import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, TAB_BAR_HEIGHT } from '@/constants/colors';
import { useData } from '@/contexts/DataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useScrollDetection } from '@/hooks/useScrollDetection';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LocalLawsScreen() {
    const { theme } = useTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const { handleScroll, resetScrollPosition } = useScrollDetection();
    const { getDataByType, isDataLoaded } = useData();
    const [selectedCategory, setSelectedCategory] = useState(null);

    const localLaws = getDataByType('law');

    useEffect(() => {
        return () => {
            resetScrollPosition();
        };
    }, [resetScrollPosition]);

    const handleItemPress = (item) => {
        router.push({
            pathname: '../content-detail',
            params: {
                type: 'law',
                id: item.id,
                title: item.title,
                content: item.description,
                category: item.category,
                severity: item.severity,
                applicableTo: item.applicableTo,
                lastUpdated: item.lastUpdated
            }
        });
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'traffic':
                return 'car.fill';
            case 'public':
                return 'person.3.fill';
            case 'business':
                return 'building.2.fill';
            case 'cultural':
                return 'heart.fill';
            case 'safety':
                return 'shield.fill';
            default:
                return 'scale.fill';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'traffic':
                return colors.tint;
            case 'public':
                return colors.general;
            case 'business':
                return colors.travel;
            case 'cultural':
                return colors.cultural;
            case 'safety':
                return colors.emergency;
            default:
                return colors.textSecondary;
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'warning':
                return colors.fire;
            case 'fine':
                return colors.travel;
            case 'arrest':
                return colors.emergency;
            case 'deportation':
                return colors.emergency;
            default:
                return colors.textSecondary;
        }
    };

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case 'warning':
                return 'exclamationmark.triangle';
            case 'fine':
                return 'dollarsign.circle';
            case 'arrest':
                return 'handcuffs';
            case 'deportation':
                return 'airplane.departure';
            default:
                return 'info.circle';
        }
    };

    // Get unique categories
    const categories = Array.from(new Set(localLaws.map(item => item.category)));

    // Filter laws by selected category
    const filteredLaws = selectedCategory
        ? localLaws.filter(item => item.category === selectedCategory)
        : localLaws;

    if (!isDataLoaded) {
        return (
            <>
                <Stack.Screen options={{ headerShown: false }} />
                <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
                    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
                        <ThemedView style={styles.loadingContainer}>
                            <IconSymbol name="scale.fill" size={48} color={colors.law} />
                            <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
                                Loading Local Laws...
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
                            <ThemedText type="title" style={[styles.title, { color: colors.law }]}>
                                Local Laws
                            </ThemedText>
                            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                                Important laws and regulations to know
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
                                        { backgroundColor: selectedCategory === null ? colors.law : colors.surface }
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
                                <ThemedText style={[styles.statNumber, { color: colors.law }]}>
                                    {localLaws.length}
                                </ThemedText>
                                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                                    Total Laws
                                </ThemedText>
                            </ThemedView>
                            <ThemedView style={[styles.statItem, { backgroundColor: colors.card }]}>
                                <ThemedText style={[styles.statNumber, { color: colors.emergency }]}>
                                    {localLaws.filter(l => l.severity === 'arrest' || l.severity === 'deportation').length}
                                </ThemedText>
                                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                                    Serious
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

                        {/* Laws List */}
                        <ThemedView style={[styles.contentContainer, { backgroundColor: colors.background }]}>
                            {filteredLaws.map((law, index) => (
                                <TouchableOpacity
                                    key={law.id}
                                    style={[styles.lawCard, { backgroundColor: colors.card }]}
                                    onPress={() => handleItemPress(law)}
                                >
                                    <ThemedView style={[styles.lawIconContainer, { backgroundColor: `${getCategoryColor(law.category)}15` }]}>
                                        <IconSymbol
                                            name={getCategoryIcon(law.category)}
                                            size={20}
                                            color={getCategoryColor(law.category)}
                                        />
                                    </ThemedView>
                                    <ThemedView style={[styles.lawContent, { backgroundColor: colors.card }]}>
                                        <ThemedView style={[styles.lawHeader, { backgroundColor: colors.card }]}>
                                            <ThemedText style={[styles.lawTitle, { color: colors.text }]}>
                                                {law.title}
                                            </ThemedText>
                                            <ThemedView style={[styles.severityBadge, { backgroundColor: getSeverityColor(law.severity) }]}>
                                                <IconSymbol
                                                    name={getSeverityIcon(law.severity)}
                                                    size={12}
                                                    color="#fff"
                                                />
                                                <ThemedText style={styles.severityText}>
                                                    {law.severity.toUpperCase()}
                                                </ThemedText>
                                            </ThemedView>
                                        </ThemedView>
                                        <ThemedText style={[styles.lawDescription, { color: colors.textSecondary }]}>
                                            {law.description.length > 120 ? `${law.description.substring(0, 120)}...` : law.description}
                                        </ThemedText>
                                        <ThemedView style={[styles.lawFooter, { backgroundColor: colors.card }]}>
                                            <ThemedView style={[styles.applicableTo, { backgroundColor: colors.surface }]}>
                                                <ThemedText style={[styles.applicableToText, { color: colors.textSecondary }]}>
                                                    {law.applicableTo}
                                                </ThemedText>
                                            </ThemedView>
                                            <ThemedText style={[styles.lastUpdated, { color: colors.textTertiary }]}>
                                                Updated: {new Date(law.lastUpdated).toLocaleDateString()}
                                            </ThemedText>
                                        </ThemedView>
                                    </ThemedView>
                                    <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
                                </TouchableOpacity>
                            ))}
                        </ThemedView>

                        {/* Important Notice */}
                        <ThemedView style={[styles.noticeContainer, { backgroundColor: colors.emergency + '15' }]}>
                            <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.emergency} />
                            <ThemedView style={[styles.noticeContent, { backgroundColor: 'transparent' }]}>
                                <ThemedText style={[styles.noticeTitle, { color: colors.emergency }]}>
                                    Important Notice
                                </ThemedText>
                                <ThemedText style={[styles.noticeText, { color: colors.text }]}>
                                    Laws and regulations may change. Always check with local authorities for the most current information.
                                    This guide provides general information and should not be considered legal advice.
                                </ThemedText>
                            </ThemedView>
                        </ThemedView>

                        {/* Info Footer */}
                        <ThemedView style={[styles.infoContainer, { backgroundColor: colors.card }]}>
                            <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
                                Tap on any law to read detailed information. Always consult official sources for the most current legal information.
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
    lawCard: {
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
    lawIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    lawContent: {
        flex: 1,
    },
    lawHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    lawTitle: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    severityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginLeft: 8,
    },
    severityText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    lawDescription: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    lawFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    applicableTo: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    applicableToText: {
        fontSize: 12,
        fontWeight: '500',
    },
    lastUpdated: {
        fontSize: 11,
    },
    noticeContainer: {
        flexDirection: 'row',
        padding: 16,
        margin: 16,
        borderRadius: 12,
        alignItems: 'flex-start',
    },
    noticeContent: {
        flex: 1,
        marginLeft: 12,
    },
    noticeTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    noticeText: {
        fontSize: 14,
        lineHeight: 20,
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
