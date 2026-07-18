import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@navigation/AppNavigator';
import { useAuthStore } from '@store/auth-store';
import { NAV_KEYS } from '@constants/nav-keys';

type Props = NativeStackScreenProps<AuthStackParamList, typeof NAV_KEYS.WELCOME>;

export function WelcomeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const setOffline = useAuthStore((s) => s.setOffline);
  const setHasSeenWelcome = useAuthStore((s) => s.setHasSeenWelcome);

  const handleOffline = () => {
    setHasSeenWelcome();
    setOffline(true);
  };

  const handleLogin = () => {
    setHasSeenWelcome();
    navigation.navigate(NAV_KEYS.LOGIN);
  };

  const handleRegister = () => {
    setHasSeenWelcome();
    navigation.navigate(NAV_KEYS.REGISTER);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-between px-6 py-12">
        {/* Header Content */}
        <View className="flex-1 justify-center items-center">
          <View className="mb-6 p-6 bg-red-50 rounded-full">
            <MaterialCommunityIcons
              name="package-variant-closed"
              size={80}
              color="#E53935"
            />
          </View>
          <Text className="text-3xl font-extrabold text-gray-900 text-center mb-3">
            {t('welcome.title')}
          </Text>
          <Text className="text-base text-gray-500 text-center px-4 leading-6">
            {t('welcome.subtitle')}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={{ gap: 12 }}>
          {/* Log In */}
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-red-600 rounded-xl py-4 flex-row justify-center items-center shadow-sm"
            testID="welcome-login-btn"
          >
            <MaterialCommunityIcons
              name="login"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white font-bold text-base">
              {t('welcome.loginBtn')}
            </Text>
          </TouchableOpacity>

          {/* Register Online */}
          <TouchableOpacity
            onPress={handleRegister}
            className="border border-red-600 rounded-xl py-4 flex-row justify-center items-center"
            testID="welcome-register-btn"
          >
            <MaterialCommunityIcons
              name="open-in-new"
              size={20}
              color="#E53935"
              style={{ marginRight: 8 }}
            />
            <Text className="text-red-600 font-bold text-base">
              {t('welcome.registerBtn')}
            </Text>
          </TouchableOpacity>

          {/* Continue Offline */}
          <TouchableOpacity
            onPress={handleOffline}
            className="rounded-xl py-4 flex-row justify-center items-center"
            testID="welcome-offline-btn"
          >
            <MaterialCommunityIcons
              name="wifi-off"
              size={20}
              color="#6B7280"
              style={{ marginRight: 8 }}
            />
            <Text className="text-gray-500 font-semibold text-base">
              {t('welcome.offlineBtn')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
