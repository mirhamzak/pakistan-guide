import { Colors } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ThemedView } from './themed-view';

export function SimpleModeToggle({ isTouristMode, onToggle }) {
    const { theme } = useTheme();
    const colors = Colors[theme];

    return (
        <ThemedView style={[styles.container, { backgroundColor: colors.cardHeader }]}>
            <TouchableOpacity
                style={[styles.toggle, { backgroundColor: colors.modeSwitch }]}
                onPress={onToggle}
                activeOpacity={0.7}
            >
                <ThemedView style={[styles.background, { backgroundColor: colors.modeSwitch }]}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        {isTouristMode ? 'Tourist' : 'Citizen'}
                    </Text>
                </ThemedView>
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    toggle: {
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
    },
});
