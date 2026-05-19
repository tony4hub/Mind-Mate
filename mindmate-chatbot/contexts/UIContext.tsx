'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface UIContextType {
  sidebarOpen: boolean;
  emergencyPanelCollapsed: boolean;
  inputValue: string;
  isLoading: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setEmergencyPanelCollapsed: (collapsed: boolean) => void;
  toggleEmergencyPanel: () => void;
  setInputValue: (value: string) => void;
  setIsLoading: (loading: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [emergencyPanelCollapsed, setEmergencyPanelCollapsed] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const toggleEmergencyPanel = useCallback(() => {
    setEmergencyPanelCollapsed((prev) => !prev);
  }, []);

  return (
    <UIContext.Provider
      value={{
        sidebarOpen,
        emergencyPanelCollapsed,
        inputValue,
        isLoading,
        setSidebarOpen,
        toggleSidebar,
        setEmergencyPanelCollapsed,
        toggleEmergencyPanel,
        setInputValue,
        setIsLoading,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
