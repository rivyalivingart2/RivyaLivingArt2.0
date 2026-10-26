import { editorialWidths } from '../editorial-media-model';
import { approvedPublicMedia } from '../public-media';

export interface AspectRatioCheckResult {
  readonly valid: boolean;
  readonly ratio: number;
  readonly expectedRatio: number;
  readonly tolerancePercent: number;
}

export interface DerivativeCheckResult {
  readonly valid: boolean;
  readonly missingWidths: readonly number[];
  readonly oversizedVariants: readonly number[];
  readonly errors: readonly string[];
}

export interface MediaDeliveryResolution {
  readonly canDeliver: boolean;
  readonly deliveryUrl: string | null;
  readonly accessType: 'public' | 'private_gated' | 'denied';
  readonly reason?: string;
}

export interface MediaUploadValidation {
  readonly valid: boolean;
  readonly error?: string;
}

export interface MediaReplacementRecord {
  readonly parentSha256: string;
  readonly newSha256: string;
  readonly method: 'ai-edit' | 'manual-crop';
  readonly recordedAt: string;
}

export interface MediaArchiveResult {
  readonly assetId: string;
  readonly status: 'ARCHIVED';
  readonly previousStatus: string;
  readonly archivedAt: string;
}

export interface OrphanMediaScanResult {
  readonly totalRegistered: number;
  readonly referencedCount: number;
  readonly orphanPaths: readonly string[];
}

export interface MotionAssetValidation {
  readonly valid: boolean;
  readonly error?: string;
}

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // 20 MB
const MAX_DERIVATIVE_BYTES = 600 * 1024;   // 600 KB
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

/**
 * Checks whether an image matches the 4:5 vertical portrait aspect ratio
 * (0.8 width/height ratio) within 2% tolerance.
 */
export function validateAspectRatio4x5(
  width: number,
  height: number,
  tolerancePercent = 2.0
): AspectRatioCheckResult {
  if (!width || !height || width <= 0 || height <= 0) {
    return { valid: false, ratio: 0, expectedRatio: 0.8, tolerancePercent };
  }
  const ratio = width / height;
  const expectedRatio = 4 / 5; // 0.8
  const diffPercent = Math.abs(ratio - expectedRatio) / expectedRatio * 100;
  return {
    valid: diffPercent <= tolerancePercent,
    ratio,
    expectedRatio,
    tolerancePercent,
  };
}

/**
 * Verifies responsive derivative set meets requirements:
 * 1. Contains all required widths: 640, 960, 1600.
 * 2. Each variant does not exceed the derivative byte budget (600 KB).
 * 3. Hashes are valid 64-char SHA-256 strings.
 */
