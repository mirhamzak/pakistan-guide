import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, TAB_BAR_HEIGHT } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { storageService } from '@/services/storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
    const { theme } = useTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedType, setSelectedType] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isDataInitialized, setIsDataInitialized] = useState(false);

    useEffect(() => {
        loadBookmarks();
        loadSearchHistory();
        checkDataInitialization();
    }, []);

    const checkDataInitialization = async () => {
        try {
            const initialized = await storageService.isDataInitialized();
            setIsDataInitialized(initialized);
            console.log('Data initialized:', initialized);
        } catch (error) {
            console.error('Failed to check data initialization:', error);
        }
    };

    useEffect(() => {
        if (searchQuery.length > 0) {
            // Show suggestions immediately as user types
            loadSearchSuggestions();
            setShowSuggestions(true);

            // Perform search immediately for better responsiveness
            if (searchQuery.trim()) {
                performSearch();
            }
        } else {
            setSearchResults([]);
            setSearchSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchQuery]);

    const loadBookmarks = async () => {
        try {
            const userBookmarks = await storageService.getBookmarks();
            setBookmarks(userBookmarks);
        } catch (error) {
            console.error('Failed to load bookmarks:', error);
        }
    };

    const loadSearchHistory = async () => {
        try {
            const history = await storageService.getSearchHistory();
            setSearchHistory(history);
        } catch (error) {
            console.error('Failed to load search history:', error);
        }
    };

    const loadSearchSuggestions = async () => {
        try {
            const suggestions = await storageService.getSearchSuggestions(searchQuery, 8);
            setSearchSuggestions(suggestions);
        } catch (error) {
            console.error('Failed to load search suggestions:', error);
        }
    };

    const performSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        if (!isDataInitialized) {
            console.log('Data not initialized, cannot search');
            Alert.alert('Data Required', 'Please initialize the Pakistan Guide data first to use search functionality.');
            return;
        }

        try {
            setIsSearching(true);
            console.log('Searching for:', searchQuery); // Debug log
            const results = await storageService.searchContent(searchQuery);
            console.log('Search results:', results); // Debug log

            // Apply filters
            let filteredResults = results;

            if (selectedType !== 'all') {
                filteredResults = filteredResults.filter(result => result.type === selectedType);
            }

            if (selectedCategory !== 'all') {
                filteredResults = filteredResults.filter(result => result.category === selectedCategory);
            }

            console.log('Filtered results:', filteredResults); // Debug log
            setSearchResults(filteredResults);

            // Add to search history
            await storageService.addSearchHistory(searchQuery);
            await loadSearchHistory();

            setShowSuggestions(false);
        } catch (error) {
            console.error('Failed to search content:', error);
            Alert.alert('Error', 'Failed to search content');
        } finally {
            setIsSearching(false);
        }
    };

    const toggleBookmark = async (result) => {
        try {
            const existingBookmark = bookmarks.find(b => b.itemId === result.id);

            if (existingBookmark) {
                await storageService.removeBookmark(existingBookmark.id);
                setBookmarks(bookmarks.filter(b => b.id !== existingBookmark.id));
            } else {
                const newBookmark = {
                    id: `bookmark-${Date.now()}`,
                    itemId: result.id,
                    itemType: result.type,
                    title: result.title,
                    createdAt: new Date().toISOString(),
                };

                await storageService.addBookmark(newBookmark);
                setBookmarks([...bookmarks, newBookmark]);
            }
        } catch (error) {
            console.error('Failed to toggle bookmark:', error);
            Alert.alert('Error', 'Failed to update bookmark');
        }
    };

    const isBookmarked = (resultId) => {
        return bookmarks.some(b => b.itemId === resultId);
    };

    const handleSuggestionPress = (suggestion) => {
        setSearchQuery(suggestion);
        setShowSuggestions(false);
    };

    const handleHistoryPress = (query) => {
        setSearchQuery(query);
        setShowSuggestions(false);
    };

    const clearSearchHistory = async () => {
        try {
            await storageService.clearSearchHistory();
            setSearchHistory([]);
        } catch (error) {
            console.error('Failed to clear search history:', error);
            Alert.alert('Error', 'Failed to clear search history');
        }
    };

    const handleSearchResultPress = (result) => {
        // Map search result types to their corresponding routes
        const routeMap = {
            general: '../general-knowledge',
            emergency: '../emergency-info',
            travel: '../travel-guidance',
            language: '../language-phrases',
            law: '../local-laws',
            cultural: '../cultural-facts',
        };

        const route = routeMap[result.type];
        if (route) {
            router.push(route);
        } else {
            Alert.alert('Navigation', `Navigate to ${result.type} section`);
        }
    };

    const highlightText = (text, query) => {
        if (!query.trim()) return text;

        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) => {
            if (regex.test(part)) {
                return (
                    <ThemedText key={index} style={{ backgroundColor: colors.tint + '30', fontWeight: '600' }}>
                        {part}
                    </ThemedText>
                );
            }
            return part;
        });
    };

    const contentTypes = [
        { value: 'all', label: 'All Types', icon: 'square.grid.2x2' },
        { value: 'general', label: 'General', icon: 'book.fill' },
        { value: 'emergency', label: 'Emergency', icon: 'exclamationmark.triangle.fill' },
        { value: 'travel', label: 'Travel', icon: 'airplane' },
        { value: 'language', label: 'Language', icon: 'text.bubble.fill' },
        { value: 'law', label: 'Laws', icon: 'scale.fill' },
        { value: 'cultural', label: 'Cultural', icon: 'heart.fill' },
    ];

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'geography', label: 'Geography' },
        { value: 'cities', label: 'Cities' },
        { value: 'demographics', label: 'Demographics' },
        { value: 'language', label: 'Language' },
        { value: 'economy', label: 'Economy' },
        { value: 'police', label: 'Police' },
        { value: 'medical', label: 'Medical' },
        { value: 'fire', label: 'Fire' },
        { value: 'transport', label: 'Transport' },
        { value: 'accommodation', label: 'Accommodation' },
        { value: 'safety', label: 'Safety' },
        { value: 'attractions', label: 'Attractions' },
        { value: 'greetings', label: 'Greetings' },
        { value: 'directions', label: 'Directions' },
        { value: 'shopping', label: 'Shopping' },
        { value: 'traffic', label: 'Traffic' },
        { value: 'public', label: 'Public' },
        { value: 'business', label: 'Business' },
        { value: 'traditions', label: 'Traditions' },
        { value: 'festivals', label: 'Festivals' },
        { value: 'etiquette', label: 'Etiquette' },
    ];

    const getTypeIcon = (type) => {
        const iconMap = {
            general: 'book.fill',
            emergency: 'exclamationmark.triangle.fill',
            travel: 'airplane',
            language: 'text.bubble.fill',
            law: 'scale.fill',
            cultural: 'heart.fill',
        };
        return iconMap[type] || 'doc.text.fill';
    };

    const getTypeColor = (type) => {
        const colorMap = {
            general: '#007AFF',
            emergency: '#FF3B30',
            travel: '#34C759',
            language: '#AF52DE',
            law: '#FF9500',
            cultural: '#FF6B6B',
        };
        return colorMap[type] || '#666';
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    {/* Header */}
                    <ThemedView style={[styles.header, { backgroundColor: colors.cardHeader, borderBottomColor: colors.border }]}>
                        <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
                            Full App Search
                        </ThemedText>
                        <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Search through all content in the app
                        </ThemedText>
                    </ThemedView>

                    {/* Search Bar */}
                    <ThemedView style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                        <TextInput
                            style={[styles.searchInput, { color: colors.text }]}
                            placeholder="Search all app content..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor={colors.textSecondary}
                            autoFocus
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchButton}>
                                <IconSymbol name="xmark.circle.fill" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        )}
                    </ThemedView>

                    {/* Search Filters */}
                    <ThemedView style={[styles.filtersContainer, { backgroundColor: colors.background }]}>
                        <ThemedText style={[styles.filtersTitle, { color: colors.text }]}>
                            Filters
                        </ThemedText>

                        {/* Content Type Filter */}
                        <ThemedView style={[styles.filterSection, { backgroundColor: colors.background }]}>
                            <ThemedText style={[styles.filterLabel, { color: colors.textSecondary }]}>
                                Content Type
                            </ThemedText>
                            <ThemedView style={[styles.filterChips, { backgroundColor: colors.background }]}>
                                {contentTypes.map((type) => (
                                    <TouchableOpacity
                                        key={type.value}
                                        style={[
                                            styles.filterChip,
                                            {
                                                backgroundColor: selectedType === type.value ? colors.tint : colors.card,
                                                borderColor: colors.border
                                            }
                                        ]}
                                        onPress={() => setSelectedType(type.value)}
                                    >
                                        <IconSymbol
                                            name={type.icon}
                                            size={16}
                                            color={selectedType === type.value ? '#fff' : colors.textSecondary}
                                        />
                                        <ThemedText style={[
                                            styles.filterChipText,
                                            { color: selectedType === type.value ? '#fff' : colors.text }
                                        ]}>
                                            {type.label}
                                        </ThemedText>
                                    </TouchableOpacity>
                                ))}
                            </ThemedView>
                        </ThemedView>

                        {/* Category Filter */}
                        <ThemedView style={[styles.filterSection, { backgroundColor: colors.background }]}>
                            <ThemedText style={[styles.filterLabel, { color: colors.textSecondary }]}>
                                Category
                            </ThemedText>
                            <ThemedView style={[styles.filterChips, { backgroundColor: colors.background }]}>
                                {categories.slice(0, 8).map((category) => (
                                    <TouchableOpacity
                                        key={category.value}
                                        style={[
                                            styles.filterChip,
                                            {
                                                backgroundColor: selectedCategory === category.value ? colors.tint : colors.card,
                                                borderColor: colors.border
                                            }
                                        ]}
                                        onPress={() => setSelectedCategory(category.value)}
                                    >
                                        <ThemedText style={[
                                            styles.filterChipText,
                                            { color: selectedCategory === category.value ? '#fff' : colors.text }
                                        ]}>
                                            {category.label}
                                        </ThemedText>
                                    </TouchableOpacity>
                                ))}
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>

                    {/* Search Suggestions/History */}
                    {showSuggestions && (searchSuggestions.length > 0 || searchHistory.length > 0) && (
                        <ThemedView style={[styles.suggestionsContainer, { backgroundColor: colors.background }]}>
                            {searchSuggestions.length > 0 && (
                                <ThemedView style={[styles.suggestionsSection, { backgroundColor: colors.background }]}>
                                    <ThemedText style={[styles.suggestionsTitle, { color: colors.text }]}>
                                        Suggestions
                                    </ThemedText>
                                    {searchSuggestions.map((suggestion, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[styles.suggestionItem, { backgroundColor: colors.card }]}
                                            onPress={() => handleSuggestionPress(suggestion)}
                                        >
                                            <IconSymbol name="magnifyingglass" size={16} color={colors.textSecondary} />
                                            <ThemedText style={[styles.suggestionText, { color: colors.text }]}>
                                                {highlightText(suggestion, searchQuery)}
                                            </ThemedText>
                                        </TouchableOpacity>
                                    ))}
                                </ThemedView>
                            )}

                            {searchHistory.length > 0 && (
                                <ThemedView style={[styles.historySection, { backgroundColor: colors.background }]}>
                                    <ThemedView style={[styles.historyHeader, { backgroundColor: colors.background }]}>
                                        <ThemedText style={[styles.suggestionsTitle, { color: colors.text }]}>
                                            Recent Searches
                                        </ThemedText>
                                        <TouchableOpacity onPress={clearSearchHistory}>
                                            <ThemedText style={{ color: colors.tint, fontSize: 14, fontWeight: '500' }}>
                                                Clear
                                            </ThemedText>
                                        </TouchableOpacity>
                                    </ThemedView>
                                    {searchHistory.slice(0, 5).map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[styles.suggestionItem, { backgroundColor: colors.card }]}
                                            onPress={() => handleHistoryPress(item.query)}
                                        >
                                            <IconSymbol name="clock" size={16} color={colors.textSecondary} />
                                            <ThemedText style={[styles.suggestionText, { color: colors.text }]}>
                                                {item.query}
                                            </ThemedText>
                                        </TouchableOpacity>
                                    ))}
                                </ThemedView>
                            )}
                        </ThemedView>
                    )}

                    {/* Search Results */}
                    <ThemedView style={[styles.resultsContainer, { backgroundColor: colors.background }]}>
                        {isSearching ? (
                            <ThemedView style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                                <ThemedText style={{ color: colors.text }}>Searching...</ThemedText>
                            </ThemedView>
                        ) : searchResults.length === 0 && searchQuery.trim() ? (
                            <ThemedView style={[styles.emptyState, { backgroundColor: colors.background }]}>
                                <IconSymbol name="magnifyingglass" size={48} color={colors.textSecondary} />
                                <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                                    No results found for "{searchQuery}"
                                </ThemedText>
                            </ThemedView>
                        ) : !isDataInitialized ? (
                            <ThemedView style={[styles.emptyState, { backgroundColor: colors.background }]}>
                                <IconSymbol name="exclamationmark.triangle" size={48} color={colors.textSecondary} />
                                <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                                    Please initialize Pakistan Guide data first to use search functionality
                                </ThemedText>
                            </ThemedView>
                        ) : searchResults.length === 0 ? (
                            <ThemedView style={[styles.emptyState, { backgroundColor: colors.background }]}>
                                <IconSymbol name="doc.text" size={48} color={colors.textSecondary} />
                                <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                                    Start typing to search all app content
                                </ThemedText>
                            </ThemedView>
                        ) : (
                            <ThemedView style={[styles.resultsList, { backgroundColor: colors.background }]}>
                                {searchResults.map((result) => (
                                    <TouchableOpacity
                                        key={result.id}
                                        style={[styles.resultCard, { backgroundColor: colors.card }]}
                                        onPress={() => handleSearchResultPress(result)}
                                        activeOpacity={0.7}
                                    >
                                        <ThemedView style={[styles.resultHeader, { backgroundColor: colors.card }]}>
                                            <ThemedView style={[styles.resultHeaderLeft, { backgroundColor: colors.card }]}>
                                                <IconSymbol
                                                    name={getTypeIcon(result.type)}
                                                    size={20}
                                                    color={getTypeColor(result.type)}
                                                    style={styles.resultIcon}
                                                />
                                                    <ThemedView style={[styles.resultTitleContainer, { backgroundColor: colors.card }]}>
                                                        <ThemedText style={[styles.resultTitle, { color: colors.text }]}>
                                                            {highlightText(result.title, searchQuery)}
                                                    </ThemedText>
                                                    <ThemedText style={[styles.resultType, { color: colors.textSecondary }]}>
                                                        {result.type.charAt(0).toUpperCase() + result.type.slice(1)} • {result.category}
                                                    </ThemedText>
                                                </ThemedView>
                                            </ThemedView>

                                            <TouchableOpacity
                                                onPress={(e) => {
                                                    e.stopPropagation(); // Prevent triggering the parent onPress
                                                    toggleBookmark(result);
                                                }}
                                                style={[styles.bookmarkButton, { backgroundColor: colors.card }]}
                                            >
                                                <IconSymbol
                                                    name={isBookmarked(result.id) ? "bookmark.fill" : "bookmark"}
                                                    size={20}
                                                    color={isBookmarked(result.id) ? "#FF9500" : colors.textSecondary}
                                                />
                                            </TouchableOpacity>
                                        </ThemedView>

                                        <ThemedText style={[styles.resultContent, { color: colors.text }]} numberOfLines={3}>
                                            {highlightText(result.content, searchQuery)}
                                        </ThemedText>

                                        <ThemedView style={[styles.resultFooter, { backgroundColor: colors.card }]}>
                                            <ThemedText style={[styles.relevanceScore, { color: colors.textSecondary }]}>
                                                Relevance: {Math.round(result.relevanceScore)}%
                                            </ThemedText>
                                            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
                                        </ThemedView>
                                    </TouchableOpacity>
                                ))}
                            </ThemedView>
                        )}
                    </ThemedView>
                </ScrollView>
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        paddingBottom: TAB_BAR_HEIGHT,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    clearSearchButton: {
        padding: 4,
    },
    resultsContainer: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center',
    },
    resultsList: {
        flex: 1,
    },
    resultCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    resultHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    resultIcon: {
        marginRight: 12,
    },
    resultTitleContainer: {
        flex: 1,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    resultType: {
        fontSize: 12,
    },
    bookmarkButton: {
        padding: 8,
    },
    resultContent: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    resultFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    relevanceScore: {
        fontSize: 12,
    },
    suggestionsContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    suggestionsSection: {
        marginBottom: 16,
    },
    historySection: {
        marginBottom: 16,
    },
    suggestionsTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 4,
    },
    suggestionText: {
        fontSize: 14,
        marginLeft: 12,
        flex: 1,
    },
    filtersContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    filtersTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    filterSection: {
        marginBottom: 16,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    filterChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 4,
    },
    filterChipText: {
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 6,
    },
});
