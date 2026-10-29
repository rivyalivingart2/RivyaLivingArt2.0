import {createHash, createHmac, randomBytes, randomUUID, scrypt, timingSafeEqual} from 'node:crypto';
import {promisify} from 'node:util';
import type {AccessInput} from '../studio-access-validation.ts';
import type {StudioSessionLifecycle} from './bounded-session-service';

export interface StaffMember {
  id: string;
  login: string;
  name: string;
  role: StaffRole;
  active: boolean;
  version: number;
}

const deriveScrypt = promisify(scrypt);

export type StaffRole = 'admin' | 'editor';

export interface StaffRecord {
  id: string;
  login: string;
  name: string;
  password_hash: string;
  role: StaffRole;
  active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface StudioSessionRecord {
  token_hash: string;
  credential_version: string;
  expires_at: string;
  idle_expires_at: string;
  staff_id: string | null;
  created_at: string;
}

export interface StudioLoginLimitRecord {
  key: string;
  attempts: number;
  reset_at: string;
}

export interface AccessRequestRecord {
  id: string;
  kind: 'access' | 'recovery';
  login: string;
  name: string;
  contact: string;
  status: 'pending' | 'approved' | 'rejected' | 'redeemed';
  token_hash: string | null;
  expires_at: string | null;
  decided_by: string | null;
  version: number;
  created_at: string;
  updated_at: string;
  staff_id: string | null;
  credential_version: number | null;
}

export interface StaffSession {
  adminId: string;
  role: StaffRole;
  staffId: string | null;
  credentialVersion?: number;
}

export class SecurityAdapterError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.name = 'SecurityAdapterError';
    this.code = code;
  }
}

export interface SecurityDataStore {
  /** Atomic provider operation. Read/modify/write must share the provider's
   * concurrency boundary across workers; separate get/save calls are unsafe. */
  consumeLoginAttempt: (input: {key: string; limit: number; windowMinutes: number; now: string}) => Promise<boolean>;
  getStaffByLogin: (login: string) => Promise<StaffRecord | null>;
  getStaffById: (id: string) => Promise<StaffRecord | null>;
  listStaff: () => Promise<StaffRecord[]>;
  createStaff: (staff: StaffRecord) => Promise<void>;
  updateStaff: (staff: StaffRecord) => Promise<void>;

  getSession: (tokenHash: string) => Promise<StudioSessionRecord | null>;
  saveSession: (session: StudioSessionRecord) => Promise<void>;
  updateSessionIdle: (tokenHash: string, newIdleExpiresAt: string) => Promise<void>;
  deleteSession: (tokenHash: string) => Promise<void>;
  deleteExpiredSessions: (now: string) => Promise<number>;

  getLoginLimit: (key: string) => Promise<StudioLoginLimitRecord | null>;
  saveLoginLimit: (limit: StudioLoginLimitRecord) => Promise<void>;
  deleteLoginLimit: (key: string) => Promise<void>;

  getAccessRequestById: (id: string) => Promise<AccessRequestRecord | null>;
  findPendingAccessRequest: (kind: string, login: string) => Promise<AccessRequestRecord | null>;
  listAccessRequests: () => Promise<AccessRequestRecord[]>;
  saveAccessRequest: (request: AccessRequestRecord) => Promise<void>;
  updateAccessRequest: (request: AccessRequestRecord) => Promise<void>;
}

/** Unit-test simulation. Never a runtime security persistence provider. */
export class InMemorySecurityStore implements SecurityDataStore {
  private staff = new Map<string, StaffRecord>();
  private sessions = new Map<string, StudioSessionRecord>();
  private loginLimits = new Map<string, StudioLoginLimitRecord>();
  private accessRequests = new Map<string, AccessRequestRecord>();

