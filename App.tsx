import './src/i18n';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppState, AppStateStatus } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useThemeStore } from './src/store/theme-store';
import { useAuthStore } from './src/store/auth-store';
import { useSyncStore } from './src/store/sync-store';
import { loadSavedLanguage } from './src/i18n';

export default function App() {
  const [ready, setReady] = useState(false);
  const { loadSaved, scheme } = useThemeStore();
  const { isAuthenticated, isOffline, loadFromStorage } = useAuthStore();

  useEffect(() => {
    Promise.all([loadSaved(), loadSavedLanguage(), loadFromStorage()]).finally(
      () => setReady(true),
    );
  }, [loadSaved, loadFromStorage]);

  // Periodic network sync checks
  useEffect(() => {
    if (!ready || !isAuthenticated) return;

    const syncStore = useSyncStore.getState();
    
    // Initial check
    syncStore.checkConnection();

    // Poll every 30s
    const timer = setInterval(() => {
      syncStore.checkConnection();
    }, 30000);

    // Recheck and sync when app is focused (foregrounded)
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        syncStore.checkConnection();
      }
    });

    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, [ready, isAuthenticated]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <AppNavigator isAuthenticated={isAuthenticated} isOffline={isOffline} />
    </>
  );
}
