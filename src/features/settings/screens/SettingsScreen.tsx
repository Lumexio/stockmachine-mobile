import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@store/auth-store';
import { useThemeStore } from '@store/theme-store';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'ja', label: '日本語' },
  { code: 'ru', label: 'Русский' },
] as const;

type LangCode = (typeof LANGUAGES)[number]['code'];

const COLOR_SCHEMES = [
  { value: 'light', label: 'Default Light' },
  { value: 'dark', label: 'Default Dark' },
  { value: 'electric', label: 'Electric Neon' },
  { value: 'tokyo', label: 'Tokyo Night' },
  { value: 'newspaper', label: 'Newspaper' },
] as const;

export function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isOffline = useAuthStore((s) => s.isOffline);
  const setOffline = useAuthStore((s) => s.setOffline);
  
  const { scheme, colors, setScheme } = useThemeStore();

  const currentLang = (i18n.language.split('-')[0] ?? 'en') as LangCode;

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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="p-4" style={{ gap: 16 }}>
        {/* Profile section */}
        {user !== null && (
          <View>
            <View className="flex-row items-center mb-2" style={{ gap: 6 }}>
              <MaterialCommunityIcons name="account-outline" size={16} color={colors.icon} />
              <Text className="text-xs uppercase tracking-wide" style={{ color: colors.textSecondary }}>
                {t('settings.userProfile')}
              </Text>
            </View>
            <View className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
              <Text className="text-base font-semibold" style={{ color: colors.text }}>
                {user.name}
              </Text>
              <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                {user.email}
              </Text>
              <View className="flex-row items-center mt-2" style={{ gap: 8 }}>
                <Text className="text-xs capitalize" style={{ color: colors.textSecondary }}>
                  {user.role}
                </Text>
                <View
                  className="px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: user.org_id !== null ? '#FFEBEE' : '#F5F5F5' }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: user.org_id !== null ? '#D32F2F' : '#616161' }}
                  >
                    {user.org_id !== null
                      ? t('auth.organization')
                      : t('auth.individual')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Language section */}
        <View>
          <View className="flex-row items-center mb-2" style={{ gap: 6 }}>
            <MaterialCommunityIcons name="translate" size={16} color={colors.icon} />
            <Text className="text-xs uppercase tracking-wide" style={{ color: colors.textSecondary }}>
              {t('settings.language')}
            </Text>
          </View>
          <View className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
            <View className="flex-row flex-wrap" style={{ gap: 8 }}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => i18n.changeLanguage(lang.code)}
                  className="px-4 py-2 rounded-full border"
                  style={{
                    backgroundColor: currentLang === lang.code ? '#E53935' : colors.card,
                    borderColor: currentLang === lang.code ? '#E53935' : colors.border,
                  }}
                  testID={`lang-${lang.code}`}
                >
                  <Text
                    className="text-sm font-medium"
                    style={{
                      color: currentLang === lang.code ? '#FFFFFF' : colors.text,
                    }}
                  >
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Appearance section */}
        <View>
          <View className="flex-row items-center mb-2" style={{ gap: 6 }}>
            <MaterialCommunityIcons name="palette-outline" size={16} color={colors.icon} />
            <Text className="text-xs uppercase tracking-wide" style={{ color: colors.textSecondary }}>
              {t('settings.appearance')}
            </Text>
          </View>
          <View className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
            <View style={{ gap: 12 }}>
              {COLOR_SCHEMES.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => setScheme(item.value)}
                  className="flex-row items-center justify-between p-3 rounded-lg border"
                  style={{
                    backgroundColor: scheme === item.value ? colors.surface : colors.card,
                    borderColor: scheme === item.value ? '#E53935' : colors.border,
                  }}
                  testID={`theme-scheme-${item.value}`}
                >
                  <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                    {item.label}
                  </Text>
                  {scheme === item.value && (
                    <MaterialCommunityIcons name="check-circle" size={18} color="#E53935" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Account section */}
        <View>
          <View className="flex-row items-center mb-2" style={{ gap: 6 }}>
            <MaterialCommunityIcons
              name={isOffline ? 'login' : 'logout'}
              size={16}
              color={colors.icon}
            />
            <Text className="text-xs uppercase tracking-wide" style={{ color: colors.textSecondary }}>
              {t('settings.account')}
            </Text>
          </View>
          {isOffline ? (
            <TouchableOpacity
              onPress={() => setOffline(false)}
              className="bg-red-600 rounded-xl py-4 items-center shadow-sm flex-row justify-center"
              testID="connect-button"
            >
              <MaterialCommunityIcons name="login" size={20} color="white" style={{ marginRight: 8 }} />
              <Text className="text-white font-bold text-base">
                {t('welcome.loginBtn')} / {t('welcome.registerBtn')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-600 rounded-xl py-4 items-center shadow-sm flex-row justify-center"
              testID="logout-button"
            >
              <MaterialCommunityIcons name="logout" size={20} color="white" style={{ marginRight: 8 }} />
              <Text className="text-white font-bold text-base">
                {t('auth.logout')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
