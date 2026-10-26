import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GoogleWorkspaceOperationsAdapter,
  InMemoryOperationsStore,
} from '../src/lib/google-workspace/operations-adapter.ts';

test('GW-402: Subscriber capture and idempotency', async () => {
  const store = new InMemoryOperationsStore();
  const adapter = new GoogleWorkspaceOperationsAdapter(store);

  // 1. Initial subscription succeeds
  const res1 = await adapter.addNewsletterSubscriber('client@example.com', 'footer');
  assert.equal(res1.ok, true);
  assert.equal(res1.inserted, true);

  // 2. Duplicate subscription with same email (case variation) returns ok:true, inserted:false
  const res2 = await adapter.addNewsletterSubscriber('CLIENT@EXAMPLE.COM', 'journal');
  assert.equal(res2.ok, true);
  assert.equal(res2.inserted, false);

  // 3. Store contains only 1 normalized record
  const all = await store.listSubscribers();
  assert.equal(all.length, 1);
  assert.equal(all[0].email, 'client@example.com');
  assert.equal(all[0].source, 'footer');
});

test('GW-402: Subscriber query, sorting, filtering and pagination', async () => {
  const store = new InMemoryOperationsStore();
  const adapter = new GoogleWorkspaceOperationsAdapter(store);

  // Populate multiple subscribers
  await store.addSubscriber({
    email: 'alice@example.com',
    source: 'footer',
    created_at: '2026-10-01T10:00:00Z',
  });
  await store.addSubscriber({
    email: 'bob@rivya.invalid',
    source: 'journal',
    created_at: '2026-10-15T12:00:00Z',
  });
  await store.addSubscriber({
    email: 'charlie@example.com',
    source: 'footer',
    created_at: '2026-10-20T15:00:00Z',
  });

  // Filter by search query
  const resQuery = await adapter.readNewsletterSubscribers({
    q: 'example',
    source: '',
    from: '',
    to: '',
    sort: 'newest',
    page: 1,
  });
  assert.equal(resQuery.total, 2);
  assert.equal(resQuery.rows[0].email, 'charlie@example.com');
  assert.equal(resQuery.rows[1].email, 'alice@example.com');

  // Filter by source
  const resSource = await adapter.readNewsletterSubscribers({
    q: '',
    source: 'journal',
    from: '',
    to: '',
    sort: 'newest',
    page: 1,
  });
  assert.equal(resSource.total, 1);
  assert.equal(resSource.rows[0].email, 'bob@rivya.invalid');

  // Filter by date range
  const resDate = await adapter.readNewsletterSubscribers({
    q: '',
    source: '',
    from: '2026-10-10',
    to: '2026-10-16',
    sort: 'oldest',
    page: 1,
  });
  assert.equal(resDate.total, 1);
  assert.equal(resDate.rows[0].email, 'bob@rivya.invalid');

  // Sorting by email ascending
  const resAlpha = await adapter.readNewsletterSubscribers({
    q: '',
    source: '',
    from: '',
    to: '',
    sort: 'email',
    page: 1,
  });
  assert.equal(resAlpha.rows[0].email, 'alice@example.com');
  assert.equal(resAlpha.rows[1].email, 'bob@rivya.invalid');
  assert.equal(resAlpha.rows[2].email, 'charlie@example.com');
});

test('GW-402: Inquiry and Order creation with initial event', async () => {
  const store = new InMemoryOperationsStore();
  const adapter = new GoogleWorkspaceOperationsAdapter(store);

  const created = await adapter.createInquiry({
    clientName: 'Collector Alpha',
    clientEmail: 'collector@example.com',
    clientPhone: '+44 7000 000000',
    title: 'The Signature - Custom Commission',
    requestKind: 'bespoke',
    answers: { dimensions: '2400x1000', finish: 'obsidian' },
    notes: 'Ground floor access.',
  });

  assert.ok(created.id);
  assert.match(created.reference, /^RLA-[A-Z0-9]{12}$/);

  // Check stored order
  const order = await store.getOrder(created.id);
  assert.ok(order);
  assert.equal(order.client, 'Collector Alpha');
  assert.equal(order.title, 'The Signature - Custom Commission');
  assert.equal(order.status, 'NEW');
  assert.equal(order.version, 1);

  // Check stored inquiry
  const inquiry = await store.getInquiry(created.id);
  assert.ok(inquiry);
  assert.equal(inquiry.contract_version, 2);
  assert.equal(inquiry.message_state, 'handoff_pending');
  assert.equal(inquiry.name, 'Collector Alpha');

  // Check order events
  assert.equal(store.orderEvents.length, 1);
  assert.equal(store.orderEvents[0].order_id, created.id);
  assert.equal(store.orderEvents[0].to_status, 'NEW');
});

