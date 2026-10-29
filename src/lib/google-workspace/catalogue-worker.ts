import type { CatalogueInputSnapshot } from './catalogue-automation';

export type CatalogueJobStatus =
  | 'QUEUED'
  | 'PROCESSING_SLIDES'
  | 'RENDERING_PDF'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'BLOCKED';

export interface CatalogueJobRecord {
  readonly storage: 'simulation';
  readonly id: string;
  readonly snapshotId: string;
  readonly snapshotSha256: string;
  status: CatalogueJobStatus;
  progressPercent: number;
  slidesDriveId?: string;
  slidesUrl?: string;
  pdfDriveId?: string;
  pdfUrl?: string;
  pageCount?: number;
  outputBytes?: number;
  outputSha256?: string;
  readonly queuedAt: string;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  retryCount: number;
}

/** Retained queue simulation only. No production catalogue factory is installed. */
class CatalogueWorkerManager {
  private jobs: Map<string, CatalogueJobRecord> = new Map();
  private snapshotToJob: Map<string, string> = new Map();
  private cancellationTokens: Set<string> = new Set();

  /**
   * Queues a catalogue generation job with idempotency protection.
   * If an identical snapshot is already completed, reuses the existing receipt without duplicate writes.
   */
  queueJob(snapshot: CatalogueInputSnapshot): CatalogueJobRecord {
    const existingJobId = this.snapshotToJob.get(snapshot.snapshotSha256);
    if (existingJobId) {
      const existing = this.jobs.get(existingJobId);
      if (existing) {
        return existing;
      }
    }

    const id = `job-cat-${snapshot.snapshotSha256.slice(0, 10)}-${Date.now()}`;
    const job: CatalogueJobRecord = {
      storage: 'simulation',
      id,
      snapshotId: snapshot.snapshotId,
      snapshotSha256: snapshot.snapshotSha256,
      status: 'QUEUED',
      progressPercent: 0,
      queuedAt: new Date().toISOString(),
      retryCount: 0,
    };

    this.jobs.set(id, job);
    this.snapshotToJob.set(snapshot.snapshotSha256, id);
    return job;
  }

  getJob(jobId: string): CatalogueJobRecord | undefined {
    return this.jobs.get(jobId);
  }

  getAllJobs(): readonly CatalogueJobRecord[] {
    return Array.from(this.jobs.values());
  }

  cancelJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job || job.status === 'COMPLETED' || job.status === 'FAILED') {
      return false;
    }
    job.status = 'CANCELLED';
    job.completedAt = new Date().toISOString();
    this.cancellationTokens.add(jobId);
    return true;
  }

  retryJob(jobId: string): CatalogueJobRecord {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Cannot retry nonexistent job: ${jobId}`);
    }
    if (job.status !== 'FAILED' && job.status !== 'CANCELLED') {
      throw new Error(`Can only retry FAILED or CANCELLED jobs (current: ${job.status})`);
    }

    this.cancellationTokens.delete(jobId);
    job.status = 'QUEUED';
    job.progressPercent = 0;
    job.retryCount++;
    job.errorMessage = undefined;
    job.startedAt = undefined;
    job.completedAt = undefined;
    return job;
  }

  /**
   * Compatibility simulation: explicitly blocked without a real durable worker.
   * Never manufactures Drive identifiers, bytes, checksums or output URLs.
   */
  async executeJob(
    jobId: string,
    snapshot: CatalogueInputSnapshot
  ): Promise<CatalogueJobRecord> {
    const job = this.jobs.get(jobId);
    if (!job) throw new Error(`Job not found: ${jobId}`);

    if (this.cancellationTokens.has(jobId)) {
      job.status = 'CANCELLED';
      job.completedAt = new Date().toISOString();
      return job;
    }

    if (job.snapshotSha256 !== snapshot.snapshotSha256 || job.snapshotId !== snapshot.snapshotId) {
      throw new Error('Catalogue snapshot does not match the queued job.');
    }
    job.status = 'BLOCKED';
    job.progressPercent = 0;
    job.errorMessage = 'PROVIDER_NOT_CONFIGURED: no durable catalogue worker or verified Google template is bound.';

    return job;
  }
}

export const catalogueWorkerManager = new CatalogueWorkerManager();
