import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';

export default function DarkModeModal({ visible, onClose, currentMode, onSelectMode }) {
    const { theme } = useTheme();
    const colors = Colors[theme];

    const themeOptions = [
        {
            key: 'light',
            title: 'Light',
            subtitle: 'Always use light theme',
            icon: 'sun.max.fill',
            color: '#FF9500',
        },
        {
            key: 'dark',
            title: 'Dark',
            subtitle: 'Always use dark theme',
            icon: 'moon.fill',
            color: '#6B46C1',
        },
        {
            key: 'system',
            title: 'System',
            subtitle: 'Follow system settings',
            icon: 'gear.circle.fill',
            color: '#007AFF',
        },
    ];

    const handleSelectMode = (mode) => {
        onSelectMode(mode);
        onClose();
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <ThemedView style={styles.overlay}>
                <TouchableOpacity 
                    style={styles.overlayTouchable} 
                    activeOpacity={1} 
                    onPress={onClose}
                />
                <ThemedView style={[styles.modalContainer, { backgroundColor: colors.card }]}>
                    {/* Header */}
                    <ThemedView style={[styles.header, { backgroundColor: colors.card }]}>
                        <ThemedText style={[styles.title, { color: colors.text }]}>
                            Choose Theme
                        </ThemedText>
                        <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Select your preferred appearance
                        </ThemedText>
                    </ThemedView>

                    {/* Options */}
                    <ThemedView style={[styles.optionsContainer, { backgroundColor: colors.card }]}>
                        {themeOptions.map((option, index) => {
                            const isSelected = currentMode === option.key;
                            return (
                                <TouchableOpacity
                                    key={option.key}
                                    style={[
                                        styles.optionItem,
                                        { 
                                            borderBottomColor: colors.border,
                                            backgroundColor: isSelected ? colors.surface : colors.card
                                        },
                                        index === themeOptions.length - 1 && styles.lastOption
                                    ]}
                                    onPress={() => handleSelectMode(option.key)}
                                    activeOpacity={0.7}
                                >
                                    <ThemedView style={[styles.optionLeft, { backgroundColor: 'transparent' }]}>
                                        <IconSymbol
                                            name={option.icon}
                                            size={24}
                                            color={option.color}
                                            style={styles.optionIcon}
                                        />
                                        <ThemedView style={[styles.optionContent, { backgroundColor: 'transparent' }]}>
                                            <ThemedText style={[styles.optionTitle, { color: colors.text }]}>
                                                {option.title}
                                            </ThemedText>
                                            <ThemedText style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                                                {option.subtitle}
                                            </ThemedText>
                                        </ThemedView>
                                    </ThemedView>

                                    {isSelected && (
                                        <IconSymbol
                                            name="checkmark.circle.fill"
                                            size={24}
                                            color="#007AFF"
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ThemedView>

                    {/* Cancel Button */}
                    <ThemedView style={[styles.cancelContainer, { backgroundColor: colors.card }]}>
                        <TouchableOpacity
                            style={[styles.cancelButton, { backgroundColor: colors.surface }]}
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            <ThemedText style={[styles.cancelText, { color: colors.text }]}>
                                Cancel
                            </ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    overlayTouchable: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 20,
        minHeight: 300,
    },
    safeArea: {
        flex: 0,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
    },
    optionsContainer: {
        paddingHorizontal: 0,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    lastOption: {
        borderBottomWidth: 0,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionIcon: {
        marginRight: 16,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
    },
    optionSubtitle: {
        fontSize: 14,
    },
    cancelContainer: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 24,
    },
    cancelButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '500',
    },
});
