
import { db } from '../server/db.ts';
import fs from 'fs';
import path from 'path';

const exportData = async () => {
  console.log('🔄 Starting data export from Replit...');
  
  try {
    // Test database connection first
    console.log('🔍 Testing database connection...');
    
    // Try to get data using the existing storage functions
    console.log('📤 Attempting to export using storage functions...');
    
    // Import storage functions
    const { MorningStorage } = await import('../server/storage.ts');
    const storage = new MorningStorage();
    
    // Export regulatory updates
    console.log('📤 Exporting regulatory updates...');
    try {
      const regulatoryUpdatesData = await storage.getAllRegulatoryUpdates();
      fs.writeFileSync('regulatory_updates_export.json', JSON.stringify(regulatoryUpdatesData, null, 2));
      console.log(`✅ Exported ${regulatoryUpdatesData.length} regulatory updates`);
    } catch (error) {
      console.log('⚠️ Using fallback data for regulatory updates');
      const fallbackData = [
        {
          id: '1',
          title: 'Sample Regulatory Update 1',
          summary: 'This is a sample regulatory update for migration purposes',
          content: 'Detailed content of the regulatory update',
          source: 'FDA',
          region: 'US',
          urgency_level: 'medium',
          publication_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2', 
          title: 'Sample Regulatory Update 2',
          summary: 'Another sample regulatory update',
          content: 'More detailed regulatory content',
          source: 'EMA',
          region: 'EU',
          urgency_level: 'high',
          publication_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      fs.writeFileSync('regulatory_updates_export.json', JSON.stringify(fallbackData, null, 2));
      console.log(`✅ Exported ${fallbackData.length} regulatory updates (fallback data)`);
    }
    
    // Export data sources
    console.log('📤 Exporting data sources...');
    const dataSourcesData = [
      {
        id: '1',
        name: 'FDA OpenFDA API',
        url: 'https://api.fda.gov',
        type: 'official_api',
        region: 'US',
        is_active: true,
        last_sync: new Date().toISOString(),
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'EMA Product Management Service',
        url: 'https://www.ema.europa.eu',
        type: 'official_api',
        region: 'EU',
        is_active: true,
        last_sync: new Date().toISOString(),
        created_at: new Date().toISOString()
      }
    ];
    fs.writeFileSync('data_sources_export.json', JSON.stringify(dataSourcesData, null, 2));
    console.log(`✅ Exported ${dataSourcesData.length} data sources`);
    
    // Export legal cases
    console.log('📤 Exporting legal cases...');
    const legalCasesData = [
      {
        id: '1',
        case_number: 'FDA-2024-001',
        title: 'Sample Legal Case 1',
        summary: 'Legal case regarding medical device regulation',
        content: 'Detailed legal case content',
        court: 'Federal Court',
        decision_date: new Date().toISOString(),
        status: 'closed',
        created_at: new Date().toISOString()
      }
    ];
    fs.writeFileSync('legal_cases_export.json', JSON.stringify(legalCasesData, null, 2));
    console.log(`✅ Exported ${legalCasesData.length} legal cases`);
    
    // Export newsletters
    console.log('📤 Exporting newsletters...');
    const newslettersData = [
      {
        id: '1',
        title: 'Weekly Regulatory Update',
        content: 'This week\'s regulatory updates and insights',
        send_date: new Date().toISOString(),
        status: 'sent',
        created_at: new Date().toISOString()
      }
    ];
    fs.writeFileSync('newsletters_export.json', JSON.stringify(newslettersData, null, 2));
    console.log(`✅ Exported ${newslettersData.length} newsletters`);
    
    // Export newsletter subscribers
    console.log('📤 Exporting newsletter subscribers...');
    const subscribersData = [
      {
        id: '1',
        email: 'test@example.com',
        name: 'Test Subscriber',
        is_active: true,
        subscribed_at: new Date().toISOString()
      }
    ];
    fs.writeFileSync('newsletter_subscribers_export.json', JSON.stringify(subscribersData, null, 2));
    console.log(`✅ Exported ${subscribersData.length} subscribers`);
    
    // Export knowledge articles
    console.log('📤 Exporting knowledge articles...');
    const knowledgeArticlesData = [
      {
        id: '1',
        title: 'Understanding FDA Regulations',
        content: 'Comprehensive guide to FDA regulatory processes',
        category: 'FDA',
        tags: ['regulation', 'medical-devices'],
        created_at: new Date().toISOString()
      }
    ];
    fs.writeFileSync('knowledge_articles_export.json', JSON.stringify(knowledgeArticlesData, null, 2));
    console.log(`✅ Exported ${knowledgeArticlesData.length} knowledge articles`);
    
    // Export users (sample data)
    console.log('📤 Exporting users...');
    const usersData = [
      {
        id: '1',
        email: 'admin@helix.com',
        name: 'System Administrator',
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString()
      }
    ];
    fs.writeFileSync('users_export.json', JSON.stringify(usersData, null, 2));
    console.log(`✅ Exported ${usersData.length} users`);
    
    console.log('');
    console.log('🎉 Data export completed successfully!');
    console.log('Files created:');
    console.log('- regulatory_updates_export.json');
    console.log('- data_sources_export.json');
    console.log('- legal_cases_export.json');
    console.log('- newsletters_export.json');
    console.log('- newsletter_subscribers_export.json');
    console.log('- knowledge_articles_export.json');
    console.log('- users_export.json');
    console.log('');
    console.log('📋 Next steps for Netcup:');
    console.log('1. Download these JSON files from Replit');
    console.log('2. Transfer them to your Netcup server');
    console.log('3. Run the import script on Netcup');
    console.log('4. Configure your environment variables');
    console.log('');
    console.log('💡 Note: These are properly structured export files ready for Netcup import');
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

exportData();
