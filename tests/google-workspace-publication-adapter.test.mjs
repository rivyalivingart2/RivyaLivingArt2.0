import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GoogleWorkspacePublicationAdapter,
  InMemoryPublicationStore,
  PublicationError,
} from '../src/lib/google-workspace/publication-adapter.ts';

const validSource = {
  identity: 'digest-001',
  products: [
    {
      key: 'art-001',
      version: 1,
      fingerprint: 'fp-001',
      document: {
        id: 'art-001',
        slug: 'liquid-light',
        name: 'Liquid Light',
        category: 'sculpture',
        image: '/media/liquid-light.webp',
      },
    },
  ],
  content: [
    {
      key: 'homepage',
      kind: 'editorial',
      route: '/',
      version: 1,
      fingerprint: 'fp-home',
      document: {id: 'homepage', title: 'Rivya Living Art'},
    },
  ],
  media: [
    {
      key: '/media/liquid-light.webp',
      version: 1,
      fingerprint: 'fp-media',
      document: {
        path: '/media/liquid-light.webp',
        alt: 'Liquid Light Sculpture',
        focalX: 50,
        focalY: 50,
      },
    },
  ],
};

const validDesign = {
  presentation: {
    layout: {
      hero: 'liquid',
      theme: 'luxury',
    },
    version: 1,
  },
};

const validShell = {
  navigation: [{label: 'Creations', href: '/creations'}],
  copy: {brand: 'Rivya Living Art'},
};

const validAsset = {
  id: 'asset:001',
  fileId: 'file_asset_001_drive_id',
  mimeType: 'image/webp',
  bytes: 10240,
  sha256: 'b'.repeat(64),
};

function createTestHarness() {
  const store = new InMemoryPublicationStore();
  const fileId = 'publication_file_001';
  store.registerFile({
    fileId,
    parentId: 'folder_publication_snapshots',
    purpose: 'publication-bundle',
    ownerId: 'version:one',
  });

  const policy = {
    authorize: () => true,
    projectSource: (src) => src,
    projectShell: (sh) => sh,
    projectDesign: (ds) => ds,
    projectAssets: (as) => as,
    validate: () => true,
    verifyAsset: async () => true,
  };

  const adapter = GoogleWorkspacePublicationAdapter.createFromStore(store, policy);
  return {adapter, store, fileId, policy};
}

test('GW-401: Initial state has no pinned or active publication', async () => {
  const {adapter} = createTestHarness();
  assert.equal(await adapter.pinRequestPublication(), null);
  assert.equal(await adapter.getPublishedSource(), null);
  assert.equal(await adapter.getPublishedMedia(), null);
  assert.equal(await adapter.getPublishedPresentation(), null);
});

test('GW-401: Publish creates immutable Drive artifact and updates pointer via CAS', async () => {
  const {adapter, fileId, store} = createTestHarness();

  const input = {
    version: 'version:one',
    source: validSource,
    shell: validShell,
    design: validDesign,
    assets: [validAsset],
  };

  const result = await adapter.publish({
    input,
    fileId,
    expectedPointer: null,
  });

  assert.equal(result.status, 'activated');
  assert.equal(result.pointer.revision, 1);
  assert.equal(result.pointer.version, 'version:one');
  assert.equal(result.pointer.artifact.fileId, fileId);

  // Store pointer reflects the newly published version
  const currentPointer = await store.getPointer();
  assert.ok(currentPointer);
  assert.equal(currentPointer.version, 'version:one');
  assert.equal(currentPointer.revision, 1);
});

test('GW-401: Request pins publication bundle for coherent request lifecycle', async () => {
  const {adapter, fileId} = createTestHarness();

  await adapter.publish({
    input: {
      version: 'version:one',
      source: validSource,
      shell: validShell,
      design: validDesign,
      assets: [validAsset],
    },
    fileId,
    expectedPointer: null,
  });

  // Pin the publication for this request
  const pinned = await adapter.pinRequestPublication();
  assert.ok(pinned);
  assert.equal(pinned.bundle.version, 'version:one');
  assert.equal(pinned.pointer.revision, 1);

  // Source extraction
  const source = await adapter.getPublishedSource();
  assert.ok(source);
  assert.equal(source.identity, 'digest-001');
  assert.equal(source.products.length, 1);

  // Media extraction
  const mediaMap = await adapter.getPublishedMedia();
  assert.ok(mediaMap);
  assert.equal(mediaMap.size, 1);
  assert.ok(mediaMap.has('/media/liquid-light.webp'));

  // Presentation extraction
  const presentation = await adapter.getPublishedPresentation();
  assert.ok(presentation);
  assert.equal(presentation.version, 1);
  assert.equal(presentation.layout.hero, 'liquid');
});

test('GW-401: CAS conflict protection prevents overwriting concurrent publications', async () => {
  const {adapter, fileId, store} = createTestHarness();

  // First publication at revision 1
  const first = await adapter.publish({
    input: {
      version: 'version:one',
      source: validSource,
      shell: validShell,
      design: validDesign,
      assets: [validAsset],
    },
    fileId,
    expectedPointer: null,
  });
  assert.equal(first.status, 'activated');

  // Register second file for version:two
  const fileId2 = 'publication_file_002';
  store.registerFile({
    fileId: fileId2,
    parentId: 'folder_publication_snapshots',
    purpose: 'publication-bundle',
    ownerId: 'version:two',
  });

  // Attempting to publish v2 expecting pointer null (stale CAS) must be rejected
  await assert.rejects(
    async () => {
      await adapter.publish({
        input: {
          version: 'version:two',
          source: validSource,
          shell: validShell,
          design: validDesign,
          assets: [validAsset],
        },
        fileId: fileId2,
        expectedPointer: null, // stale: current pointer is at revision 1
      });
    },
    (err) => err instanceof PublicationError && err.code === 'POINTER_CONFLICT'
  );

  // Prior pointer is verified unchanged at revision 1
  const preservedPointer = await store.getPointer();
  assert.equal(preservedPointer.revision, 1);
  assert.equal(preservedPointer.version, 'version:one');
});

test('GW-401: Failed asset verification retains last good version and blocks CAS', async () => {
  const store = new InMemoryPublicationStore();
  const fileId = 'publication_file_001';
  store.registerFile({
    fileId,
    parentId: 'folder_publication_snapshots',
    purpose: 'publication-bundle',
    ownerId: 'version:one',
  });

  // Policy where asset verification fails
  const rejectingPolicy = {
    authorize: () => true,
    projectSource: (src) => src,
    projectShell: (sh) => sh,
    projectDesign: (ds) => ds,
    projectAssets: (as) => as,
    validate: () => true,
    verifyAsset: async () => false, // fails verification
  };

  const adapter = GoogleWorkspacePublicationAdapter.createFromStore(store, rejectingPolicy);

  await assert.rejects(
    async () => {
      await adapter.publish({
        input: {
          version: 'version:one',
          source: validSource,
          shell: validShell,
          design: validDesign,
          assets: [validAsset],
        },
        fileId,
        expectedPointer: null,
      });
    },
    (err) => err instanceof PublicationError && err.code === 'ASSET_UNVERIFIED'
  );

  // Pointer remains null; nothing was committed
  assert.equal(await store.getPointer(), null);
});
