import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useThemeStore } from '@store/theme-store';
import { NAV_KEYS } from '@constants/nav-keys';

export function MenuScreen() {
  const { t } = useTranslation();
  const { colors } = useThemeStore();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const menuItems = [
    {
      title: t('auth.profile', 'Profile'),
      icon: 'account' as const,
      route: NAV_KEYS.PROFILE,
      color: '#3B82F6', // blue
    },
    {
      title: t('common.history', 'History'),
      icon: 'history' as const,
      route: NAV_KEYS.HISTORY,
      color: '#10B981', // green
    },
    {
      title: t('common.settings', 'Settings'),
      icon: 'cog' as const,
      route: NAV_KEYS.SETTINGS,
      color: '#6B7280', // gray
    },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="p-4" style={{ gap: 16 }}>
        <Text className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
          {t('common.menu', 'Menu')}
        </Text>

        <View className="rounded-xl overflow-hidden shadow-sm" style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.route}
              onPress={() => navigation.navigate(item.route)}
              className="flex-row items-center p-4"
              style={{
                borderBottomWidth: index === menuItems.length - 1 ? 0 : 1,
                borderBottomColor: colors.border,
              }}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <MaterialCommunityIcons name={item.icon} size={22} color={item.color} />
              </View>
              <Text className="flex-1 text-base font-semibold" style={{ color: colors.text }}>
                {item.title}
              </Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
