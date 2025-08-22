
import fs from 'fs';
import { sql } from 'drizzle-orm';
import { db } from './server/db.ts';

const createDatabaseDumps = async () => {
  console.log('🔄 Creating SQL database dumps...');
  
  try {
    // Get all table schemas
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    let sqlDump = '-- Helix Database Dump\n';
    sqlDump += `-- Generated: ${new Date().toISOString()}\n\n`;
    
    for (const table of tables.rows) {
      const tableName = table.table_name;
      console.log(`📊 Exporting table: ${tableName}`);
      
      // Get table structure
      const structure = await db.execute(sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = ${tableName}
        ORDER BY ordinal_position
      `);
      
      sqlDump += `-- Table: ${tableName}\n`;
      sqlDump += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
      
      structure.rows.forEach((col, index) => {
        const nullable = col.is_nullable === 'YES' ? '' : ' NOT NULL';
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        const comma = index < structure.rows.length - 1 ? ',' : '';
        sqlDump += `  ${col.column_name} ${col.data_type}${nullable}${defaultVal}${comma}\n`;
      });
      
      sqlDump += ');\n\n';
      
      // Export data
      const data = await db.execute(sql`SELECT * FROM ${sql.identifier(tableName)}`);
      
      if (data.rows.length > 0) {
        const columns = Object.keys(data.rows[0]);
        sqlDump += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES\n`;
        
        data.rows.forEach((row, index) => {
          const values = columns.map(col => {
            const val = row[col];
            if (val === null) return 'NULL';
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
            if (val instanceof Date) return `'${val.toISOString()}'`;
            return val;
          });
          
          const comma = index < data.rows.length - 1 ? ',' : ';';
          sqlDump += `  (${values.join(', ')})${comma}\n`;
        });
        
        sqlDump += '\n';
      }
    }
    
    // Save SQL dump
    const filename = `helix-database-dump-${new Date().toISOString().split('T')[0]}.sql`;
    fs.writeFileSync(filename, sqlDump);
    
    console.log(`✅ SQL dump created: ${filename}`);
    console.log(`📊 File size: ${(fs.statSync(filename).size / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Database dump failed:', error);
  }
};

createDatabaseDumps();
