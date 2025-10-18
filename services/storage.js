import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
    APP_DATA: 'pakistan_guide_data',
    BOOKMARKS: 'pakistan_guide_bookmarks',
    LAST_SYNC: 'pakistan_guide_last_sync',
    APP_VERSION: 'pakistan_guide_version',
    SEARCH_HISTORY: 'pakistan_guide_search_history',
};

class StorageService {
    constructor() {
        this.db = null;
    }

    async initializeDatabase() {
        try {
            // Skip SQLite initialization on web platform due to WASM issues
            if (Platform.OS === 'web') {
                console.log('Skipping SQLite initialization on web platform');
                return;
            }

            this.db = await SQLite.openDatabaseAsync('pakistan_guide.db');

            // Create tables for better query performance
            await this.createTables();
        } catch (error) {
            console.error('Failed to initialize database:', error);
        }
    }

    async createTables() {
        if (!this.db) return;

        try {
            // General Knowledge table
            await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS general_knowledge (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          category TEXT NOT NULL,
          tags TEXT,
          last_updated TEXT NOT NULL
        );
      `);

            // Emergency Info table
            await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS emergency_info (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          phone_number TEXT,
          category TEXT NOT NULL,
          priority TEXT NOT NULL,
          location TEXT
        );
      `);

            // Travel Guidance table
            await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS travel_guidance (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          category TEXT NOT NULL,
          location TEXT NOT NULL,
          latitude REAL,
          longitude REAL,
          tips TEXT,
          images TEXT
        );
      `);

            // Language Phrases table
            await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS language_phrases (
          id TEXT PRIMARY KEY,
          english TEXT NOT NULL,
          urdu TEXT NOT NULL,
          romanized TEXT NOT NULL,
          category TEXT NOT NULL,
          audio_url TEXT,
          difficulty TEXT NOT NULL
        );
      `);

