import './src/i18n';
import React, { useEffect, useState } from 'react';
import { View, AppState, AppStateStatus } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { vars } from 'nativewind';
import { Colors } from './src/constants/theme';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useThemeStore } from './src/store/theme-store';
import { useAuthStore } from './src/store/auth-store';
import { useSyncStore } from './src/store/sync-store';
import { loadSavedLanguage } from './src/i18n';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function App() {
  const [ready, setReady] = useState(false);
  const { loadSaved, isDarkActive } = useThemeStore();
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

  const { colors } = useThemeStore();

  if (!ready) return null;

  const themeVars = vars({
    '--theme-background': colors.background,
    '--theme-surface': colors.surface,
    '--theme-card': colors.card,
    '--theme-text': colors.text,
    '--theme-text-secondary': colors.textSecondary,
    '--theme-border': colors.border,
    '--theme-icon': colors.icon,
    '--theme-primary': Colors.primary,
    '--theme-primary-light': Colors.primaryLight,
    '--theme-primary-dark': Colors.primaryDark,
  });

  return (
    <StripeProvider publishableKey="pk_test_51OaocLLziPoKDnBfC3llEbiKqhUI7CBTRnkjdwi7XpEcsuo9juKCPHKEZpq1RP9cmnt55xI2ztbAB3iy5z7ydCrg00HAyJwBqe">
      <View style={[{ flex: 1 }, themeVars]}>
        <StatusBar style={isDarkActive ? 'light' : 'dark'} />
        <AppNavigator isAuthenticated={isAuthenticated} isOffline={isOffline} />
      </View>
    </StripeProvider>
  );
}
