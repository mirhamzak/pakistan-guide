import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, TAB_BAR_HEIGHT } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useScrollDetection } from '@/hooks/useScrollDetection';
import { storageService } from '@/services/storage';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LanguagePhrasesScreen() {
    const { theme } = useTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const { handleScroll, resetScrollPosition } = useScrollDetection();
    const [languagePhrases, setLanguagePhrases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        loadLanguagePhrases();
        return () => {
            resetScrollPosition();
        };
    }, [resetScrollPosition]);

    const loadLanguagePhrases = async () => {
        try {
            setLoading(true);
            const data = await storageService.getAppData();
            if (data?.languagePhrases) {
                setLanguagePhrases(data.languagePhrases);
            }
        } catch (error) {
            console.error('Failed to load language phrases:', error);
            Alert.alert('Error', 'Failed to load language phrases data');
        } finally {
            setLoading(false);
        }
    };

    const handleItemPress = (item) => {
        router.push({
            pathname: '../content-detail',
            params: {
                type: 'language',
                id: item.id,
                title: item.english,
                content: item.urdu,
                category: item.category,
                romanized: item.romanized,
                difficulty: item.difficulty,
                audioUrl: item.audioUrl || ''
            }
        });
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'greetings':
                return 'hand.wave.fill';
            case 'directions':
                return 'location.fill';
            case 'emergency':
                return 'exclamationmark.triangle.fill';
            case 'shopping':
                return 'cart.fill';
            case 'food':
                return 'fork.knife';
            case 'transport':
                return 'car.fill';
            case 'common':
                return 'text.bubble.fill';
            default:
                return 'text.bubble';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'greetings':
                return colors.tint;
            case 'directions':
                return colors.travel;
            case 'emergency':
                return colors.emergency;
            case 'shopping':
                return colors.fire;
            case 'food':
                return colors.cultural;
            case 'transport':
                return colors.general;
            case 'common':
                return colors.language;
            default:
                return colors.textSecondary;
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner':
                return colors.travel;
            case 'intermediate':
                return colors.fire;
            case 'advanced':
                return colors.emergency;
            default:
                return colors.textSecondary;
        }
    };

    // Get unique categories
    const categories = Array.from(new Set(languagePhrases.map(item => item.category)));

    // Filter phrases by selected category
    const filteredPhrases = selectedCategory
        ? languagePhrases.filter(item => item.category === selectedCategory)
        : languagePhrases;

    if (loading) {
        return (
            <>
                <Stack.Screen options={{ headerShown: false }} />
                <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
                    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
                        <ThemedView style={styles.loadingContainer}>
                            <IconSymbol name="text.bubble.fill" size={48} color={colors.language} />
                            <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
                                Loading Language Phrases...
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
                            <ThemedText type="title" style={[styles.title, { color: colors.language }]}>
                                Language Phrases
                            </ThemedText>
                            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                                Essential Urdu phrases for travelers
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        {/* Category Filter */}
                        <ThemedView style={[styles.categoryFilter, { backgroundColor: colors.background }]}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <TouchableOpacity
                                    style={[
                                        styles.categoryButton,
                                        { backgroundColor: selectedCategory === null ? colors.tint : colors.surface }
                                    ]}
                                    onPress={() => setSelectedCategory(null)}
                                >
                                    <ThemedText style={[
                                        styles.categoryButtonText,
                                        { color: selectedCategory === null ? '#fff' : colors.text }
                                    ]}>
                                        All
                                    </ThemedText>
                                </TouchableOpacity>
                                {categories.map((category, index) => (
                                    <TouchableOpacity
                                        key={category}
                                        style={[
                                            styles.categoryButton,
                                            { backgroundColor: selectedCategory === category ? getCategoryColor(category) : colors.surface }
                                        ]}
                                        onPress={() => setSelectedCategory(category)}
                                    >
                                        <ThemedText style={[
                                            styles.categoryButtonText,
                                            { color: selectedCategory === category ? '#fff' : colors.text }
                                        ]}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </ThemedText>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </ThemedView>

                        {/* Quick Stats */}
                        <ThemedView style={[styles.statsContainer, { backgroundColor: colors.card }]}>
                            <ThemedView style={[styles.statItem, { backgroundColor: colors.card }]}>
                                <ThemedText style={[styles.statNumber, { color: colors.language }]}>
                                    {languagePhrases.length}
                                </ThemedText>
                                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                                    Total Phrases
                                </ThemedText>
                            </ThemedView>
                            <ThemedView style={[styles.statItem, { backgroundColor: colors.card }]}>
                                <ThemedText style={[styles.statNumber, { color: colors.travel }]}>
                                    {languagePhrases.filter(p => p.difficulty === 'beginner').length}
                                </ThemedText>
                                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                                    Beginner
                                </ThemedText>
                            </ThemedView>
                            <ThemedView style={[styles.statItem, { backgroundColor: colors.card }]}>
                                <ThemedText style={[styles.statNumber, { color: colors.cultural }]}>
                                    {categories.length}
                                </ThemedText>
                                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                                    Categories
                                </ThemedText>
                            </ThemedView>
                        </ThemedView>

                        {/* Phrases List */}
                        <ThemedView style={[styles.contentContainer, { backgroundColor: colors.background }]}>
                            {filteredPhrases.map((phrase, index) => (
                                <TouchableOpacity
                                    key={phrase.id}
                                    style={[styles.phraseCard, { backgroundColor: colors.card }]}
                                    onPress={() => handleItemPress(phrase)}
                                >
                                    <ThemedView style={[styles.phraseIconContainer, { backgroundColor: `${getCategoryColor(phrase.category)}15` }]}>
                                        <IconSymbol
                                            name={getCategoryIcon(phrase.category)}
                                            size={20}
                                            color={getCategoryColor(phrase.category)}
                                        />
                                    </ThemedView>
                                    <ThemedView style={[styles.phraseContent, { backgroundColor: colors.card }]}>
                                        <ThemedView style={[styles.phraseHeader, { backgroundColor: colors.card }]}>
                                            <ThemedText style={[styles.englishText, { color: colors.text }]}>
                                                {phrase.english}
                                            </ThemedText>
                                            <ThemedView style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(phrase.difficulty) }]}>
                                                <ThemedText style={styles.difficultyText}>
                                                    {phrase.difficulty.toUpperCase()}
                                                </ThemedText>
                                            </ThemedView>
                                        </ThemedView>
                                        <ThemedText style={[styles.urduText, { color: colors.tint }]}>
                                            {phrase.urdu}
                                        </ThemedText>
                                        <ThemedText style={[styles.romanizedText, { color: colors.textSecondary }]}>
                                            {phrase.romanized}
                                        </ThemedText>
                                        <ThemedView style={[styles.categoryTag, { backgroundColor: colors.surface }]}>
                                            <ThemedText style={[styles.categoryTagText, { color: colors.textSecondary }]}>
                                                {phrase.category}
                                            </ThemedText>
                                        </ThemedView>
                                    </ThemedView>
                                    <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
                                </TouchableOpacity>
                            ))}
                        </ThemedView>

                        {/* Learning Tips */}
                        <ThemedView style={[styles.tipsContainer, { backgroundColor: colors.card }]}>
                            <ThemedText type="subtitle" style={[styles.tipsTitle, { color: colors.text }]}>
                                Learning Tips
                            </ThemedText>
                            <ThemedView style={[styles.tipsList, { backgroundColor: colors.card }]}>
                                <ThemedText style={[styles.tipItem, { color: colors.textSecondary }]}>
                                    • Practice pronunciation with the romanized text
                                </ThemedText>
                                <ThemedText style={[styles.tipItem, { color: colors.textSecondary }]}>
                                    • Start with beginner phrases and gradually move up
                                </ThemedText>
                                <ThemedText style={[styles.tipItem, { color: colors.textSecondary }]}>
                                    • Use phrases in context when speaking with locals
                                </ThemedText>
                                <ThemedText style={[styles.tipItem, { color: colors.textSecondary }]}>
                                    • Don't worry about perfect pronunciation - locals appreciate the effort
                                </ThemedText>
                            </ThemedView>
                        </ThemedView>

                        {/* Info Footer */}
                        <ThemedView style={[styles.infoContainer, { backgroundColor: colors.card }]}>
                            <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
                                Tap on any phrase to see detailed information and pronunciation guide. All phrases are available offline.
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
    categoryFilter: {
        padding: 16,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    categoryButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 16,
        margin: 16,
        borderRadius: 12,
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        textAlign: 'center',
    },
    contentContainer: {
        padding: 16,
    },
    phraseCard: {
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
    phraseIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    phraseContent: {
        flex: 1,
    },
    phraseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    englishText: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginLeft: 8,
    },
    difficultyText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    urduText: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 2,
        textAlign: 'right',
    },
    romanizedText: {
        fontSize: 14,
        fontStyle: 'italic',
        marginBottom: 6,
    },
    categoryTag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryTagText: {
        fontSize: 12,
        fontWeight: '500',
    },
    tipsContainer: {
        padding: 16,
        margin: 16,
        borderRadius: 12,
    },
    tipsTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    tipsList: {
        marginLeft: 8,
    },
    tipItem: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 6,
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
