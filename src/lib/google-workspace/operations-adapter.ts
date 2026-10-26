import {randomUUID, createHash} from 'node:crypto';
import type {SubscriberFilters, SubscriberPage, SubscriberRow} from '../subscriber-model';
import {subscriberPageSize} from '../subscriber-model';
import type {StaffSession} from '../studio-auth';

export interface OperationsSubscriberRecord {
  email: string;
  source: 'footer' | 'journal';
  created_at: string;
}

export interface OperationsInquiryRecord {
  id: string;
  reference: string;
  guest_hash: string;
  request_key: string;
  payload_hash: string;
  product_id?: string | null;
  product_snapshot?: unknown;
  name: string;
  phone: string;
  email: string;
  answers: Record<string, unknown>;
  notes: string;
  summary: string;
  contract_version: number;
  request_kind: string;
  schema_id?: string;
  schema_version?: number;
  schema_snapshot?: unknown;
  answer_snapshot?: unknown;
  submission_source: string;
  source_route?: string;
  consent_version: number;
  consent_accepted_at: string;
  reference_count: number;
  message_state: 'handoff_pending' | 'handoff_ready' | 'handoff_failed';
  message_template_version?: number;
  message_destination?: string;
  destination_config_version?: number;
  assignee?: string | null;
  follow_up?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface OperationsOrderRecord {
  id: string;
  client: string;
  title: string;
  status: 'NEW' | 'IN_DISCUSSION' | 'ESTIMATE_SENT' | 'CONFIRMED' | 'IN_PRODUCTION' | 'COMPLETED' | 'CLOSED';
  version: number;
  created_at: string;
  updated_at: string;
}

export interface OperationsOrderEventRecord {
  id: string;
  order_id: string;
  actor: string;
  from_status: string | null;
  to_status: string;
  version: number;
  reason?: string | null;
  created_at: string;
}

export interface OperationsInquiryNoteRecord {
  id: string;
  inquiry_id: string;
  actor: string;
  body: string;
  created_at: string;
}

export interface OperationsReferenceRecord {
  id: string;
  inquiry_id?: string | null;
  request_key?: string;
  guest_hash: string;
  pathname: string;
  storage_provider: 'google-drive' | 'vercel-blob' | 'local';
  state: 'pending' | 'ready' | 'erased';
  normalized_mime: string;
  byte_size: number;
  created_at: string;
  linked_at?: string | null;
}

export interface OperationsAdapterStore {
  // Subscribers
  addSubscriber(record: OperationsSubscriberRecord): Promise<boolean>;
  listSubscribers(): Promise<OperationsSubscriberRecord[]>;

  // Inquiries & Orders
  saveInquiryAndOrder(
    inquiry: OperationsInquiryRecord,
    order: OperationsOrderRecord,
    initialEvent: OperationsOrderEventRecord
  ): Promise<void>;
  getInquiry(id: string): Promise<OperationsInquiryRecord | null>;
  getOrder(id: string): Promise<OperationsOrderRecord | null>;
  updateOrderStatus(
    id: string,
    expectedVersion: number,
    nextStatus: OperationsOrderRecord['status'],
    actor: string,
    reason?: string
  ): Promise<boolean>;
  updateInquiryAssignment(
    id: string,
    assignee: string | null,
    followUp?: string | null
  ): Promise<boolean>;
  addInquiryNote(note: OperationsInquiryNoteRecord): Promise<void>;
  listInquiryNotes(inquiryId: string): Promise<OperationsInquiryNoteRecord[]>;

  // Private References
  getReference(id: string): Promise<OperationsReferenceRecord | null>;
  saveReference(ref: OperationsReferenceRecord): Promise<void>;
  listReferencesForInquiry(inquiryId: string): Promise<OperationsReferenceRecord[]>;
}

export class InMemoryOperationsStore implements OperationsAdapterStore {
  subscribers = new Map<string, OperationsSubscriberRecord>();
  inquiries = new Map<string, OperationsInquiryRecord>();
  orders = new Map<string, OperationsOrderRecord>();
  orderEvents: OperationsOrderEventRecord[] = [];
  inquiryNotes: OperationsInquiryNoteRecord[] = [];
  references = new Map<string, OperationsReferenceRecord>();

  async addSubscriber(record: OperationsSubscriberRecord): Promise<boolean> {
    const key = record.email.toLowerCase();
    if (this.subscribers.has(key)) {
      return false; // ON CONFLICT DO NOTHING
    }
    this.subscribers.set(key, record);
    return true;
  }

  async listSubscribers(): Promise<OperationsSubscriberRecord[]> {
    return Array.from(this.subscribers.values());
  }

  async saveInquiryAndOrder(
    inquiry: OperationsInquiryRecord,
    order: OperationsOrderRecord,
    initialEvent: OperationsOrderEventRecord
  ): Promise<void> {
    this.inquiries.set(inquiry.id, inquiry);
    this.orders.set(order.id, order);
    this.orderEvents.push(initialEvent);
  }

