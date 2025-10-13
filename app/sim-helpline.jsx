import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, TAB_BAR_HEIGHT } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function SimHelplineScreen() {
    const { theme } = useTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (index) => {
        setExpandedSections(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleCall = (number, network) => {
        const phoneNumber = `tel:${number}`;
        Linking.canOpenURL(phoneNumber)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(phoneNumber);
                } else {
                    Alert.alert('Error', 'Unable to make phone calls on this device');
                }
            })
            .catch((error) => {
                console.error('Error opening phone dialer:', error);
                Alert.alert('Error', 'Failed to open phone dialer');
            });
    };

    const networks = [
        {
            name: 'Jazz (Warid)',
            color: '#FF6B35',
            icon: 'phone.fill',
            numbers: [
                { label: 'Customer Service', number: '111' },
                { label: 'Balance Inquiry', number: '*111#' },
                { label: 'Data Balance', number: '*222#' },
                { label: 'SMS Balance', number: '*333#' },
                { label: 'Emergency', number: '112' }
            ]
        },
        {
            name: 'Telenor',
            color: '#00A651',
            icon: 'phone.fill',
            numbers: [
                { label: 'Customer Service', number: '345' },
                { label: 'Balance Inquiry', number: '*345#' },
                { label: 'Data Balance', number: '*222#' },
                { label: 'SMS Balance', number: '*333#' },
                { label: 'Emergency', number: '112' }
            ]
        },
        {
            name: 'Ufone',
            color: '#FFD700',
            icon: 'phone.fill',
            numbers: [
                { label: 'Customer Service', number: '333' },
                { label: 'Balance Inquiry', number: '*333#' },
                { label: 'Data Balance', number: '*222#' },
                { label: 'SMS Balance', number: '*333#' },
                { label: 'Emergency', number: '112' }
            ]
        },
        {
            name: 'Zong',
            color: '#E31E24',
            icon: 'phone.fill',
            numbers: [
                { label: 'Customer Service', number: '310' },
                { label: 'Balance Inquiry', number: '*310#' },
                { label: 'Data Balance', number: '*222#' },
                { label: 'SMS Balance', number: '*333#' },
                { label: 'Emergency', number: '112' }
            ]
        },
        {
            name: 'PTCL',
            color: '#003366',
            icon: 'phone.fill',
            numbers: [
                { label: 'Customer Service', number: '1217' },
                { label: 'Landline Directory', number: '17' },
                { label: 'Internet Support', number: '1218' },
                { label: 'Emergency', number: '15' }
            ]
        },
        {
            name: 'Emergency Services',
            color: '#FF3B30',
            icon: 'exclamationmark.triangle.fill',
            numbers: [
                { label: 'Police', number: '15' },
                { label: 'Fire Brigade', number: '16' },
                { label: 'Ambulance', number: '115' },
                { label: 'Emergency', number: '112' },
                { label: 'Women Helpline', number: '1093' }
            ]
        }
    ];

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
                <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
                    {/* Header */}
                    <ThemedView style={[styles.header, { backgroundColor: colors.cardHeader, borderBottomColor: colors.border }]}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <IconSymbol name="chevron.left" size={24} color={colors.text} />
                        </TouchableOpacity>
                        <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
                            SIM Helpline Numbers
                        </ThemedText>
                        <ThemedView style={styles.placeholder} />
                    </ThemedView>

                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + 20 }}
                    >
                        <ThemedView style={[styles.content, { backgroundColor: colors.background }]}>
                            <ThemedText style={[styles.description, { color: colors.textSecondary }]}>
                                Tap on a network to expand and view helpline numbers, then tap any number to call
                            </ThemedText>

                            {networks.map((network, networkIndex) => {
                                const isExpanded = expandedSections[networkIndex];
                                return (
                                    <ThemedView key={networkIndex} style={[styles.networkCard, { backgroundColor: colors.card }]}>
                                        <TouchableOpacity
                                            style={[styles.networkHeader, { backgroundColor: colors.card }]}
                                            onPress={() => toggleSection(networkIndex)}
                                            activeOpacity={0.7}
                                        >
                                            <ThemedView style={[
                                                styles.networkIconContainer,
                                                { backgroundColor: `${network.color}15` }
                                            ]}>
                                                <IconSymbol
                                                    name={network.icon}
                                                    size={24}
                                                    color={network.color}
                                                />
                                            </ThemedView>
                                            <ThemedText style={[styles.networkName, { color: colors.text }]}>
                                                {network.name}
                                            </ThemedText>
                                            <IconSymbol
                                                name={isExpanded ? "chevron.up" : "chevron.down"}
                                                size={20}
                                                color={colors.textSecondary}
                                            />
                                        </TouchableOpacity>

                                        {isExpanded && (
                                            <ThemedView style={[styles.numbersContainer, { backgroundColor: colors.card }]}>
                                                {network.numbers.map((number, numberIndex) => (
                                                    <TouchableOpacity
                                                        key={numberIndex}
                                                        style={[styles.numberCard, { backgroundColor: colors.background }]}
                                                        onPress={() => handleCall(number.number, network.name)}
                                                        activeOpacity={0.7}
                                                    >
                                                        <ThemedView style={[styles.numberInfo, { backgroundColor: colors.background }]}>
                                                            <ThemedText style={[styles.numberLabel, { color: colors.text }]}>
                                                                {number.label}
                                                            </ThemedText>
                                                            <ThemedText style={[styles.numberValue, { color: network.color }]}>
                                                                {number.number}
                                                            </ThemedText>
                                                        </ThemedView>
                                                        <IconSymbol
                                                            name="phone.circle.fill"
                                                            size={24}
                                                            color={network.color}
                                                        />
                                                    </TouchableOpacity>
                                                ))}
                                            </ThemedView>
                                        )}
                                    </ThemedView>
                                );
                            })}

                            <ThemedView style={[styles.infoCard, { backgroundColor: colors.card }]}>
                                <IconSymbol name="info.circle.fill" size={24} color={colors.tint} />
                                <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
                                    All numbers are toll-free when calling from the respective network.
                                    Emergency numbers (15, 16, 115, 112) are free from all networks.
                                </ThemedText>
                            </ThemedView>
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
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    title: {
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 16,
    },
    placeholder: {
        width: 40,
    },
    content: {
        padding: 20,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    networkCard: {
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
    networkHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
        borderRadius: 8,
    },
    networkIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    networkName: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
    },
    numbersContainer: {
        gap: 8,
    },
    numberCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 8,
        marginBottom: 4,
    },
    numberInfo: {
        flex: 1,
    },
    numberLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    numberValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
    },
    infoText: {
        fontSize: 14,
        lineHeight: 20,
        marginLeft: 12,
        flex: 1,
    },
});
