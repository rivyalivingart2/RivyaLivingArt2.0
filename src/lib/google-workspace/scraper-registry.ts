import legacySources from '../../components/studio/legacy-sources.json';

export type ScraperPlatform = 'WOOCOMMERCE' | 'SHOPIFY' | 'JSONLD' | 'UNKNOWN';

export type ScraperTier = 'OWNER' | 'LARGE_FORMAT' | 'MEDIUM_FORMAT' | 'SMALL_FORMAT';

export type AccessMethod =
  | 'STORE_API'
  | 'SHOPIFY_API'
  | 'JSON_LD'
  | 'PUBLIC_SITEMAP'
  | 'MANUAL_RESEARCH';

export interface VendorSourceRecord {
  readonly key: string;
  readonly name: string;
  readonly baseUrl: string;
  readonly country: string;
  readonly vertical: string;
  readonly platform: ScraperPlatform;
  readonly tier: ScraperTier;
  readonly accessMethod: AccessMethod;
  readonly rateLimitRpm: number;
  readonly maxConcurrency: number;
  readonly requiresAuth: false;
  readonly bypassAccessControls: false;
  readonly enabled: boolean;
  readonly collectionMode: 'AUTOMATED_HTTP' | 'MANUAL_RESEARCH';
  readonly lastVerifiedDate: string;
  readonly lastVerifiedStatus: 'ACTIVE_ACCESSIBLE' | 'MANUAL_ONLY' | 'CATALOGUE_EMPTY' | 'BLOCKED_ACCESS';
  readonly notes: string;
}

function deriveAccessMethod(platform: string, collectionMode?: string, notes?: string): AccessMethod {
  if (collectionMode === 'MANUAL_RESEARCH' || platform === 'UNKNOWN') {
    return 'MANUAL_RESEARCH';
  }
  if (platform === 'SHOPIFY') return 'SHOPIFY_API';
  if (platform === 'WOOCOMMERCE') {
    if (notes?.toLowerCase().includes('json-ld')) return 'JSON_LD';
    return 'STORE_API';
  }
  if (platform === 'JSONLD') return 'JSON_LD';
  return 'MANUAL_RESEARCH';
}

function deriveVerifiedStatus(notes: string, enabled: boolean): VendorSourceRecord['lastVerifiedStatus'] {
  const n = notes.toLowerCase();
  if (n.includes('cloudflare') || n.includes('403')) return 'BLOCKED_ACCESS';
  if (n.includes('0 products') || n.includes('nothing to collect')) return 'CATALOGUE_EMPTY';
  if (n.includes('no automated path') || n.includes('enquiry-only') || !enabled) return 'MANUAL_ONLY';
  return 'ACTIVE_ACCESSIBLE';
}

/**
 * Builds the canonical vendor registry from legacy sources with strict ethics and compliance boundaries.
 */
export function buildVendorRegistry(): readonly VendorSourceRecord[] {
  return legacySources.map((s) => {
    const accessMethod = deriveAccessMethod(s.platform, s.collectionMode, s.notes);
    const lastVerifiedStatus = deriveVerifiedStatus(s.notes, s.enabled);
    const isManual = accessMethod === 'MANUAL_RESEARCH' || s.collectionMode === 'MANUAL_RESEARCH';

    return {
      key: s.key,
      name: s.name,
      baseUrl: s.baseUrl,
      country: s.country,
      vertical: s.vertical || 'resin',
      platform: s.platform as ScraperPlatform,
      tier: s.tier as ScraperTier,
      accessMethod,
      rateLimitRpm: isManual ? 0 : 30, // conservative: 30 requests per minute max
      maxConcurrency: isManual ? 0 : 2,
      requiresAuth: false,
      bypassAccessControls: false, // Invariant: Never bypass logins, paywalls, or bot protections
      enabled: s.enabled,
      collectionMode: isManual ? 'MANUAL_RESEARCH' : 'AUTOMATED_HTTP',
      lastVerifiedDate: '2026-09-18',
      lastVerifiedStatus,
      notes: s.notes || '',
    };
  });
}

export const vendorRegistry: readonly VendorSourceRecord[] = buildVendorRegistry();

export function getVendorByKey(key: string): VendorSourceRecord | undefined {
  return vendorRegistry.find((v) => v.key === key);
}

export function getVendorsByPlatform(platform: ScraperPlatform): readonly VendorSourceRecord[] {
  return vendorRegistry.filter((v) => v.platform === platform);
}

export function getVendorsByTier(tier: ScraperTier): readonly VendorSourceRecord[] {
  return vendorRegistry.filter((v) => v.tier === tier);
}

export function getActiveAutomatedVendors(): readonly VendorSourceRecord[] {
  return vendorRegistry.filter(
    (v) => v.enabled && v.collectionMode === 'AUTOMATED_HTTP' && v.lastVerifiedStatus === 'ACTIVE_ACCESSIBLE'
  );
}
