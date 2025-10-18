import InteractiveChips from '@/components/InteractiveChips';
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

export default function TravelGuidanceScreen() {
    const { theme } = useTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const { handleScroll, resetScrollPosition } = useScrollDetection();
    const { getDataByType, isDataLoaded } = useData();

    const travelGuidance = getDataByType('travel');

    useEffect(() => {
        return () => {
            resetScrollPosition();
        };
    }, [resetScrollPosition]);

    const handleItemPress = (item) => {
        router.push({
            pathname: '../content-detail',
            params: {
                type: 'travel',
                id: item.id,
                title: item.title,
                content: item.description,
                category: item.category,
                location: item.location,
                tips: item.tips.join('|'),
                coordinates: item.coordinates ? `${item.coordinates.latitude},${item.coordinates.longitude}` : ''
            }
        });
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'transport':
                return 'car.fill';
            case 'accommodation':
                return 'bed.double.fill';
            case 'attractions':
                return 'camera.fill';
            case 'safety':
                return 'shield.fill';
            case 'tips':
                return 'lightbulb.fill';
            default:
                return 'airplane';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'transport':
                return colors.tint;
            case 'accommodation':
                return colors.travel;
            case 'attractions':
                return colors.cultural;
            case 'safety':
                return colors.emergency;
            case 'tips':
                return colors.fire;
            default:
                return colors.textSecondary;
        }
    };

    // Group travel guidance by category
    const transportItems = travelGuidance.filter(item => item.category === 'transport');
    const accommodationItems = travelGuidance.filter(item => item.category === 'accommodation');
    const attractionItems = travelGuidance.filter(item => item.category === 'attractions');
    const safetyItems = travelGuidance.filter(item => item.category === 'safety');
    const tipItems = travelGuidance.filter(item => item.category === 'tips');

    if (!isDataLoaded) {
        return (
            <>
                <Stack.Screen options={{ headerShown: false }} />
                <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
                    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
                        <ThemedView style={styles.loadingContainer}>
                            <IconSymbol name="airplane" size={48} color={colors.travel} />
                            <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
                                Loading Travel Guidance...
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>
                </SafeAreaView>
            </>
        );
    }

    const renderCategorySection = (title, items, icon, color) => {
        if (items.length === 0) return null;

        return (
            <ThemedView key={title} style={[styles.categorySection, { backgroundColor: colors.background }]}>
                <ThemedView style={[styles.categoryHeader, { backgroundColor: colors.background }]}>
                    <IconSymbol name={icon} size={20} color={color} />
                    <ThemedText type="subtitle" style={[styles.categoryTitle, { color: colors.text }]}>
                        {title}
                    </ThemedText>
                </ThemedView>
                {items.map((item, index) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.itemCard, { backgroundColor: colors.card }]}
                        onPress={() => handleItemPress(item)}
                    >
                        <ThemedView style={[styles.itemIconContainer, { backgroundColor: `${color}15` }]}>
                            <IconSymbol
                                name={getCategoryIcon(item.category)}
                                size={20}
                                color={color}
                            />
                        </ThemedView>
                        <ThemedView style={[styles.itemContent, { backgroundColor: colors.card }]}>
                            <ThemedText style={[styles.itemTitle, { color: colors.text }]}>
                                {item.title}
                            </ThemedText>
                            {item.category === 'attractions' ? (
                                <InteractiveChips
                                    text={item.description.length > 120 ? `${item.description.substring(0, 120)}...` : item.description}
                                    terms={['Karakoram Highway', 'Hunza Valley', 'Lahore Fort', 'Mohenjo-daro', 'Skardu', 'Gilgit', 'Swat Valley', 'Murree', 'Naran', 'Kaghan', 'Fairy Meadows', 'Nanga Parbat', 'K2', 'Baltit Fort', 'Shalimar Gardens', 'Badshahi Mosque', 'Faisal Mosque', 'Minar-e-Pakistan']}
                                    icon="location.fill"
                                />
                            ) : (
                                <ThemedText style={[styles.itemDescription, { color: colors.textSecondary }]}>
                                    {item.description.length > 120 ? `${item.description.substring(0, 120)}...` : item.description}
                                </ThemedText>
                            )}
                            <ThemedView style={[styles.itemLocation, { backgroundColor: colors.card }]}>
                                <IconSymbol name="location" size={12} color={colors.textSecondary} />
                                <ThemedText style={[styles.locationText, { color: colors.textSecondary }]}>
                                    {item.location}
                                </ThemedText>
                            </ThemedView>
                            {item.tips.length > 0 && (
                                <ThemedView style={[styles.tipsPreview, { backgroundColor: colors.card }]}>
                                    <ThemedText style={[styles.tipsText, { color: colors.textSecondary }]}>
                                        💡 {item.tips.length} tip{item.tips.length > 1 ? 's' : ''} available
                                    </ThemedText>
                                </ThemedView>
                            )}
                        </ThemedView>
                        <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                ))}
            </ThemedView>
        );
    };

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
                            <ThemedText type="title" style={[styles.title, { color: colors.travel }]}>
                                Travel Guidance
                            </ThemedText>
                            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                                Transportation, accommodation, and safety tips
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        {/* Quick Stats */}
                        <ThemedView style={[styles.statsContainer, { backgroundColor: colors.card }]}>
                            <ThemedView style={[styles.statItem, { backgroundColor: colors.card }]}>
                                <ThemedText style={[styles.statNumber, { color: colors.travel }]}>
                                    {travelGuidance.length}
                                </ThemedText>
                                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                                    Travel Guides
                                </ThemedText>
                            </ThemedView>
                            <ThemedView style={[styles.statItem, { backgroundColor: colors.card }]}>
                                <ThemedText style={[styles.statNumber, { color: colors.tint }]}>
                                    {transportItems.length}
                                </ThemedText>
                                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                                    Transport
                                </ThemedText>
                            </ThemedView>
                            <ThemedView style={[styles.statItem, { backgroundColor: colors.card }]}>
                                <ThemedText style={[styles.statNumber, { color: colors.cultural }]}>
                                    {attractionItems.length}
                                </ThemedText>
                                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                                    Attractions
                                </ThemedText>
                            </ThemedView>
                        </ThemedView>

                        {/* Category Sections */}
                        {renderCategorySection('Transportation', transportItems, 'car.fill', colors.tint)}
                        {renderCategorySection('Accommodation', accommodationItems, 'bed.double.fill', colors.travel)}
                        {renderCategorySection('Attractions', attractionItems, 'camera.fill', colors.cultural)}
                        {renderCategorySection('Safety Tips', safetyItems, 'shield.fill', colors.emergency)}
                        {renderCategorySection('General Tips', tipItems, 'lightbulb.fill', colors.fire)}

                        {/* Travel Tips */}
                        <ThemedView style={[styles.tipsContainer, { backgroundColor: colors.card }]}>
                            <ThemedText type="subtitle" style={[styles.tipsTitle, { color: colors.text }]}>
                                General Travel Tips
                            </ThemedText>
                            <ThemedView style={[styles.tipsList, { backgroundColor: colors.card }]}>
                                <ThemedText style={[styles.tipItem, { color: colors.textSecondary }]}>
                                    • Always carry copies of important documents
                                </ThemedText>
                                <ThemedText style={[styles.tipItem, { color: colors.textSecondary }]}>
                                    • Check weather conditions before traveling to mountain areas
                                </ThemedText>
                                <ThemedText style={[styles.tipItem, { color: colors.textSecondary }]}>
                                    • Respect local customs and dress codes
                                </ThemedText>
                                <ThemedText style={[styles.tipItem, { color: colors.textSecondary }]}>
                                    • Keep emergency contacts saved in your phone
                                </ThemedText>
                                <ThemedText style={[styles.tipItem, { color: colors.textSecondary }]}>
                                    • Book accommodations in advance during peak season
                                </ThemedText>
                            </ThemedView>
                        </ThemedView>

                        {/* Info Footer */}
                        <ThemedView style={[styles.infoContainer, { backgroundColor: colors.card }]}>
                            <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
                                Tap on any guide to read detailed information, tips, and location details. All information is available offline.
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
    categorySection: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    itemIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
        marginBottom: 6,
    },
    itemLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    locationText: {
        fontSize: 12,
        marginLeft: 4,
    },
    tipsPreview: {
        marginTop: 4,
    },
    tipsText: {
        fontSize: 12,
        fontStyle: 'italic',
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
