import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NAV_KEYS } from '@constants/nav-keys';
import { useThemeStore } from '@store/theme-store';
import { Colors } from '@constants/theme';

// ── Feature screens & navigators ─────────────────────────────────────────────
import { LoginScreen, RegisterScreen, WelcomeScreen } from '@features/auth';
import { DashboardScreen } from '@features/dashboard';
import { ProductsNavigator } from '@features/products';
import { CategoriesNavigator } from '@features/categories';
import { ShelvesNavigator } from '@features/shelves';
import { RacksNavigator } from '@features/racks';
import { HistoryScreen } from '@features/history';
import { SettingsScreen, ProfileScreen } from '@features/settings/screens';
import { useAuthStore } from '@store/auth-store';

// ── Auth navigator ────────────────────────────────────────────────────────────
export type AuthStackParamList = {
  [NAV_KEYS.WELCOME]: undefined;
  [NAV_KEYS.LOGIN]: undefined;
  [NAV_KEYS.REGISTER]: undefined;
};
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function AuthNavigator() {
  const hasSeenWelcome = useAuthStore((s) => s.hasSeenWelcome);
  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={hasSeenWelcome ? NAV_KEYS.LOGIN : NAV_KEYS.WELCOME}
    >
      <AuthStack.Screen name={NAV_KEYS.WELCOME} component={WelcomeScreen} />
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
  [NAV_KEYS.PROFILE]: undefined;
  [NAV_KEYS.SETTINGS]: undefined;
};
const MainTabs = createBottomTabNavigator<MainTabsParamList>();

function MainNavigator() {
  const colors = useThemeStore((s) => s.colors);
  const user = useAuthStore((s) => s.user);

  return (
    <MainTabs.Navigator
      screenOptions={({ navigation }) => ({
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.card },
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12, gap: 12 }}>
            <TouchableOpacity onPress={() => navigation.navigate(NAV_KEYS.PROFILE)}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 }}>
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate(NAV_KEYS.SETTINGS)}>
              <MaterialCommunityIcons name="cog" size={22} color={colors.icon} />
            </TouchableOpacity>
          </View>
        ),
      })}
    >
      <MainTabs.Screen name={NAV_KEYS.DASHBOARD} component={DashboardScreen} />
      <MainTabs.Screen
        name={NAV_KEYS.PRODUCTS_STACK}
        component={ProductsNavigator}
        options={{ title: 'Products' }}
      />
      <MainTabs.Screen
        name={NAV_KEYS.CATEGORIES_STACK}
        component={CategoriesNavigator}
        options={{ title: 'Categories' }}
      />
      <MainTabs.Screen
        name={NAV_KEYS.SHELVES_STACK}
        component={ShelvesNavigator}
        options={{ title: 'Shelves' }}
      />
      <MainTabs.Screen
        name={NAV_KEYS.RACKS_STACK}
        component={RacksNavigator}
        options={{ title: 'Racks' }}
      />
      <MainTabs.Screen name={NAV_KEYS.HISTORY} component={HistoryScreen} />
      <MainTabs.Screen
        name={NAV_KEYS.PROFILE}
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
      <MainTabs.Screen
        name={NAV_KEYS.SETTINGS}
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </MainTabs.Navigator>
  );
}

// ── Root navigator ────────────────────────────────────────────────────────────
export type RootStackParamList = {
  [NAV_KEYS.AUTH_STACK]: undefined;
  [NAV_KEYS.MAIN_TABS]: undefined;
};
const RootStack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  isAuthenticated: boolean;
  isOffline: boolean;
}

export function AppNavigator({ isAuthenticated, isOffline }: AppNavigatorProps) {
  const colors = useThemeStore((s) => s.colors);

  return (
    <NavigationContainer
      theme={{
        dark: useThemeStore.getState().isDarkActive,
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
        {isAuthenticated || isOffline ? (
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
