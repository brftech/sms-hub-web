// Re-export generated types from live database
export * from './database-generated'

// Keep existing UserRole type for backward compatibility
export type UserRole = 'SUPERADMIN' | 'OWNER' | 'ADMIN' | 'SUPPORT' | 'VIEWER' | 'MEMBER'

// Re-export Database type from generated file
export type { Database } from './database-generated'