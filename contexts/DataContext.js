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

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            setIsLoading(true);
            const appData = await storageService.getAppData();
            
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
        refreshData,
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
