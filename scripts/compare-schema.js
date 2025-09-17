// Script to compare migration schema with database-comprehensive.ts
import fs from 'fs';

// Extract tables from migration file
function extractTablesFromMigration(migrationContent) {
  const tables = {};
  const tableRegex = /CREATE TABLE IF NOT EXISTS (\w+)\s*\(([\s\S]*?)\);/g;
  
  let match;
  while ((match = tableRegex.exec(migrationContent)) !== null) {
    const tableName = match[1];
    const tableContent = match[2];
    
    // Extract columns
    const columns = {};
    const lines = tableContent.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('--') || 
          trimmedLine.startsWith('UNIQUE') || 
          trimmedLine.startsWith('CHECK') ||
          trimmedLine.startsWith('CONSTRAINT') ||
          trimmedLine.startsWith('PRIMARY KEY') ||
          trimmedLine.startsWith('FOREIGN KEY')) {
        continue;
      }
      
      // Parse column definition
      const columnMatch = trimmedLine.match(/^(\w+)\s+(.+?)(?:,)?$/);
      if (columnMatch) {
        const columnName = columnMatch[1];
        const columnDef = columnMatch[2];
        columns[columnName] = columnDef;
      }
    }
    
    tables[tableName] = columns;
  }
  
  return tables;
}

// Extract tables from TypeScript file
function extractTablesFromTypeScript(tsContent) {
  const tables = {};
  
  // Find Tables section
  const tablesMatch = tsContent.match(/Tables:\s*{([\s\S]*?)}\s*Views:/);
  if (!tablesMatch) {
    console.error('Could not find Tables section in TypeScript file');
    return tables;
  }
  
  const tablesContent = tablesMatch[1];
  
  // Extract each table
  const tableRegex = /(\w+):\s*{\s*Row:\s*{([\s\S]*?)}\s*Insert:/g;
  
  let match;
  while ((match = tableRegex.exec(tablesContent)) !== null) {
    const tableName = match[1];
    const rowContent = match[2];
    
    // Extract columns from Row type
    const columns = {};
    const columnRegex = /(\w+):\s*([^|\n]+?)(?:\s*\|[^|\n]+?)*$/gm;
    
    let colMatch;
    while ((colMatch = columnRegex.exec(rowContent)) !== null) {
      const columnName = colMatch[1];
      const columnType = colMatch[2].trim();
      columns[columnName] = columnType;
    }
    
    tables[tableName] = columns;
  }
  
  return tables;
}

// Map SQL types to TypeScript types
function mapSqlToTs(sqlType) {
  const typeMap = {
    'UUID': 'string',
    'TEXT': 'string',
    'INTEGER': 'number',
    'BOOLEAN': 'boolean',
    'TIMESTAMPTZ': 'string',
    'JSONB': 'Json',
    'TIME': 'string',
    'INET': 'unknown',
    'DECIMAL': 'number'
  };
  
  for (const [sql, ts] of Object.entries(typeMap)) {
    if (sqlType.toUpperCase().includes(sql)) {
      return ts;
    }
  }
  
  return 'unknown';
}

// Compare schemas
function compareSchemas() {
  const migrationPath = '/Users/bryan/Dev/sms-hub-monorepo/supabase/migrations/0000001_complete_schema.sql';
  const tsPath = '/Users/bryan/Dev/sms-hub-monorepo/packages/types/src/database-comprehensive.ts';
  
  const migrationContent = fs.readFileSync(migrationPath, 'utf8');
  const tsContent = fs.readFileSync(tsPath, 'utf8');
  
  const migrationTables = extractTablesFromMigration(migrationContent);
  const tsTables = extractTablesFromTypeScript(tsContent);
  
  console.log('Migration tables:', Object.keys(migrationTables).sort());
  console.log('\nTypeScript tables:', Object.keys(tsTables).sort());
  
  // Find missing tables
  const migrationTableNames = new Set(Object.keys(migrationTables));
  const tsTableNames = new Set(Object.keys(tsTables));
  
  const missingInTs = [...migrationTableNames].filter(t => !tsTableNames.has(t));
  const missingInMigration = [...tsTableNames].filter(t => !migrationTableNames.has(t));
  
  if (missingInTs.length > 0) {
    console.log('\n❌ Tables in migration but missing in TypeScript:');
    console.log(missingInTs);
  }
  
  if (missingInMigration.length > 0) {
    console.log('\n❌ Tables in TypeScript but missing in migration:');
    console.log(missingInMigration);
  }
  
  // Compare columns for each table
  console.log('\n=== Comparing columns for each table ===\n');
  
  for (const tableName of migrationTableNames) {
    if (!tsTableNames.has(tableName)) continue;
    
    console.log(`Table: ${tableName}`);
    
    const migrationCols = migrationTables[tableName];
    const tsCols = tsTables[tableName];
    
    const migrationColNames = new Set(Object.keys(migrationCols));
    const tsColNames = new Set(Object.keys(tsCols));
    
    const missingInTsCols = [...migrationColNames].filter(c => !tsColNames.has(c));
    const missingInMigrationCols = [...tsColNames].filter(c => !migrationColNames.has(c));
    
    if (missingInTsCols.length > 0) {
      console.log(`  ❌ Columns in migration but missing in TypeScript: ${missingInTsCols.join(', ')}`);
    }
    
    if (missingInMigrationCols.length > 0) {
      console.log(`  ❌ Columns in TypeScript but missing in migration: ${missingInMigrationCols.join(', ')}`);
    }
    
    if (missingInTsCols.length === 0 && missingInMigrationCols.length === 0) {
      console.log('  ✅ All columns match');
    }
    
    console.log('');
  }
}

compareSchemas();