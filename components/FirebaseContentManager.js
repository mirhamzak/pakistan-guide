import { Colors } from '@/constants/colors';
import { useData } from '@/contexts/DataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { firebaseService } from '@/services/firebaseService';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';

export const FirebaseContentManager = ({ visible, onClose }) => {
    const { theme } = useTheme();
    const colors = Colors[theme];
    const { 
        updateAvailable, 
        isUpdating, 
        checkForUpdates, 
        updateContent, 
        getContentStats,
        lastSyncDate 
    } = useData();

    const [stats, setStats] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);
    const [realTimeEnabled, setRealTimeEnabled] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');

    useEffect(() => {
        if (visible) {
            loadStats();
            checkConnectionStatus();
        }
    }, [visible]);

    const loadStats = async () => {
        try {
            const contentStats = await getContentStats();
            setStats(contentStats);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const checkConnectionStatus = async () => {
        try {
            const isConnected = await firebaseService.testConnection();
            setConnectionStatus(isConnected ? 'connected' : 'disconnected');
        } catch (error) {
            setConnectionStatus('error');
        }
    };

    const handleCheckUpdates = async () => {
        try {
            setIsCheckingUpdates(true);
            const updateInfo = await checkForUpdates();
            
            if (updateInfo.hasUpdate) {
                Alert.alert(
                    'Update Available',
                    `New version ${updateInfo.latestVersion} is available. Current version: ${updateInfo.currentVersion}`,
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Update', onPress: () => handleUpdate('all') }
                    ]
                );
            } else {
                Alert.alert('No Updates', 'Your content is up to date!');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to check for updates');
        } finally {
            setIsCheckingUpdates(false);
        }
    };

    const handleUpdate = async (type) => {
        try {
            const success = await updateContent(type);
            if (success) {
                Alert.alert('Success', 'Content updated successfully!');
                loadStats();
            } else {
                Alert.alert('Error', 'Failed to update content');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update content');
        }
    };

    const handleRealTimeToggle = async () => {
        try {
            if (realTimeEnabled) {
                // Disable real-time updates
                firebaseService.cleanup();
                setRealTimeEnabled(false);
                Alert.alert('Real-time Updates', 'Real-time updates disabled');
            } else {
                // Enable real-time updates
                const unsubscribe = firebaseService.listenToContent('all', (data) => {
                    console.log('Real-time update received:', data);
                    loadStats();
                });
                
                setRealTimeEnabled(true);
                Alert.alert('Real-time Updates', 'Real-time updates enabled');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to toggle real-time updates');
        }
    };

    const handleAddContentItem = async (type) => {
        try {
            // This would open a form to add new content
            // For now, just show an alert
            Alert.alert(
                'Add Content Item',
                `This would open a form to add a new ${type} item.`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to add content item');
        }
    };

    const handleDeleteContentItem = async (type, itemId) => {
        try {
            Alert.alert(
                'Delete Content Item',
                'Are you sure you want to delete this item?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                        text: 'Delete', 
                        style: 'destructive',
                        onPress: async () => {
                            // For now, just show success - implement actual deletion later
                            Alert.alert('Success', 'Item deleted successfully');
                            loadStats();
                        }
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to delete content item');
        }
    };

    const getContentTypeIcon = (type) => {
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

    const getContentTypeColor = (type) => {
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

    const getConnectionStatusColor = () => {
        switch (connectionStatus) {
            case 'connected': return '#34C759';
            case 'disconnected': return '#FF9500';
            case 'error': return '#FF3B30';
            default: return '#666';
        }
    };

    const getConnectionStatusText = () => {
        switch (connectionStatus) {
            case 'connected': return 'Connected';
            case 'disconnected': return 'Disconnected';
            case 'error': return 'Error';
            default: return 'Unknown';
        }
    };

    if (!visible) return null;

    return (
        <ThemedView style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <ThemedView style={[styles.modal, { backgroundColor: colors.background }]}>
                <ScrollView style={styles.scrollView}>
                    {/* Header */}
                    <ThemedView style={[styles.header, { borderBottomColor: colors.border }]}>
                        <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
                            Firebase Content Manager
                        </ThemedText>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <IconSymbol name="xmark" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </ThemedView>

                    {/* Connection Status */}
                    <ThemedView style={[styles.section, { backgroundColor: colors.card }]}>
                        <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
                            Firebase Connection
                        </ThemedText>
                        
                        <View style={styles.statusRow}>
                            <ThemedText style={[styles.statusLabel, { color: colors.textSecondary }]}>
                                Status:
                            </ThemedText>
                            <View style={styles.statusIndicator}>
                                <IconSymbol 
                                    name="circle.fill" 
                                    size={12} 
                                    color={getConnectionStatusColor()} 
                                />
                                <ThemedText style={[styles.statusValue, { color: getConnectionStatusColor() }]}>
                                    {getConnectionStatusText()}
                                </ThemedText>
                            </View>
                        </View>

                        <View style={styles.statusRow}>
                            <ThemedText style={[styles.statusLabel, { color: colors.textSecondary }]}>
                                Real-time Updates:
                            </ThemedText>
                            <ThemedText style={[styles.statusValue, { color: realTimeEnabled ? '#34C759' : '#FF9500' }]}>
                                {realTimeEnabled ? 'Enabled' : 'Disabled'}
                            </ThemedText>
                        </View>

                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: realTimeEnabled ? '#FF3B30' : '#34C759' }]}
                            onPress={handleRealTimeToggle}
                        >
                            <IconSymbol 
                                name={realTimeEnabled ? "stop.circle" : "play.circle"} 
                                size={16} 
                                color="#fff" 
                            />
                            <ThemedText style={styles.actionButtonText}>
                                {realTimeEnabled ? 'Disable Real-time' : 'Enable Real-time'}
                            </ThemedText>
                        </TouchableOpacity>
                    </ThemedView>

                    {/* Update Status */}
                    <ThemedView style={[styles.section, { backgroundColor: colors.card }]}>
                        <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
                            Update Status
                        </ThemedText>
                        
                        <View style={styles.statusRow}>
                            <ThemedText style={[styles.statusLabel, { color: colors.textSecondary }]}>
                                Last Sync:
                            </ThemedText>
                            <ThemedText style={[styles.statusValue, { color: colors.text }]}>
                                {lastSyncDate ? new Date(lastSyncDate).toLocaleString() : 'Never'}
                            </ThemedText>
                        </View>

                        <View style={styles.statusRow}>
                            <ThemedText style={[styles.statusLabel, { color: colors.textSecondary }]}>
                                Update Available:
                            </ThemedText>
                            <View style={styles.statusIndicator}>
                                <IconSymbol 
                                    name={updateAvailable ? "exclamationmark.circle.fill" : "checkmark.circle.fill"} 
                                    size={16} 
                                    color={updateAvailable ? "#FF9500" : "#34C759"} 
                                />
                                <ThemedText style={[styles.statusValue, { color: updateAvailable ? "#FF9500" : "#34C759" }]}>
                                    {updateAvailable ? 'Yes' : 'No'}
                                </ThemedText>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: colors.tint }]}
                            onPress={handleCheckUpdates}
                            disabled={isCheckingUpdates}
                        >
                            {isCheckingUpdates ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <IconSymbol name="arrow.clockwise" size={16} color="#fff" />
                            )}
                            <ThemedText style={styles.actionButtonText}>
                                {isCheckingUpdates ? 'Checking...' : 'Check for Updates'}
                            </ThemedText>
                        </TouchableOpacity>
                    </ThemedView>

                    {/* Content Statistics */}
                    {stats && (
                        <ThemedView style={[styles.section, { backgroundColor: colors.card }]}>
                            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
                                Content Statistics
                            </ThemedText>
                            
                            <View style={styles.statsGrid}>
                                {Object.entries(stats).map(([key, value]) => {
                                    if (key === 'lastUpdated' || key === 'version') return null;
                                    
                                    const type = key.replace(/([A-Z])/g, '$1').toLowerCase()
                                        .replace('knowledge', '').replace('info', '').replace('guidance', '')
                                        .replace('phrases', '').replace('laws', '').replace('facts', '')
                                        .trim() || 'general';
                                    
                                    return (
                                        <View key={key} style={[styles.statItem, { backgroundColor: colors.surface }]}>
                                            <IconSymbol
                                                name={getContentTypeIcon(type)}
                                                size={20}
                                                color={getContentTypeColor(type)}
                                            />
                                            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            </ThemedText>
                                            <ThemedText style={[styles.statValue, { color: colors.text }]}>
                                                {value}
                                            </ThemedText>
                                        </View>
                                    );
                                })}
                            </View>
                        </ThemedView>
                    )}

                    {/* Content Management Actions */}
                    <ThemedView style={[styles.section, { backgroundColor: colors.card }]}>
                        <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
                            Content Management
                        </ThemedText>
                        
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: colors.tint }]}
                            onPress={() => handleUpdate('all')}
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <IconSymbol name="arrow.down.circle" size={16} color="#fff" />
                            )}
                            <ThemedText style={styles.actionButtonText}>
                                {isUpdating ? 'Updating...' : 'Update All Content'}
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#34C759' }]}
                            onPress={() => handleAddContentItem('general')}
                        >
                            <IconSymbol name="plus.circle" size={16} color="#fff" />
                            <ThemedText style={styles.actionButtonText}>
                                Add Content Item
                            </ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                </ScrollView>
            </ThemedView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        width: '90%',
        maxHeight: '80%',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    scrollView: {
        maxHeight: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    section: {
        margin: 16,
        padding: 16,
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusLabel: {
        fontSize: 14,
    },
    statusValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statItem: {
        width: '48%',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 2,
    },
});
