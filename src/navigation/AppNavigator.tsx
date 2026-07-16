import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { NAV_KEYS } from '@constants/nav-keys';
import { useThemeStore } from '@store/theme-store';
import { Colors } from '@constants/theme';

// ── Feature screens & navigators ─────────────────────────────────────────────
import { LoginScreen, RegisterScreen } from '@features/auth';
import { DashboardScreen } from '@features/dashboard';
import { ProductsNavigator } from '@features/products';
import { CategoriesNavigator } from '@features/categories';
import { ShelvesNavigator } from '@features/shelves';
import { RacksNavigator } from '@features/racks';
import { HistoryScreen } from '@features/history';
import { SettingsScreen } from '@features/settings';

// ── Auth navigator ────────────────────────────────────────────────────────────
export type AuthStackParamList = {
  [NAV_KEYS.LOGIN]: undefined;
  [NAV_KEYS.REGISTER]: undefined;
};
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name={NAV_KEYS.LOGIN} component={LoginScreen} />
      <AuthStack.Screen name={NAV_KEYS.REGISTER} component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

// ── Main tab navigator ────────────────────────────────────────────────────────
export type MainTabsParamList = {
  [NAV_KEYS.DASHBOARD]: undefined;
  [NAV_KEYS.PRODUCTS_STACK]: undefined;
  [NAV_KEYS.CATEGORIES_STACK]: undefined;
  [NAV_KEYS.SHELVES_STACK]: undefined;
  [NAV_KEYS.RACKS_STACK]: undefined;
  [NAV_KEYS.HISTORY]: undefined;
  [NAV_KEYS.SETTINGS]: undefined;
};
const MainTabs = createBottomTabNavigator<MainTabsParamList>();

function MainNavigator() {
  const colors = useThemeStore((s) => s.colors);

  return (
    <MainTabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.card },
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
      }}
    >
      <MainTabs.Screen name={NAV_KEYS.DASHBOARD} component={DashboardScreen} />
      <MainTabs.Screen
        name={NAV_KEYS.PRODUCTS_STACK}
        component={ProductListScreen}
        options={{ title: 'Products' }}
      />
      <MainTabs.Screen
        name={NAV_KEYS.CATEGORIES_STACK}
        component={CategoryListScreen}
        options={{ title: 'Categories' }}
      />
      <MainTabs.Screen
        name={NAV_KEYS.SHELVES_STACK}
        component={ShelfListScreen}
        options={{ title: 'Shelves' }}
      />
      <MainTabs.Screen
        name={NAV_KEYS.RACKS_STACK}
        component={RackListScreen}
        options={{ title: 'Racks' }}
      />
      <MainTabs.Screen name={NAV_KEYS.HISTORY} component={HistoryScreen} />
      <MainTabs.Screen name={NAV_KEYS.SETTINGS} component={SettingsScreen} />
    </MainTabs.Navigator>
  );
}

// ── Root navigator ────────────────────────────────────────────────────────────
export type RootStackParamList = {
  [NAV_KEYS.AUTH_STACK]: undefined;
  [NAV_KEYS.MAIN_TABS]: undefined;
};
const RootStack = createNativeStackNavigator<RootStackParamList>();

/** Replace `isAuthenticated` with your auth store selector once auth is implemented */
interface AppNavigatorProps {
  isAuthenticated: boolean;
}

export function AppNavigator({ isAuthenticated }: AppNavigatorProps) {
  const colors = useThemeStore((s) => s.colors);

  return (
    <NavigationContainer
      theme={{
        dark: useThemeStore.getState().scheme === 'dark',
        colors: {
          primary: Colors.primary,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
          notification: Colors.primary,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '800' },
        },
      }}
    >
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen
            name={NAV_KEYS.MAIN_TABS}
            component={MainNavigator}
          />
        ) : (
          <RootStack.Screen
            name={NAV_KEYS.AUTH_STACK}
            component={AuthNavigator}
          />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
