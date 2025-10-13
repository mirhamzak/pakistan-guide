import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, TAB_BAR_HEIGHT } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useScrollDetection } from '@/hooks/useScrollDetection';
import { storageService } from '@/services/storage';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function GeneralKnowledgeScreen() {
    const { theme } = useTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const { handleScroll, resetScrollPosition } = useScrollDetection();
    const [generalKnowledge, setGeneralKnowledge] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGeneralKnowledge();
        return () => {
            resetScrollPosition();
        };
    }, [resetScrollPosition]);

    const loadGeneralKnowledge = async () => {
        try {
            setLoading(true);
            const data = await storageService.getAppData();
            if (data?.generalKnowledge) {
                setGeneralKnowledge(data.generalKnowledge);
            }
        } catch (error) {
            console.error('Failed to load general knowledge:', error);
            Alert.alert('Error', 'Failed to load general knowledge data');
        } finally {
            setLoading(false);
        }
    };

    const handleItemPress = (item) => {
        router.push({
            pathname: '../content-detail',
            params: {
                type: 'general',
                id: item.id,
                title: item.title,
                content: item.content,
                category: item.category,
                tags: item.tags.join(', '),
                lastUpdated: item.lastUpdated
            }
        });
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'geography':
                return 'globe';
            case 'cities':
                return 'building.2';
            case 'demographics':
                return 'person.3';
            case 'language':
                return 'text.bubble';
            case 'economy':
                return 'dollarsign.circle';
            default:
                return 'book';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'geography':
                return colors.tint;
            case 'cities':
                return colors.general;
            case 'demographics':
                return colors.cultural;
            case 'language':
                return colors.language;
            case 'economy':
                return colors.travel;
            default:
                return colors.textSecondary;
        }
    };

    if (loading) {
        return (
            <>
                <Stack.Screen options={{ headerShown: false }} />
                <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
                    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
                        <ThemedView style={styles.loadingContainer}>
                            <IconSymbol name="book" size={48} color={colors.textSecondary} />
                            <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
                                Loading General Knowledge...
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>
                </SafeAreaView>
            </>
        );
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
                <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
                    {/* Header */}
                    <ThemedView style={[styles.header, { backgroundColor: colors.cardHeader }]}>
                        <TouchableOpacity
                            style={[styles.backButton, { backgroundColor: colors.surface }]}
                            onPress={() => router.back()}
                        >
                            <IconSymbol name="chevron.left" size={24} color={colors.tint} />
                        </TouchableOpacity>
                        <ThemedView style={[styles.headerContent, { backgroundColor: colors.cardHeader }]}>
                            <ThemedText type="title" style={[styles.title, { color: colors.tint }]}>
                                General Knowledge
                            </ThemedText>
                            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                                Learn about Pakistan's geography, demographics, and basic facts
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        {/* Content Items */}
                        <ThemedView style={[styles.contentContainer, { backgroundColor: colors.background }]}>
                            {generalKnowledge.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.itemCard, { backgroundColor: colors.card }]}
                                    onPress={() => handleItemPress(item)}
                                >
                                    <ThemedView style={[styles.itemIconContainer, { backgroundColor: `${getCategoryColor(item.category)}15` }]}>
                                        <IconSymbol
                                            name={getCategoryIcon(item.category)}
                                            size={24}
                                            color={getCategoryColor(item.category)}
                                        />
                                    </ThemedView>
                                    <ThemedView style={[styles.itemContent, { backgroundColor: colors.card }]}>
                                        <ThemedText style={[styles.itemTitle, { color: colors.text }]}>
                                            {item.title}
                                        </ThemedText>
                                        <ThemedText style={[styles.itemDescription, { color: colors.textSecondary }]}>
                                            {item.content.length > 100 ? `${item.content.substring(0, 100)}...` : item.content}
                                        </ThemedText>
                                        <ThemedView style={[styles.itemTags, { backgroundColor: colors.card }]}>
                                            {item.tags.slice(0, 3).map((tag, tagIndex) => (
                                                <ThemedView key={tagIndex} style={[styles.tag, { backgroundColor: colors.surface }]}>
                                                    <ThemedText style={[styles.tagText, { color: colors.textSecondary }]}>
                                                        {tag}
                                                    </ThemedText>
                                                </ThemedView>
                                            ))}
                                        </ThemedView>
                                    </ThemedView>
                                    <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
                                </TouchableOpacity>
                            ))}
                        </ThemedView>

                        {/* Info Footer */}
                        <ThemedView style={[styles.infoContainer, { backgroundColor: colors.card }]}>
                            <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
                                Tap on any item to read the full content. This information is available offline and regularly updated.
                            </ThemedText>
                        </ThemedView>
                    </ScrollView>
                </ThemedView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        marginTop: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        marginRight: 12,
    },
    headerContent: {
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
    },
    itemCard: {
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
    itemIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    itemTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 4,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '500',
    },
    infoContainer: {
        padding: 16,
        margin: 16,
        borderRadius: 12,
        marginBottom: TAB_BAR_HEIGHT,
    },
    infoText: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
    },
});
