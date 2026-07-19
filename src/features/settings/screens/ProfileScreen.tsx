import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@store/auth-store';
import { useThemeStore } from '@store/theme-store';

export function ProfileScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { colors } = useThemeStore();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogout = () => {
    Alert.alert(t('auth.logout'), `${t('auth.logout')}?`, [
      { text: t('actions.cancel'), style: 'cancel' },
      {
        text: t('auth.logout'),
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    Alert.alert('Success', 'Password updated successfully');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="p-4" style={{ gap: 16 }}>
        {/* User Identity */}
        {user && (
          <View className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
            <View className="flex-row items-center" style={{ gap: 12 }}>
              <View className="w-12 h-12 rounded-full bg-red-500 items-center justify-center">
                <Text className="text-white font-bold text-lg">
                  {user.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text className="text-lg font-bold" style={{ color: colors.text }}>
                  {user.name}
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  {user.email}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Security & Password */}
        <View className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
          <Text className="text-base font-bold mb-3" style={{ color: colors.text }}>
            Security & Password
          </Text>
          <View style={{ gap: 10 }}>
            <TextInput
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholderTextColor={colors.textSecondary}
              style={{
                backgroundColor: colors.surface,
                color: colors.text,
                padding: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            />
            <TextInput
              placeholder="Confirm New Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor={colors.textSecondary}
              style={{
                backgroundColor: colors.surface,
                color: colors.text,
                padding: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            />
            <TouchableOpacity
              onPress={handleChangePassword}
              className="bg-red-600 rounded-lg p-3 items-center mt-1"
            >
              <Text className="text-white font-bold">Update Password</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Plan & Limits */}
        <View className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
          <Text className="text-base font-bold mb-2" style={{ color: colors.text }}>
            Plan & Subscription
          </Text>
          <Text className="text-xs text-gray-500 mb-2">
            Default Plan Limits
          </Text>
          <View style={{ gap: 4 }}>
            <Text className="text-sm" style={{ color: colors.text }}>
              • Max Locations: <Text className="font-bold">1 (Free) / 5 (Pro) / 10 (Max)</Text>
            </Text>
            <Text className="text-sm" style={{ color: colors.text }}>
              • Max Products: <Text className="font-bold">50 (Free) / 150 (Pro) / 500 (Max)</Text>
            </Text>
          </View>
        </View>

        {/* Account Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-600 rounded-xl py-4 items-center shadow-sm flex-row justify-center"
        >
          <MaterialCommunityIcons name="logout" size={20} color="white" style={{ marginRight: 8 }} />
          <Text className="text-white font-bold text-base">
            {t('auth.logout')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
