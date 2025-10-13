import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, TAB_BAR_HEIGHT } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useScrollDetection } from '@/hooks/useScrollDetection';
import { storageService } from '@/services/storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function MoreScreen() {
    const { theme } = useTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const { handleScroll, resetScrollPosition } = useScrollDetection();
    const [isDataInitialized, setIsDataInitialized] = useState(false);

    useEffect(() => {
        checkDataInitialization();
        return () => {
            resetScrollPosition();
        };
    }, [resetScrollPosition]);

    const checkDataInitialization = async () => {
        try {
            const initialized = await storageService.isDataInitialized();
            setIsDataInitialized(initialized);
        } catch (error) {
            console.error('Failed to check data initialization:', error);
        }
    };

    const contentSections = [
        {
            title: 'General Knowledge',
            description: 'Learn about Pakistan\'s geography, demographics, and basic facts',
            icon: 'book.fill',
            color: colors.general,
            content: 'general',
            route: '../general-knowledge'
        },
        {
            title: 'Travel Guidance',
            description: 'Transportation, accommodation, and safety tips',
            icon: 'airplane',
            color: colors.travel,
            content: 'travel',
            route: '../travel-guidance'
        },
        {
            title: 'Language Phrases',
            description: 'Essential Urdu phrases for travelers',
            icon: 'text.bubble.fill',
            color: colors.language,
            content: 'language',
            route: '../language-phrases'
        },
        {
            title: 'Local Laws',
            description: 'Important laws and regulations to know',
            icon: 'scale.fill',
            color: colors.law,
            content: 'laws',
            route: '../local-laws'
        },
        {
            title: 'Cultural Facts',
            description: 'Learn about Pakistani culture and traditions',
            icon: 'heart.fill',
            color: colors.cultural,
            content: 'cultural',
            route: '../cultural-facts'
        },
        {
            title: 'Emergency Information',
            description: 'Quick access to emergency numbers and contacts',
            icon: 'exclamationmark.triangle.fill',
            color: colors.emergency,
            content: 'emergency',
            route: '../emergency-info'
        }
    ];

    const handleSectionPress = (route) => {
        if (isDataInitialized) {
            router.push(route);
        } else {
            Alert.alert('Data Required', 'Please initialize the Pakistan Guide data first to access content sections.');
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {/* Header */}
                    <ThemedView style={[styles.header, { backgroundColor: colors.cardHeader }]}>
                        <ThemedView style={[styles.headerContent, { backgroundColor: colors.cardHeader }]}>
                            <ThemedText type="title" style={[styles.title, { color: colors.tint }]}>
                                More
                            </ThemedText>
                            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                                Explore all Pakistan Guide content
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>

                    {/* Content Sections */}
                    <ThemedView style={[styles.sectionsContainer, { backgroundColor: colors.background }]}>
                        <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
                            Content Sections
                        </ThemedText>

                        <ThemedView style={[styles.sectionsGrid, { backgroundColor: colors.background }]}>
                            {contentSections.map((section, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.sectionCard, { backgroundColor: colors.card }]}
                                    onPress={() => handleSectionPress(section.route)}
                                    disabled={!isDataInitialized}
                                >
                                    <ThemedView style={[styles.sectionIconContainer, { backgroundColor: `${section.color}15` }]}>
                                        <IconSymbol
                                            name={section.icon}
                                            size={24}
                                            color={section.color}
                                        />
                                    </ThemedView>
                                    <ThemedView style={[styles.sectionContent, { backgroundColor: colors.card }]}>
                                        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
                                            {section.title}
                                        </ThemedText>
                                        <ThemedText style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                                            {section.description}
                                        </ThemedText>
                                    </ThemedView>
                                    <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
                                </TouchableOpacity>
                            ))}
                        </ThemedView>
                    </ThemedView>

                    {/* App Info */}
                    <ThemedView style={[styles.infoContainer, { backgroundColor: colors.card }]}>
                        <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
                            Pakistan Guide provides comprehensive offline information about Pakistan including general knowledge, emergency contacts, travel guidance, language phrases, local laws, and cultural facts.
                        </ThemedText>
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
    },
    headerContent: {
        flex: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
    sectionsContainer: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    sectionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    sectionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        width: '100%',
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
    sectionDescription: {
        fontSize: 14,
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
