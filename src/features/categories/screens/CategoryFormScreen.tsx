import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useThemeStore } from '@store/theme-store';
import { useCategoriesStore } from '../store/categories-store';
import { NAV_KEYS } from '@constants/nav-keys';
import type { CategoriesStackParamList } from '../types';

type Props = NativeStackScreenProps<
  CategoriesStackParamList,
  typeof NAV_KEYS.CATEGORY_FORM
>;

export function CategoryFormScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { colors } = useThemeStore();
  const { id } = route.params;
  const isEdit = id !== undefined;
  const { selectedCategory, create, update, fetchById } = useCategoriesStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && id !== undefined) {
      fetchById(id);
    }
  }, [id, isEdit, fetchById]);

  useEffect(() => {
    if (isEdit && selectedCategory) {
      setName(selectedCategory.name);
      setDescription(selectedCategory.description ?? '');
    }
  }, [isEdit, selectedCategory]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('', t('forms.validation.required'));
      return;
    }
    setSaving(true);
    try {
      const dto = {
        name: name.trim(),
        ...(description.trim() && { description: description.trim() }),
      };
      if (isEdit && id !== undefined) {
        await update(id, dto);
      } else {
        await create(dto);
      }
      navigation.goBack();
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || t('messages.error.create');
      Alert.alert('', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="p-4" style={{ gap: 16 }}>
        <View>
          <Text className="text-sm mb-1" style={{ color: colors.text }}>
            {t('forms.label.categories.name')}
          </Text>
          <TextInput
            className="border rounded-lg px-4 py-3"
            style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            placeholder={t('forms.placeholders.name')}
            testID="name-input"
          />
        </View>

        <View>
          <Text className="text-sm mb-1" style={{ color: colors.text }}>
            {t('forms.label.categories.description')}
          </Text>
          <TextInput
            className="border rounded-lg px-4 py-3"
            style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            placeholder={t('forms.placeholders.description')}
            multiline
            numberOfLines={3}
            testID="description-input"
          />
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className="bg-red-600 rounded-xl py-4 items-center mt-2"
          testID="save-button"
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              {t('actions.save')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