  async getInquiry(id: string): Promise<OperationsInquiryRecord | null> {
    return this.inquiries.get(id) || null;
  }

  async getOrder(id: string): Promise<OperationsOrderRecord | null> {
    return this.orders.get(id) || null;
  }

  async updateOrderStatus(
    id: string,
    expectedVersion: number,
    nextStatus: OperationsOrderRecord['status'],
    actor: string,
    reason?: string
  ): Promise<boolean> {
    const order = this.orders.get(id);
    if (!order || order.version !== expectedVersion) {
      return false;
    }
    const fromStatus = order.status;
    order.status = nextStatus;
    order.version += 1;
    order.updated_at = new Date().toISOString();

    this.orderEvents.push({
      id: randomUUID(),
      order_id: id,
      actor,
      from_status: fromStatus,
      to_status: nextStatus,
      version: order.version,
      reason: reason || null,
      created_at: new Date().toISOString(),
    });
    return true;
  }

  async updateInquiryAssignment(
    id: string,
    assignee: string | null,
    followUp?: string | null
  ): Promise<boolean> {
    const inquiry = this.inquiries.get(id);
    if (!inquiry) return false;
    inquiry.assignee = assignee;
    if (followUp !== undefined) inquiry.follow_up = followUp;
    inquiry.updated_at = new Date().toISOString();
    return true;
  }

  async addInquiryNote(note: OperationsInquiryNoteRecord): Promise<void> {
    this.inquiryNotes.push(note);
  }

  async listInquiryNotes(inquiryId: string): Promise<OperationsInquiryNoteRecord[]> {
    return this.inquiryNotes.filter(n => n.inquiry_id === inquiryId);
  }

  async getReference(id: string): Promise<OperationsReferenceRecord | null> {
    return this.references.get(id) || null;
  }

  async saveReference(ref: OperationsReferenceRecord): Promise<void> {
    this.references.set(ref.id, ref);
  }

  async listReferencesForInquiry(inquiryId: string): Promise<OperationsReferenceRecord[]> {
    return Array.from(this.references.values()).filter(r => r.inquiry_id === inquiryId);
  }
}

export class GoogleWorkspaceOperationsAdapter {
  constructor(private readonly store: OperationsAdapterStore) {}

  // --- Newsletter Subscribers ---
  async addNewsletterSubscriber(
    email: string,
    source: string
  ): Promise<{ ok: boolean; inserted: boolean }> {
    const normalized = email.trim().toLowerCase();
    const validSource = source === 'journal' ? 'journal' : 'footer';
    const inserted = await this.store.addSubscriber({
      email: normalized,
      source: validSource,
      created_at: new Date().toISOString(),
    });
    return { ok: true, inserted };
  }

  async readNewsletterSubscribers(
    filters: SubscriberFilters,
    exportAll = false
  ): Promise<SubscriberPage> {
    const all = await this.store.listSubscribers();

    // Filtering
    const qLower = filters.q.toLowerCase();
    const fromDate = filters.from ? new Date(`${filters.from}T00:00:00Z`).getTime() : null;
    const toDate = filters.to ? new Date(`${filters.to}T23:59:59.999Z`).getTime() : null;

    const filtered = all.filter(sub => {
      if (qLower && !sub.email.toLowerCase().includes(qLower)) return false;
      if (filters.source && sub.source !== filters.source) return false;
      const subTime = new Date(sub.created_at).getTime();
      if (fromDate && subTime < fromDate) return false;
      if (toDate && subTime > toDate) return false;
      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (filters.sort === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (filters.sort === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return a.email.localeCompare(b.email);
    });

    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / subscriberPageSize));
    const page = Math.min(Math.max(1, filters.page), pages);

    const rows: SubscriberRow[] = exportAll
      ? filtered.map(r => ({ email: r.email, source: r.source, createdAt: r.created_at }))
      : filtered
          .slice((page - 1) * subscriberPageSize, page * subscriberPageSize)
          .map(r => ({ email: r.email, source: r.source, createdAt: r.created_at }));

    return {
      total,
      pages,
      page,
      pageSize: subscriberPageSize,
      rows,
    };
  }

