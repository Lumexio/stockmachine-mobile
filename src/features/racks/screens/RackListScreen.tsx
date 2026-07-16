import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRacksStore } from '../store/racks-store';
import { NAV_KEYS } from '@constants/nav-keys';
import type { RacksStackParamList } from '../types';

type Props = NativeStackScreenProps<
  RacksStackParamList,
  typeof NAV_KEYS.RACK_LIST
>;

export function RackListScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { racks, loading, fetchAll, remove } = useRacksStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const onRefresh = useCallback(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDelete = (id: number) => {
    Alert.alert(t('actions.delete'), t('modals.deleteConfirm'), [
      { text: t('actions.cancel'), style: 'cancel' },
      {
        text: t('actions.delete'),
        style: 'destructive',
        onPress: () => remove(id),
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={racks}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        ListEmptyComponent={
          !loading ? (
            <Text className="text-center text-gray-400 mt-12">
              {t('common.noData')}
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl p-4 mb-3 shadow-sm flex-row items-center">
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-900">
                {item.name}
              </Text>
              {item.shelve_name !== undefined && (
                <Text className="text-sm text-gray-500 mt-1">
                  {t('tables.racks.columns.shelve_name')}: {item.shelve_name}
                </Text>
              )}
            </View>
            <View className="flex-row" style={{ gap: 8 }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(NAV_KEYS.RACK_FORM, { id: item.id })
                }
                className="px-3 py-1 border border-red-600 rounded-lg"
              >
                <Text className="text-red-600 text-sm">
                  {t('actions.edit')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                className="px-3 py-1 bg-red-50 border border-red-200 rounded-lg"
              >
                <Text className="text-red-600 text-sm">
                  {t('actions.delete')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate(NAV_KEYS.RACK_FORM, {})}
        className="absolute bottom-6 right-6 bg-red-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        testID="add-rack-button"
      >
        <Text
          className="text-white text-3xl font-light"
          style={{ lineHeight: 36 }}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}
