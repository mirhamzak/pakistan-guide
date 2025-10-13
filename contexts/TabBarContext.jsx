import { createContext, useContext, useState } from 'react';

const TabBarContext = createContext(undefined);

export function TabBarProvider({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [scrollDirection, setScrollDirection] = useState(null);

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
