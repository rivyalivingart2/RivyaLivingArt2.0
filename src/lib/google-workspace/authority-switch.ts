import {getStorageProvider, isSqlDisabled, type StorageProvider} from './provider-switch';
import {cutoverOrchestrator, type BackupRecoveryManifest} from './cutover-runbook';

export interface AuthoritySwitchOptions {
  readonly targetProvider: 'google-workspace';
  readonly authorizationToken?: string;
  readonly dryRun?: boolean;
  readonly operator: string;
  readonly reason: string;
}

/** Preparation boundary. A process-local flag or token prefix cannot authorize,
 * execute, or roll back a production cutover. Retained runbook models are simulations. */
export class AuthoritySwitchManager {
  getState(env: NodeJS.ProcessEnv = process.env) {
    return {currentAuthority: getStorageProvider(env), cutoverStage: cutoverOrchestrator.getStage(),
      isWritePaused: false, authorized: false, sqlDisabled: isSqlDisabled(env), history: []};
  }
  isAuthorized(_token?: string, _env: NodeJS.ProcessEnv = process.env): boolean {
    void _token; void _env;
    return false;
  }
  validatePrerequisites(_manifest?: BackupRecoveryManifest) {
    void _manifest;
    return {ready: false, checks: {tablesReconciled: false, mediaAssetsReconciled: false,
      writePauseOperational: false, zeroUncommittedTransactions: false}};
  }
  executeSwitch(options: AuthoritySwitchOptions, env: NodeJS.ProcessEnv = process.env) {
    return {
      status: options.dryRun === true ? 'SIMULATED_DRY_RUN' as const : 'REJECTED' as const,
      currentAuthority: getStorageProvider(env),
      message: options.dryRun === true
        ? 'Planning simulation only; prerequisite evidence is missing and no authority changed.'
        : 'Durable cutover execution is not installed. Reviewed final-delta, write fencing, restore and scoped authorization are required.',
      prerequisites: this.validatePrerequisites().checks,
    };
  }
  emergencyRollback(_reason: string, _operator: string): {status: 'REJECTED'; restoredAuthority: null; currentAuthority: StorageProvider; message: string} {
    void _reason; void _operator;
    return {status: 'REJECTED', restoredAuthority: null, currentAuthority: getStorageProvider(),
      message: 'No rollback performed. Reconcile writes after cutover before selecting a recovery store.'};
  }
  reset(): void { cutoverOrchestrator.reset(); }
}
export const authoritySwitchManager = new AuthoritySwitchManager();
