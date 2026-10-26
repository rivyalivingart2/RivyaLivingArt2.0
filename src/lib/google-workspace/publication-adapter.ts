import {
  type PublicationBundle,
  type PublicationInput,
  type PublicationPointer,
  type PublicationDependencies,
  type PublicationPolicy,
  type PublicAsset,
  publishPublication,
  readPinnedPublication,
  PublicationError,
} from './publication-bundle';
import type {PublishedSource} from '../published-source';
import type {PublicMedia} from '../public-media';
import type {HomepageLayout} from '../presentation-model';
import type {ArtifactOptions, ArtifactRegistration, DriveDocumentStore, DriveJsonRef} from './drive-documents';

export interface PublicationAdapterStore {
  getPointer: () => Promise<PublicationPointer | null>;
  compareAndSwapPointer: (
    expected: PublicationPointer | null,
    next: PublicationPointer
  ) => Promise<'committed' | 'conflict'>;
  readJson: (artifact: DriveJsonRef) => Promise<unknown>;
  ensureJson: (fileId: string, value: unknown) => Promise<DriveJsonRef>;
  getRegistration: (fileId: string) => ArtifactRegistration;
}

export class InMemoryPublicationStore implements PublicationAdapterStore {
  private pointer: PublicationPointer | null = null;
  private files = new Map<string, {data: unknown; ref: DriveJsonRef}>();
  private registrations = new Map<string, ArtifactRegistration>();

  registerFile(file: ArtifactRegistration): void {
    this.registrations.set(file.fileId, file);
  }

  async getPointer(): Promise<PublicationPointer | null> {
    return this.pointer ? JSON.parse(JSON.stringify(this.pointer)) : null;
  }

  async compareAndSwapPointer(
    expected: PublicationPointer | null,
    next: PublicationPointer
  ): Promise<'committed' | 'conflict'> {
    const currentJson = JSON.stringify(this.pointer);
    const expectedJson = JSON.stringify(expected);
    if (currentJson !== expectedJson) {
      return 'conflict';
    }
    this.pointer = JSON.parse(JSON.stringify(next));
    return 'committed';
  }

  async readJson(artifact: DriveJsonRef): Promise<unknown> {
    const entry = this.files.get(artifact.fileId);
    if (!entry) {
      throw new Error(`Artifact not found: ${artifact.fileId}`);
    }
    return JSON.parse(JSON.stringify(entry.data));
  }

  async ensureJson(fileId: string, value: unknown): Promise<DriveJsonRef> {
    const registration = this.registrations.get(fileId);
    if (!registration) {
      throw new Error(`Unregistered file: ${fileId}`);
    }
    const ref: DriveJsonRef = {
      format: 'rivya-drive-json-v1',
      fileId,
      parentId: registration.parentId,
      purpose: 'publication-bundle',
      mimeType: 'application/json',
      bytes: Buffer.byteLength(JSON.stringify(value)),
      sha256: 'a'.repeat(64),
      ownerId: (value as {version?: string})?.version || 'v1',
    };
    this.files.set(fileId, {data: JSON.parse(JSON.stringify(value)), ref});
    return ref;
  }

  getRegistration(fileId: string): ArtifactRegistration {
    const reg = this.registrations.get(fileId);
    if (!reg) {
      throw new Error(`File not registered: ${fileId}`);
    }
    return reg;
  }
}

export class GoogleWorkspacePublicationAdapter {
  private dependencies: PublicationDependencies;
  private pinnedPublication: {pointer: PublicationPointer; bundle: PublicationBundle} | null = null;

  constructor(dependencies: PublicationDependencies) {
    this.dependencies = dependencies;
  }

  static createFromStore(
    store: PublicationAdapterStore,
    policy: PublicationPolicy,
    timeoutMs = 30_000
  ): GoogleWorkspacePublicationAdapter {
    const documents = {
      readJson: async (artifact: unknown) => store.readJson(artifact as DriveJsonRef),
      ensureJson: async (fileId: string, value: unknown) => store.ensureJson(fileId, value),
      getRegistration: (fileId: string) => store.getRegistration(fileId),
    } as unknown as DriveDocumentStore;

    const pointers = {
      read: async () => store.getPointer(),
      compareAndSwap: async (
        expected: PublicationPointer | null,
        next: PublicationPointer
      ) => store.compareAndSwapPointer(expected, next),
    };

    return new GoogleWorkspacePublicationAdapter({
      documents,
      policy,
      pointers,
      timeoutMs,
    });
  }

  /**
   * Pins a single coherent publication for the lifecycle of the incoming request.
   * If already pinned for this adapter instance, returns the cached pinned bundle.
   */
  async pinRequestPublication(signal?: AbortSignal): Promise<{
    pointer: PublicationPointer;
    bundle: PublicationBundle;
  } | null> {
    if (this.pinnedPublication) {
      return this.pinnedPublication;
    }
    const pinned = await readPinnedPublication(this.dependencies, {signal});
    if (pinned) {
      this.pinnedPublication = pinned;
    }
    return pinned;
  }

  getPinnedPublication(): {pointer: PublicationPointer; bundle: PublicationBundle} | null {
    return this.pinnedPublication;
  }

  clearPinnedPublication(): void {
    this.pinnedPublication = null;
  }

  async getPublishedSource(signal?: AbortSignal): Promise<PublishedSource | null> {
    const pinned = await this.pinRequestPublication(signal);
    if (!pinned) return null;
    const sourceVal = pinned.bundle.source.value as unknown as PublishedSource;
    return sourceVal || null;
  }

  async getPublishedMedia(signal?: AbortSignal): Promise<Map<string, PublicMedia> | null> {
    const source = await this.getPublishedSource(signal);
    if (!source || !Array.isArray(source.media)) return null;
    const mediaMap = new Map<string, PublicMedia>();
    for (const row of source.media) {
      if (row.document && (row.document as PublicMedia).path === row.key) {
        mediaMap.set(row.key, row.document as PublicMedia);
      }
    }
    return mediaMap;
  }

  async getPublishedPresentation(
    signal?: AbortSignal
  ): Promise<{layout: HomepageLayout; version: number} | null> {
    const pinned = await this.pinRequestPublication(signal);
    if (!pinned) return null;
    const design = pinned.bundle.design.value as {
      presentation?: {layout: HomepageLayout; version: number};
    };
    return design?.presentation || null;
  }

  async publish(
    request: {
      input: PublicationInput;
      fileId: string;
      expectedPointer: PublicationPointer | null;
    },
    signal?: AbortSignal
  ): Promise<{
    status: 'activated' | 'replayed' | 'recovered';
    pointer: PublicationPointer;
    bundle: PublicationBundle;
  }> {
    const result = await publishPublication(request, this.dependencies, {signal});
    // Invalidate local pinned publication so next read refreshes
    this.clearPinnedPublication();
    return result;
  }
}

export {PublicationError};
export type {PublicAsset, PublicationBundle, PublicationInput, PublicationPointer};
