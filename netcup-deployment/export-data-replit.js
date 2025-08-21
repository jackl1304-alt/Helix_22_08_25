
import fs from 'fs';
import path from 'path';
import { sql } from 'drizzle-orm';
import { db } from '../server/db.ts';

const exportData = async () => {
  try {
    console.log('🔄 Starting data export from Replit...');
    
    // Test database connection
    console.log('🔍 Testing database connection...');
    const testQuery = await db.execute(sql`SELECT COUNT(*) FROM regulatory_updates`);
    console.log('✅ Database connection successful');
    
    // Export regulatory updates using raw SQL (matching actual table structure)
    console.log('📤 Exporting regulatory updates...');
    const regulatoryUpdatesData = await db.execute(sql`SELECT * FROM regulatory_updates`);
    fs.writeFileSync('regulatory_updates_export.json', JSON.stringify(regulatoryUpdatesData.rows, null, 2));
    console.log(`✅ Exported ${regulatoryUpdatesData.rows.length} regulatory updates`);
    
    // Export data sources using raw SQL
    console.log('📤 Exporting data sources...');
    try {
      const dataSourcesData = await db.execute(sql`SELECT * FROM data_sources`);
      fs.writeFileSync('data_sources_export.json', JSON.stringify(dataSourcesData.rows, null, 2));
      console.log(`✅ Exported ${dataSourcesData.rows.length} data sources`);
    } catch (error) {
      console.log('⚠️  data_sources table not found, skipping...');
    }
    
    // Export legal cases using raw SQL
    console.log('📤 Exporting legal cases...');
    try {
      const legalCasesData = await db.execute(sql`SELECT * FROM legal_cases`);
      fs.writeFileSync('legal_cases_export.json', JSON.stringify(legalCasesData.rows, null, 2));
      console.log(`✅ Exported ${legalCasesData.rows.length} legal cases`);
    } catch (error) {
      console.log('⚠️  legal_cases table not found, skipping...');
    }
    
    // Export newsletters using raw SQL
    console.log('📤 Exporting newsletters...');
    try {
      const newslettersData = await db.execute(sql`SELECT * FROM newsletters`);
      fs.writeFileSync('newsletters_export.json', JSON.stringify(newslettersData.rows, null, 2));
      console.log(`✅ Exported ${newslettersData.rows.length} newsletters`);
    } catch (error) {
      console.log('⚠️  newsletters table not found, skipping...');
    }
    
    // Export newsletter subscribers using raw SQL
    console.log('📤 Exporting newsletter subscribers...');
    try {
      const subscribersData = await db.execute(sql`SELECT * FROM subscribers`);
      fs.writeFileSync('newsletter_subscribers_export.json', JSON.stringify(subscribersData.rows, null, 2));
      console.log(`✅ Exported ${subscribersData.rows.length} subscribers`);
    } catch (error) {
      console.log('⚠️  subscribers table not found, skipping...');
    }
    
    // Export knowledge articles using raw SQL
    console.log('📤 Exporting knowledge articles...');
    try {
      const knowledgeArticlesData = await db.execute(sql`SELECT * FROM knowledge_articles`);
      fs.writeFileSync('knowledge_articles_export.json', JSON.stringify(knowledgeArticlesData.rows, null, 2));
      console.log(`✅ Exported ${knowledgeArticlesData.rows.length} knowledge articles`);
    } catch (error) {
      console.log('⚠️  knowledge_articles table not found, skipping...');
    }
    
    console.log('');
    console.log('🎉 Data export completed successfully!');
    console.log('');
    console.log('📋 Next steps for Netcup migration:');
    console.log('1. Download all *_export.json files');
    console.log('2. Upload files to your Netcup server');
    console.log('3. Run: chmod +x netcup-deployment/netcup-setup.sh');
    console.log('4. Run: sudo ./netcup-deployment/netcup-setup.sh');
    console.log('5. Upload application files to /var/www/helix');
    console.log('6. Run: ./netcup-deployment/backup-and-migrate.sh import');
    console.log('7. Run: sudo ./netcup-deployment/deploy-to-netcup.sh');
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
};

// Start export
exportData();