  // --- Inquiries and Orders ---
  async createInquiry(input: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    title: string;
    requestKind: string;
    answers?: Record<string, unknown>;
    notes?: string;
    summary?: string;
    productId?: string | null;
    productSnapshot?: unknown;
    guestHash?: string;
    requestKey?: string;
  }): Promise<{ id: string; reference: string }> {
    const id = randomUUID();
    const reference = 'RLA-' + id.replaceAll('-', '').slice(0, 12).toUpperCase();
    const now = new Date().toISOString();

    const order: OperationsOrderRecord = {
      id,
      client: input.clientName,
      title: input.title,
      status: 'NEW',
      version: 1,
      created_at: now,
      updated_at: now,
    };

    const payloadHash = createHash('sha256')
      .update(JSON.stringify(input.answers || {}))
      .digest('hex');

    const inquiry: OperationsInquiryRecord = {
      id,
      reference,
      guest_hash: input.guestHash || '',
      request_key: input.requestKey || id,
      payload_hash: payloadHash,
      product_id: input.productId || null,
      product_snapshot: input.productSnapshot || null,
      name: input.clientName,
      phone: input.clientPhone,
      email: input.clientEmail,
      answers: input.answers || {},
      notes: input.notes || '',
      summary: input.summary || '',
      contract_version: 2,
      request_kind: input.requestKind,
      submission_source: 'website',
      consent_version: 1,
      consent_accepted_at: now,
      reference_count: 0,
      message_state: 'handoff_pending',
      created_at: now,
    };

    const initialEvent: OperationsOrderEventRecord = {
      id: randomUUID(),
      order_id: id,
      actor: 'Website inquiry',
      from_status: null,
      to_status: 'NEW',
      version: 1,
      created_at: now,
    };

    await this.store.saveInquiryAndOrder(inquiry, order, initialEvent);
    return { id, reference };
  }

  async canAccessInquiry(session: StaffSession, inquiryId: string): Promise<boolean> {
    if (session.role === 'admin') return true;
    if (!session.staffId) return false;
    const inquiry = await this.store.getInquiry(inquiryId);
    if (!inquiry) return false;
    return inquiry.assignee === session.staffId;
  }

  async getInquiry(
    id: string,
    session?: StaffSession
  ): Promise<{ inquiry: OperationsInquiryRecord; order: OperationsOrderRecord } | null> {
    if (session && !(await this.canAccessInquiry(session, id))) {
      return null;
    }
    const inquiry = await this.store.getInquiry(id);
    const order = await this.store.getOrder(id);
    if (!inquiry || !order) return null;
    return { inquiry, order };
  }

  async updateOrderStatus(
    id: string,
    expectedVersion: number,
    nextStatus: OperationsOrderRecord['status'],
    session: StaffSession,
    reason?: string
  ): Promise<boolean> {
    if (!(await this.canAccessInquiry(session, id))) {
      return false;
    }
    return this.store.updateOrderStatus(
      id,
      expectedVersion,
      nextStatus,
      session.adminId,
      reason
    );
  }

  async assignInquiry(
    id: string,
    assigneeStaffId: string | null,
    session: StaffSession,
    followUp?: string | null
  ): Promise<boolean> {
    if (session.role !== 'admin') {
      throw new Error('Administrator access required to assign inquiries.');
    }
    return this.store.updateInquiryAssignment(id, assigneeStaffId, followUp);
  }

  async addInquiryNote(
    inquiryId: string,
    body: string,
    session: StaffSession
  ): Promise<string | null> {
    if (!(await this.canAccessInquiry(session, inquiryId))) {
      return null;
    }
    const id = randomUUID();
    const note: OperationsInquiryNoteRecord = {
      id,
      inquiry_id: inquiryId,
      actor: session.adminId,
      body,
      created_at: new Date().toISOString(),
    };
    await this.store.addInquiryNote(note);
    return id;
  }

  async listInquiryNotes(
    inquiryId: string,
    session: StaffSession
  ): Promise<OperationsInquiryNoteRecord[]> {
    if (!(await this.canAccessInquiry(session, inquiryId))) {
      return [];
    }
    return this.store.listInquiryNotes(inquiryId);
  }

  // --- Private Media & References Permission Protection ---
  /**
   * Resolves a private media reference only if it matches a known registered ID.
   * Arbitrary file IDs or path traversals are explicitly rejected.
   */
  async resolvePrivateReference(
    referenceId: string,
    session?: StaffSession
  ): Promise<OperationsReferenceRecord | null> {
    // Only valid UUID or registered RLA reference ID permitted
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(referenceId) &&
      !/^RLA-[A-Z0-9]{12}$/.test(referenceId)
    ) {
      throw new Error('Access denied: Invalid or arbitrary reference identifier.');
    }

    const ref = await this.store.getReference(referenceId);
    if (!ref) return null;

    // If linked to an inquiry, enforce inquiry staff assignment scoping
    if (ref.inquiry_id && session) {
      const allowed = await this.canAccessInquiry(session, ref.inquiry_id);
      if (!allowed) {
        throw new Error('Access denied: Staff session not authorized for this reference.');
      }
    }

    return ref;
  }

  async registerPrivateReference(
    ref: OperationsReferenceRecord
  ): Promise<void> {
    await this.store.saveReference(ref);
  }
}

// Active singleton instance for application delegation
let activeOperationsAdapter: GoogleWorkspaceOperationsAdapter | null = null;

export function setOperationsAdapter(adapter: GoogleWorkspaceOperationsAdapter | null): void {
  activeOperationsAdapter = adapter;
}

export function getOperationsAdapter(): GoogleWorkspaceOperationsAdapter | null {
  return activeOperationsAdapter;
}
