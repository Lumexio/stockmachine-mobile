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
  Modal,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@navigation/AppNavigator';
import { useAuthStore } from '@store/auth-store';
import { NAV_KEYS } from '@constants/nav-keys';
import { apiClient } from '@api/axios-client';

type Props = NativeStackScreenProps<AuthStackParamList, typeof NAV_KEYS.LOGIN>;

export function LoginScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const login = useAuthStore((s) => s.login);
  const setPendingInviteCode = useAuthStore((s) => s.setPendingInviteCode);
  const pendingInviteCode = useAuthStore((s) => s.pendingInviteCode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [verifyingInvite, setVerifyingInvite] = useState(false);
  const [inviteMsg, setInviteMsg] = useState('');

  const handleVerifyInvite = async () => {
    if (!inviteCodeInput) return;
    setVerifyingInvite(true);
    try {
      const res = await apiClient.get(`/invitations/${inviteCodeInput}`);
      if (res.data?.data?.organization_name) {
        setPendingInviteCode(inviteCodeInput);
        setInviteMsg(`Invited to ${res.data.data.organization_name}!`);
        if (res.data.data.email) {
          setEmail(res.data.data.email);
        }
        setTimeout(() => setInviteModalVisible(false), 2000);
      }
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Invalid invite code');
    } finally {
      setVerifyingInvite(false);
    }
  };

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

          <Text className="text-sm mb-1 font-medium text-gray-700">{t('forms.label.email', 'Email Address')}</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            testID="email-input"
          />

          <Text className="text-sm mb-1 font-medium text-gray-700">{t('forms.label.password', 'Password')}</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-900"
            placeholder="********"
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
            className="mb-4"
          >
            <Text className="text-center text-red-600">
              {t('auth.noAccount')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => useAuthStore.getState().setOffline(true)}
            className="mb-2"
          >
            <Text className="text-center text-gray-500 font-bold">
              Cancel / Stay Offline
            </Text>
          </TouchableOpacity>

          <View className="h-[1px] bg-gray-200 my-4" />

          <TouchableOpacity
            onPress={() => setInviteModalVisible(true)}
          >
            <Text className="text-center text-gray-500 font-bold">
              Got an invite code?
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={inviteModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 shadow-lg">
            <Text className="text-xl font-bold mb-2">Accept Invitation</Text>
            <Text className="text-gray-500 mb-4">Enter your 6-character code.</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-900"
              placeholder="Invite Code"
              value={inviteCodeInput}
              onChangeText={setInviteCodeInput}
              autoCapitalize="characters"
            />
            {!!inviteMsg && <Text className="text-green-600 mb-4 font-bold">{inviteMsg}</Text>}
            <View className="flex-row justify-end space-x-2 mt-2">
              <TouchableOpacity onPress={() => setInviteModalVisible(false)} className="px-4 py-2">
                <Text className="text-gray-500 font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleVerifyInvite} disabled={verifyingInvite} className="bg-red-600 px-6 py-2 rounded-lg">
                <Text className="text-white font-bold">{verifyingInvite ? '...' : 'Verify'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
