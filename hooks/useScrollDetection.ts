import { useTabBar } from '@/contexts/TabBarContext';
import { useCallback, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export function useScrollDetection() {
  const { setIsCollapsed, setScrollDirection } = useTabBar();
  const lastScrollY = useRef(0);
  const scrollThreshold = 10; // Minimum scroll distance to trigger animation

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      const scrollDifference = currentScrollY - lastScrollY.current;

      // Only trigger if scroll difference is significant
      if (Math.abs(scrollDifference) > scrollThreshold) {
        if (scrollDifference > 0) {
          // Scrolling down - collapse tab bar
          setIsCollapsed(true);
          setScrollDirection('down');
        } else {
          // Scrolling up - expand tab bar
          setIsCollapsed(false);
          setScrollDirection('up');
        }
        lastScrollY.current = currentScrollY;
      }
    },
    [setIsCollapsed, setScrollDirection]
  );

  const resetScrollPosition = useCallback(() => {
    lastScrollY.current = 0;
  }, []);

  return {
    handleScroll,
    resetScrollPosition,
  };
}
