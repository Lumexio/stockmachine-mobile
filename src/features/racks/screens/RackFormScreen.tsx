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
import { useRacksStore } from '../store/racks-store';
import { apiClient } from '@api/axios-client';
import { NAV_KEYS } from '@constants/nav-keys';
import type { RacksStackParamList } from '../types';

type Props = NativeStackScreenProps<
  RacksStackParamList,
  typeof NAV_KEYS.RACK_FORM
>;

interface SelectOption {
  id: number;
  name: string;
}

export function RackFormScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { id } = route.params;
  const isEdit = id !== undefined;
  const { selectedRack, create, update, fetchById } = useRacksStore();

  const [name, setName] = useState('');
  const [shelveId, setShelveId] = useState<number | undefined>();
  const [saving, setSaving] = useState(false);
  const [shelves, setShelves] = useState<SelectOption[]>([]);

  useEffect(() => {
    apiClient
      .get<{ data: SelectOption[] }>('/shelves')
      .then((r) => setShelves(r.data.data))
      .catch(() => null);

    if (isEdit && id !== undefined) {
      fetchById(id);
    }
  }, [id, isEdit, fetchById]);

  useEffect(() => {
    if (isEdit && selectedRack) {
      setName(selectedRack.name);
      setShelveId(selectedRack.shelve_id ?? undefined);
    }
  }, [isEdit, selectedRack]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('', t('forms.validation.required'));
      return;
    }
    setSaving(true);
    try {
      const dto = {
        name: name.trim(),
        ...(shelveId !== undefined && { shelve_id: shelveId }),
      };
      if (isEdit && id !== undefined) {
        await update(id, dto);
      } else {
        await create(dto);
      }
      navigation.goBack();
    } catch {
      Alert.alert('', t('messages.error.create'));
    } finally {
      setSaving(false);
    }
  };

  const chipCls = (selected: boolean) =>
    `mr-2 px-3 py-2 rounded-full border ${
      selected ? 'bg-red-600 border-red-600' : 'border-gray-300 bg-white'
    }`;
  const chipTextCls = (selected: boolean) =>
    `text-sm ${selected ? 'text-white' : 'text-gray-700'}`;

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4" style={{ gap: 16 }}>
        <View>
          <Text className="text-sm text-gray-600 mb-1">
            {t('forms.label.racks.name')}
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
            value={name}
            onChangeText={setName}
            placeholder={t('forms.placeholders.name')}
            testID="name-input"
          />
        </View>

        {shelves.length > 0 && (
          <View>
            <Text className="text-sm text-gray-600 mb-2">
              {t('forms.label.racks.shelve_name')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {shelves.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  onPress={() =>
                    setShelveId(s.id === shelveId ? undefined : s.id)
                  }
                  className={chipCls(s.id === shelveId)}
                >
                  <Text className={chipTextCls(s.id === shelveId)}>
                    {s.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

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
