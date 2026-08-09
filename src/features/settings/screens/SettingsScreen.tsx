import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeStore, type ColorScheme } from '@store/theme-store';
import { useAuthStore } from '@store/auth-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkForUpdates } from '../../../utils/github-updater';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'ja', label: '日本語' },
  { code: 'ru', label: 'Русский' },
] as const;

type LangCode = (typeof LANGUAGES)[number]['code'];

const LIGHT_SCHEMES: Array<{ value: ColorScheme; label: string }> = [
  { value: 'default-light', label: 'Default Light' },
  { value: 'electron-neon-light', label: 'Electron Neon Light' },
  { value: 'tokyo-day', label: 'Tokyo Day' },
  { value: 'newspaper-light', label: 'Newspaper Light' },
];

const DARK_SCHEMES: Array<{ value: ColorScheme; label: string }> = [
  { value: 'default-dark', label: 'Default Dark' },
  { value: 'electron-neon-dark', label: 'Electron Neon Dark' },
  { value: 'tokyo-night', label: 'Tokyo Night' },
  { value: 'newspaper-dark', label: 'Newspaper Dark' },
];

export function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { scheme, colors, isDarkActive, setScheme, toggle } = useThemeStore();
  const { user } = useAuthStore();
  const [storagePreference, setStoragePreference] = React.useState<string | null>('server');

  React.useEffect(() => {
    AsyncStorage.getItem('storage_preference').then((pref) => {
      if (pref) setStoragePreference(pref);
    });
  }, []);

  const handleStorageChange = async (val: string) => {
    setStoragePreference(val);
    await AsyncStorage.setItem('storage_preference', val);
  };

  const currentLang = (i18n.language.split('-')[0] ?? 'en') as LangCode;
  
  const canManageSnapshots = ['owner', 'admin'].includes(user?.role || '');
  const isFreePlan = user?.organization?.plan_id === 'free';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="p-4" style={{ gap: 16 }}>
        {/* Language section */}
        <View>
          <View className="flex-row items-center mb-2" style={{ gap: 6 }}>
            <MaterialCommunityIcons name="translate" size={16} color={colors.icon} />
            <Text className="text-xs uppercase tracking-wide" style={{ color: colors.textSecondary }}>
              {t('settings.language')}
            </Text>
          </View>
          <View className="rounded-3xl p-4 " style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
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

        {/* Appearance & Dual-Column Color Schemes */}
        <View>
          <View className="flex-row items-center mb-2" style={{ gap: 6 }}>
            <MaterialCommunityIcons name="palette-outline" size={16} color={colors.icon} />
            <Text className="text-xs uppercase tracking-wide" style={{ color: colors.textSecondary }}>
              {t('settings.appearance')}
            </Text>
          </View>
          <View className="rounded-3xl p-4 " style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
            {/* Dark Mode Switch */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                Dark Theme Mode
              </Text>
              <Switch
                value={isDarkActive}
                onValueChange={() => toggle()}
                trackColor={{ false: '#767577', true: '#E53935' }}
              />
            </View>

            <View className="flex-row" style={{ gap: 12 }}>
              {/* Light Schemes Column */}
              <View style={{ flex: 1, gap: 8 }}>
                <Text className="text-xs font-bold uppercase mb-1" style={{ color: colors.textSecondary }}>
                  Light Schemes
                </Text>
                {LIGHT_SCHEMES.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => setScheme(item.value)}
                    className="p-3 rounded-lg border flex-row items-center justify-between"
                    style={{
                      backgroundColor: scheme === item.value ? colors.surface : colors.card,
                      borderColor: scheme === item.value ? '#E53935' : colors.border,
                    }}
                  >
                    <Text className="text-xs font-semibold" style={{ color: colors.text }}>
                      {item.label}
                    </Text>
                    {scheme === item.value && (
                      <MaterialCommunityIcons name="check-circle" size={14} color="#E53935" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Dark Schemes Column */}
              <View style={{ flex: 1, gap: 8 }}>
                <Text className="text-xs font-bold uppercase mb-1" style={{ color: colors.textSecondary }}>
                  Dark Schemes
                </Text>
                {DARK_SCHEMES.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => setScheme(item.value)}
                    className="p-3 rounded-lg border flex-row items-center justify-between"
                    style={{
                      backgroundColor: scheme === item.value ? colors.surface : colors.card,
                      borderColor: scheme === item.value ? '#E53935' : colors.border,
                    }}
                  >
                    <Text className="text-xs font-semibold" style={{ color: colors.text }}>
                      {item.label}
                    </Text>
                    {scheme === item.value && (
                      <MaterialCommunityIcons name="check-circle" size={14} color="#E53935" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Data Sync Section */}
        {isFreePlan && canManageSnapshots && (
          <View>
            <View className="flex-row items-center mb-2" style={{ gap: 6 }}>
              <MaterialCommunityIcons name="cloud-sync" size={16} color={colors.icon} />
              <Text className="text-xs uppercase tracking-wide" style={{ color: colors.textSecondary }}>
                Data Sync
              </Text>
            </View>
            <View className="rounded-3xl p-4 " style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
              <Text className="text-xs font-bold uppercase mb-3" style={{ color: colors.textSecondary }}>
                Storage Preference
              </Text>
              <View className="flex-row" style={{ gap: 8 }}>
                <TouchableOpacity
                  onPress={() => handleStorageChange('server')}
                  className="flex-1 p-3 rounded-lg border items-center justify-center"
                  style={{
                    backgroundColor: storagePreference === 'server' ? colors.surface : colors.card,
                    borderColor: storagePreference === 'server' ? '#E53935' : colors.border,
                  }}
                >
                  <MaterialCommunityIcons name="server" size={20} color={storagePreference === 'server' ? '#E53935' : colors.icon} />
                  <Text className="text-xs font-semibold mt-1" style={{ color: storagePreference === 'server' ? '#E53935' : colors.text }}>
                    Comet Server
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleStorageChange('gdrive')}
                  className="flex-1 p-3 rounded-lg border items-center justify-center"
                  style={{
                    backgroundColor: storagePreference === 'gdrive' ? colors.surface : colors.card,
                    borderColor: storagePreference === 'gdrive' ? '#E53935' : colors.border,
                  }}
                >
                  <MaterialCommunityIcons name="google-drive" size={20} color={storagePreference === 'gdrive' ? '#E53935' : colors.icon} />
                  <Text className="text-xs font-semibold mt-1" style={{ color: storagePreference === 'gdrive' ? '#E53935' : colors.text }}>
                    Google Drive
                  </Text>
                </TouchableOpacity>
              </View>
              {storagePreference === 'gdrive' && (
                <View className="mt-4 p-3 rounded-lg" style={{ backgroundColor: colors.surface }}>
                  <Text className="text-xs" style={{ color: colors.text }}>
                    Google Drive sync is managed via the Web Dashboard (stockmachine.online). Please log in there to authorize and perform cloud sync operations.
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Updater Section */}
        <View>
          <View className="flex-row items-center mb-2" style={{ gap: 6 }}>
            <MaterialCommunityIcons name="cellphone-arrow-down" size={16} color={colors.icon} />
            <Text className="text-xs uppercase tracking-wide" style={{ color: colors.textSecondary }}>
              {t('settings.updates', 'Updates')}
            </Text>
          </View>
          <View className="rounded-3xl p-4 " style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
             <TouchableOpacity 
               className="bg-red-600 rounded-lg py-3 items-center"
               onPress={() => checkForUpdates(true)}
             >
                <Text className="text-white font-bold">Check for Updates</Text>
             </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
