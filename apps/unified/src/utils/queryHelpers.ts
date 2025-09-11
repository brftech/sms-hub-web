import type { SupabaseClient } from "@sms-hub/supabase";
import { logger } from "./logger";

/**
 * Tables that require hub_id for multi-tenant isolation
 */
const HUB_ISOLATED_TABLES = [
  'companies',
  'user_profiles',
  'verifications',
  'leads',
  'contacts',
  'messages',
  'conversations',
  'gphone_numbers',
  'inbox_assignments',
] as const;

type HubIsolatedTable = typeof HUB_ISOLATED_TABLES[number];

/**
 * Check if a table requires hub_id isolation
 */
export function requiresHubId(table: string): table is HubIsolatedTable {
  return HUB_ISOLATED_TABLES.includes(table as HubIsolatedTable);
}

/**
 * Create a query builder that enforces hub_id for multi-tenant tables
 * This is a helper to ensure developers don't forget to add hub_id
 */
export function createSecureQuery<T extends Record<string, any>>(
  supabase: SupabaseClient,
  table: string,
  hubId?: number,
  options?: {
    requireHub?: boolean;
    isGlobalQuery?: boolean;
  }
) {
  const { requireHub = true, isGlobalQuery = false } = options || {};
  
  // Start the query
  let query = supabase.from(table);
  
  // Check if this table requires hub isolation
  if (requiresHubId(table) && !isGlobalQuery) {
    if (hubId === undefined && requireHub) {
      logger.error(`Security Warning: Query to "${table}" table missing hub_id!`, {
        table,
        stack: new Error().stack
      });
      throw new Error(`Hub ID is required for queries to ${table} table`);
    }
    
    if (hubId !== undefined) {
      // Apply hub filter for SELECT queries
      query = query as any;
      return {
        select: (...args: any[]) => {
          const selectQuery = (query as any).select(...args);
          return selectQuery.eq('hub_id', hubId);
        },
        insert: (data: T | T[]) => {
          // Ensure hub_id is included in insert data
          const dataWithHub = Array.isArray(data) 
            ? data.map(item => ({ ...item, hub_id: hubId }))
            : { ...data, hub_id: hubId };
          return (query as any).insert(dataWithHub);
        },
        update: (data: Partial<T>) => {
          // For updates, we need to filter by hub_id
          return (query as any).update(data).eq('hub_id', hubId);
        },
        delete: () => {
          // For deletes, we need to filter by hub_id
          return (query as any).delete().eq('hub_id', hubId);
        },
        upsert: (data: T | T[]) => {
          // Ensure hub_id is included in upsert data
          const dataWithHub = Array.isArray(data)
            ? data.map(item => ({ ...item, hub_id: hubId }))
            : { ...data, hub_id: hubId };
          return (query as any).upsert(dataWithHub);
        }
      };
    }
  }
  
  // Return normal query for non-hub-isolated tables or global queries
  return query;
}

/**
 * Validate that an object contains required hub_id for hub-isolated operations
 */
export function validateHubId<T extends { hub_id?: number }>(
  data: T,
  table: string
): asserts data is T & { hub_id: number } {
  if (requiresHubId(table) && !data.hub_id) {
    throw new Error(`hub_id is required for ${table} operations`);
  }
}

/**
 * Add hub_id to data if it's missing and the table requires it
 */
export function ensureHubId<T extends Record<string, any>>(
  data: T,
  hubId: number,
  table: string
): T & { hub_id?: number } {
  if (requiresHubId(table) && !('hub_id' in data)) {
    return { ...data, hub_id: hubId };
  }
  return data;
}

/**
 * Example usage:
 * 
 * // In a service:
 * const query = createSecureQuery(supabase, 'companies', userHubId);
 * const companies = await query.select('*').eq('is_active', true);
 * 
 * // For inserts:
 * await query.insert({ name: 'New Company', ... }); // hub_id automatically added
 * 
 * // For global queries (superadmin only):
 * const globalQuery = createSecureQuery(supabase, 'companies', undefined, { isGlobalQuery: true });
 * const allCompanies = await globalQuery.select('*');
 */