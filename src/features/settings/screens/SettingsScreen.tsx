import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
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

export function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { scheme, toggle } = useThemeStore();

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
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4" style={{ gap: 16 }}>
        {/* Profile section */}
        <View>
          <Text className="text-xs text-gray-400 uppercase tracking-wide mb-2">
            {t('settings.userProfile')}
          </Text>
          {user !== null && (
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-base font-medium text-gray-900">
                {user.name}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">{user.email}</Text>
              <View className="flex-row items-center mt-2" style={{ gap: 8 }}>
                <Text className="text-xs text-gray-500 capitalize">
                  {user.role}
                </Text>
                <View
                  className={`px-2 rounded-full ${
                    user.org_id !== null ? 'bg-red-100' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      user.org_id !== null ? 'text-red-600' : 'text-gray-500'
                    }`}
                  >
                    {user.org_id !== null
                      ? t('auth.organization')
                      : t('auth.individual')}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Language section */}
        <View>
          <Text className="text-xs text-gray-400 uppercase tracking-wide mb-2">
            {t('settings.language')}
          </Text>
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row flex-wrap" style={{ gap: 8 }}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => i18n.changeLanguage(lang.code)}
                  className={`px-4 py-2 rounded-full border ${
                    currentLang === lang.code
                      ? 'bg-red-600 border-red-600'
                      : 'border-gray-300 bg-white'
                  }`}
                  testID={`lang-${lang.code}`}
                >
                  <Text
                    className={`text-sm ${
                      currentLang === lang.code ? 'text-white' : 'text-gray-700'
                    }`}
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
          <Text className="text-xs text-gray-400 uppercase tracking-wide mb-2">
            {t('settings.appearance')}
          </Text>
          <TouchableOpacity
            onPress={toggle}
            className="bg-white rounded-xl p-4 shadow-sm flex-row items-center justify-between"
            testID="theme-toggle"
          >
            <Text className="text-base text-gray-900">
              {scheme === 'dark' ? t('app.theme.dark') : t('app.theme.light')}
            </Text>
            <View
              className="w-12 h-6 rounded-full justify-center"
              style={{
                paddingHorizontal: 2,
                backgroundColor: scheme === 'dark' ? '#E53935' : '#D1D5DB',
              }}
            >
              <View
                className="w-5 h-5 rounded-full bg-white shadow-sm"
                style={{
                  alignSelf: scheme === 'dark' ? 'flex-end' : 'flex-start',
                }}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Account section */}
        <View>
          <Text className="text-xs text-gray-400 uppercase tracking-wide mb-2">
            {t('settings.account')}
          </Text>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-600 rounded-xl py-4 items-center shadow-sm"
            testID="logout-button"
          >
            <Text className="text-white font-semibold text-base">
              {t('auth.logout')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
