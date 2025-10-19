import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, TAB_BAR_HEIGHT } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { storageService } from '@/services/storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavouritesScreen() {
    const { theme } = useTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const [bookmarks, setBookmarks] = useState([]);
    const [filteredBookmarks, setFilteredBookmarks] = useState([]);
    const [selectedType, setSelectedType] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookmarks();
    }, []);

    // Refresh bookmarks when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadBookmarks();
        }, [])
    );

    useEffect(() => {
        filterBookmarks();
    }, [bookmarks, selectedType]);

    const loadBookmarks = async () => {
        try {
            const userBookmarks = await storageService.getBookmarks();
            setBookmarks(userBookmarks);
        } catch (error) {
            console.error('Failed to load bookmarks:', error);
            Alert.alert('Error', 'Failed to load bookmarks');
        } finally {
            setLoading(false);
        }
    };

    const filterBookmarks = () => {
        let filtered = bookmarks;

        if (selectedType !== 'all') {
            filtered = filtered.filter(bookmark => bookmark.itemType === selectedType);
        }

        // Sort by creation date (newest first)
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setFilteredBookmarks(filtered);
    };

    const removeBookmark = async (bookmarkId) => {
        try {
            await storageService.removeBookmark(bookmarkId);
            setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
            Alert.alert('Success', 'Bookmark removed');
        } catch (error) {
            console.error('Failed to remove bookmark:', error);
            Alert.alert('Error', 'Failed to remove bookmark');
        }
    };

    const handleBookmarkPress = (bookmark) => {
        console.log('Bookmark pressed:', bookmark); // Debug log
        
        // Map bookmark types to their corresponding routes
        const routeMap = {
            general: '../general-knowledge',
            emergency: '../emergency-info',
            travel: '../travel-guidance',
            language: '../language-phrases',
            law: '../local-laws',
            cultural: '../cultural-facts',
        };

        const route = routeMap[bookmark.itemType];
        if (route) {
            // This is a content section bookmark (from search or home screen)
            console.log('Navigating to content section:', route);
            router.push(route);
        } else if (bookmark.url) {
            // Handle citizen features based on their URL
            console.log('Processing URL:', bookmark.url); // Debug log
            
            if (bookmark.url.startsWith('http')) {
                // Open web URL
                console.log('Opening web URL:', bookmark.url);
                Linking.openURL(bookmark.url).catch(err => {
                    console.error('Failed to open URL:', err);
                    Alert.alert('Error', 'Failed to open link');
                });
            } else if (bookmark.url.startsWith('tel:')) {
                // Make phone call
                const phoneNumber = bookmark.url.replace('tel:', '');
                console.log('Making call to:', phoneNumber);
                Linking.openURL(`tel:${phoneNumber}`).catch(err => {
                    console.error('Failed to make call:', err);
                    Alert.alert('Error', 'Failed to make call');
                });
            } else {
                // Navigate to internal route
                console.log('Navigating to internal route:', bookmark.url);
                router.push(bookmark.url);
            }
        } else {
            // No URL and no route mapping, navigate to home screen
            console.log('No URL or route mapping found, navigating to home screen');
            router.push('/(tabs)/');
        }
    };

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

    const getTypes = () => {
        const types = ['all', ...new Set(bookmarks.map(bookmark => bookmark.itemType))];
        return types;
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
                <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
                    <ThemedText style={{ color: colors.text }}>Loading bookmarks...</ThemedText>
                </ThemedView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <ThemedView style={[styles.header, { backgroundColor: colors.cardHeader, borderBottomColor: colors.border }]}>
                        <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
                            Favourites
                        </ThemedText>
                        <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Your saved items from Pakistan Guide
                        </ThemedText>
                    </ThemedView>

                    {/* Type Filter */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
                        {getTypes().map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.filterButton,
                                    { backgroundColor: colors.card, borderColor: colors.border },
                                    selectedType === type && { backgroundColor: colors.tint, borderColor: colors.tint }
                                ]}
                                onPress={() => setSelectedType(type)}
                            >
                                <IconSymbol
                                    name={getTypeIcon(type)}
                                    size={16}
                                    color={selectedType === type ? '#fff' : getTypeColor(type)}
                                    style={styles.filterIcon}
                                />
                                <ThemedText
                                    style={[
                                        styles.filterText,
                                        { color: selectedType === type ? '#fff' : colors.textSecondary }
                                    ]}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Bookmarks */}
                    <ThemedView style={[styles.contentContainer, { backgroundColor: colors.background }]}>
                        {filteredBookmarks.length === 0 ? (
                            <ThemedView style={[styles.emptyState, { backgroundColor: colors.background }]}>
                                <IconSymbol name="bookmark" size={48} color={colors.textSecondary} />
                                <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                                    {bookmarks.length === 0
                                        ? 'No bookmarks yet'
                                        : 'No bookmarks found for this category'
                                    }
                                </ThemedText>
                                {bookmarks.length === 0 && (
                                    <ThemedText style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                                        Bookmark items by tapping the bookmark icon in search results
                                    </ThemedText>
                                )}
                            </ThemedView>
                        ) : (
                            filteredBookmarks.map((bookmark) => (
                                <TouchableOpacity
                                    key={bookmark.id}
                                    style={[styles.bookmarkCard, { backgroundColor: colors.card }]}
                                    onPress={() => handleBookmarkPress(bookmark)}
                                    activeOpacity={0.7}
                                >
                                    <ThemedView style={[styles.cardHeader, { backgroundColor: colors.card }]}>
                                        <ThemedView style={[styles.cardHeaderLeft, { backgroundColor: colors.card }]}>
                                            <IconSymbol
                                                name={getTypeIcon(bookmark.itemType)}
                                                size={20}
                                                color={getTypeColor(bookmark.itemType)}
                                                style={styles.typeIcon}
                                            />
                                            <ThemedView style={[styles.cardTitleContainer, { backgroundColor: colors.card }]}>
                                                <ThemedText type="subtitle" style={[styles.cardTitle, { color: colors.text }]}>
                                                    {bookmark.title}
                                                </ThemedText>
                                                <ThemedText style={[styles.cardType, { color: colors.textSecondary }]}>
                                                    {bookmark.itemType.charAt(0).toUpperCase() + bookmark.itemType.slice(1)}
                                                </ThemedText>
                                            </ThemedView>
                                        </ThemedView>

                                        <TouchableOpacity
                                            onPress={(e) => {
                                                e.stopPropagation(); // Prevent triggering the parent onPress
                                                removeBookmark(bookmark.id);
                                            }}
                                            style={[styles.removeButton, { backgroundColor: colors.card }]}
                                        >
                                            <IconSymbol name="trash" size={16} color="#FF3B30" />
                                        </TouchableOpacity>
                                    </ThemedView>

                                    <ThemedView style={[styles.cardFooter, { backgroundColor: colors.card }]}>
                                        <ThemedText style={[styles.createdDate, { color: colors.textSecondary }]}>
                                            Saved on {new Date(bookmark.createdAt).toLocaleDateString()}
                                        </ThemedText>
                                        <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
                                    </ThemedView>
                                </TouchableOpacity>
                            ))
                        )}
                    </ThemedView>

                    {/* Quick Stats */}
                    {bookmarks.length > 0 && (
                        <ThemedView style={[styles.statsContainer, { backgroundColor: colors.card }]}>
                            <ThemedText type="subtitle" style={[styles.statsTitle, { color: colors.text }]}>
                                Your Bookmarks
                            </ThemedText>

                            <ThemedView style={[styles.statsGrid, { backgroundColor: colors.card }]}>
                                {getTypes().slice(1).map((type) => {
                                    const count = bookmarks.filter(b => b.itemType === type).length;
                                    if (count === 0) return null;

                                    return (
                                        <ThemedView key={type} style={[styles.statItem, { backgroundColor: colors.surface }]}>
                                            <IconSymbol
                                                name={getTypeIcon(type)}
                                                size={16}
                                                color={getTypeColor(type)}
                                            />
                                            <ThemedText style={[styles.statText, { color: colors.text }]}>
                                                {count} {type}
                                            </ThemedText>
                                        </ThemedView>
                                    );
                                })}
                            </ThemedView>
                        </ThemedView>
                    )}
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
    filterContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    filterIcon: {
        marginRight: 6,
    },
    filterText: {
        fontSize: 14,
    },
    contentContainer: {
        padding: 16,
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
    emptySubtext: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    bookmarkCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    typeIcon: {
        marginRight: 12,
    },
    cardTitleContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    cardType: {
        fontSize: 12,
    },
    removeButton: {
        padding: 8,
        borderRadius: 6,
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    createdDate: {
        fontSize: 12,
    },
    statsContainer: {
        padding: 16,
        marginHorizontal: 16,
        marginBottom: "20%",
        borderRadius: 12,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    statText: {
        fontSize: 12,
        marginLeft: 6,
    },
});