import DarkModeModal from '@/components/DarkModeModal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, TAB_BAR_HEIGHT } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { initializePakistanGuideData } from '@/services/dataInitializer';
import { storageService } from '@/services/storage';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const { theme, themeMode, setThemeMode, toggleTheme } = useTheme();
    const [isDataInitialized, setIsDataInitialized] = useState(false);
    const [lastSyncDate, setLastSyncDate] = useState(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [isInitializing, setIsInitializing] = useState(false);
    const [showDarkModeModal, setShowDarkModeModal] = useState(false);

    useEffect(() => {
        checkDataStatus();
    }, []);

    const checkDataStatus = async () => {
        try {
            const initialized = await storageService.isDataInitialized();
            setIsDataInitialized(initialized);

            if (initialized) {
                const syncDate = await storageService.getLastSyncDate();
                setLastSyncDate(syncDate);
            }
        } catch (error) {
            console.error('Failed to check data status:', error);
        }
    };

    const initializeData = async () => {
        try {
            setIsInitializing(true);
            await storageService.initializeDatabase();

            const data = initializePakistanGuideData();
            await storageService.saveAppData(data);

            setIsDataInitialized(true);
            setLastSyncDate(new Date().toISOString());
            Alert.alert('Success', 'Pakistan Guide data has been initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize data:', error);
            Alert.alert('Error', 'Failed to initialize Pakistan Guide data');
        } finally {
            setIsInitializing(false);
        }
    };

    const clearAllData = async () => {
        Alert.alert(
            'Clear All Data',
            'This will remove all Pakistan Guide data and bookmarks. This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Clear Data',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await storageService.clearAllData();
                            setIsDataInitialized(false);
                            setLastSyncDate(null);
                            Alert.alert('Success', 'All data has been cleared');
                        } catch (error) {
                            console.error('Failed to clear data:', error);
                            Alert.alert('Error', 'Failed to clear data');
                        }
                    },
                },
            ]
        );
    };

    const exportData = async () => {
        Alert.alert(
            'Export Data',
            'This feature will be available in a future update. You can manually backup your bookmarks by taking screenshots.',
            [{ text: 'OK' }]
        );
    };

    const aboutApp = () => {
        Alert.alert(
            'About Pakistan Guide',
            'Version 1.0.0\n\nPakistan Guide provides comprehensive offline information about Pakistan including general knowledge, emergency contacts, travel guidance, language phrases, local laws, and cultural facts.\n\nBuilt with React Native and Expo.',
            [{ text: 'OK' }]
        );
    };

    const handleThemeModeChange = (mode) => {
        setThemeMode(mode);
    };

    const settingsSections = [
        {
            title: 'Data Management',
            items: [
                {
                    title: 'Data Status',
                    subtitle: isDataInitialized
                        ? `Last updated: ${lastSyncDate ? new Date(lastSyncDate).toLocaleDateString() : 'Unknown'}`
                        : 'Data not initialized',
                    icon: isDataInitialized ? 'checkmark.circle.fill' : 'exclamationmark.triangle.fill',
                    color: isDataInitialized ? '#34C759' : '#FF9500',
                    onPress: null,
                },
                ...(isDataInitialized ? [] : [{
                    title: 'Initialize Data',
                    subtitle: 'Download Pakistan Guide content for offline access',
                    icon: 'arrow.down.circle.fill',
                    color: '#FF9500',
                    onPress: initializeData,
                    isButton: true,
                    buttonText: isInitializing ? 'Initializing...' : 'Initialize',
                    disabled: isInitializing,
                }]),
                {
                    title: 'Clear All Data',
                    subtitle: 'Remove all app data and bookmarks',
                    icon: 'trash.fill',
                    color: '#FF3B30',
                    onPress: clearAllData,
                },
                {
                    title: 'Export Data',
                    subtitle: 'Backup your bookmarks and settings',
                    icon: 'square.and.arrow.up',
                    color: '#007AFF',
                    onPress: exportData,
                },
            ],
        },
        {
            title: 'Preferences',
            items: [
                {
                    title: 'Notifications',
                    subtitle: 'Emergency alerts and updates',
                    icon: 'bell.fill',
                    color: '#FF9500',
                    onPress: null,
                    isToggle: true,
                    toggleValue: notificationsEnabled,
                    onToggle: setNotificationsEnabled,
                },
                {
                    title: 'Dark Mode',
                    subtitle: themeMode === 'system' ? 'Follow system' : themeMode === 'dark' ? 'Always on' : 'Always off',
                    icon: 'moon.fill',
                    color: '#6B46C1',
                    onPress: () => setShowDarkModeModal(true),
                },
            ],
        },
        {
            title: 'Information',
            items: [
                {
                    title: 'About',
                    subtitle: 'App version and information',
                    icon: 'info.circle.fill',
                    color: '#007AFF',
                    onPress: aboutApp,
                },
                {
                    title: 'Privacy Policy',
                    subtitle: 'How we handle your data',
                    icon: 'hand.raised.fill',
                    color: '#34C759',
                    onPress: () => Alert.alert('Privacy Policy', 'Privacy policy will be available in a future update.'),
                },
                {
                    title: 'Terms of Service',
                    subtitle: 'App usage terms',
                    icon: 'doc.text.fill',
                    color: '#666',
                    onPress: () => Alert.alert('Terms of Service', 'Terms of service will be available in a future update.'),
                },
            ],
        },
    ];

    const colors = Colors[theme];

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <ThemedView style={[styles.header, { backgroundColor: colors.cardHeader }]}>
                        <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
                            Settings
                        </ThemedText>
                        <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Manage your Pakistan Guide preferences
                        </ThemedText>
                    </ThemedView>

                    {/* Settings Sections */}
                    <ThemedView style={[styles.contentContainer, { backgroundColor: colors.background }]}>
                        {settingsSections.map((section, sectionIndex) => (
                            <ThemedView key={sectionIndex} style={[styles.section, { backgroundColor: colors.card }]}>
                                <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
                                    {section.title}
                                </ThemedText>

                                {section.items.map((item, itemIndex) => (
                                    <TouchableOpacity
                                        key={itemIndex}
                                        style={[
                                            styles.settingItem,
                                            { borderBottomColor: colors.border },
                                            itemIndex === section.items.length - 1 && styles.lastItem,
                                            'isButton' in item && item.isButton && styles.buttonItem
                                        ]}
                                        onPress={item.onPress || undefined}
                                        disabled={!item.onPress && !('isToggle' in item && item.isToggle) || ('disabled' in item && item.disabled)}
                                    >
                                        <ThemedView style={[styles.settingItemLeft, { backgroundColor: colors.card }]}>
                                            <IconSymbol
                                                name={item.icon}
                                                size={20}
                                                color={item.color}
                                                style={styles.settingIcon}
                                            />
                                            <ThemedView style={[styles.settingContent, { backgroundColor: colors.card }]}>
                                                <ThemedText style={[styles.settingTitle, { color: colors.text }]}>
                                                    {item.title}
                                                </ThemedText>
                                                <ThemedText style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                                                    {item.subtitle}
                                                </ThemedText>
                                            </ThemedView>
                                        </ThemedView>

                                        {'isToggle' in item && item.isToggle ? (
                                            <Switch
                                                value={item.toggleValue}
                                                onValueChange={item.onToggle}
                                                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                                                thumbColor={item.toggleValue ? '#FFFFFF' : '#FFFFFF'}
                                            />
                                        ) : 'isButton' in item && item.isButton ? (
                                            <ThemedView style={[styles.buttonContainer, { backgroundColor: colors.card }]}>
                                                <ThemedText style={[
                                                    styles.buttonText,
                                                    {
                                                        color: item.disabled ? colors.textTertiary : '#FFFFFF',
                                                        backgroundColor: item.disabled ? colors.border : item.color
                                                    }
                                                ]}>
                                                    {item.buttonText}
                                                </ThemedText>
                                            </ThemedView>
                                        ) : (
                                            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ThemedView>
                        ))}
                    </ThemedView>

                    {/* App Info */}
                    <ThemedView style={[styles.appInfoContainer, { backgroundColor: colors.cardHeader }]}>
                        <ThemedText style={[styles.appInfoText, { color: colors.text }]}>
                            Pakistan Guide v1.0.0
                        </ThemedText>
                        <ThemedText style={[styles.appInfoSubtext, { color: colors.textSecondary }]}>
                            Your comprehensive offline guide to Pakistan
                        </ThemedText>
                    </ThemedView>
                </ScrollView>
            </ThemedView>

            {/* Dark Mode Modal */}
            <DarkModeModal
                visible={showDarkModeModal}
                onClose={() => setShowDarkModeModal(false)}
                currentMode={themeMode}
                onSelectMode={handleThemeModeChange}
            />
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
        paddingTop: 20,
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
    contentContainer: {
        padding: 16,
    },
    section: {
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        padding: 16,
        paddingBottom: 8,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    buttonItem: {
        paddingVertical: 16,
    },
    buttonContainer: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        textAlign: 'center',
        minWidth: 80,
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIcon: {
        marginRight: 12,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 14,
    },
    appInfoContainer: {
        alignItems: 'center',
        paddingBottom: 20,
        // margin: 16,
        borderRadius: 12,
        marginBottom: TAB_BAR_HEIGHT,
    },
    appInfoText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    appInfoSubtext: {
        fontSize: 14,
        textAlign: 'center',
    },
});
