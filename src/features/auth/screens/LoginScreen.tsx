import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@navigation/AppNavigator';
import { useAuthStore } from '@store/auth-store';
import { NAV_KEYS } from '@constants/nav-keys';

type Props = NativeStackScreenProps<AuthStackParamList, typeof NAV_KEYS.LOGIN>;

export function LoginScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('auth.invalidCredentials'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6">
          <Text className="text-3xl font-bold text-center mb-2 text-red-600">
            {t('app.title')}
          </Text>

          {error !== null && (
            <View className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <Text className="text-red-600 text-sm">{error}</Text>
            </View>
          )}

          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
            placeholder={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            testID="email-input"
          />

          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-900"
            placeholder={t('auth.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            testID="password-input"
          />

          <Text className="text-red-400 text-xs text-right mb-6">
            {t('auth.forgotPassword')}
          </Text>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="bg-red-600 rounded-lg py-4 items-center mb-4"
            testID="login-button"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                {t('auth.login')}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate(NAV_KEYS.REGISTER)}
          >
            <Text className="text-center text-red-600">
              {t('auth.noAccount')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
