// Script to migrate local data to Firebase
// Run this script to upload your content to Firebase

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get } = require('firebase/database');
const { initializePakistanGuideData } = require('../services/dataInitializer');

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

async function migrateDataToFirebase() {
    try {
        console.log('🔥 Starting Firebase migration...');
        
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const database = getDatabase(app);
        
        // Get the local data
        const localData = initializePakistanGuideData();
        
        // Convert array data to Firebase format (objects with keys)
        const firebaseData = {
            generalKnowledge: convertArrayToFirebaseObject(localData.generalKnowledge),
            emergencyInfo: convertArrayToFirebaseObject(localData.emergencyInfo),
            travelGuidance: convertArrayToFirebaseObject(localData.travelGuidance),
            languagePhrases: convertArrayToFirebaseObject(localData.languagePhrases),
            localLaws: convertArrayToFirebaseObject(localData.localLaws),
            culturalFacts: convertArrayToFirebaseObject(localData.culturalFacts),
            version: '1.0.0',
            lastUpdated: new Date().toISOString(),
            migratedAt: new Date().toISOString()
        };

        // Validate the data structure
        if (!validateFirebaseDataStructure(firebaseData)) {
            throw new Error('Data structure validation failed');
        }

        // Upload to Firebase
        console.log('📤 Uploading content to Firebase...');
        const contentRef = ref(database, 'content');
        await set(contentRef, firebaseData);

        // Upload version info
        console.log('📤 Uploading version info...');
        const versionRef = ref(database, 'version');
        await set(versionRef, {
            version: '1.0.0',
            lastUpdated: new Date().toISOString(),
            size: JSON.stringify(firebaseData).length,
            required: false
        });

        // Verify upload
        console.log('✅ Verifying upload...');
        const verifyRef = ref(database, 'content');
        const snapshot = await get(verifyRef);
        
        if (snapshot.exists()) {
            const uploadedData = snapshot.val();
            console.log('🎉 Firebase migration completed successfully!');
            console.log('📊 Content statistics:');
            console.log(`   - General Knowledge: ${Object.keys(uploadedData.generalKnowledge || {}).length} items`);
            console.log(`   - Emergency Info: ${Object.keys(uploadedData.emergencyInfo || {}).length} items`);
            console.log(`   - Travel Guidance: ${Object.keys(uploadedData.travelGuidance || {}).length} items`);
            console.log(`   - Language Phrases: ${Object.keys(uploadedData.languagePhrases || {}).length} items`);
            console.log(`   - Local Laws: ${Object.keys(uploadedData.localLaws || {}).length} items`);
            console.log(`   - Cultural Facts: ${Object.keys(uploadedData.culturalFacts || {}).length} items`);
            console.log(`   - Version: ${uploadedData.version}`);
            console.log(`   - Last Updated: ${uploadedData.lastUpdated}`);
            
            console.log('\n🔗 Firebase Database URL:');
            console.log(`   ${firebaseConfig.databaseURL}`);
            
            console.log('\n📝 Next steps:');
            console.log('   1. Update firebaseConfig.js with your actual Firebase config');
            console.log('   2. Install Firebase SDK: npm install firebase');
            console.log('   3. Update your app to use FirebaseDataService');
            console.log('   4. Test the integration');
            
        } else {
            throw new Error('Upload verification failed');
        }
        
    } catch (error) {
        console.error('❌ Firebase migration failed:', error.message);
        process.exit(1);
    }
}

function convertArrayToFirebaseObject(array) {
    const obj = {};
    array.forEach((item, index) => {
        // Use the item's ID if it exists, otherwise use index
        const key = item.id || `item_${index}`;
        obj[key] = item;
    });
    return obj;
}

function validateFirebaseDataStructure(data) {
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

    // Validate that content fields are objects (not arrays)
    const contentFields = [
        'generalKnowledge',
        'emergencyInfo',
        'travelGuidance',
        'languagePhrases',
        'localLaws',
        'culturalFacts'
    ];

    for (const field of contentFields) {
        if (typeof data[field] !== 'object' || Array.isArray(data[field])) {
            console.error(`❌ Field ${field} should be an object, not an array`);
            return false;
        }
    }

    console.log('✅ Firebase data structure validation passed');
    return true;
}

// Run the migration
if (require.main === module) {
    migrateDataToFirebase();
}

module.exports = { migrateDataToFirebase, convertArrayToFirebaseObject, validateFirebaseDataStructure };
