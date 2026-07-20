import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@store/auth-store';
import { useThemeStore } from '@store/theme-store';
import { Colors } from '@constants/theme';
import { NAV_KEYS } from '@constants/nav-keys';

export function HeaderRight() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const colors = useThemeStore((s) => s.colors);

  if (!user) return null;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12, gap: 12 }}>
      <TouchableOpacity onPress={() => navigation.navigate(NAV_KEYS.PROFILE)}>
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: Colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {user.photo_url ? (
            <Image source={{ uri: user.photo_url }} style={{ width: '100%', height: '100%' }} />
          ) : (
            <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 }}>
              {user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate(NAV_KEYS.SETTINGS)}>
        <MaterialCommunityIcons name="cog" size={22} color={colors.icon} />
      </TouchableOpacity>
    </View>
  );
}
