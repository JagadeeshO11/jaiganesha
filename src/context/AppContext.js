import React, { createContext, useState, useEffect } from 'react';
import { NativeModules, AppState } from 'react-native';

const { TorchCamModule } = NativeModules;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isServiceEnabled, setIsServiceEnabled] = useState(false);
  const [isBatteryOptimized, setIsBatteryOptimized] = useState(false);
  const [sensitivity] = useState(800);
  const [cooldown] = useState(2);

  const checkBatteryStatus = async () => {
    const optimized = await TorchCamModule.isBatteryOptimizationEnabled();
    setIsBatteryOptimized(optimized);
  };

  useEffect(() => {
    checkBatteryStatus();
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkBatteryStatus();
      }
    });
    return () => subscription.remove();
  }, []);

  const toggleService = (value) => {
    if (value) {
      TorchCamModule.startService();
    } else {
      TorchCamModule.stopService();
    }
    setIsServiceEnabled(value);
  };

  const openBatterySettings = () => {
    TorchCamModule.openBatterySettings();
  };

  return (
    <AppContext.Provider
      value={{
        isServiceEnabled,
        toggleService,
        isBatteryOptimized,
        openBatterySettings,
        sensitivity,
        cooldown,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
