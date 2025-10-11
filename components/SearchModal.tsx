import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { storageService } from '@/services/storage';
import { Bookmark, SearchResult } from '@/types';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  homeScreenData?: {
    contentSections: any[];
    citizenFeatures: any[];
  };
  onResultPress?: (result: SearchResult) => void;
}

export default function SearchModal({ visible, onClose, homeScreenData, onResultPress }: SearchModalProps) {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<{ query: string; timestamp: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDataInitialized, setIsDataInitialized] = useState(false);

  useEffect(() => {
    if (visible) {
      loadBookmarks();
      loadSearchHistory();
      checkDataInitialization();
    }
  }, [visible]);

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
      if (!homeScreenData) return;

      const suggestions: string[] = [];
      const queryLower = searchQuery.toLowerCase();

      // Get suggestions from content sections
      homeScreenData.contentSections.forEach((section: any) => {
        if (section.title.toLowerCase().includes(queryLower)) {
          suggestions.push(section.title);
        }
        if (section.description.toLowerCase().includes(queryLower)) {
          suggestions.push(section.description);
        }
      });

      // Get suggestions from citizen features
      homeScreenData.citizenFeatures.forEach((category: any) => {
        if (category.category.toLowerCase().includes(queryLower)) {
          suggestions.push(category.category);
        }
        category.items.forEach((item: any) => {
          if (item.title.toLowerCase().includes(queryLower)) {
            suggestions.push(item.title);
          }
          if (item.description.toLowerCase().includes(queryLower)) {
            suggestions.push(item.description);
          }
        });
      });

      setSearchSuggestions(suggestions.slice(0, 8));
    } catch (error) {
      console.error('Failed to load search suggestions:', error);
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    if (!homeScreenData) {
      console.log('Home screen data not available');
      return;
    }

    try {
      setIsSearching(true);
      console.log('Searching home screen elements for:', searchQuery); // Debug log
      const results = await storageService.searchHomeScreenContent(searchQuery, homeScreenData);
      console.log('Home screen search results:', results); // Debug log
      setSearchResults(results);

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

  const toggleBookmark = async (result: SearchResult) => {
    try {
      const existingBookmark = bookmarks.find(b => b.itemId === result.id);

      if (existingBookmark) {
        await storageService.removeBookmark(existingBookmark.id);
        setBookmarks(bookmarks.filter(b => b.id !== existingBookmark.id));
      } else {
        const newBookmark: Bookmark = {
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

  const isBookmarked = (resultId: string) => {
    return bookmarks.some(b => b.itemId === resultId);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleHistoryPress = (query: string) => {
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

  const highlightText = (text: string, query: string) => {
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

  const getTypeIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      general: 'book.fill',
      emergency: 'exclamationmark.triangle.fill',
      travel: 'airplane',
      language: 'text.bubble.fill',
      law: 'scale.fill',
      cultural: 'heart.fill',
    };
    return iconMap[type] || 'doc.text.fill';
  };

  const getTypeColor = (type: string) => {
    const colorMap: { [key: string]: string } = {
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
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <ThemedView style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
            Quick Search
          </ThemedText>
          <ThemedView style={styles.placeholder} />
        </ThemedView>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >

          {/* Search Bar */}
          <ThemedView style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search home screen options..."
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
          <ThemedView style={[styles.resultsContainer, { backgroundColor: colors.card }]}>
            {isSearching ? (
              <ThemedView style={styles.loadingContainer}>
                <ThemedText style={{ color: colors.text }}>Searching...</ThemedText>
              </ThemedView>
            ) : searchResults.length === 0 && searchQuery.trim() ? (
              <ThemedView style={styles.emptyState}>
                <IconSymbol name="magnifyingglass" size={48} color={colors.textSecondary} />
                <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No results found for "{searchQuery}"
                </ThemedText>
              </ThemedView>
            ) : !homeScreenData ? (
              <ThemedView style={[styles.emptyState, { backgroundColor: colors.card }]}>
                <IconSymbol name="exclamationmark.triangle" size={48} color={colors.textSecondary} />
                <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Home screen data not available
                </ThemedText>
              </ThemedView>
            ) : searchResults.length === 0 ? (
              <ThemedView style={[styles.emptyState, { backgroundColor: colors.card }]}>
                <IconSymbol name="doc.text" size={48} color={colors.textSecondary} />
                <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Start typing to search home screen options
                </ThemedText>
              </ThemedView>
            ) : (
              <ThemedView style={styles.resultsList}>
                {searchResults.map((result, index) => (
                  <TouchableOpacity
                    key={`${result.searchType}-${index}`}
                    style={[styles.sectionCard, { backgroundColor: colors.card }]}
                    onPress={() => onResultPress?.(result)}
                  >
                    <ThemedView style={[
                      styles.sectionIconContainer,
                      { backgroundColor: `${result.color}15` }
                    ]}>
                      <IconSymbol
                        name={result.icon as any}
                        size={24}
                        color={result.color}
                      />
                    </ThemedView>
                    <ThemedView style={[styles.sectionContent, { backgroundColor: colors.card }]}>
                      <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
                        {highlightText(result.title, searchQuery)}
                      </ThemedText>
                      <ThemedText style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                        {highlightText(result.description, searchQuery)}
                      </ThemedText>
                    </ThemedView>
                    <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                ))}
              </ThemedView>
            )}
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
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
    justifyContent: 'flex-end',
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
  // Home screen card styles
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
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
  sectionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
  },
});