  async consumeLoginAttempt(input: {key: string; limit: number; windowMinutes: number; now: string}): Promise<boolean> {
    // No await between read and update: atomic only within this test process.
    const now = Date.parse(input.now), existing = this.loginLimits.get(input.key);
    if (existing && (!Number.isSafeInteger(existing.attempts) || existing.attempts < 0 || !Number.isFinite(Date.parse(existing.reset_at)))) {
      throw new SecurityAdapterError('INVALID_THROTTLE', 'Stored throttle state is invalid.');
    }
    const active = existing && Date.parse(existing.reset_at) > now;
    const attempts = active ? existing.attempts : 0;
    if (attempts >= input.limit) return false;
    this.loginLimits.set(input.key, {key: input.key, attempts: attempts + 1,
      reset_at: active ? existing.reset_at : new Date(now + input.windowMinutes * 60_000).toISOString()});
    return true;
  }

  async getStaffByLogin(login: string): Promise<StaffRecord | null> {
    const lower = login.trim().toLowerCase();
    for (const record of this.staff.values()) {
      if (record.login.toLowerCase() === lower) return {...record};
    }
    return null;
  }

  async getStaffById(id: string): Promise<StaffRecord | null> {
    const s = this.staff.get(id);
    return s ? {...s} : null;
  }

  async listStaff(): Promise<StaffRecord[]> {
    return Array.from(this.staff.values()).map(s => ({...s}));
  }

  async createStaff(staff: StaffRecord): Promise<void> {
    this.staff.set(staff.id, {...staff});
  }

  async updateStaff(staff: StaffRecord): Promise<void> {
    this.staff.set(staff.id, {...staff});
  }

  async getSession(tokenHash: string): Promise<StudioSessionRecord | null> {
    const s = this.sessions.get(tokenHash);
    return s ? {...s} : null;
  }

  async saveSession(session: StudioSessionRecord): Promise<void> {
    this.sessions.set(session.token_hash, {...session});
  }

  async updateSessionIdle(tokenHash: string, newIdleExpiresAt: string): Promise<void> {
    const s = this.sessions.get(tokenHash);
    if (s) {
      s.idle_expires_at = newIdleExpiresAt;
      this.sessions.set(tokenHash, s);
    }
  }

  async deleteSession(tokenHash: string): Promise<void> {
    this.sessions.delete(tokenHash);
  }

  async deleteExpiredSessions(now: string): Promise<number> {
    let deleted = 0;
    const nowDate = new Date(now).getTime();
    for (const [hashKey, s] of this.sessions.entries()) {
      if (new Date(s.expires_at).getTime() <= nowDate || new Date(s.idle_expires_at).getTime() <= nowDate) {
        this.sessions.delete(hashKey);
        deleted++;
      }
    }
    return deleted;
  }

  async getLoginLimit(key: string): Promise<StudioLoginLimitRecord | null> {
    const l = this.loginLimits.get(key);
    return l ? {...l} : null;
  }

  async saveLoginLimit(limit: StudioLoginLimitRecord): Promise<void> {
    this.loginLimits.set(limit.key, {...limit});
  }

  async deleteLoginLimit(key: string): Promise<void> {
    this.loginLimits.delete(key);
  }

  async getAccessRequestById(id: string): Promise<AccessRequestRecord | null> {
    const r = this.accessRequests.get(id);
    return r ? {...r} : null;
  }

  async findPendingAccessRequest(kind: string, login: string): Promise<AccessRequestRecord | null> {
    const lower = login.trim().toLowerCase();
    for (const req of this.accessRequests.values()) {
      if (req.kind === kind && req.login.toLowerCase() === lower && (req.status === 'pending' || req.status === 'approved')) {
        return {...req};
      }
    }
    return null;
  }

  async listAccessRequests(): Promise<AccessRequestRecord[]> {
    return Array.from(this.accessRequests.values()).map(r => ({...r}));
  }

  async saveAccessRequest(request: AccessRequestRecord): Promise<void> {
    this.accessRequests.set(request.id, {...request});
  }

  async updateAccessRequest(request: AccessRequestRecord): Promise<void> {
    this.accessRequests.set(request.id, {...request});
  }
}

export class GoogleWorkspaceSecurityAdapter {
  private store: SecurityDataStore;
  private adminId: string;
  private adminPassword?: string;
  private sessionSecret?: string;
  private sessionLifecycle?: StudioSessionLifecycle;

