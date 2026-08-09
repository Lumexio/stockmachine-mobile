import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@store/auth-store';
import { useThemeStore } from '@store/theme-store';

export function OnboardingConfigModal() {
  const [visible, setVisible] = useState(false);
  const { isAuthenticated, isOffline, user } = useAuthStore();
  const colors = useThemeStore((s) => s.colors);

  useEffect(() => {
    checkPreference();
  }, [isAuthenticated, isOffline, user]);

  const checkPreference = async () => {
    if (!isAuthenticated || isOffline || user?.organization?.plan_id !== 'free') {
      return;
    }
    const role = user?.role || '';
    if (!['owner', 'admin'].includes(role)) {
      return;
    }
    const pref = await AsyncStorage.getItem('storage_preference');
    if (!pref) {
      setVisible(true);
    }
  };

  const selectStorage = async (type: 'server' | 'gdrive') => {
    await AsyncStorage.setItem('storage_preference', type);
    setVisible(false);
    if (type === 'gdrive') {
      Alert.alert(
        'Google Drive',
        'Google Drive sync is managed via the Web Dashboard (stockmachine.online). Please log in there to authorize and perform cloud sync operations.'
      );
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
        <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <MaterialCommunityIcons name="cloud-sync" size={24} color="#E53935" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>Data Sync Configuration</Text>
          </View>
          
          <Text style={{ color: colors.textSecondary, marginBottom: 20 }}>
            As a free user, you can choose where to securely sync your catalog across devices:
          </Text>

          <TouchableOpacity
            style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, marginBottom: 12 }}
            onPress={() => selectStorage('server')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <MaterialCommunityIcons name="server" size={24} color={colors.icon} style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text }}>Comet Server</Text>
            </View>
            <Text style={{ color: colors.textSecondary }}>
              Data is stored on our managed servers. Strict freemium storage limits apply.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ borderWidth: 2, borderColor: '#E53935', borderRadius: 12, padding: 16 }}
            onPress={() => selectStorage('gdrive')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <MaterialCommunityIcons name="google-drive" size={24} color="#E53935" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#E53935' }}>Google Drive</Text>
            </View>
            <Text style={{ color: colors.textSecondary }}>
              Sync to your personal Drive. <Text style={{ color: '#E53935', fontWeight: 'bold' }}>Unlimited capacity.</Text> (Recommended)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
