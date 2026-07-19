import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeStore, type ColorScheme } from '@store/theme-store';

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

  const currentLang = (i18n.language.split('-')[0] ?? 'en') as LangCode;

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

        {/* Appearance & Dual-Column Color Schemes */}
        <View>
          <View className="flex-row items-center mb-2" style={{ gap: 6 }}>
            <MaterialCommunityIcons name="palette-outline" size={16} color={colors.icon} />
            <Text className="text-xs uppercase tracking-wide" style={{ color: colors.textSecondary }}>
              {t('settings.appearance')}
            </Text>
          </View>
          <View className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
            <!-- Dark Mode Switch -->
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
      </View>
    </ScrollView>
  );
}