            // Local Laws table
            await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS local_laws (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          category TEXT NOT NULL,
          severity TEXT NOT NULL,
          applicable_to TEXT NOT NULL,
          last_updated TEXT NOT NULL
        );
      `);

            // Cultural Facts table
            await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS cultural_facts (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          category TEXT NOT NULL,
          region TEXT,
          importance TEXT NOT NULL,
          related_facts TEXT
        );
      `);

            // Bookmarks table
            await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS bookmarks (
          id TEXT PRIMARY KEY,
          item_id TEXT NOT NULL,
          item_type TEXT NOT NULL,
          title TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
      `);

            // Create indexes for better search performance
            await this.db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_general_knowledge_category ON general_knowledge(category);
        CREATE INDEX IF NOT EXISTS idx_emergency_info_priority ON emergency_info(priority);
        CREATE INDEX IF NOT EXISTS idx_travel_guidance_category ON travel_guidance(category);
        CREATE INDEX IF NOT EXISTS idx_language_phrases_category ON language_phrases(category);
        CREATE INDEX IF NOT EXISTS idx_local_laws_category ON local_laws(category);
        CREATE INDEX IF NOT EXISTS idx_cultural_facts_category ON cultural_facts(category);
        CREATE INDEX IF NOT EXISTS idx_bookmarks_item_type ON bookmarks(item_type);
      `);
        } catch (error) {
            console.error('Failed to create tables:', error);
        }
    }

    async saveAppData(data) {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.APP_DATA, JSON.stringify(data));
            await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
            await AsyncStorage.setItem(STORAGE_KEYS.APP_VERSION, data.version);

            // Also save to SQLite for better query performance
            await this.saveToSQLite(data);
        } catch (error) {
            console.error('Failed to save app data:', error);
        }
    }

    async saveToSQLite(data) {
        if (!this.db) return;

        try {
            // Clear existing data
            await this.db.execAsync('DELETE FROM general_knowledge');
            await this.db.execAsync('DELETE FROM emergency_info');
            await this.db.execAsync('DELETE FROM travel_guidance');
            await this.db.execAsync('DELETE FROM language_phrases');
            await this.db.execAsync('DELETE FROM local_laws');
            await this.db.execAsync('DELETE FROM cultural_facts');
            await this.db.execAsync('DELETE FROM bookmarks');

            // Insert new data
            for (const item of data.generalKnowledge) {
                await this.db.runAsync(
                    'INSERT INTO general_knowledge (id, title, content, category, tags, last_updated) VALUES (?, ?, ?, ?, ?, ?)',
                    [item.id, item.title, item.content, item.category, JSON.stringify(item.tags), item.lastUpdated]
                );
            }

            for (const item of data.emergencyInfo) {
                await this.db.runAsync(
                    'INSERT INTO emergency_info (id, title, description, phone_number, category, priority, location) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [item.id, item.title, item.description, item.phoneNumber || null, item.category, item.priority, item.location || null]
                );
            }

            for (const item of data.travelGuidance) {
                await this.db.runAsync(
                    'INSERT INTO travel_guidance (id, title, description, category, location, latitude, longitude, tips, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        item.id,
                        item.title,
                        item.description,
                        item.category,
                        item.location,
                        item.coordinates?.latitude || null,
                        item.coordinates?.longitude || null,
                        JSON.stringify(item.tips),
                        JSON.stringify(item.images || [])
                    ]
                );
            }

            for (const item of data.languagePhrases) {
                await this.db.runAsync(
                    'INSERT INTO language_phrases (id, english, urdu, romanized, category, audio_url, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [item.id, item.english, item.urdu, item.romanized, item.category, item.audioUrl || null, item.difficulty]
                );
            }

            for (const item of data.localLaws) {
                await this.db.runAsync(
                    'INSERT INTO local_laws (id, title, description, category, severity, applicable_to, last_updated) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [item.id, item.title, item.description, item.category, item.severity, item.applicableTo, item.lastUpdated]
                );
            }

            for (const item of data.culturalFacts) {
                await this.db.runAsync(
                    'INSERT INTO cultural_facts (id, title, description, category, region, importance, related_facts) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [item.id, item.title, item.description, item.category, item.region || null, item.importance, JSON.stringify(item.relatedFacts || [])]
                );
            }

            for (const item of data.bookmarks) {
                await this.db.runAsync(
                    'INSERT INTO bookmarks (id, item_id, item_type, title, created_at) VALUES (?, ?, ?, ?, ?)',
                    [item.id, item.itemId, item.itemType, item.title, item.createdAt]
                );
            }
        } catch (error) {
            console.error('Failed to save to SQLite:', error);
        }
    }

    async getAppData() {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.APP_DATA);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to get app data:', error);
            return null;
        }
    }

    async getSearchSuggestions(query, limit = 10) {
        if (query.length < 2) return [];

        try {
            // Fallback to AsyncStorage-based search on web
            if (Platform.OS === 'web' || !this.db) {
                return await this.getSearchSuggestionsFromAsyncStorage(query, limit);
            }

            const searchTerm = `%${query.toLowerCase()}%`;
            const suggestions = new Set();

            // Get suggestions from titles across all content types
            const queries = [
                'SELECT DISTINCT title FROM general_knowledge WHERE LOWER(title) LIKE ? LIMIT ?',
                'SELECT DISTINCT title FROM emergency_info WHERE LOWER(title) LIKE ? LIMIT ?',
                'SELECT DISTINCT title FROM travel_guidance WHERE LOWER(title) LIKE ? LIMIT ?',
                'SELECT DISTINCT english as title FROM language_phrases WHERE LOWER(english) LIKE ? LIMIT ?',
                'SELECT DISTINCT title FROM local_laws WHERE LOWER(title) LIKE ? LIMIT ?',
                'SELECT DISTINCT title FROM cultural_facts WHERE LOWER(title) LIKE ? LIMIT ?'
            ];

            for (const sql of queries) {
                const results = await this.db.getAllAsync(sql, [searchTerm, limit]);
                results.forEach((row) => {
                    if (row.title && row.title.toLowerCase().includes(query.toLowerCase())) {
                        suggestions.add(row.title);
                    }
                });
            }

            // Get suggestions from categories
            const categoryQueries = [
                'SELECT DISTINCT category FROM general_knowledge WHERE LOWER(category) LIKE ?',
                'SELECT DISTINCT category FROM emergency_info WHERE LOWER(category) LIKE ?',
                'SELECT DISTINCT category FROM travel_guidance WHERE LOWER(category) LIKE ?',
                'SELECT DISTINCT category FROM language_phrases WHERE LOWER(category) LIKE ?',
                'SELECT DISTINCT category FROM local_laws WHERE LOWER(category) LIKE ?',
                'SELECT DISTINCT category FROM cultural_facts WHERE LOWER(category) LIKE ?'
            ];

            for (const sql of categoryQueries) {
                const results = await this.db.getAllAsync(sql, [searchTerm]);
                results.forEach((row) => {
                    if (row.category && row.category.toLowerCase().includes(query.toLowerCase())) {
                        suggestions.add(row.category);
                    }
                });
            }

            return Array.from(suggestions).slice(0, limit);
        } catch (error) {
            console.error('Failed to get search suggestions:', error);
            return [];
        }
    }

    async getHomeScreenSearchSuggestions(query, limit = 10) {
        if (query.length < 2) return [];

        try {
            // Fallback to AsyncStorage-based search on web
            if (Platform.OS === 'web' || !this.db) {
                return await this.getHomeScreenSearchSuggestionsFromAsyncStorage(query, limit);
            }

            const searchTerm = `%${query.toLowerCase()}%`;
            const suggestions = new Set();

            // Only get suggestions from general knowledge for home screen
            const results = await this.db.getAllAsync(
                'SELECT DISTINCT title FROM general_knowledge WHERE LOWER(title) LIKE ? LIMIT ?',
                [searchTerm, limit]
            );

            results.forEach((row) => {
                if (row.title && row.title.toLowerCase().includes(query.toLowerCase())) {
                    suggestions.add(row.title);
                }
            });

            // Add some basic home screen related suggestions
            const homeScreenSuggestions = [
                'General Knowledge', 'Emergency Information', 'Travel Guidance',
                'Language Phrases', 'Local Laws', 'Cultural Facts',
                'Citizen Services', 'SIM Information', 'E-Challan', 'Passport Tracking'
            ];

            homeScreenSuggestions.forEach(suggestion => {
                if (suggestion.toLowerCase().includes(query.toLowerCase())) {
                    suggestions.add(suggestion);
                }
            });

            return Array.from(suggestions).slice(0, limit);
        } catch (error) {
            console.error('Failed to get home screen search suggestions:', error);
            return [];
        }
    }

    async searchHomeScreenContent(query, homeScreenData) {
        try {
            console.log('Searching home screen elements with query:', query);
            const results = [];
            const queryLower = query.toLowerCase();

            // Search through content sections
            homeScreenData.contentSections.forEach((section, index) => {
                const titleMatch = section.title.toLowerCase().includes(queryLower);
                const descriptionMatch = section.description.toLowerCase().includes(queryLower);

                if (titleMatch || descriptionMatch) {
                    results.push({
                        ...section,
                        searchType: 'content-section',
                        searchIndex: index,
                        relevanceScore: this.calculateRelevanceScore(query, section.title, section.description)
                    });
                }
            });

            // Search through citizen features
            homeScreenData.citizenFeatures.forEach((category, categoryIndex) => {
                // Search category title
                if (category.category.toLowerCase().includes(queryLower)) {
                    results.push({
                        title: category.category,
                        description: `Category: ${category.category}`,
                        icon: 'folder.fill',
                        color: '#007AFF',
                        searchType: 'citizen-category',
                        searchIndex: categoryIndex,
                        relevanceScore: this.calculateRelevanceScore(query, category.category, '')
                    });
                }

                // Search through items in each category
                category.items.forEach((item, itemIndex) => {
                    const titleMatch = item.title.toLowerCase().includes(queryLower);
                    const descriptionMatch = item.description.toLowerCase().includes(queryLower);

                    if (titleMatch || descriptionMatch) {
                        results.push({
                            ...item,
                            searchType: 'citizen-item',
                            searchCategoryIndex: categoryIndex,
                            searchItemIndex: itemIndex,
                            relevanceScore: this.calculateRelevanceScore(query, item.title, item.description)
                        });
                    }
                });
            });

            // Sort by relevance score
            const sortedResults = results.sort((a, b) => b.relevanceScore - a.relevanceScore);
            console.log('Total home screen search results:', sortedResults.length);
            return sortedResults;
        } catch (error) {
            console.error('Failed to search home screen content:', error);
            return [];
        }
    }

    async searchContent(query) {
        try {
            // Fallback to AsyncStorage-based search on web
            if (Platform.OS === 'web' || !this.db) {
                console.log('Using AsyncStorage fallback for search');
                return await this.searchContentFromAsyncStorage(query);
            }

            console.log('Searching with query:', query);
            const searchTerm = `%${query.toLowerCase()}%`;
            const results = [];

            // Search in general knowledge (including tags)
            const generalResults = await this.db.getAllAsync(
                'SELECT id, title, content, category, tags FROM general_knowledge WHERE LOWER(title) LIKE ? OR LOWER(content) LIKE ? OR LOWER(tags) LIKE ?',
                [searchTerm, searchTerm, searchTerm]
            );
            console.log('General knowledge results:', generalResults);

            results.push(...generalResults.map((row) => ({
                id: row.id,
                title: row.title,
                content: row.content,
                type: 'general',
                category: row.category,
                relevanceScore: this.calculateRelevanceScore(query, row.title, row.content, row.tags)
            })));

            // Search in emergency info (including phone numbers and location)
            const emergencyResults = await this.db.getAllAsync(
                'SELECT id, title, description as content, category, phone_number, location FROM emergency_info WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(phone_number) LIKE ? OR LOWER(location) LIKE ?',
                [searchTerm, searchTerm, searchTerm, searchTerm]
            );

            results.push(...emergencyResults.map((row) => ({
                id: row.id,
                title: row.title,
                content: row.content,
                type: 'emergency',
                category: row.category,
                relevanceScore: this.calculateRelevanceScore(query, row.title, row.content, null, row.phone_number, row.location)
            })));

            // Search in travel guidance (including location and tips)
            const travelResults = await this.db.getAllAsync(
                'SELECT id, title, description as content, category, location, tips FROM travel_guidance WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(location) LIKE ? OR LOWER(tips) LIKE ?',
                [searchTerm, searchTerm, searchTerm, searchTerm]
            );

            results.push(...travelResults.map((row) => ({
                id: row.id,
                title: row.title,
                content: row.content,
                type: 'travel',
                category: row.category,
                relevanceScore: this.calculateRelevanceScore(query, row.title, row.content, null, null, row.location, row.tips)
            })));

            // Search in language phrases (including romanized text)
            const languageResults = await this.db.getAllAsync(
                'SELECT id, english as title, urdu as content, category, romanized FROM language_phrases WHERE LOWER(english) LIKE ? OR LOWER(urdu) LIKE ? OR LOWER(romanized) LIKE ?',
                [searchTerm, searchTerm, searchTerm]
            );

            results.push(...languageResults.map((row) => ({
                id: row.id,
                title: row.title,
                content: row.content,
                type: 'language',
                category: row.category,
                relevanceScore: this.calculateRelevanceScore(query, row.title, row.content, null, null, null, null, row.romanized)
            })));

            // Search in local laws (including severity and applicable_to)
            const lawResults = await this.db.getAllAsync(
                'SELECT id, title, description as content, category, severity, applicable_to FROM local_laws WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(severity) LIKE ? OR LOWER(applicable_to) LIKE ?',
                [searchTerm, searchTerm, searchTerm, searchTerm]
            );

            results.push(...lawResults.map((row) => ({
                id: row.id,
                title: row.title,
                content: row.content,
                type: 'law',
                category: row.category,
                relevanceScore: this.calculateRelevanceScore(query, row.title, row.content, null, null, null, null, null, row.severity, row.applicable_to)
            })));

            // Search in cultural facts (including region and related_facts)
            const culturalResults = await this.db.getAllAsync(
                'SELECT id, title, description as content, category, region, related_facts FROM cultural_facts WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(region) LIKE ? OR LOWER(related_facts) LIKE ?',
                [searchTerm, searchTerm, searchTerm, searchTerm]
            );

            results.push(...culturalResults.map((row) => ({
                id: row.id,
                title: row.title,
                content: row.content,
                type: 'cultural',
                category: row.category,
                relevanceScore: this.calculateRelevanceScore(query, row.title, row.content, null, null, row.region, null, null, null, null, row.related_facts)
            })));

            // Sort by relevance score
            const sortedResults = results.sort((a, b) => b.relevanceScore - a.relevanceScore);
            console.log('Total search results:', sortedResults.length);
            return sortedResults;
        } catch (error) {
            console.error('Failed to search content:', error);
            return [];
        }
    }

    calculateRelevanceScore(
        query,
        title,
        content,
        tags,
        phoneNumber,
        location,
        tips,
        romanized,
        severity,
        applicableTo,
        relatedFacts
    ) {
        const queryLower = query.toLowerCase();
        const titleLower = title.toLowerCase();
        const contentLower = content.toLowerCase();

        let score = 0;

        // Title matches are most important
        if (titleLower.includes(queryLower)) {
            score += 15;
        }

        // Exact title match gets highest score
        if (titleLower === queryLower) {
            score += 25;
        }

        // Content matches
        if (contentLower.includes(queryLower)) {
            score += 8;
        }

        // Tags matches (for general knowledge)
        if (tags) {
            const tagsLower = tags.toLowerCase();
            if (tagsLower.includes(queryLower)) {
                score += 12;
            }
        }

        // Phone number matches (for emergency info)
        if (phoneNumber && phoneNumber.includes(query)) {
            score += 20;
        }

        // Location matches
        if (location) {
            const locationLower = location.toLowerCase();
            if (locationLower.includes(queryLower)) {
                score += 10;
            }
        }

        // Tips matches (for travel guidance)
        if (tips) {
            const tipsLower = tips.toLowerCase();
            if (tipsLower.includes(queryLower)) {
                score += 6;
            }
        }

        // Romanized text matches (for language phrases)
        if (romanized) {
            const romanizedLower = romanized.toLowerCase();
            if (romanizedLower.includes(queryLower)) {
                score += 10;
            }
        }

        // Severity matches (for local laws)
        if (severity) {
            const severityLower = severity.toLowerCase();
            if (severityLower.includes(queryLower)) {
                score += 8;
            }
        }

        // Applicable to matches (for local laws)
        if (applicableTo) {
            const applicableToLower = applicableTo.toLowerCase();
            if (applicableToLower.includes(queryLower)) {
                score += 8;
            }
        }

        // Related facts matches (for cultural facts)
        if (relatedFacts) {
            const relatedFactsLower = relatedFacts.toLowerCase();
            if (relatedFactsLower.includes(queryLower)) {
                score += 6;
            }
        }

        // Bonus for word boundary matches
        const wordBoundaryRegex = new RegExp(`\\b${queryLower}\\b`, 'i');
        if (wordBoundaryRegex.test(titleLower)) {
            score += 5;
        }
        if (wordBoundaryRegex.test(contentLower)) {
            score += 3;
        }

        return Math.min(score, 100); // Cap at 100
    }

    async addBookmark(bookmark) {
        try {
            const existingBookmarks = await this.getBookmarks();
            const updatedBookmarks = [...existingBookmarks, bookmark];

            await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updatedBookmarks));

            if (this.db) {
                await this.db.runAsync(
                    'INSERT INTO bookmarks (id, item_id, item_type, title, created_at) VALUES (?, ?, ?, ?, ?)',
                    [bookmark.id, bookmark.itemId, bookmark.itemType, bookmark.title, bookmark.createdAt]
                );
            }
        } catch (error) {
            console.error('Failed to add bookmark:', error);
        }
    }

    async removeBookmark(bookmarkId) {
        try {
            const existingBookmarks = await this.getBookmarks();
            const updatedBookmarks = existingBookmarks.filter(b => b.id !== bookmarkId);

            await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updatedBookmarks));

            if (this.db) {
                await this.db.runAsync('DELETE FROM bookmarks WHERE id = ?', [bookmarkId]);
            }
        } catch (error) {
            console.error('Failed to remove bookmark:', error);
        }
    }

    async getBookmarks() {
        try {
            const bookmarks = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
            return bookmarks ? JSON.parse(bookmarks) : [];
        } catch (error) {
            console.error('Failed to get bookmarks:', error);
            return [];
        }
    }

    async isDataInitialized() {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.APP_DATA);
            return data !== null;
        } catch (error) {
            console.error('Failed to check data initialization:', error);
            return false;
        }
    }

    async getLastSyncDate() {
        try {
            return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
        } catch (error) {
            console.error('Failed to get last sync date:', error);
            return null;
        }
    }

    async addSearchHistory(query) {
        try {
            if (!query.trim()) return;

            const history = await this.getSearchHistory();
            const trimmedQuery = query.trim();

            // Remove if already exists
            const filteredHistory = history.filter(item => item.query !== trimmedQuery);

            // Add to beginning
            const newHistory = [
                { query: trimmedQuery, timestamp: new Date().toISOString() },
                ...filteredHistory
            ].slice(0, 20); // Keep only last 20 searches

            await AsyncStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(newHistory));
        } catch (error) {
            console.error('Failed to add search history:', error);
        }
    }

    async getSearchHistory() {
        try {
            const history = await AsyncStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Failed to get search history:', error);
            return [];
        }
    }

    async clearSearchHistory() {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
        } catch (error) {
            console.error('Failed to clear search history:', error);
        }
    }

    async clearAllData() {
        try {
            await AsyncStorage.multiRemove([
                STORAGE_KEYS.APP_DATA,
                STORAGE_KEYS.BOOKMARKS,
                STORAGE_KEYS.LAST_SYNC,
                STORAGE_KEYS.APP_VERSION,
                STORAGE_KEYS.SEARCH_HISTORY,
            ]);

            if (this.db) {
                await this.db.execAsync('DELETE FROM general_knowledge');
                await this.db.execAsync('DELETE FROM emergency_info');
                await this.db.execAsync('DELETE FROM travel_guidance');
                await this.db.execAsync('DELETE FROM language_phrases');
                await this.db.execAsync('DELETE FROM local_laws');
                await this.db.execAsync('DELETE FROM cultural_facts');
                await this.db.execAsync('DELETE FROM bookmarks');
            }
        } catch (error) {
            console.error('Failed to clear all data:', error);
        }
    }

    // Fallback methods for web platform when SQLite is not available
    async getSearchSuggestionsFromAsyncStorage(query, limit = 10) {
        try {
            const appData = await this.getAppData();
            if (!appData) return [];

            const suggestions = new Set();
            const queryLower = query.toLowerCase();

            // Search through all data types
            const searchData = [
                ...appData.generalKnowledge,
                ...appData.emergencyInfo,
                ...appData.travelGuidance,
                ...appData.languagePhrases.map(p => ({ title: p.english, category: p.category })),
                ...appData.localLaws,
                ...appData.culturalFacts
            ];

            searchData.forEach(item => {
                if (item.title && item.title.toLowerCase().includes(queryLower)) {
                    suggestions.add(item.title);
                }
                if (item.category && item.category.toLowerCase().includes(queryLower)) {
                    suggestions.add(item.category);
                }
            });

            return Array.from(suggestions).slice(0, limit);
        } catch (error) {
            console.error('Failed to get search suggestions from AsyncStorage:', error);
            return [];
        }
    }

    async searchContentFromAsyncStorage(query) {
        try {
            const appData = await this.getAppData();
            if (!appData) return [];

            const results = [];
            const queryLower = query.toLowerCase();

            // Search in general knowledge
            appData.generalKnowledge.forEach(item => {
                if (this.matchesQuery(queryLower, item.title, item.content, item.tags)) {
                    results.push({
                        id: item.id,
                        title: item.title,
                        content: item.content,
                        type: 'general',
                        category: item.category,
                        relevanceScore: this.calculateRelevanceScore(query, item.title, item.content, item.tags)
                    });
                }
            });

            // Search in emergency info
            appData.emergencyInfo.forEach(item => {
                if (this.matchesQuery(queryLower, item.title, item.description, null, item.phoneNumber, item.location)) {
                    results.push({
                        id: item.id,
                        title: item.title,
                        content: item.description,
                        type: 'emergency',
                        category: item.category,
                        relevanceScore: this.calculateRelevanceScore(query, item.title, item.description, null, item.phoneNumber, item.location)
                    });
                }
            });

            // Search in travel guidance
            appData.travelGuidance.forEach(item => {
                if (this.matchesQuery(queryLower, item.title, item.description, null, null, item.location, item.tips)) {
                    results.push({
                        id: item.id,
                        title: item.title,
                        content: item.description,
                        type: 'travel',
                        category: item.category,
                        relevanceScore: this.calculateRelevanceScore(query, item.title, item.description, null, null, item.location, item.tips)
                    });
                }
            });

            // Search in language phrases
            appData.languagePhrases.forEach(item => {
                if (this.matchesQuery(queryLower, item.english, item.urdu, null, null, null, null, item.romanized)) {
                    results.push({
                        id: item.id,
                        title: item.english,
                        content: item.urdu,
                        type: 'language',
                        category: item.category,
                        relevanceScore: this.calculateRelevanceScore(query, item.english, item.urdu, null, null, null, null, item.romanized)
                    });
                }
            });

            // Search in local laws
            appData.localLaws.forEach(item => {
                if (this.matchesQuery(queryLower, item.title, item.description, null, null, null, null, null, item.severity, item.applicableTo)) {
                    results.push({
                        id: item.id,
                        title: item.title,
                        content: item.description,
                        type: 'law',
                        category: item.category,
                        relevanceScore: this.calculateRelevanceScore(query, item.title, item.description, null, null, null, null, null, item.severity, item.applicableTo)
                    });
                }
            });

            // Search in cultural facts
            appData.culturalFacts.forEach(item => {
                if (this.matchesQuery(queryLower, item.title, item.description, null, null, item.region, null, null, null, null, item.relatedFacts)) {
                    results.push({
                        id: item.id,
                        title: item.title,
                        content: item.description,
                        type: 'cultural',
                        category: item.category,
                        relevanceScore: this.calculateRelevanceScore(query, item.title, item.description, null, null, item.region, null, null, null, null, item.relatedFacts)
                    });
                }
            });

            return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
        } catch (error) {
            console.error('Failed to search content from AsyncStorage:', error);
            return [];
        }
    }

    async getHomeScreenSearchSuggestionsFromAsyncStorage(query, limit = 10) {
        try {
            const appData = await this.getAppData();
            if (!appData) return [];

            const suggestions = new Set();
            const queryLower = query.toLowerCase();

            // Search through general knowledge for home screen suggestions
            appData.generalKnowledge.forEach(item => {
                if (item.title && item.title.toLowerCase().includes(queryLower)) {
                    suggestions.add(item.title);
                }
            });

            // Add some basic home screen related suggestions
            const homeScreenSuggestions = [
                'General Knowledge', 'Emergency Information', 'Travel Guidance',
                'Language Phrases', 'Local Laws', 'Cultural Facts',
                'Citizen Services', 'SIM Information', 'E-Challan', 'Passport Tracking'
            ];

            homeScreenSuggestions.forEach(suggestion => {
                if (suggestion.toLowerCase().includes(queryLower)) {
                    suggestions.add(suggestion);
                }
            });

            return Array.from(suggestions).slice(0, limit);
        } catch (error) {
            console.error('Failed to get home screen search suggestions from AsyncStorage:', error);
            return [];
        }
    }

    matchesQuery(queryLower, title, content, tags, phoneNumber, location, tips, romanized, severity, applicableTo, relatedFacts) {
        if (!title && !content) return false;

        const titleLower = title ? title.toLowerCase() : '';
        const contentLower = content ? content.toLowerCase() : '';

        if (titleLower.includes(queryLower) || contentLower.includes(queryLower)) {
            return true;
        }

        if (tags && tags.toLowerCase().includes(queryLower)) return true;
        if (phoneNumber && phoneNumber.includes(queryLower)) return true;
        if (location && location.toLowerCase().includes(queryLower)) return true;
        if (tips && tips.toLowerCase().includes(queryLower)) return true;
        if (romanized && romanized.toLowerCase().includes(queryLower)) return true;
        if (severity && severity.toLowerCase().includes(queryLower)) return true;
        if (applicableTo && applicableTo.toLowerCase().includes(queryLower)) return true;
        if (relatedFacts && relatedFacts.toLowerCase().includes(queryLower)) return true;

        return false;
    }
}

export const storageService = new StorageService();
