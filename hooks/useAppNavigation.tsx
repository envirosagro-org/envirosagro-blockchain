import React, { createContext, useContext } from 'react';
import { ViewState } from '../types';

interface NavigationContextType {
  navigate: (view: ViewState, section?: string, pushToHistory?: boolean) => void;
  goBack: () => void;
  goForward: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{
  navigate: (view: ViewState, section?: string, pushToHistory?: boolean) => void;
  goBack: () => void;
  goForward: () => void;
  children: React.ReactNode;
}> = ({ navigate, goBack, goForward, children }) => {
  return (
    <NavigationContext.Provider value={{ navigate, goBack, goForward }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useAppNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useAppNavigation must be used within a NavigationProvider');
  }
  return context;
};
