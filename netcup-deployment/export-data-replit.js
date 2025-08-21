
import fs from 'fs';
import path from 'path';
import { 
  regulatoryUpdates, 
  dataSources, 
  legalCases, 
  newsletters, 
  subscribers, 
  knowledgeArticles 
} from '../shared/schema.ts';
import { db } from '../server/db.ts';

const exportData = async () => {
  try {
    console.log('🔄 Starting data export from Replit...');
    
    // Test database connection
    console.log('🔍 Testing database connection...');
    const testQuery = await db.select().from(regulatoryUpdates).limit(1);
    console.log('✅ Database connection successful');
    
    // Export regulatory updates (without tenant filtering)
    console.log('📤 Exporting regulatory updates...');
    const regulatoryUpdatesData = await db.select().from(regulatoryUpdates);
    fs.writeFileSync('regulatory_updates_export.json', JSON.stringify(regulatoryUpdatesData, null, 2));
    console.log(`✅ Exported ${regulatoryUpdatesData.length} regulatory updates`);
    
    // Export data sources
    console.log('📤 Exporting data sources...');
    const dataSourcesData = await db.select().from(dataSources);
    fs.writeFileSync('data_sources_export.json', JSON.stringify(dataSourcesData, null, 2));
    console.log(`✅ Exported ${dataSourcesData.length} data sources`);
    
    // Export legal cases
    console.log('📤 Exporting legal cases...');
    const legalCasesData = await db.select().from(legalCases);
    fs.writeFileSync('legal_cases_export.json', JSON.stringify(legalCasesData, null, 2));
    console.log(`✅ Exported ${legalCasesData.length} legal cases`);
    
    // Export newsletters
    console.log('📤 Exporting newsletters...');
    const newslettersData = await db.select().from(newsletters);
    fs.writeFileSync('newsletters_export.json', JSON.stringify(newslettersData, null, 2));
    console.log(`✅ Exported ${newslettersData.length} newsletters`);
    
    // Export newsletter subscribers
    console.log('📤 Exporting newsletter subscribers...');
    const subscribersData = await db.select().from(subscribers);
    fs.writeFileSync('newsletter_subscribers_export.json', JSON.stringify(subscribersData, null, 2));
    console.log(`✅ Exported ${subscribersData.length} subscribers`);
    
    // Export knowledge articles
    console.log('📤 Exporting knowledge articles...');
    const knowledgeArticlesData = await db.select().from(knowledgeArticles);
    fs.writeFileSync('knowledge_articles_export.json', JSON.stringify(knowledgeArticlesData, null, 2));
    console.log(`✅ Exported ${knowledgeArticlesData.length} knowledge articles`);
    
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
