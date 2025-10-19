import { get, getDatabase, off, onValue, push, ref, remove, serverTimestamp, set, update } from 'firebase/database';
import { storageService } from './storage';

// Firebase configuration - you'll need to replace these with your actual values
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase (you'll need to import initializeApp from firebase/app)
import { initializeApp } from 'firebase/app';
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Database references
const CONTENT_REF = 'content';
const VERSION_REF = 'version';
const ANALYTICS_REF = 'analytics';

class FirebaseDataService {
    constructor() {
        this.database = database;
        this.listeners = new Map(); // Store active listeners
        this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours
        this.retryAttempts = 3;
        this.retryDelay = 1000;
    }

    /**
     * Fetch content from Firebase with caching and fallback
     */
    async fetchContent(type = 'all', forceRefresh = false) {
        try {
            // Check cache first if not forcing refresh
            if (!forceRefresh) {
                const cachedData = await this.getCachedContent(type);
                if (cachedData && this.isCacheValid(cachedData.timestamp)) {
                    console.log(`[FirebaseDataService] Using cached data for ${type}`);
                    return cachedData.data;
                }
            }

            // Fetch from Firebase
            const firebaseData = await this.fetchFromFirebase(type);
            
            if (firebaseData) {
                // Cache the data
                await this.cacheContent(type, firebaseData);
                return firebaseData;
            }

            // Fallback to local data
            console.log(`[FirebaseDataService] Firebase fetch failed for ${type}, using local data`);
            return await this.getLocalContent(type);

        } catch (error) {
            console.error(`[FirebaseDataService] Error fetching content for ${type}:`, error);
            // Always fallback to local data
            return await this.getLocalContent(type);
        }
    }

    /**
     * Fetch content from Firebase with retry logic
     */
    async fetchFromFirebase(type) {
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                let dataRef;
                
                if (type === 'all') {
                    dataRef = ref(this.database, CONTENT_REF);
                } else {
                    dataRef = ref(this.database, `${CONTENT_REF}/${type}`);
                }

                const snapshot = await get(dataRef);
                
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    
                    // Validate the response structure
                    if (this.validateContentStructure(data)) {
                        return data;
                    } else {
                        throw new Error('Invalid content structure received from Firebase');
                    }
                } else {
                    throw new Error('No data found in Firebase');
                }

            } catch (error) {
                console.error(`[FirebaseDataService] Attempt ${attempt} failed:`, error);
                
                if (attempt === this.retryAttempts) {
                    throw error;
                }
                
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
            }
        }
    }

    /**
     * Listen to real-time content updates
     */
    listenToContentUpdates(type, callback) {
        const dataRef = ref(this.database, `${CONTENT_REF}/${type}`);
        
        const listener = onValue(dataRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                callback(data);
            }
        }, (error) => {
            console.error(`[FirebaseDataService] Real-time listener error:`, error);
        });

        // Store listener for cleanup
        this.listeners.set(`${type}_listener`, listener);
        
        return () => {
            off(dataRef, 'value', listener);
            this.listeners.delete(`${type}_listener`);
        };
    }

    /**
     * Update content in Firebase
     */
    async updateContent(type, data) {
        try {
            const dataRef = ref(this.database, `${CONTENT_REF}/${type}`);
            await set(dataRef, {
                ...data,
                lastUpdated: serverTimestamp(),
                updatedBy: 'admin' // You can get this from auth
            });
            
            console.log(`[FirebaseDataService] Successfully updated ${type} content`);
            return true;
        } catch (error) {
            console.error(`[FirebaseDataService] Failed to update content:`, error);
            return false;
        }
    }

    /**
     * Update specific content item
     */
    async updateContentItem(type, itemId, itemData) {
        try {
            const itemRef = ref(this.database, `${CONTENT_REF}/${type}/${itemId}`);
            await update(itemRef, {
                ...itemData,
                lastUpdated: serverTimestamp()
            });
            
            console.log(`[FirebaseDataService] Successfully updated ${type} item ${itemId}`);
            return true;
        } catch (error) {
            console.error(`[FirebaseDataService] Failed to update content item:`, error);
            return false;
        }
    }

    /**
     * Add new content item
     */
    async addContentItem(type, itemData) {
        try {
            const itemsRef = ref(this.database, `${CONTENT_REF}/${type}`);
            const newItemRef = push(itemsRef);
            
            await set(newItemRef, {
                ...itemData,
                id: newItemRef.key,
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            });
            
            console.log(`[FirebaseDataService] Successfully added new ${type} item`);
            return newItemRef.key;
        } catch (error) {
            console.error(`[FirebaseDataService] Failed to add content item:`, error);
            return null;
        }
    }

    /**
     * Delete content item
     */
    async deleteContentItem(type, itemId) {
        try {
            const itemRef = ref(this.database, `${CONTENT_REF}/${type}/${itemId}`);
            await remove(itemRef);
            
            console.log(`[FirebaseDataService] Successfully deleted ${type} item ${itemId}`);
            return true;
        } catch (error) {
            console.error(`[FirebaseDataService] Failed to delete content item:`, error);
            return false;
        }
    }

    /**
     * Check for content updates
     */
    async checkForUpdates() {
        try {
            const versionRef = ref(this.database, VERSION_REF);
            const snapshot = await get(versionRef);
            
            if (snapshot.exists()) {
                const versionInfo = snapshot.val();
                const localVersion = await storageService.getItem('app_version') || '1.0.0';
                
                return {
                    hasUpdate: versionInfo.version !== localVersion,
                    latestVersion: versionInfo.version,
                    currentVersion: localVersion,
                    updateSize: versionInfo.size || 0,
                    updateRequired: versionInfo.required || false,
                    lastUpdated: versionInfo.lastUpdated
                };
            }
            
            return { hasUpdate: false, error: 'No version info found' };
        } catch (error) {
            console.error('[FirebaseDataService] Error checking for updates:', error);
            return { hasUpdate: false, error: error.message };
        }
    }

    /**
     * Update version information
     */
    async updateVersion(versionInfo) {
        try {
            const versionRef = ref(this.database, VERSION_REF);
            await set(versionRef, {
                ...versionInfo,
                lastUpdated: serverTimestamp()
            });
            
            console.log('[FirebaseDataService] Successfully updated version info');
            return true;
        } catch (error) {
            console.error('[FirebaseDataService] Failed to update version:', error);
            return false;
        }
    }

    /**
     * Track content usage analytics
     */
    async trackContentUsage(type, itemId, action) {
        try {
            const analyticsRef = ref(this.database, `${ANALYTICS_REF}/${type}/${itemId}`);
            const usageData = {
                action,
                timestamp: serverTimestamp(),
                userAgent: 'mobile-app' // You can get more specific info
            };
            
            await push(analyticsRef, usageData);
            
            console.log(`[FirebaseDataService] Tracked ${action} for ${type}/${itemId}`);
            return true;
        } catch (error) {
            console.error('[FirebaseDataService] Failed to track usage:', error);
            return false;
        }
    }

    /**
     * Get content statistics
     */
    async getContentStats() {
        try {
            const contentRef = ref(this.database, CONTENT_REF);
            const snapshot = await get(contentRef);
            
            if (snapshot.exists()) {
                const data = snapshot.val();
                return {
                    generalKnowledge: data.generalKnowledge ? Object.keys(data.generalKnowledge).length : 0,
                    emergencyInfo: data.emergencyInfo ? Object.keys(data.emergencyInfo).length : 0,
                    travelGuidance: data.travelGuidance ? Object.keys(data.travelGuidance).length : 0,
                    languagePhrases: data.languagePhrases ? Object.keys(data.languagePhrases).length : 0,
                    localLaws: data.localLaws ? Object.keys(data.localLaws).length : 0,
                    culturalFacts: data.culturalFacts ? Object.keys(data.culturalFacts).length : 0,
                    lastUpdated: data.lastUpdated,
                    version: data.version
                };
            }
            
            return null;
        } catch (error) {
            console.error('[FirebaseDataService] Failed to get content stats:', error);
            return null;
        }
    }

    /**
     * Validate content structure
     */
    validateContentStructure(data) {
        const requiredFields = ['generalKnowledge', 'emergencyInfo', 'travelGuidance', 'languagePhrases', 'localLaws', 'culturalFacts'];
        
        if (!data || typeof data !== 'object') {
            return false;
        }

        // Check if all required fields exist
        for (const field of requiredFields) {
            if (!data[field]) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get cached content from local storage
     */
    async getCachedContent(type) {
        try {
            const cacheKey = `firebase_cache_${type}`;
            const cached = await storageService.getItem(cacheKey);
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            console.error('[FirebaseDataService] Error getting cached content:', error);
            return null;
        }
    }

    /**
     * Cache content in local storage
     */
    async cacheContent(type, data) {
        try {
            const cacheKey = `firebase_cache_${type}`;
            const cacheData = {
                data,
                timestamp: Date.now(),
                version: data.version || '1.0.0'
            };
            await storageService.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (error) {
            console.error('[FirebaseDataService] Error caching content:', error);
        }
    }

    /**
     * Check if cached data is still valid
     */
    isCacheValid(timestamp) {
        return (Date.now() - timestamp) < this.cacheTimeout;
    }

    /**
     * Get local content as fallback
     */
    async getLocalContent(type) {
        try {
            const localData = await storageService.getAppData();
            if (!localData) {
                return null;
            }

            if (type === 'all') {
                return localData;
            }

            // Return specific type
            const typeMap = {
                'general': 'generalKnowledge',
                'emergency': 'emergencyInfo',
                'travel': 'travelGuidance',
                'language': 'languagePhrases',
                'law': 'localLaws',
                'cultural': 'culturalFacts'
            };

            const fieldName = typeMap[type];
            return fieldName ? { [fieldName]: localData[fieldName] } : localData;
        } catch (error) {
            console.error('[FirebaseDataService] Error getting local content:', error);
            return null;
        }
    }

    /**
     * Cleanup all listeners
     */
    cleanup() {
        this.listeners.forEach((listener, key) => {
            listener(); // Call the cleanup function
        });
        this.listeners.clear();
    }
}

export const firebaseDataService = new FirebaseDataService();