export function verifyDerivativeSizes(
  derivatives: readonly { width: number; height: number; bytes: number; sha256: string }[]
): DerivativeCheckResult {
  const errors: string[] = [];
  const missingWidths: number[] = [];
  const oversizedVariants: number[] = [];

  for (const expectedWidth of editorialWidths) {
    const match = derivatives.find((d) => d.width === expectedWidth);
    if (!match) {
      missingWidths.push(expectedWidth);
      errors.push(`Missing derivative variant for width: ${expectedWidth}`);
    } else {
      if (match.bytes > MAX_DERIVATIVE_BYTES) {
        oversizedVariants.push(expectedWidth);
        errors.push(`Derivative for width ${expectedWidth} exceeds budget (${match.bytes} > ${MAX_DERIVATIVE_BYTES})`);
      }
      if (!/^[a-f0-9]{64}$/.test(match.sha256)) {
        errors.push(`Derivative for width ${expectedWidth} has invalid SHA-256 hash`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    missingWidths,
    oversizedVariants,
    errors,
  };
}

/**
 * Resolves media delivery ensuring strict private/public boundaries:
 * - Public media & creations resolve for all clients.
 * - Private references require authenticated staff session.
 */
export function resolveMediaDelivery(
  mediaPath: string,
  isStaffAuthenticated: boolean
): MediaDeliveryResolution {
  if (!mediaPath || typeof mediaPath !== 'string') {
    return { canDeliver: false, deliveryUrl: null, accessType: 'denied', reason: 'Invalid media path' };
  }

  // Deny path traversals
  if (mediaPath.includes('..') || mediaPath.includes('//') || mediaPath.includes('\\')) {
    return { canDeliver: false, deliveryUrl: null, accessType: 'denied', reason: 'Path traversal detected' };
  }

  // Private customer reference gating
  if (
    mediaPath.startsWith('/api/studio/reference/private') ||
    mediaPath.startsWith('/references/') ||
    mediaPath.includes('private-ref')
  ) {
    if (!isStaffAuthenticated) {
      return {
        canDeliver: false,
        deliveryUrl: null,
        accessType: 'denied',
        reason: 'Private customer references require authenticated Studio staff session',
      };
    }
    return {
      canDeliver: true,
      deliveryUrl: mediaPath,
      accessType: 'private_gated',
    };
  }

  // Approved public media or creation
  const isApproved =
    approvedPublicMedia.some((m) => m.path === mediaPath) ||
    mediaPath.startsWith('/media/') ||
    mediaPath.startsWith('/editorial/') ||
    mediaPath.startsWith('/api/local-creations/') ||
    mediaPath.startsWith('/creations/');

  if (isApproved) {
    return {
      canDeliver: true,
      deliveryUrl: mediaPath,
      accessType: 'public',
    };
  }

  return {
    canDeliver: false,
    deliveryUrl: null,
    accessType: 'denied',
    reason: 'Unregistered media path',
  };
}

/**
 * Validates bounded media upload
 */
export function validateMediaUpload(input: {
  filename: string;
  bytes: number;
  contentType: string;
}): MediaUploadValidation {
  if (!input.filename || input.filename.length > 180 || /[<>]/.test(input.filename)) {
    return { valid: false, error: 'Filename must be safe string up to 180 characters' };
  }
  if (!input.bytes || input.bytes <= 0 || input.bytes > MAX_UPLOAD_BYTES) {
    return { valid: false, error: `Image must be between 1 byte and 20 MB (received ${input.bytes} bytes)` };
  }
  if (!ALLOWED_MIME_TYPES.has(input.contentType.toLowerCase())) {
    return { valid: false, error: `Invalid image content type: ${input.contentType}. Use JPEG, PNG, or WebP.` };
  }
  return { valid: true };
}

/**
 * Records replace lineage preserving immutable parent history
 */
export function recordMediaReplaceLineage(
  parentSha256: string,
  newSha256: string,
  method: 'ai-edit' | 'manual-crop'
): MediaReplacementRecord {
  if (!/^[a-f0-9]{64}$/.test(parentSha256)) {
    throw new Error('Invalid parent SHA-256 hash');
  }
  if (!/^[a-f0-9]{64}$/.test(newSha256)) {
    throw new Error('Invalid replacement SHA-256 hash');
  }
  if (parentSha256 === newSha256) {
    throw new Error('Replacement must differ from original parent hash');
  }

  return {
    parentSha256,
    newSha256,
    method,
    recordedAt: new Date().toISOString(),
  };
}

/**
 * Safely archives a media record without destructive loss of bytes
 */
export function archiveMediaAsset(
  assetId: string,
  currentStatus: string
): MediaArchiveResult {
  return {
    assetId,
    status: 'ARCHIVED',
    previousStatus: currentStatus,
    archivedAt: new Date().toISOString(),
  };
}

/**
 * Scans for orphan media assets (assets registered with 0 entity references)
 */
export function checkOrphanMediaAssets(
  registeredPaths: readonly string[],
  referencedPaths: readonly string[]
): OrphanMediaScanResult {
  const referencedSet = new Set(referencedPaths);
  const orphanPaths = registeredPaths.filter((p) => !referencedSet.has(p));
  return {
    totalRegistered: registeredPaths.length,
    referencedCount: referencedSet.size,
    orphanPaths,
  };
}

/**
 * Validates motion / video assets (e.g. process footage like 'resin-pour')
 */
export function validateMotionAsset(asset: {
  id: string;
  motionKind: 'resin-pour';
  posterPath: string;
  durationSeconds: number;
  hasAudio: boolean;
}): MotionAssetValidation {
  if (asset.motionKind !== 'resin-pour') {
    return { valid: false, error: `Unsupported motionKind: ${asset.motionKind}` };
  }
  if (!asset.posterPath || !asset.posterPath.startsWith('/media/')) {
    return { valid: false, error: 'Motion asset requires a valid static poster image path' };
  }
  if (!Number.isFinite(asset.durationSeconds) || asset.durationSeconds <= 0 || asset.durationSeconds > 60) {
    return { valid: false, error: 'Motion clips must be under 60 seconds duration' };
  }
  if (asset.hasAudio) {
    return { valid: false, error: 'Background ambient motion must be silent (hasAudio must be false)' };
  }
  return { valid: true };
}
