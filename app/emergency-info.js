import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, TAB_BAR_HEIGHT } from '@/constants/colors';
import { useData } from '@/contexts/DataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useScrollDetection } from '@/hooks/useScrollDetection';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EmergencyInfoScreen() {
    const { theme } = useTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const { handleScroll, resetScrollPosition } = useScrollDetection();
    const { getDataByType, isDataLoaded } = useData();

    const emergencyInfo = getDataByType('emergency');

    useEffect(() => {
        return () => {
            resetScrollPosition();
        };
    }, [resetScrollPosition]);

    const handleCall = async (phoneNumber, title) => {
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

    const handleItemPress = (item) => {
        router.push({
            pathname: '../content-detail',
            params: {
                type: 'emergency',
                id: item.id,
                title: item.title,
                content: item.description,
                category: item.category,
                phoneNumber: item.phoneNumber || '',
                priority: item.priority,
                location: item.location || ''
            }
        });
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'police':
                return 'shield.fill';
            case 'medical':
                return 'cross.fill';
            case 'fire':
                return 'flame.fill';
            case 'ambulance':
                return 'cross.case.fill';
            default:
                return 'phone.fill';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'police':
                return colors.emergency;
            case 'medical':
                return colors.medical;
            case 'fire':
                return colors.fire;
            case 'ambulance':
                return colors.emergency;
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

    // Group emergency info by priority
    const highPriorityItems = emergencyInfo.filter(item => item.priority === 'high');
    const mediumPriorityItems = emergencyInfo.filter(item => item.priority === 'medium');
    const lowPriorityItems = emergencyInfo.filter(item => item.priority === 'low');

    if (!isDataLoaded) {
        return (
            <>
                <Stack.Screen options={{ headerShown: false }} />
                <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
                    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
                        <ThemedView style={styles.loadingContainer}>
                            <IconSymbol name="exclamationmark.triangle.fill" size={48} color={colors.emergency} />
                            <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
                                Loading Emergency Information...
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
                            <ThemedText type="title" style={[styles.title, { color: colors.emergency }]}>
                                Emergency Information
                            </ThemedText>
                            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                                Quick access to emergency numbers and contacts
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        {/* High Priority Emergency Actions */}
                        {highPriorityItems.length > 0 && (
                            <ThemedView style={[styles.prioritySection, { backgroundColor: colors.background }]}>
                                <ThemedText type="subtitle" style={[styles.priorityTitle, { color: colors.emergency }]}>
                                    High Priority
                                </ThemedText>
                                <ThemedView style={[styles.emergencyGrid, { backgroundColor: colors.background }]}>
                                    {highPriorityItems.map((item, index) => (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={[styles.emergencyButton, { backgroundColor: getCategoryColor(item.category) }]}
                                            onPress={() => item.phoneNumber && handleCall(item.phoneNumber, item.title)}
                                        >
                                            <IconSymbol name={getCategoryIcon(item.category)} size={24} color="#fff" />
                                            <ThemedText style={styles.emergencyButtonTitle}>
                                                {item.title}
                                            </ThemedText>
                                            <ThemedText style={styles.emergencyButtonNumber}>
                                                {item.phoneNumber}
                                            </ThemedText>
                                        </TouchableOpacity>
                                    ))}
                                </ThemedView>
                            </ThemedView>
                        )}

                        {/* All Emergency Information */}
                        <ThemedView style={[styles.contentContainer, { backgroundColor: colors.background }]}>
                            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
                                All Emergency Contacts
                            </ThemedText>

                            {emergencyInfo.map((item, index) => (
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
                                        <ThemedView style={[styles.itemHeader, { backgroundColor: colors.card }]}>
                                            <ThemedText style={[styles.itemTitle, { color: colors.text }]}>
                                                {item.title}
                                            </ThemedText>
                                            <ThemedView style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
                                                <ThemedText style={styles.priorityText}>
                                                    {item.priority.toUpperCase()}
                                                </ThemedText>
                                            </ThemedView>
                                        </ThemedView>
                                        <ThemedText style={[styles.itemDescription, { color: colors.textSecondary }]}>
                                            {item.description}
                                        </ThemedText>
                                        {item.phoneNumber && (
                                            <ThemedText style={[styles.phoneNumber, { color: getCategoryColor(item.category) }]}>
                                                📞 {item.phoneNumber}
                                            </ThemedText>
                                        )}
                                        {item.location && (
                                            <ThemedText style={[styles.location, { color: colors.textSecondary }]}>
                                                📍 {item.location}
                                            </ThemedText>
                                        )}
                                    </ThemedView>
                                    <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
                                </TouchableOpacity>
                            ))}
                        </ThemedView>

                        {/* Emergency Tips */}
                        <ThemedView style={[styles.tipsContainer, { backgroundColor: colors.card }]}>
                            <ThemedText type="subtitle" style={[styles.tipsTitle, { color: colors.text }]}>
                                Emergency Tips
                            </ThemedText>
                            <ThemedView style={[styles.tipsList, { backgroundColor: colors.card }]}>
                                <ThemedText style={[styles.tipItem, { color: colors.textSecondary }]}>
                                    • Stay calm and speak clearly when calling emergency services
                                </ThemedText>
                                <ThemedText style={[styles.tipItem, { color: colors.textSecondary }]}>
                                    • Provide your exact location and describe the emergency
                                </ThemedText>
                                <ThemedText style={[styles.tipItem, { color: colors.textSecondary }]}>
                                    • Keep emergency numbers saved in your phone
                                </ThemedText>
                                <ThemedText style={[styles.tipItem, { color: colors.textSecondary }]}>
                                    • If you can't speak, text or use emergency apps
                                </ThemedText>
                            </ThemedView>
                        </ThemedView>

                        {/* Info Footer */}
                        <ThemedView style={[styles.infoContainer, { backgroundColor: colors.card }]}>
                            <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
                                Emergency numbers are available 24/7. Tap on any contact for more information or to call directly.
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
    prioritySection: {
        padding: 16,
    },
    priorityTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    emergencyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    emergencyButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 12,
        width: '48%',
        minHeight: 100,
    },
    emergencyButtonTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 8,
        textAlign: 'center',
    },
    emergencyButtonNumber: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 4,
    },
    contentContainer: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
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
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginLeft: 8,
    },
    priorityText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    itemDescription: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 4,
    },
    phoneNumber: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    location: {
        fontSize: 12,
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
