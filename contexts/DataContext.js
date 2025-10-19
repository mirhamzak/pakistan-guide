import { firebaseService } from '@/services/firebaseService';
import { storageService } from '@/services/storage';
import { createContext, useContext, useEffect, useState } from 'react';

const DataContext = createContext();

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider = ({ children }) => {
    const [data, setData] = useState({
        generalKnowledge: [],
        emergencyInfo: [],
        travelGuidance: [],
        languagePhrases: [],
        localLaws: [],
        culturalFacts: [],
        bookmarks: []
    });
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [lastSyncDate, setLastSyncDate] = useState(null);
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async (forceRefresh = false) => {
        try {
            setIsLoading(true);
            
            // Try to fetch from Firebase first, fallback to local
            const appData = await firebaseService.getContent('all');
            
            if (appData) {
                setData({
                    generalKnowledge: appData.generalKnowledge || [],
                    emergencyInfo: appData.emergencyInfo || [],
                    travelGuidance: appData.travelGuidance || [],
                    languagePhrases: appData.languagePhrases || [],
                    localLaws: appData.localLaws || [],
                    culturalFacts: appData.culturalFacts || [],
                    bookmarks: appData.bookmarks || []
                });
                
                const syncDate = await storageService.getLastSyncDate();
                setLastSyncDate(syncDate);
                setIsDataLoaded(true);
            } else {
                setIsDataLoaded(false);
            }
        } catch (error) {
            console.error('Failed to load app data:', error);
            setIsDataLoaded(false);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshData = async () => {
        await loadAllData();
    };

    const checkForUpdates = async () => {
        try {
            // Simple update check - you can implement version checking later
            const isConnected = await firebaseService.testConnection();
            setUpdateAvailable(isConnected);
            return { hasUpdate: isConnected, error: null };
        } catch (error) {
            console.error('Failed to check for updates:', error);
            return { hasUpdate: false, error: error.message };
        }
    };

    const updateContent = async (type = 'all') => {
        try {
            setIsUpdating(true);
            // For now, just refresh the data
            await loadAllData(true);
            return true;
        } catch (error) {
            console.error('Failed to update content:', error);
            return false;
        } finally {
            setIsUpdating(false);
        }
    };

    const validateContent = async () => {
        try {
            // Simple validation - you can implement more complex validation later
            return [];
        } catch (error) {
            console.error('Failed to validate content:', error);
            return [];
        }
    };

    const getContentStats = async () => {
        try {
            // Simple stats - you can implement more detailed stats later
            return {
                generalKnowledge: data.generalKnowledge?.length || 0,
                emergencyInfo: data.emergencyInfo?.length || 0,
                travelGuidance: data.travelGuidance?.length || 0,
                languagePhrases: data.languagePhrases?.length || 0,
                localLaws: data.localLaws?.length || 0,
                culturalFacts: data.culturalFacts?.length || 0,
                lastUpdated: new Date().toISOString(),
                version: '1.0.0'
            };
        } catch (error) {
            console.error('Failed to get content stats:', error);
            return null;
        }
    };

    // Expose refreshData globally for use in other components
    useEffect(() => {
        // Make refreshData available globally for data initialization
        if (typeof window !== 'undefined') {
            window.refreshAppData = refreshData;
        }
    }, []);

    const getDataByType = (type) => {
        switch (type) {
            case 'general':
                return data.generalKnowledge;
            case 'emergency':
                return data.emergencyInfo;
            case 'travel':
                return data.travelGuidance;
            case 'language':
                return data.languagePhrases;
            case 'law':
                return data.localLaws;
            case 'cultural':
                return data.culturalFacts;
            default:
                return [];
        }
    };

    const addBookmark = async (bookmark) => {
        try {
            await storageService.addBookmark(bookmark);
            // Update local state
            setData(prev => ({
                ...prev,
                bookmarks: [...prev.bookmarks, bookmark]
            }));
        } catch (error) {
            console.error('Failed to add bookmark:', error);
        }
    };

    const removeBookmark = async (bookmarkId) => {
        try {
            await storageService.removeBookmark(bookmarkId);
            // Update local state
            setData(prev => ({
                ...prev,
                bookmarks: prev.bookmarks.filter(b => b.id !== bookmarkId)
            }));
        } catch (error) {
            console.error('Failed to remove bookmark:', error);
        }
    };

    const value = {
        data,
        isDataLoaded,
        isLoading,
        lastSyncDate,
        updateAvailable,
        isUpdating,
        refreshData,
        checkForUpdates,
        updateContent,
        validateContent,
        getContentStats,
        getDataByType,
        addBookmark,
        removeBookmark
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
