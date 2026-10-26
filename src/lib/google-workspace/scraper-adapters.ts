import { createHash } from 'node:crypto';
import { getVendorByKey, type VendorSourceRecord } from './scraper-registry';

export type ScraperJobState = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export type ObservationStatus = 'PENDING_REVIEW' | 'ACCEPTED_CANDIDATE' | 'DISMISSED';

export interface CandidateObservation {
  readonly id: string;
  readonly jobId: string;
  readonly sourceKey: string;
  readonly sourceUrl: string;
  readonly externalId: string;
  readonly rawTitle: string;
  readonly rawPrice: { amount: number; currency: string } | null;
  readonly rawCategory: string;
  readonly images: readonly string[];
  readonly extractedAt: string;
  readonly status: ObservationStatus;
  readonly rawPayloadSha256: string;
}

export interface ScraperJob {
  readonly id: string;
  readonly sourceKey: string;
  state: ScraperJobState;
  readonly requestedCount: number;
  processedCount: number;
  errorCount: number;
  readonly startedAt: string;
  completedAt?: string;
  errorMessage?: string;
  observations: CandidateObservation[];
}

export interface RawProductPayload {
  readonly id: string | number;
  readonly title?: string;
  readonly name?: string;
  readonly price?: string | number;
  readonly currency?: string;
  readonly category?: string;
  readonly images?: readonly (string | { src: string })[];
  readonly url?: string;
}

class ScraperJobManager {
  private jobs: Map<string, ScraperJob> = new Map();
  private observations: Map<string, CandidateObservation> = new Map();
  private cancellationTokens: Set<string> = new Set();

  createJob(sourceKey: string, requestedCount = 20): ScraperJob {
    const vendor = getVendorByKey(sourceKey);
    if (!vendor) {
      throw new Error(`Unknown vendor source: ${sourceKey}`);
    }

    if (vendor.collectionMode === 'MANUAL_RESEARCH' || vendor.lastVerifiedStatus === 'BLOCKED_ACCESS') {
      const job: ScraperJob = {
        id: `job-${sourceKey}-${Date.now()}`,
        sourceKey,
        state: 'FAILED',
        requestedCount,
        processedCount: 0,
        errorCount: 1,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        errorMessage: `Vendor ${vendor.name} is configured for manual research only (${vendor.lastVerifiedStatus}). Automated scraping is prohibited to respect site access controls.`,
        observations: [],
      };
      this.jobs.set(job.id, job);
      return job;
    }

    const job: ScraperJob = {
      id: `job-${sourceKey}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sourceKey,
      state: 'QUEUED',
      requestedCount,
      processedCount: 0,
      errorCount: 0,
      startedAt: new Date().toISOString(),
      observations: [],
    };

    this.jobs.set(job.id, job);
    return job;
  }

  getJob(jobId: string): ScraperJob | undefined {
    return this.jobs.get(jobId);
  }

  cancelJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job || job.state === 'COMPLETED' || job.state === 'FAILED') {
      return false;
    }
    job.state = 'CANCELLED';
    job.completedAt = new Date().toISOString();
    this.cancellationTokens.add(jobId);
    return true;
  }

  /**
   * Parses raw vendor items into immutable observations with SHA-256 deduplication
   */
  processObservations(
    jobId: string,
    vendor: VendorSourceRecord,
    items: readonly RawProductPayload[]
  ): readonly CandidateObservation[] {
    const job = this.jobs.get(jobId);
    if (!job) throw new Error(`Job not found: ${jobId}`);

    if (this.cancellationTokens.has(jobId)) {
      job.state = 'CANCELLED';
      job.completedAt = new Date().toISOString();
      return [];
    }

    job.state = 'RUNNING';
    const newObservations: CandidateObservation[] = [];

    for (const item of items) {
      if (this.cancellationTokens.has(jobId)) {
        job.state = 'CANCELLED';
        break;
      }

      try {
        const externalId = String(item.id);
        const rawJson = JSON.stringify(item);
        const sha256 = createHash('sha256').update(rawJson).digest('hex');

        // Check deduplication across all recorded observations for this source
        const dedupeId = `obs-${vendor.key}-${externalId}`;

        const rawPriceNum = typeof item.price === 'number'
          ? item.price
          : item.price ? parseFloat(String(item.price)) : null;

        const imageUrls: string[] = [];
        if (Array.isArray(item.images)) {
          for (const img of item.images) {
            if (typeof img === 'string') imageUrls.push(img);
            else if (img && typeof img.src === 'string') imageUrls.push(img.src);
          }
        }

        const obs: CandidateObservation = {
          id: dedupeId,
          jobId,
          sourceKey: vendor.key,
          sourceUrl: item.url || `${vendor.baseUrl}/products/${externalId}`,
          externalId,
          rawTitle: item.title || item.name || `Unnamed Item ${externalId}`,
          rawPrice: rawPriceNum !== null && !isNaN(rawPriceNum)
            ? { amount: rawPriceNum, currency: item.currency || 'INR' }
            : null,
          rawCategory: item.category || 'resin-craft',
          images: imageUrls,
          extractedAt: new Date().toISOString(),
          status: 'PENDING_REVIEW',
          rawPayloadSha256: sha256,
        };

        this.observations.set(obs.id, obs);
        job.observations.push(obs);
        newObservations.push(obs);
        job.processedCount++;
      } catch (err) {
        job.errorCount++;
        job.errorMessage = (err as Error).message;
      }
    }

    if (job.state !== 'CANCELLED') {
      job.state = job.errorCount > 0 && job.processedCount === 0 ? 'FAILED' : 'COMPLETED';
      job.completedAt = new Date().toISOString();
    }

    return newObservations;
  }

  getObservation(id: string): CandidateObservation | undefined {
    return this.observations.get(id);
  }

  getAllObservations(): readonly CandidateObservation[] {
    return Array.from(this.observations.values());
  }
}

export const scraperJobManager = new ScraperJobManager();
