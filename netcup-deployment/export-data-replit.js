
import { db } from '../server/db.ts';
import fs from 'fs';
import path from 'path';

const exportData = async () => {
  console.log('🔄 Starting data export from Replit...');
  
  try {
    // Test database connection first
    console.log('🔍 Testing database connection...');
    const testQuery = await db.execute('SELECT 1 as test');
    console.log('✅ Database connection successful');
    
    // Export regulatory updates with raw SQL to avoid schema issues
    console.log('📤 Exporting regulatory updates...');
    const regulatoryUpdatesData = await db.execute(`
      SELECT * FROM regulatory_updates 
      ORDER BY created_at DESC
    `);
    fs.writeFileSync('regulatory_updates_export.json', JSON.stringify(regulatoryUpdatesData.rows, null, 2));
    console.log(`✅ Exported ${regulatoryUpdatesData.rows.length} regulatory updates`);
    
    // Export data sources
    console.log('📤 Exporting data sources...');
    const dataSourcesData = await db.execute(`
      SELECT * FROM data_sources 
      ORDER BY created_at DESC
    `);
    fs.writeFileSync('data_sources_export.json', JSON.stringify(dataSourcesData.rows, null, 2));
    console.log(`✅ Exported ${dataSourcesData.rows.length} data sources`);
    
    // Export legal cases
    console.log('📤 Exporting legal cases...');
    const legalCasesData = await db.execute(`
      SELECT * FROM legal_cases 
      ORDER BY created_at DESC
    `);
    fs.writeFileSync('legal_cases_export.json', JSON.stringify(legalCasesData.rows, null, 2));
    console.log(`✅ Exported ${legalCasesData.rows.length} legal cases`);
    
    // Export newsletters
    console.log('📤 Exporting newsletters...');
    const newslettersData = await db.execute(`
      SELECT * FROM newsletters 
      ORDER BY created_at DESC
    `);
    fs.writeFileSync('newsletters_export.json', JSON.stringify(newslettersData.rows, null, 2));
    console.log(`✅ Exported ${newslettersData.rows.length} newsletters`);
    
    // Export newsletter subscribers
    console.log('📤 Exporting newsletter subscribers...');
    const subscribersData = await db.execute(`
      SELECT * FROM subscribers 
      ORDER BY subscribed_at DESC
    `);
    fs.writeFileSync('newsletter_subscribers_export.json', JSON.stringify(subscribersData.rows, null, 2));
    console.log(`✅ Exported ${subscribersData.rows.length} subscribers`);
    
    // Export knowledge articles
    console.log('📤 Exporting knowledge articles...');
    const knowledgeArticlesData = await db.execute(`
      SELECT * FROM knowledge_articles 
      ORDER BY created_at DESC
    `);
    fs.writeFileSync('knowledge_articles_export.json', JSON.stringify(knowledgeArticlesData.rows, null, 2));
    console.log(`✅ Exported ${knowledgeArticlesData.rows.length} knowledge articles`);
    
    // Export users if table exists
    try {
      console.log('📤 Exporting users...');
      const usersData = await db.execute(`
        SELECT id, email, name, role, is_active, last_login, created_at, updated_at 
        FROM users 
        ORDER BY created_at DESC
      `);
      fs.writeFileSync('users_export.json', JSON.stringify(usersData.rows, null, 2));
      console.log(`✅ Exported ${usersData.rows.length} users`);
    } catch (error) {
      console.log('⚠️ Users table not found or accessible, skipping...');
    }
    
    // Export sessions if table exists
    try {
      console.log('📤 Exporting sessions...');
      const sessionsData = await db.execute(`
        SELECT * FROM sessions 
        WHERE expire > NOW()
        ORDER BY expire DESC
      `);
      fs.writeFileSync('sessions_export.json', JSON.stringify(sessionsData.rows, null, 2));
      console.log(`✅ Exported ${sessionsData.rows.length} active sessions`);
    } catch (error) {
      console.log('⚠️ Sessions table not found or accessible, skipping...');
    }
    
    console.log('');
    console.log('🎉 Data export completed successfully!');
    console.log('Files created:');
    console.log('- regulatory_updates_export.json');
    console.log('- data_sources_export.json');
    console.log('- legal_cases_export.json');
    console.log('- newsletters_export.json');
    console.log('- newsletter_subscribers_export.json');
    console.log('- knowledge_articles_export.json');
    console.log('- users_export.json (if available)');
    console.log('- sessions_export.json (if available)');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Download these JSON files from Replit');
    console.log('2. Transfer them to your Netcup server');
    console.log('3. Run the import script on Netcup');
    console.log('');
    console.log('💡 Note: Multi-tenant fields will be added during import on Netcup');
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

exportData();
