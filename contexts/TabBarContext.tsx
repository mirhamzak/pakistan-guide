import React, { createContext, ReactNode, useContext, useState } from 'react';

interface TabBarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  scrollDirection: 'up' | 'down' | null;
  setScrollDirection: (direction: 'up' | 'down' | null) => void;
}

const TabBarContext = createContext<TabBarContextType | undefined>(undefined);

export function TabBarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

  return (
    <TabBarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        scrollDirection,
        setScrollDirection,
      }}
    >
      {children}
    </TabBarContext.Provider>
  );
}

export function useTabBar() {
  const context = useContext(TabBarContext);
  if (context === undefined) {
    throw new Error('useTabBar must be used within a TabBarProvider');
  }
  return context;
}



