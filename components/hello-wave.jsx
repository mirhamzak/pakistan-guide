// Temporarily disable reanimated to avoid hardware bitmap issues
// import Animated from 'react-native-reanimated';
import { Text } from 'react-native';

export function HelloWave() {
    return (
        <Text
            style={{
                fontSize: 28,
                lineHeight: 32,
                marginTop: -6,
                // Temporarily disable animation to avoid hardware bitmap issues
                // animationName: {
                //     '50%': { transform: [{ rotate: '25deg' }] },
                // },
                // animationIterationCount: 4,
                // animationDuration: '300ms',
            }}>
            👋
        </Text>
    );
}
