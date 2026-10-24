import {localCreationAccess} from './owner-creation-model';

/** Server capability only. Production activation requires the reviewed additive
 * schema and runtime grants first; this flag never runs a migration. The strict
 * existing local target retains its already-rehearsed extension workflows. */
export function editorialExtensionsEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.RIVYA_EDITORIAL_EXTENSIONS_SCHEMA_READY === 'true' || localCreationAccess(env);
}

/** Only these two fixed server-owned fragments may enter sql.unsafe. Never accept
 * SQL, table names, resource identifiers or flags from a browser request. */
export function editorialExtensionDependencyUnion(env: NodeJS.ProcessEnv = process.env): string {
  return editorialExtensionsEnabled(env)
    ? "UNION ALL SELECT 'extension',kind||':'||entity_key,md5(published::text) FROM rivya_editorial_extensions WHERE published IS NOT NULL"
    : '';
}
