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

type Props = NativeStackScreenProps<
  AuthStackParamList,
  typeof NAV_KEYS.REGISTER
>;

export function RegisterScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const register = useAuthStore((s) => s.register);
  const [accountType, setAccountType] = useState<'individual' | 'organization'>(
    'individual',
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgNameError, setOrgNameError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    setOrgNameError(null);
    if (accountType === 'organization' && !orgName.trim()) {
      setOrgNameError(t('forms.validation.required'));
      return;
    }
    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        ...(accountType === 'organization' && orgName.trim()
          ? { org_name: orgName.trim() }
          : {}),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('messages.error.create'));
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
            STOCKMACHINE
          </Text>
          <Text className="text-sm text-gray-500 text-center mb-6">
            {t('auth.accountType')}
          </Text>

          {/* Account type selector */}
          <View className="flex-row mb-6" style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={() => setAccountType('individual')}
              className={`flex-1 rounded-xl p-4 items-center ${
                accountType === 'individual'
                  ? 'border-red-600 border-2 bg-red-50'
                  : 'border-gray-200 border bg-white'
              }`}
              testID="account-type-individual"
            >
              <Text className="text-2xl mb-1">👤</Text>
              <Text
                className={`font-semibold text-sm ${
                  accountType === 'individual'
                    ? 'text-red-600'
                    : 'text-gray-700'
                }`}
              >
                {t('auth.individual')}
              </Text>
              <Text className="text-xs text-gray-400 text-center mt-1">
                {t('auth.individualDesc')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAccountType('organization')}
              className={`flex-1 rounded-xl p-4 items-center ${
                accountType === 'organization'
                  ? 'border-red-600 border-2 bg-red-50'
                  : 'border-gray-200 border bg-white'
              }`}
              testID="account-type-organization"
            >
              <Text className="text-2xl mb-1">🏢</Text>
              <Text
                className={`font-semibold text-sm ${
                  accountType === 'organization'
                    ? 'text-red-600'
                    : 'text-gray-700'
                }`}
              >
                {t('auth.organization')}
              </Text>
              <Text className="text-xs text-gray-400 text-center mt-1">
                {t('auth.orgDesc')}
              </Text>
            </TouchableOpacity>
          </View>

          {error !== null && (
            <View className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <Text className="text-red-600 text-sm">{error}</Text>
            </View>
          )}

          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
            placeholder={t('auth.name')}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            testID="name-input"
          />

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
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
            placeholder={t('auth.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            testID="password-input"
          />

          {accountType === 'organization' && (
            <>
              <TextInput
                className={`border rounded-lg px-4 py-3 mb-1 text-gray-900 ${
                  orgNameError !== null ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder={t('auth.orgName')}
                value={orgName}
                onChangeText={(v) => {
                  setOrgName(v);
                  setOrgNameError(null);
                }}
                testID="org-name-input"
              />
              {orgNameError !== null ? (
                <Text className="text-xs text-red-500 mb-4">
                  {orgNameError}
                </Text>
              ) : (
                <Text className="text-xs text-gray-400 mb-4">
                  {t('auth.orgNameHint')}
                </Text>
              )}
            </>
          )}

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="bg-red-600 rounded-lg py-4 items-center mb-4"
            testID="register-button"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                {t('auth.createAccount')}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate(NAV_KEYS.LOGIN)}>
            <Text className="text-center text-red-600">
              {t('auth.hasAccount')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
