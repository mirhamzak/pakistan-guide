import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Linking, StyleSheet, TouchableOpacity } from 'react-native';

export default function InteractiveChips({ text, terms = [], icon = 'location.fill', chipColor = null }) {
    const { theme } = useTheme();
    const colors = Colors[theme];

    const handleChipPress = async (term) => {
        try {
            const searchQuery = encodeURIComponent(term);
            const googleSearchUrl = `https://www.google.com/search?q=${searchQuery}`;
            
            const canOpen = await Linking.canOpenURL(googleSearchUrl);
            if (canOpen) {
                await Linking.openURL(googleSearchUrl);
            } else {
                console.log('Cannot open Google search');
            }
        } catch (error) {
            console.error('Failed to open Google search:', error);
        }
    };

    // Find terms that exist in the text
    const foundTerms = terms.filter(term => 
        text.toLowerCase().includes(term.toLowerCase())
    );

    return (
        <ThemedView style={[styles.container, { backgroundColor: 'transparent' }]}>
            {/* Original text */}
            <ThemedText style={[styles.text, { color: colors.text }]}>
                {text}
            </ThemedText>
            
            {/* Chips list */}
            {foundTerms.length > 0 && (
                <ThemedView style={[styles.chipsContainer, { backgroundColor: 'transparent' }]}>
                    <ThemedText style={[styles.chipsTitle, { color: colors.textSecondary }]}>
                        Key Places & Attractions:
                    </ThemedText>
                    <ThemedView style={[styles.chipsList, { backgroundColor: 'transparent' }]}>
                        {foundTerms.map((term, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.chip,
                                    {
                                        backgroundColor: colors.tint + '15',
                                        borderColor: colors.tint,
                                    }
                                ]}
                                onPress={() => handleChipPress(term)}
                                activeOpacity={0.7}
                            >
                                <IconSymbol
                                    name={icon}
                                    size={14}
                                    color={colors.tint}
                                    style={styles.chipIcon}
                                />
                                <ThemedText style={[
                                    styles.chipText,
                                    { color: colors.tint }
                                ]}>
                                    {term}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </ThemedView>
                </ThemedView>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    chipsContainer: {
        marginTop: 8,
    },
    chipsTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    chipsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 6,
    },
    chipIcon: {
        marginRight: 6,
    },
    chipText: {
        fontSize: 13,
        fontWeight: '500',
    },
});
