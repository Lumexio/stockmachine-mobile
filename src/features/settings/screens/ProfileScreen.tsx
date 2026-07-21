import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Image, Modal, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@store/auth-store';
import { useThemeStore } from '@store/theme-store';
import { Colors } from '@constants/theme';
import { apiClient } from '@api/axios-client';
import { useStripe } from '@stripe/stripe-react-native';

export function ProfileScreen() {
  const { t } = useTranslation();
  const { user, logout, updateUser } = useAuthStore();
  const { colors } = useThemeStore();

  const [name, setName] = useState(user?.name || '');
  const [photoUrl, setPhotoUrl] = useState(user?.photo_url || '');
  const [savingProfile, setSavingProfile] = useState(false);
  
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isInitializingCheckout, setIsInitializingCheckout] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const isOwnerOrAdmin = user?.role === 'owner' || user?.role === 'admin';

  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [sendingInvite, setSendingInvite] = useState(false);

  const handleSendInvite = async () => {
    if (!inviteEmail) return;
    setSendingInvite(true);
    try {
      await apiClient.post('/invitations', { email: inviteEmail, role: inviteRole });
      Alert.alert('Success', 'Invitation sent successfully');
      setInviteModalVisible(false);
      setInviteEmail('');
      setInviteRole('member');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to send invite');
    } finally {
      setSendingInvite(false);
    }
  };

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

  const handleUpgrade = async (targetPlan: 'pro' | 'max', targetAccountType: 'individual' | 'team') => {
    setIsInitializingCheckout(true);
    try {
      const res = await apiClient.post('/billing/checkout-session', {
        target_plan: targetPlan,
        target_account_type: targetAccountType,
        client_type: 'mobile',
      });

      const { paymentIntent, ephemeralKey, customer } = res.data;
      if (!paymentIntent || !ephemeralKey || !customer) {
        throw new Error('Invalid response from server');
      }

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Stockmachine',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: false,
        defaultBillingDetails: {
          name: user?.name,
          email: user?.email,
        },
      });

      if (initError) {
        throw new Error(initError.message);
      }

      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        if (presentError.code === 'Canceled') return;
        throw new Error(presentError.message);
      }

      // Success! Update local auth state
      const meRes = await apiClient.get('/auth/me');
      if (meRes.data?.data) {
         updateUser(meRes.data.data);
      }
      Alert.alert('Success', 'Your subscription was successfully upgraded!');
    } catch (e: any) {
      Alert.alert('Checkout Failed', e.message || 'An error occurred during checkout.');
    } finally {
      setIsInitializingCheckout(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="p-4" style={{ gap: 16 }}>
        
        {/* Offline / Unauthenticated State */}
        {!user && (
          <View className="rounded-xl p-6 shadow-sm items-center justify-center mt-10" style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
            <MaterialCommunityIcons name="account-off-outline" size={64} color={colors.textSecondary} style={{ marginBottom: 16 }} />
            <Text className="text-xl font-bold mb-2 text-center" style={{ color: colors.text }}>You are Offline</Text>
            <Text className="text-sm text-center mb-8 px-4" style={{ color: colors.textSecondary }}>
              Log in or create an account to sync your inventory, manage your team, and access premium features.
            </Text>
            
            <TouchableOpacity
              onPress={() => {
                useAuthStore.getState().setHasSeenWelcome();
                useAuthStore.getState().setOffline(false);
              }}
              className="bg-red-600 rounded-xl py-4 items-center shadow-sm flex-row justify-center w-full mb-4"
            >
              <MaterialCommunityIcons name="login" size={20} color="white" style={{ marginRight: 8 }} />
              <Text className="text-white font-bold text-base">Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                useAuthStore.getState().setHasSeenWelcome();
                useAuthStore.getState().setOffline(false);
              }}
              className="border border-red-600 rounded-xl py-4 items-center flex-row justify-center w-full"
            >
              <MaterialCommunityIcons name="open-in-new" size={20} color="#E53935" style={{ marginRight: 8 }} />
              <Text className="text-red-600 font-bold text-base">Create an Account</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* User Identity Form */}
        {user && (
          <>
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
        </>
        )}
      </View>

      <Modal visible={inviteModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 shadow-lg pb-10">
            <Text className="text-xl font-bold mb-2 text-gray-900">Invite Team Member</Text>
            <Text className="text-gray-500 mb-4">Send a 6-character code via email.</Text>
            
            <Text className="text-sm font-bold text-gray-700 mb-1 mt-2">Email Address</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
              placeholder="colleague@example.com"
              value={inviteEmail}
              onChangeText={setInviteEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Text className="text-sm font-bold text-gray-700 mb-1">Role</Text>
            <View className="border border-gray-300 rounded-lg mb-6 overflow-hidden">
              <Picker
                selectedValue={inviteRole}
                onValueChange={(itemValue) => setInviteRole(itemValue)}
                style={{ backgroundColor: 'white', color: '#000' }}
                dropdownIconColor="#000"
              >
                <Picker.Item label="Member (Standard access)" value="member" />
                <Picker.Item label="Admin (Can invite others)" value="admin" />
              </Picker>
            </View>

            <View className="flex-row justify-end space-x-2 mt-2">
              <TouchableOpacity onPress={() => setInviteModalVisible(false)} className="px-4 py-3">
                <Text className="text-gray-500 font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSendInvite} disabled={sendingInvite} className="bg-red-600 px-6 py-3 rounded-lg flex-row items-center">
                {sendingInvite && <ActivityIndicator color="white" size="small" style={{ marginRight: 8 }} />}
                <Text className="text-white font-bold text-base">Send Invite</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
