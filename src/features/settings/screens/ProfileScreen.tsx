import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@store/auth-store';
import { useThemeStore } from '@store/theme-store';
import { Colors } from '@constants/theme';
import { apiClient } from '@api/axios-client';

export function ProfileScreen() {
  const { t } = useTranslation();
  const { user, logout, updateUser } = useAuthStore();
  const { colors } = useThemeStore();

  const [name, setName] = useState(user?.name || '');
  const [photoUrl, setPhotoUrl] = useState(user?.photo_url || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setPhotoUrl(user?.photo_url || '');
  }, [user]);

  const userAccountType = user?.account_type || 'team';
  const currentPlan = user?.organization?.plan_id || 'free';

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

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setPhotoUrl(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) return;
    setSavingProfile(true);
    try {
      await apiClient.post('/auth/profile', {
        name: name,
        photo_url: photoUrl,
      });
      // Update local state and wait for sync
      updateUser({ name, photo_url: photoUrl });
      const res = await apiClient.get('/auth/me');
      if (res.data?.data) {
         updateUser(res.data.data);
      }
      Alert.alert('Success', 'Profile updated successfully');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || e.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) return;
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setSavingPassword(true);
    try {
      await apiClient.post('/auth/change-password', {
        newPassword: newPassword,
      });
      Alert.alert('Success', 'Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || e.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="p-4" style={{ gap: 16 }}>
        
        {/* User Identity Form */}
        {user && (
          <View className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-base font-bold" style={{ color: colors.text }}>User Profile</Text>
              <View className="bg-red-100 px-2 py-1 rounded-md">
                <Text className="text-xs text-red-600 font-bold">{userAccountType.toUpperCase()} ACCOUNT</Text>
              </View>
            </View>

            <View className="flex-row items-center mb-4" style={{ gap: 16 }}>
              <TouchableOpacity onPress={handlePickImage} className="w-16 h-16 rounded-full items-center justify-center overflow-hidden" style={{ backgroundColor: Colors.primary }}>
                {photoUrl ? (
                  <Image source={{ uri: photoUrl }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <Text className="text-white font-bold text-xl">
                    {user.name.slice(0, 2).toUpperCase()}
                  </Text>
                )}
                <View className="absolute bottom-0 w-full h-1/3 bg-black/50 items-center justify-center">
                  <MaterialCommunityIcons name="camera" size={12} color="white" />
                </View>
              </TouchableOpacity>
              <View style={{ flex: 1, gap: 10 }}>
                 <TextInput
                   value={name}
                   onChangeText={setName}
                   placeholder={t('auth.name')}
                   placeholderTextColor={colors.textSecondary}
                   style={{
                     backgroundColor: colors.surface,
                     color: colors.text,
                     padding: 8,
                     borderRadius: 8,
                     borderWidth: 1,
                     borderColor: colors.border,
                   }}
                 />
                 <Text className="text-sm" style={{ color: colors.textSecondary }}>
                   {user.email}
                 </Text>
              </View>
            </View>
            
            <TouchableOpacity
              onPress={handleSaveProfile}
              disabled={savingProfile}
              className="rounded-lg p-3 items-center"
              style={{ backgroundColor: Colors.primary, opacity: savingProfile ? 0.6 : 1 }}
            >
              <Text className="text-white font-bold">
                {savingProfile ? 'Saving...' : 'Save Profile Changes'}
              </Text>
            </TouchableOpacity>
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
              disabled={savingPassword}
              className="rounded-lg p-3 items-center mt-1"
              style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: Colors.primary, opacity: savingPassword ? 0.6 : 1 }}
            >
              <Text className="font-bold" style={{ color: Colors.primary }}>
                {savingPassword ? 'Updating...' : 'Update Password'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Plan & Limits */}
        <View className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-bold" style={{ color: colors.text }}>
              Plan & Subscription
            </Text>
            <View className={`px-2 py-1 rounded-md ${currentPlan === 'max' ? 'bg-green-100' : currentPlan === 'pro' ? 'bg-blue-100' : 'bg-yellow-100'}`}>
               <Text className={`text-xs font-bold ${currentPlan === 'max' ? 'text-green-700' : currentPlan === 'pro' ? 'text-blue-700' : 'text-yellow-700'}`}>
                 {currentPlan.toUpperCase()} PLAN
               </Text>
            </View>
          </View>
          
          <Text className="text-xs text-gray-500 mb-2">
            Current Plan Limits
          </Text>
          <View style={{ gap: 4 }}>
            <Text className="text-sm" style={{ color: colors.text }}>
              • Max Products: <Text className="font-bold">{currentPlan === 'max' ? '500' : currentPlan === 'pro' ? '150' : '50'}</Text>
            </Text>
            <Text className="text-sm" style={{ color: colors.text }}>
              • Max Locations: <Text className="font-bold">{currentPlan === 'max' ? '10' : currentPlan === 'pro' ? '5' : '1'}</Text>
            </Text>
            <Text className="text-sm" style={{ color: colors.text }}>
              • Exports: <Text className="font-bold">{currentPlan === 'max' ? 'Excel, CSV, JSON, PDF Reports' : currentPlan === 'pro' ? 'Excel, CSV, JSON' : 'Excel Only'}</Text>
            </Text>
            <Text className="text-sm" style={{ color: colors.text }}>
              • Max Team Accounts: <Text className="font-bold">{currentPlan === 'max' ? '50 Accounts' : currentPlan === 'pro' ? '15 Accounts' : '5 Accounts'}</Text>
            </Text>
          </View>
          
          <Text className="text-xs mt-3 text-center" style={{ color: colors.textSecondary }}>
             Billing upgrades are managed via the Web Application.
          </Text>
        </View>

        {/* Account Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-600 rounded-xl py-4 items-center shadow-sm flex-row justify-center mt-2 mb-8"
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
