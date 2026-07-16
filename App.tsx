import './src/i18n';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useThemeStore } from './src/store/theme-store';
import { useAuthStore } from './src/store/auth-store';
import { loadSavedLanguage } from './src/i18n';

export default function App() {
  const [ready, setReady] = useState(false);
  const { loadSaved, scheme } = useThemeStore();
  const { isAuthenticated, loadFromStorage } = useAuthStore();

  useEffect(() => {
    Promise.all([loadSaved(), loadSavedLanguage(), loadFromStorage()]).finally(
      () => setReady(true),
    );
  }, [loadSaved, loadFromStorage]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <AppNavigator isAuthenticated={isAuthenticated} />
    </>
  );
}
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
