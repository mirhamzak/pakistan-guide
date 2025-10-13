// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
    // Tab bar icons
    'house.fill': 'home',
    'house': 'home',
    'magnifyingglass': 'search',
    'magnifyingglass.circle.fill': 'search',
    'bookmark': 'bookmark-border',
    'bookmark.fill': 'bookmark',
    'gearshape': 'settings',
    'gearshape.fill': 'settings',

    // General icons
    'paperplane.fill': 'send',
    'chevron.left.forwardslash.chevron.right': 'code',
    'chevron.right': 'chevron-right',
    'book.fill': 'book',
    'exclamationmark.triangle.fill': 'warning',
    'checkmark.circle.fill': 'check-circle',
    'trash.fill': 'delete',
    'square.and.arrow.up': 'share',
    'bell.fill': 'notifications',
    'moon.fill': 'nightlight-round',
    'info.circle.fill': 'info',
    'hand.raised.fill': 'pan-tool',
    'doc.text.fill': 'description',

    // Action icons
    'airplane': 'flight',
    'text.bubble.fill': 'chat-bubble',
    'scale.fill': 'gavel',
    'heart.fill': 'favorite',
    'shield.fill': 'security',
    'cross.fill': 'add',
    'flame.fill': 'local-fire-department',
    'phone.fill': 'phone',

    // Navigation icons
    'chevron.down': 'keyboard-arrow-down',
    'chevron.up': 'keyboard-arrow-up',
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
    name,
    size = 24,
    color,
    style,
}) {
    const iconName = MAPPING[name] || 'help-outline'; // fallback to help icon
    return (
        <MaterialIcons
            color={color}
            size={size}
            name={iconName}
            style={[{ resizeMode: 'contain' }, style]}
        />
    );
}
