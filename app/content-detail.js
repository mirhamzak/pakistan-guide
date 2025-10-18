import InteractiveChips from '@/components/InteractiveChips';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, TAB_BAR_HEIGHT } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Linking, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ContentDetailScreen() {
    const { theme } = useTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const params = useLocalSearchParams();

    const {
        type,
        id,
        title,
        content,
        category,
        tags,
        lastUpdated,
        phoneNumber,
        priority,
        location,
        coordinates,
        tips,
        romanized,
        difficulty,
        audioUrl,
        severity,
        applicableTo,
        region,
        importance,
        relatedFacts
    } = params;

    const handleCall = async (phoneNumber) => {
        try {
            const url = `tel:${phoneNumber}`;
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', 'Cannot make phone calls on this device');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to make phone call');
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'general':
                return 'book.fill';
            case 'emergency':
                return 'exclamationmark.triangle.fill';
            case 'travel':
                return 'airplane';
            case 'language':
                return 'text.bubble.fill';
            case 'law':
                return 'scale.fill';
            case 'cultural':
                return 'heart.fill';
            default:
                return 'info.circle.fill';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'general':
                return colors.general;
            case 'emergency':
                return colors.emergency;
            case 'travel':
                return colors.travel;
            case 'language':
                return colors.language;
            case 'law':
                return colors.law;
            case 'cultural':
                return colors.cultural;
            default:
                return colors.tint;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return colors.emergency;
            case 'medium':
                return colors.fire;
            case 'low':
                return colors.textSecondary;
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

    const getImportanceColor = (importance) => {
        switch (importance) {
            case 'high':
                return colors.emergency;
            case 'medium':
                return colors.fire;
            case 'low':
                return colors.textSecondary;
            default:
                return colors.textSecondary;
        }
    };

    const tipsArray = tips ? tips.split('|') : [];
    const tagsArray = tags ? tags.split(', ') : [];
    const relatedFactsArray = relatedFacts ? relatedFacts.split(',') : [];

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
                            <ThemedView style={[styles.titleContainer, { backgroundColor: colors.cardHeader }]}>
                                <IconSymbol
                                    name={getTypeIcon(type)}
                                    size={24}
                                    color={getTypeColor(type)}
                                />
                                <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
                                    {title}
                                </ThemedText>
                            </ThemedView>
                            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                                {category?.toString().charAt(0).toUpperCase() + category?.toString().slice(1)}
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        {/* Content */}
                        <ThemedView style={[styles.contentContainer, { backgroundColor: colors.background }]}>
                            <ThemedView style={[styles.contentCard, { backgroundColor: colors.card }]}>
                                {type === 'travel' && category === 'attractions' ? (
                                    <InteractiveChips
                                        text={content}
                                        terms={['Karakoram Highway', 'Hunza Valley', 'Lahore Fort', 'Mohenjo-daro', 'Skardu', 'Gilgit', 'Swat Valley', 'Murree', 'Naran', 'Kaghan', 'Fairy Meadows', 'Nanga Parbat', 'K2', 'Baltit Fort', 'Shalimar Gardens', 'Badshahi Mosque', 'Faisal Mosque', 'Minar-e-Pakistan', 'Taxila', 'Harappa', 'Multan', 'Peshawar', 'Quetta', 'Karachi', 'Islamabad', 'Rawalpindi']}
                                        icon="location.fill"
                                    />
                                ) : (
                                    <ThemedText style={[styles.contentText, { color: colors.text }]}>
                                        {content}
                                    </ThemedText>
                                )}
                            </ThemedView>

                            {/* Language-specific content */}
                            {type === 'language' && romanized && (
                                <ThemedView style={[styles.languageCard, { backgroundColor: colors.card }]}>
                                    <ThemedText style={[styles.languageLabel, { color: colors.textSecondary }]}>
                                        Pronunciation
                                    </ThemedText>
                                    <ThemedText style={[styles.romanizedText, { color: colors.tint }]}>
                                        {romanized}
                                    </ThemedText>
                                </ThemedView>
                            )}

                            {/* Emergency-specific content */}
                            {type === 'emergency' && phoneNumber && (
                                <TouchableOpacity
                                    style={[styles.callButton, { backgroundColor: colors.emergency }]}
                                    onPress={() => handleCall(phoneNumber)}
                                >
                                    <IconSymbol name="phone.fill" size={20} color="#fff" />
                                    <ThemedText style={styles.callButtonText}>
                                        Call {phoneNumber}
                                    </ThemedText>
                                </TouchableOpacity>
                            )}

                            {/* Travel-specific content */}
                            {type === 'travel' && location && (
                                <ThemedView style={[styles.locationCard, { backgroundColor: colors.card }]}>
                                    <IconSymbol name="location" size={16} color={colors.textSecondary} />
                                    <ThemedText style={[styles.locationText, { color: colors.textSecondary }]}>
                                        {location}
                                    </ThemedText>
                                </ThemedView>
                            )}

                            {/* Tips */}
                            {tipsArray.length > 0 && (
                                <ThemedView style={[styles.tipsCard, { backgroundColor: colors.card }]}>
                                    <ThemedText type="subtitle" style={[styles.tipsTitle, { color: colors.text }]}>
                                        Tips
                                    </ThemedText>
                                    {tipsArray.map((tip, index) => (
                                        <ThemedText key={index} style={[styles.tipItem, { color: colors.textSecondary }]}>
                                            • {tip}
                                        </ThemedText>
                                    ))}
                                </ThemedView>
                            )}

                            {/* Tags */}
                            {tagsArray.length > 0 && (
                                <ThemedView style={[styles.tagsCard, { backgroundColor: colors.card }]}>
                                    <ThemedText type="subtitle" style={[styles.tagsTitle, { color: colors.text }]}>
                                        Tags
                                    </ThemedText>
                                    <ThemedView style={[styles.tagsContainer, { backgroundColor: colors.card }]}>
                                        {tagsArray.map((tag, index) => (
                                            <ThemedView key={index} style={[styles.tag, { backgroundColor: colors.surface }]}>
                                                <ThemedText style={[styles.tagText, { color: colors.textSecondary }]}>
                                                    {tag}
                                                </ThemedText>
                                            </ThemedView>
                                        ))}
                                    </ThemedView>
                                </ThemedView>
                            )}

                            {/* Additional Information */}
                            <ThemedView style={[styles.infoCard, { backgroundColor: colors.card }]}>
                                <ThemedText type="subtitle" style={[styles.infoTitle, { color: colors.text }]}>
                                    Additional Information
                                </ThemedText>

                                {priority && (
                                    <ThemedView style={[styles.infoRow, { backgroundColor: colors.card }]}>
                                        <ThemedText style={[styles.infoLabel, { color: colors.textSecondary }]}>
                                            Priority:
                                        </ThemedText>
                                        <ThemedView style={[styles.priorityBadge, { backgroundColor: getPriorityColor(priority) }]}>
                                            <ThemedText style={styles.priorityText}>
                                                {priority.toString().toUpperCase()}
                                            </ThemedText>
                                        </ThemedView>
                                    </ThemedView>
                                )}

                                {severity && (
                                    <ThemedView style={[styles.infoRow, { backgroundColor: colors.card }]}>
                                        <ThemedText style={[styles.infoLabel, { color: colors.textSecondary }]}>
                                            Severity:
                                        </ThemedText>
                                        <ThemedView style={[styles.severityBadge, { backgroundColor: getSeverityColor(severity) }]}>
                                            <ThemedText style={styles.severityText}>
                                                {severity.toString().toUpperCase()}
                                            </ThemedText>
                                        </ThemedView>
                                    </ThemedView>
                                )}

                                {difficulty && (
                                    <ThemedView style={[styles.infoRow, { backgroundColor: colors.card }]}>
                                        <ThemedText style={[styles.infoLabel, { color: colors.textSecondary }]}>
                                            Difficulty:
                                        </ThemedText>
                                        <ThemedView style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(difficulty) }]}>
                                            <ThemedText style={styles.difficultyText}>
                                                {difficulty.toString().toUpperCase()}
                                            </ThemedText>
                                        </ThemedView>
                                    </ThemedView>
                                )}

                                {importance && (
                                    <ThemedView style={[styles.infoRow, { backgroundColor: colors.card }]}>
                                        <ThemedText style={[styles.infoLabel, { color: colors.textSecondary }]}>
                                            Importance:
                                        </ThemedText>
                                        <ThemedView style={[styles.importanceBadge, { backgroundColor: getImportanceColor(importance) }]}>
                                            <ThemedText style={styles.importanceText}>
                                                {importance.toString().toUpperCase()}
                                            </ThemedText>
                                        </ThemedView>
                                    </ThemedView>
                                )}

                                {applicableTo && (
                                    <ThemedView style={[styles.infoRow, { backgroundColor: colors.card }]}>
                                        <ThemedText style={[styles.infoLabel, { color: colors.textSecondary }]}>
                                            Applicable To:
                                        </ThemedText>
                                        <ThemedText style={[styles.infoValue, { color: colors.text }]}>
                                            {applicableTo}
                                        </ThemedText>
                                    </ThemedView>
                                )}

                                {region && (
                                    <ThemedView style={[styles.infoRow, { backgroundColor: colors.card }]}>
                                        <ThemedText style={[styles.infoLabel, { color: colors.textSecondary }]}>
                                            Region:
                                        </ThemedText>
                                        <ThemedText style={[styles.infoValue, { color: colors.text }]}>
                                            {region}
                                        </ThemedText>
                                    </ThemedView>
                                )}

                                {lastUpdated && (
                                    <ThemedView style={[styles.infoRow, { backgroundColor: colors.card }]}>
                                        <ThemedText style={[styles.infoLabel, { color: colors.textSecondary }]}>
                                            Last Updated:
                                        </ThemedText>
                                        <ThemedText style={[styles.infoValue, { color: colors.text }]}>
                                            {new Date(lastUpdated).toLocaleDateString()}
                                        </ThemedText>
                                    </ThemedView>
                                )}
                            </ThemedView>

                            {/* Related Facts */}
                            {relatedFactsArray.length > 0 && (
                                <ThemedView style={[styles.relatedCard, { backgroundColor: colors.card }]}>
                                    <ThemedText type="subtitle" style={[styles.relatedTitle, { color: colors.text }]}>
                                        Related Facts
                                    </ThemedText>
                                    {relatedFactsArray.map((factId, index) => (
                                        <ThemedText key={index} style={[styles.relatedItem, { color: colors.textSecondary }]}>
                                            • {factId}
                                        </ThemedText>
                                    ))}
                                </ThemedView>
                            )}
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
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 8,
        flex: 1,
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
    contentCard: {
        padding: 16,
        borderRadius: 12,
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
    contentText: {
        fontSize: 16,
        lineHeight: 24,
    },
    languageCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        backgroundColor: '#f8f9fa',
    },
    languageLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    romanizedText: {
        fontSize: 18,
        fontStyle: 'italic',
        fontWeight: '500',
    },
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    callButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    locationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#f8f9fa',
    },
    locationText: {
        fontSize: 14,
        marginLeft: 8,
    },
    tipsCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        backgroundColor: '#f8f9fa',
    },
    tipsTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    tipItem: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 6,
    },
    tagsCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    tagsTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '500',
    },
    infoCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    priorityText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    severityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    severityText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    difficultyText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    importanceBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    importanceText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    relatedCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: TAB_BAR_HEIGHT,
    },
    relatedTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    relatedItem: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 6,
    },
});
