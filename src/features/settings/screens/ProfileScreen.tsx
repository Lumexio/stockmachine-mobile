import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Image, Modal } from 'react-native';
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
          
          <View className="mt-6" style={{ gap: 10 }}>
            {currentPlan === 'free' && (
              <View style={{ gap: 10 }}>
                <TouchableOpacity
                  onPress={() => handleUpgrade('pro', 'individual')}
                  disabled={isInitializingCheckout}
                  className="rounded-lg p-4 items-center flex-row justify-center"
                  style={{ backgroundColor: '#2563EB', opacity: isInitializingCheckout ? 0.7 : 1 }}
                >
                  <Text className="text-white font-bold mr-2 text-base">Upgrade to Pro Solo</Text>
                  <Text className="text-white/80">($4/mo)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleUpgrade('pro', 'team')}
                  disabled={isInitializingCheckout}
                  className="rounded-lg p-4 items-center flex-row justify-center"
                  style={{ backgroundColor: '#2563EB', opacity: isInitializingCheckout ? 0.7 : 1 }}
                >
                  <Text className="text-white font-bold mr-2 text-base">Upgrade to Pro Team</Text>
                  <Text className="text-white/80">($7/mo)</Text>
                </TouchableOpacity>
              </View>
            )}

            {currentPlan !== 'max' && (
              <View style={{ gap: 10 }}>
                <TouchableOpacity
                  onPress={() => handleUpgrade('max', 'individual')}
                  disabled={isInitializingCheckout}
                  className="rounded-lg p-4 items-center flex-row justify-center"
                  style={{ backgroundColor: '#10B981', opacity: isInitializingCheckout ? 0.7 : 1 }}
                >
                  <Text className="text-white font-bold mr-2 text-base">Upgrade to Max Solo</Text>
                  <Text className="text-white/80">($11.99/mo)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleUpgrade('max', 'team')}
                  disabled={isInitializingCheckout}
                  className="rounded-lg p-4 items-center flex-row justify-center"
                  style={{ backgroundColor: '#10B981', opacity: isInitializingCheckout ? 0.7 : 1 }}
                >
                  <Text className="text-white font-bold mr-2 text-base">Upgrade to Max Team</Text>
                  <Text className="text-white/80">($19.99/mo)</Text>
                </TouchableOpacity>
              </View>
            )}

            {currentPlan === 'max' && (
              <View className="p-4 items-center flex-row justify-center">
                <MaterialCommunityIcons name="check-decagram" size={24} color="#10B981" style={{ marginRight: 8 }} />
                <Text className="text-green-600 font-bold text-base">You have the Max Plan!</Text>
              </View>
            )}
          </View>
        </View>

        {/* Team Administration (Only for Owner/Admin of Team Accounts) */}
        {userAccountType === 'team' && isOwnerOrAdmin && (
          <View className="rounded-xl p-4 shadow-sm mb-4" style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
            <Text className="text-base font-bold mb-3" style={{ color: colors.text }}>Team Administration</Text>
            <TouchableOpacity
              onPress={() => setInviteModalVisible(true)}
              className="rounded-lg p-3 items-center flex-row justify-center"
              style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: Colors.primary }}
            >
              <MaterialCommunityIcons name="email-plus-outline" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
              <Text className="font-bold" style={{ color: Colors.primary }}>
                Invite Member
              </Text>
            </TouchableOpacity>
          </View>
        )}

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