  constructor(
    store: SecurityDataStore,
    options: {adminId?: string; adminPassword?: string; sessionSecret?: string} = {},
    sessionLifecycle?: StudioSessionLifecycle,
  ) {
    this.store = store;
    this.adminId = options.adminId || process.env.STUDIO_ADMIN_ID || '';
    this.adminPassword = options.adminPassword || process.env.STUDIO_ADMIN_PASSWORD;
    this.sessionSecret = options.sessionSecret || process.env.STUDIO_SESSION_SECRET;
    this.sessionLifecycle = sessionLifecycle;
    if (sessionLifecycle && (sessionLifecycle.scope !== 'BOUNDED_ATOMIC_SESSIONS' ||
        ['createStudioSession', 'studioSessionFromToken', 'revokeStudioSession'].some(key =>
          typeof sessionLifecycle[key as keyof StudioSessionLifecycle] !== 'function'))) {
      throw new SecurityAdapterError('ATOMIC_SESSIONS_REQUIRED', 'The atomic session service is invalid.');
    }
  }

  isConfigured(): boolean {
    return Boolean(
      this.adminId.trim() &&
      (this.adminPassword?.length ?? 0) >= 16 &&
      (this.sessionSecret?.length ?? 0) >= 32 &&
      (this.store instanceof InMemorySecurityStore || !!this.sessionLifecycle)
    );
  }

  private hash(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }

