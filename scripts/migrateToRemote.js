// Script to migrate local data to remote API format
// Run this script to prepare your data for the remote API

const fs = require('fs');
const path = require('path');

// Import your local data initializer
const { initializePakistanGuideData } = require('../services/dataInitializer');

function migrateDataToRemote() {
    try {
        console.log('Starting data migration to remote format...');
        
        // Get the local data
        const localData = initializePakistanGuideData();
        
        // Add additional metadata for remote API
        const remoteData = {
            ...localData,
            version: '1.0.0',
            lastUpdated: new Date().toISOString(),
            apiVersion: '1.0.0',
            supportedPlatforms: ['ios', 'android', 'web'],
            minAppVersion: '1.0.0',
            maxAppVersion: '2.0.0'
        };

        // Validate the data structure
        if (!validateDataStructure(remoteData)) {
            throw new Error('Data structure validation failed');
        }

        // Create output directory if it doesn't exist
        const outputDir = path.join(__dirname, '../api-example');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write the data to JSON file
        const outputPath = path.join(outputDir, 'content.json');
        fs.writeFileSync(outputPath, JSON.stringify(remoteData, null, 2));
        
        console.log(`✅ Data successfully migrated to ${outputPath}`);
        console.log(`📊 Content statistics:`);
        console.log(`   - General Knowledge: ${remoteData.generalKnowledge.length} items`);
        console.log(`   - Emergency Info: ${remoteData.emergencyInfo.length} items`);
        console.log(`   - Travel Guidance: ${remoteData.travelGuidance.length} items`);
        console.log(`   - Language Phrases: ${remoteData.languagePhrases.length} items`);
        console.log(`   - Local Laws: ${remoteData.localLaws.length} items`);
        console.log(`   - Cultural Facts: ${remoteData.culturalFacts.length} items`);
        console.log(`   - Version: ${remoteData.version}`);
        console.log(`   - Last Updated: ${remoteData.lastUpdated}`);
        
        // Generate API documentation
        generateApiDocumentation(remoteData, outputDir);
        
        console.log('🎉 Migration completed successfully!');
        console.log('📝 Next steps:');
        console.log('   1. Update your API endpoint URL in remoteDataService.js');
        console.log('   2. Set up your API server using the provided example');
        console.log('   3. Deploy your API to a hosting service');
        console.log('   4. Test the integration with your app');
        
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

function validateDataStructure(data) {
    const requiredFields = [
        'generalKnowledge',
        'emergencyInfo', 
        'travelGuidance',
        'languagePhrases',
        'localLaws',
        'culturalFacts',
        'version',
        'lastUpdated'
    ];

    for (const field of requiredFields) {
        if (!data[field]) {
            console.error(`❌ Missing required field: ${field}`);
            return false;
        }
    }

    // Validate array fields
    const arrayFields = [
        'generalKnowledge',
        'emergencyInfo',
        'travelGuidance', 
        'languagePhrases',
        'localLaws',
        'culturalFacts'
    ];

    for (const field of arrayFields) {
        if (!Array.isArray(data[field])) {
            console.error(`❌ Field ${field} should be an array`);
            return false;
        }
    }

    console.log('✅ Data structure validation passed');
    return true;
}

function generateApiDocumentation(data, outputDir) {
    const documentation = `# Pakistan Guide API Documentation

## Overview
This API serves content for the Pakistan Guide mobile application, allowing for dynamic content updates without requiring app store updates.

## Base URL
\`https://your-api-domain.com/api\`

## Authentication
All endpoints require an API key in the Authorization header:
\`Authorization: Bearer your-api-key\`

## Endpoints

### Health Check
\`GET /health\`
Returns server status and version information.

### Get Content Version
\`GET /content/version\`
Returns version information and update availability.

### Get All Content
\`GET /content\`
Returns all content data.

### Get Specific Content Type
\`GET /content/{type}\`
Returns content for a specific type (general, emergency, travel, language, law, cultural).

### Update Content (Admin)
\`POST /content\`
Updates all content (admin only).

### Update Specific Content Type (Admin)
\`POST /content/{type}\`
Updates specific content type (admin only).

## Content Types
- \`general\` - General Knowledge
- \`emergency\` - Emergency Information  
- \`travel\` - Travel Guidance
- \`language\` - Language Phrases
- \`law\` - Local Laws
- \`cultural\` - Cultural Facts

## Current Content Statistics
- General Knowledge: ${data.generalKnowledge.length} items
- Emergency Info: ${data.emergencyInfo.length} items
- Travel Guidance: ${data.travelGuidance.length} items
- Language Phrases: ${data.languagePhrases.length} items
- Local Laws: ${data.localLaws.length} items
- Cultural Facts: ${data.culturalFacts.length} items
- Version: ${data.version}
- Last Updated: ${data.lastUpdated}

## Error Responses
All error responses follow this format:
\`\`\`json
{
  "error": "Error message description"
}
\`\`\`

## Rate Limiting
API requests are limited to 100 requests per minute per API key.

## Caching
Content is cached for 24 hours. Use the \`forceRefresh\` parameter to bypass cache.
`;

    const docPath = path.join(outputDir, 'API_DOCUMENTATION.md');
    fs.writeFileSync(docPath, documentation);
    console.log(`📚 API documentation generated: ${docPath}`);
}

// Run the migration
if (require.main === module) {
    migrateDataToRemote();
}

module.exports = { migrateDataToRemote, validateDataStructure };