test('GW-402: Staff assignment and inquiry access scoping', async () => {
  const store = new InMemoryOperationsStore();
  const adapter = new GoogleWorkspaceOperationsAdapter(store);

  const {id: inquiryId} = await adapter.createInquiry({
    clientName: 'Client Beta',
    clientEmail: 'beta@example.com',
    clientPhone: '+44 7000 111111',
    title: 'Memory Study Table',
    requestKind: 'preserve',
  });

  const adminSession = {adminId: 'admin-1', role: 'admin', staffId: 'staff-admin-id'};
  const editorSessionA = {adminId: 'editor-a', role: 'editor', staffId: 'staff-editor-a'};
  const editorSessionB = {adminId: 'editor-b', role: 'editor', staffId: 'staff-editor-b'};

  // 1. Admin can access unassigned inquiry
  assert.equal(await adapter.canAccessInquiry(adminSession, inquiryId), true);

  // 2. Editor A cannot access unassigned inquiry
  assert.equal(await adapter.canAccessInquiry(editorSessionA, inquiryId), false);

  // 3. Admin assigns inquiry to Editor A
  const assigned = await adapter.assignInquiry(inquiryId, 'staff-editor-a', adminSession, '2026-11-01');
  assert.equal(assigned, true);

  // 4. Editor A can now access inquiry
  assert.equal(await adapter.canAccessInquiry(editorSessionA, inquiryId), true);

  // 5. Editor B still cannot access inquiry
  assert.equal(await adapter.canAccessInquiry(editorSessionB, inquiryId), false);

  // 6. Editor cannot assign inquiry (admin only)
  await assert.rejects(
    async () => adapter.assignInquiry(inquiryId, 'staff-editor-b', editorSessionA),
    /Administrator access required/
  );
});

test('GW-402: Order status transition with optimistic locking', async () => {
  const store = new InMemoryOperationsStore();
  const adapter = new GoogleWorkspaceOperationsAdapter(store);

  const {id: inquiryId} = await adapter.createInquiry({
    clientName: 'Client Gamma',
    clientEmail: 'gamma@example.com',
    clientPhone: '+44 7000 222222',
    title: 'Dining Table Study',
    requestKind: 'bespoke',
  });

  const adminSession = {adminId: 'admin-1', role: 'admin', staffId: 'staff-admin-id'};

  // Successful transition from version 1 to IN_DISCUSSION
  const ok1 = await adapter.updateOrderStatus(
    inquiryId,
    1,
    'IN_DISCUSSION',
    adminSession,
    'Initial call scheduled'
  );
  assert.equal(ok1, true);

  const orderAfter = await store.getOrder(inquiryId);
  assert.equal(orderAfter?.status, 'IN_DISCUSSION');
  assert.equal(orderAfter?.version, 2);

  // Attempt transition with stale version 1 fails
  const okStale = await adapter.updateOrderStatus(
    inquiryId,
    1,
    'CONFIRMED',
    adminSession
  );
  assert.equal(okStale, false);

  // Attempt transition with current version 2 succeeds
  const ok2 = await adapter.updateOrderStatus(
    inquiryId,
    2,
    'CONFIRMED',
    adminSession
  );
  assert.equal(ok2, true);
  const orderFinal = await store.getOrder(inquiryId);
  assert.equal(orderFinal?.status, 'CONFIRMED');
  assert.equal(orderFinal?.version, 3);
});

test('GW-402: Private media and reference permission protection', async () => {
  const store = new InMemoryOperationsStore();
  const adapter = new GoogleWorkspaceOperationsAdapter(store);

  const validRefId = '00000000-0000-4000-8000-000000000001';
  await adapter.registerPrivateReference({
    id: validRefId,
    guest_hash: 'guest-hash-1',
    pathname: 'references/alpha.jpg',
    storage_provider: 'google-drive',
    state: 'ready',
    normalized_mime: 'image/jpeg',
    byte_size: 1024,
    created_at: new Date().toISOString(),
  });

  // 1. Valid registered reference ID resolves successfully
  const ref = await adapter.resolvePrivateReference(validRefId);
  assert.ok(ref);
  assert.equal(ref.id, validRefId);

  // 2. Arbitrary file path or ID traversal is rejected
  await assert.rejects(
    async () => adapter.resolvePrivateReference('../../etc/passwd'),
    /Access denied: Invalid or arbitrary reference identifier/
  );

  await assert.rejects(
    async () => adapter.resolvePrivateReference('arbitrary-google-drive-file-id!'),
    /Access denied: Invalid or arbitrary reference identifier/
  );

  // 3. Private reference linked to inquiry enforces assignment permissions
  const {id: inquiryId} = await adapter.createInquiry({
    clientName: 'Client Delta',
    clientEmail: 'delta@example.com',
    clientPhone: '+44 7000 333333',
    title: 'Private Commission',
    requestKind: 'bespoke',
  });

  const linkedRefId = '00000000-0000-4000-8000-000000000002';
  await adapter.registerPrivateReference({
    id: linkedRefId,
    inquiry_id: inquiryId,
    guest_hash: 'guest-hash-2',
    pathname: 'references/brief-delta.jpg',
    storage_provider: 'google-drive',
    state: 'ready',
    normalized_mime: 'image/jpeg',
    byte_size: 2048,
    created_at: new Date().toISOString(),
  });

  const adminSession = {adminId: 'admin-1', role: 'admin', staffId: 'staff-admin-id'};
  const editorSession = {adminId: 'editor-1', role: 'editor', staffId: 'staff-editor-id'};

  // Admin can resolve
  const adminResolved = await adapter.resolvePrivateReference(linkedRefId, adminSession);
  assert.ok(adminResolved);

  // Unassigned editor is rejected
  await assert.rejects(
    async () => adapter.resolvePrivateReference(linkedRefId, editorSession),
    /Access denied: Staff session not authorized for this reference/
  );
});
