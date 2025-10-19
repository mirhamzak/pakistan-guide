// Simplified Firebase service for React Native/Expo
import { initializeApp } from 'firebase/app';
import { get, getDatabase, off, onValue, ref, serverTimestamp, set } from 'firebase/database';

// Firebase configuration - Replace with your actual values
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Database references
const CONTENT_REF = 'content';
const VERSION_REF = 'version';
const ANALYTICS_REF = 'analytics';

class FirebaseService {
    constructor() {
        this.database = database;
        this.listeners = new Map();
        this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours
    }

    // Test connection
    async testConnection() {
        try {
            const testRef = ref(this.database, 'test');
            await set(testRef, { timestamp: Date.now() });
            return true;
        } catch (error) {
            console.error('Firebase connection test failed:', error);
            return false;
        }
    }

    // Get content from Firebase
    async getContent(type = 'all') {
        try {
            let dataRef;
            if (type === 'all') {
                dataRef = ref(this.database, CONTENT_REF);
            } else {
                dataRef = ref(this.database, `${CONTENT_REF}/${type}`);
            }

            const snapshot = await get(dataRef);
            if (snapshot.exists()) {
                return snapshot.val();
            }
            return null;
        } catch (error) {
            console.error('Error getting content from Firebase:', error);
            return null;
        }
    }

    // Set content in Firebase
    async setContent(type, data) {
        try {
            const dataRef = ref(this.database, `${CONTENT_REF}/${type}`);
            await set(dataRef, {
                ...data,
                lastUpdated: serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Error setting content in Firebase:', error);
            return false;
        }
    }

    // Listen to real-time updates
    listenToContent(type, callback) {
        const dataRef = ref(this.database, `${CONTENT_REF}/${type}`);
        
        const listener = onValue(dataRef, (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.val());
            }
        }, (error) => {
            console.error('Real-time listener error:', error);
        });

        this.listeners.set(`${type}_listener`, listener);
        
        return () => {
            off(dataRef, 'value', listener);
            this.listeners.delete(`${type}_listener`);
        };
    }

    // Cleanup listeners
    cleanup() {
        this.listeners.forEach((listener) => {
            listener();
        });
        this.listeners.clear();
    }
}

export const firebaseService = new FirebaseService();
export { ANALYTICS_REF, CONTENT_REF, database, VERSION_REF };

