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
import { useShelvesStore } from '../store/shelves-store';
import { NAV_KEYS } from '@constants/nav-keys';
import type { ShelvesStackParamList } from '../types';

type Props = NativeStackScreenProps<
  ShelvesStackParamList,
  typeof NAV_KEYS.SHELF_FORM
>;

export function ShelfFormScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { id } = route.params;
  const isEdit = id !== undefined;
  const { selectedShelf, create, update, fetchById } = useShelvesStore();

  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && id !== undefined) {
      fetchById(id);
    }
  }, [id, isEdit, fetchById]);

  useEffect(() => {
    if (isEdit && selectedShelf) {
      setName(selectedShelf.name);
    }
  }, [isEdit, selectedShelf]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('', t('forms.validation.required'));
      return;
    }
    setSaving(true);
    try {
      if (isEdit && id !== undefined) {
        await update(id, { name: name.trim() });
      } else {
        await create({ name: name.trim() });
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
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4" style={{ gap: 16 }}>
        <View>
          <Text className="text-sm text-gray-600 mb-1">
            {t('forms.label.shelves.name')}
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
            value={name}
            onChangeText={setName}
            placeholder={t('forms.placeholders.name')}
            testID="name-input"
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
