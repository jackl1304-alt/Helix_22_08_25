
// Run this script in your Replit environment to export data

import { db } from '../server/db.ts';
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

const exportData = async () => {
  console.log('🔄 Starting data export from Replit...');
  
  try {
    // Test database connection first
    console.log('🔍 Testing database connection...');
    const testQuery = await db.execute('SELECT 1 as test');
    console.log('✅ Database connection successful');
    
    // Export regulatory updates
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
    console.log('Files created:');
    console.log('- regulatory_updates_export.json');
    console.log('- data_sources_export.json');
    console.log('- legal_cases_export.json');
    console.log('- newsletters_export.json');
    console.log('- newsletter_subscribers_export.json');
    console.log('- knowledge_articles_export.json');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Download these JSON files from Replit');
    console.log('2. Transfer them to your Netcup server');
    console.log('3. Run the import script on Netcup');
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

exportData();