  private adminFingerprint(): string {
    if (!this.sessionSecret || !this.adminId || !this.adminPassword) {
      throw new SecurityAdapterError('NOT_CONFIGURED', 'Security environment is incomplete.');
    }
    return createHmac('sha256', this.sessionSecret)
      .update(JSON.stringify([this.adminId, this.adminPassword]))
      .digest('hex');
  }

  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derived = (await deriveScrypt(password, salt, 64)) as Buffer;
    return `${salt}:${derived.toString('hex')}`;
  }

  async verifyAdmin(id: string, password: string): Promise<boolean> {
    if (!this.isConfigured() || !this.adminPassword || !this.sessionSecret) return false;
    const salt = this.sessionSecret;
    const [actual, expected] = await Promise.all([
      deriveScrypt(password, salt, 64),
      deriveScrypt(this.adminPassword, salt, 64),
    ]);
    const idMatches = timingSafeEqual(
      Buffer.from(this.hash(id.trim())),
      Buffer.from(this.hash(this.adminId))
    );
    return timingSafeEqual(actual as Buffer, expected as Buffer) && idMatches;
  }

  async authenticateStaff(id: string, password: string): Promise<StaffSession | null> {
    if (await this.verifyAdmin(id, password)) {
      return {adminId: this.adminId, role: 'admin', staffId: null};
    }
    const staff = await this.store.getStaffByLogin(id);
    if (!staff || !staff.active) return null;

    const [salt, expected] = (staff.password_hash || '0'.repeat(32) + ':' + '0'.repeat(128)).split(':');
    if (!salt || !expected) return null;

    const actual = (await deriveScrypt(password, salt, 64)) as Buffer;
    const matches = timingSafeEqual(actual, Buffer.from(expected, 'hex'));
    if (!matches) return null;

    return {
      adminId: staff.login,
      role: staff.role,
      staffId: staff.id,
      credentialVersion: staff.version,
    };
  }

  async recordLoginAttempt(key: string, limit: number, windowMinutes = 15, now = new Date()): Promise<boolean> {
    if (!key || key.length > 240 || !Number.isSafeInteger(limit) || limit < 1 || limit > 1000 ||
      !Number.isSafeInteger(windowMinutes) || windowMinutes < 1 || windowMinutes > 1440 || !Number.isFinite(now.getTime())) {
      throw new SecurityAdapterError('INVALID_THROTTLE', 'Invalid throttle policy.');
    }
    return this.store.consumeLoginAttempt({key, limit, windowMinutes, now: now.toISOString()});
  }

  async createStudioSession(identity?: StaffSession, now = new Date()): Promise<string> {
    if (this.sessionLifecycle) {
      this.requireSessionBinding();
      return this.sessionLifecycle.createStudioSession(identity);
    }
    this.requireSimulationSessions();
    const token = randomBytes(32).toString('base64url');
    const tokenHash = this.hash(token);
    const staffId = identity?.staffId || null;

    let credentialVersion: string;
    if (staffId) {
      if (!Number.isSafeInteger(identity?.credentialVersion)) {
        throw new SecurityAdapterError('REAUTH_REQUIRED', 'Account must be authenticated again.');
      }
      credentialVersion = String(identity!.credentialVersion);
    } else {
      credentialVersion = this.adminFingerprint();
    }

    const expiresAt = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString();
    const idleExpiresAt = new Date(now.getTime() + 30 * 60 * 1000).toISOString();

    await this.store.saveSession({
      token_hash: tokenHash,
      credential_version: credentialVersion,
      expires_at: expiresAt,
      idle_expires_at: idleExpiresAt,
      staff_id: staffId,
      created_at: now.toISOString(),
    });

    await this.store.deleteExpiredSessions(now.toISOString());
    await this.store.deleteLoginLimit('owner');

    return token;
  }

  async studioSessionFromToken(token: string | undefined, now = new Date()): Promise<StaffSession | null> {
    if (this.sessionLifecycle) {
      this.requireSessionBinding();
      return this.sessionLifecycle.studioSessionFromToken(token);
    }
    this.requireSimulationSessions();
    if (!this.isConfigured()) return null;
    if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;

    const tokenHash = this.hash(token);
    const session = await this.store.getSession(tokenHash);
    if (!session) return null;

    const nowTime = now.getTime();
    if (new Date(session.expires_at).getTime() <= nowTime) {
      await this.store.deleteSession(tokenHash);
      return null;
    }
    if (new Date(session.idle_expires_at).getTime() <= nowTime) {
      await this.store.deleteSession(tokenHash);
      return null;
    }

    if (session.staff_id === null) {
      const currentAdminFp = this.adminFingerprint();
      if (session.credential_version !== currentAdminFp) {
        await this.store.deleteSession(tokenHash);
        return null;
      }
      const newIdle = new Date(Math.min(new Date(session.expires_at).getTime(), nowTime + 30 * 60 * 1000)).toISOString();
      await this.store.updateSessionIdle(tokenHash, newIdle);
      return {adminId: this.adminId, role: 'admin', staffId: null};
    }

    const staff = await this.store.getStaffById(session.staff_id);
    if (!staff || !staff.active || String(staff.version) !== session.credential_version) {
      await this.store.deleteSession(tokenHash);
      return null;
    }

    const newIdle = new Date(Math.min(new Date(session.expires_at).getTime(), nowTime + 30 * 60 * 1000)).toISOString();
    await this.store.updateSessionIdle(tokenHash, newIdle);

    return {
      adminId: staff.login,
      role: staff.role,
      staffId: staff.id,
      credentialVersion: staff.version,
    };
  }

  async revokeStudioSession(token: string | undefined): Promise<void> {
    if (this.sessionLifecycle) {
      this.requireSessionBinding();
      await this.sessionLifecycle.revokeStudioSession(token);
      return;
    }
    this.requireSimulationSessions();
    if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return;
    await this.store.deleteSession(this.hash(token));
  }

  private requireSessionBinding(): void {
    const binding = this.sessionLifecycle?.ownerCredentialFingerprint;
    if (typeof binding !== 'string' || !/^[a-f0-9]{64}$/.test(binding) ||
        !timingSafeEqual(Buffer.from(binding), Buffer.from(this.adminFingerprint()))) {
      throw new SecurityAdapterError('SESSION_BINDING_CHANGED', 'Session credentials must be configured together.');
    }
  }

  private requireSimulationSessions(): void {
    if (!(this.store instanceof InMemorySecurityStore)) {
      throw new SecurityAdapterError('ATOMIC_SESSIONS_REQUIRED', 'Persistent sessions require the atomic session service.');
    }
  }

  async workspaceStaff(session: StaffSession): Promise<StaffMember[]> {
    const list = await this.store.listStaff();
    list.sort((a, b) => a.name.localeCompare(b.name));
    if (session.role === 'admin') {
      return list.map(s => ({
        id: s.id,
        login: s.login,
        name: s.name,
        role: s.role,
        active: s.active,
        version: s.version,
      }));
    }
    return list
      .filter(s => s.active)
      .map(s => ({
        id: s.id,
        login: '',
        name: s.name,
        role: s.role,
        active: s.active,
        version: s.version,
      }));
  }

  async requestStudioAccess(input: AccessInput, now = new Date()): Promise<void> {
    const existing = await this.store.findPendingAccessRequest(input.kind, input.login);
    if (existing) return;

    await this.store.saveAccessRequest({
      id: randomUUID(),
      kind: input.kind,
      login: input.login,
      name: input.name,
      contact: input.contact,
      status: 'pending',
      token_hash: null,
      expires_at: null,
      decided_by: null,
      version: 1,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      staff_id: null,
      credential_version: null,
    });
  }

  async listAccessRequests(): Promise<AccessRequestRecord[]> {
    const all = await this.store.listAccessRequests();
    return all
      .filter(r => r.status === 'pending' || r.status === 'approved')
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .slice(0, 100);
  }

  async decideAccessRequest(
    session: StaffSession,
    id: string,
    version: number,
    operation: 'approve' | 'reject',
    now = new Date()
  ): Promise<{saved: true; linkToken?: string} | null> {
    if (session.role !== 'admin') {
      throw new SecurityAdapterError('FORBIDDEN', 'Administrator access required.');
    }
    const req = await this.store.getAccessRequestById(id);
    if (!req || req.version !== version || (req.status !== 'pending' && req.status !== 'approved')) {
      return null;
    }

    if (operation === 'reject') {
      req.status = 'rejected';
      req.token_hash = null;
      req.expires_at = null;
      req.version += 1;
      req.updated_at = now.toISOString();
      req.decided_by = session.adminId;
      await this.store.updateAccessRequest(req);
      return {saved: true};
    }

    if (
      req.login.toLowerCase() === this.adminId.toLowerCase() ||
      req.login.toLowerCase() === session.adminId.toLowerCase()
    ) {
      return null;
    }

    let targetStaff: StaffRecord | null = null;
    if (req.kind === 'access') {
      if (req.staff_id) {
        targetStaff = await this.store.getStaffById(req.staff_id);
      } else {
        const placeholderHash = await this.hashPassword(randomBytes(48).toString('base64url'));
        targetStaff = {
          id: randomUUID(),
          login: req.login,
          name: req.name,
          password_hash: placeholderHash,
          role: 'editor',
          active: false,
          version: 1,
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
        };
        await this.store.createStaff(targetStaff);
        req.staff_id = targetStaff.id;
      }
    } else {
      targetStaff = await this.store.getStaffByLogin(req.login);
      if (!targetStaff || !targetStaff.active) return null;
      if (session.staffId && targetStaff.id === session.staffId) return null;
      req.staff_id = targetStaff.id;
    }

    if (!targetStaff) return null;

    const token = randomBytes(32).toString('base64url');
    req.status = 'approved';
    req.credential_version = targetStaff.version;
    req.token_hash = this.hash(token);
    req.expires_at = new Date(now.getTime() + 30 * 60 * 1000).toISOString();
    req.version += 1;
    req.updated_at = now.toISOString();
    req.decided_by = session.adminId;

    await this.store.updateAccessRequest(req);
    return {saved: true, linkToken: token};
  }

  async redeemAccessLink(token: string, newPassword: string, now = new Date()): Promise<boolean> {
    if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return false;
    const tokenHash = this.hash(token);

    const all = await this.store.listAccessRequests();
    const match = all.find(
      r => r.token_hash === tokenHash && r.status === 'approved' && r.expires_at && new Date(r.expires_at).getTime() > now.getTime()
    );
    if (!match || !match.staff_id) return false;

    const staff = await this.store.getStaffById(match.staff_id);
    if (!staff) return false;
    if (match.credential_version !== null && staff.version !== match.credential_version) return false;

    staff.password_hash = await this.hashPassword(newPassword);
    staff.active = true;
    staff.version += 1;
    staff.updated_at = now.toISOString();
    await this.store.updateStaff(staff);

    match.status = 'redeemed';
    match.token_hash = null;
    match.expires_at = null;
    match.version += 1;
    match.updated_at = now.toISOString();
    await this.store.updateAccessRequest(match);

    return true;
  }
}
