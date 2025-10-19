import { getCurrentConfig } from '@/config/remoteConfig';
import { storageService } from './storage';

class RemoteDataService {
    constructor() {
        const config = getCurrentConfig();
        this.baseUrl = config.API_BASE_URL;
        this.apiKey = config.API_KEY;
        this.cacheTimeout = config.CACHE_TIMEOUT;
        this.retryAttempts = config.CACHE_RETRY_ATTEMPTS;
        this.retryDelay = config.CACHE_RETRY_DELAY;
        this.debugMode = config.DEBUG_MODE;
        this.logRequests = config.LOG_REQUESTS;
    }

    /**
     * Fetch content from remote API with caching and fallback
     */
    async fetchContent(type = 'all', forceRefresh = false) {
        try {
            // Check if we have cached data and it's still valid
            if (!forceRefresh) {
                const cachedData = await this.getCachedContent(type);
                if (cachedData && this.isCacheValid(cachedData.timestamp)) {
                    if (this.debugMode) {
                        console.log(`[RemoteDataService] Using cached data for ${type}`);
                    }
                    return cachedData.data;
                }
            }

            // Fetch from remote API
            const remoteData = await this.fetchFromRemote(type);
            
            if (remoteData) {
                // Cache the data
                await this.cacheContent(type, remoteData);
                return remoteData;
            }

            // Fallback to local data if remote fails
            console.log(`Remote fetch failed for ${type}, using local data`);
            return await this.getLocalContent(type);

        } catch (error) {
            console.error(`Error fetching content for ${type}:`, error);
            // Always fallback to local data
            return await this.getLocalContent(type);
        }
    }

    /**
     * Fetch content from remote API with retry logic
     */
    async fetchFromRemote(type) {
        const url = type === 'all' ? `${this.baseUrl}/content` : `${this.baseUrl}/content/${type}`;
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`,
                        'X-App-Version': '1.0.0', // Include app version for compatibility
                        'X-Platform': 'mobile'
                    },
                    timeout: 10000 // 10 second timeout
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                
                // Validate the response structure
                if (this.validateContentStructure(data)) {
                    return data;
                } else {
                    throw new Error('Invalid content structure received from server');
                }

            } catch (error) {
                console.error(`Attempt ${attempt} failed:`, error);
                
                if (attempt === this.retryAttempts) {
                    throw error;
                }
                
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
            }
        }
    }

    /**
     * Validate content structure to ensure it matches expected format
     */
    validateContentStructure(data) {
        const requiredFields = ['generalKnowledge', 'emergencyInfo', 'travelGuidance', 'languagePhrases', 'localLaws', 'culturalFacts'];
        
        if (!data || typeof data !== 'object') {
            return false;
        }

        // Check if all required fields exist
        for (const field of requiredFields) {
            if (!Array.isArray(data[field])) {
                return false;
            }
        }

        // Validate version and timestamp
        if (!data.version || !data.lastUpdated) {
            return false;
        }

        return true;
    }

    /**
     * Get cached content from local storage
     */
    async getCachedContent(type) {
        try {
            const cacheKey = `remote_cache_${type}`;
            const cached = await storageService.getItem(cacheKey);
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            console.error('Error getting cached content:', error);
            return null;
        }
    }

    /**
     * Cache content in local storage
     */
    async cacheContent(type, data) {
        try {
            const cacheKey = `remote_cache_${type}`;
            const cacheData = {
                data,
                timestamp: Date.now(),
                version: data.version || '1.0.0'
            };
            await storageService.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (error) {
            console.error('Error caching content:', error);
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
            console.error('Error getting local content:', error);
            return null;
        }
    }

    /**
     * Check for content updates
     */
    async checkForUpdates() {
        try {
            const response = await fetch(`${this.baseUrl}/content/version`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const versionInfo = await response.json();
            const localVersion = await storageService.getItem('app_version') || '1.0.0';
            
            return {
                hasUpdate: versionInfo.version !== localVersion,
                latestVersion: versionInfo.version,
                currentVersion: localVersion,
                updateSize: versionInfo.size || 0,
                updateRequired: versionInfo.required || false
            };
        } catch (error) {
            console.error('Error checking for updates:', error);
            return { hasUpdate: false, error: error.message };
        }
    }

    /**
     * Update specific content type
     */
    async updateContentType(type) {
        try {
            const newData = await this.fetchFromRemote(type);
            if (newData) {
                // Update local storage
                const currentData = await storageService.getAppData();
                if (currentData) {
                    const typeMap = {
                        'general': 'generalKnowledge',
                        'emergency': 'emergencyInfo',
                        'travel': 'travelGuidance',
                        'language': 'languagePhrases',
                        'law': 'localLaws',
                        'cultural': 'culturalFacts'
                    };

                    const fieldName = typeMap[type];
                    if (fieldName && newData[fieldName]) {
                        currentData[fieldName] = newData[fieldName];
                        currentData.lastUpdated = new Date().toISOString();
                        currentData.version = newData.version || currentData.version;
                        
                        await storageService.saveAppData(currentData);
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            console.error(`Error updating content type ${type}:`, error);
            return false;
        }
    }

    /**
     * Validate and fix broken links
     */
    async validateLinks(content) {
        const brokenLinks = [];
        
        // Check emergency phone numbers
        if (content.emergencyInfo) {
            for (const item of content.emergencyInfo) {
                if (item.phoneNumber && !this.isValidPhoneNumber(item.phoneNumber)) {
                    brokenLinks.push({
                        type: 'emergency',
                        id: item.id,
                        field: 'phoneNumber',
                        value: item.phoneNumber,
                        issue: 'Invalid phone number format'
                    });
                }
            }
        }

        // Check travel guidance coordinates
        if (content.travelGuidance) {
            for (const item of content.travelGuidance) {
                if (item.coordinates) {
                    const { latitude, longitude } = item.coordinates;
                    if (!this.isValidCoordinate(latitude, longitude)) {
                        brokenLinks.push({
                            type: 'travel',
                            id: item.id,
                            field: 'coordinates',
                            value: item.coordinates,
                            issue: 'Invalid coordinates'
                        });
                    }
                }
            }
        }

        return brokenLinks;
    }

    /**
     * Validate phone number format
     */
    isValidPhoneNumber(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/;
        return phoneRegex.test(phone);
    }

    /**
     * Validate coordinate format
     */
    isValidCoordinate(lat, lng) {
        return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    }

    /**
     * Get content statistics
     */
    async getContentStats() {
        try {
            const data = await storageService.getAppData();
            if (!data) return null;

            return {
                generalKnowledge: data.generalKnowledge?.length || 0,
                emergencyInfo: data.emergencyInfo?.length || 0,
                travelGuidance: data.travelGuidance?.length || 0,
                languagePhrases: data.languagePhrases?.length || 0,
                localLaws: data.localLaws?.length || 0,
                culturalFacts: data.culturalFacts?.length || 0,
                lastUpdated: data.lastUpdated,
                version: data.version
            };
        } catch (error) {
            console.error('Error getting content stats:', error);
            return null;
        }
    }
}

export const remoteDataService = new RemoteDataService();
