
#!/usr/bin/env node
// Run this script in your Replit environment to export data

import { db } from './server/db.js';
import fs from 'fs';
import path from 'path';

const exportData = async () => {
  console.log('🔄 Starting data export from Replit...');
  
  try {
    // Export regulatory updates
    console.log('📤 Exporting regulatory updates...');
    const regulatoryUpdates = await db.query.regulatory_updates.findMany();
    fs.writeFileSync('regulatory_updates_export.json', JSON.stringify(regulatoryUpdates, null, 2));
    console.log(`✅ Exported ${regulatoryUpdates.length} regulatory updates`);
    
    // Export data sources
    console.log('📤 Exporting data sources...');
    const dataSources = await db.query.data_sources.findMany();
    fs.writeFileSync('data_sources_export.json', JSON.stringify(dataSources, null, 2));
    console.log(`✅ Exported ${dataSources.length} data sources`);
    
    // Export legal cases
    console.log('📤 Exporting legal cases...');
    const legalCases = await db.query.legal_cases.findMany();
    fs.writeFileSync('legal_cases_export.json', JSON.stringify(legalCases, null, 2));
    console.log(`✅ Exported ${legalCases.length} legal cases`);
    
    // Export newsletters
    console.log('📤 Exporting newsletters...');
    const newsletters = await db.query.newsletters.findMany();
    fs.writeFileSync('newsletters_export.json', JSON.stringify(newsletters, null, 2));
    console.log(`✅ Exported ${newsletters.length} newsletters`);
    
    // Export newsletter subscribers
    console.log('📤 Exporting newsletter subscribers...');
    const subscribers = await db.query.newsletter_subscribers.findMany();
    fs.writeFileSync('newsletter_subscribers_export.json', JSON.stringify(subscribers, null, 2));
    console.log(`✅ Exported ${subscribers.length} subscribers`);
    
    // Export knowledge articles
    console.log('📤 Exporting knowledge articles...');
    const knowledgeArticles = await db.query.knowledge_articles.findMany();
    fs.writeFileSync('knowledge_articles_export.json', JSON.stringify(knowledgeArticles, null, 2));
    console.log(`✅ Exported ${knowledgeArticles.length} knowledge articles`);
    
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
    process.exit(1);
  }
};

exportData();
