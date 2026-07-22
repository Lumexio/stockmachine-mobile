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
import { useThemeStore } from '@store/theme-store';
import { useAuthStore } from '@store/auth-store';
import { useCategoriesStore } from '../store/categories-store';
import { NAV_KEYS } from '@constants/nav-keys';
import type { CategoriesStackParamList } from '../types';

type Props = NativeStackScreenProps<
  CategoriesStackParamList,
  typeof NAV_KEYS.CATEGORY_LIST
>;

export function CategoryListScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { colors } = useThemeStore();
  const { categories, loading, fetchAll, remove } = useCategoriesStore();
  const currentLocationId = useAuthStore(s => s.currentLocationId);

  useEffect(() => {
    fetchAll();
  }, [fetchAll, currentLocationId]);

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
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <FlatList
        data={categories}
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
          <View className="rounded-xl p-4 mb-3 shadow-sm flex-row items-center" style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}>
            <View className="flex-1">
              <Text className="text-base font-medium" style={{ color: colors.text }}>
                {item.name}
              </Text>
              {item.description !== null && (
                <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                  {item.description}
                </Text>
              )}
            </View>
            <View className="flex-row" style={{ gap: 8 }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(NAV_KEYS.CATEGORY_FORM, { id: item.id })
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
        onPress={() => navigation.navigate(NAV_KEYS.CATEGORY_FORM, {})}
        className="absolute bottom-6 right-6 bg-red-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        testID="add-category-button"
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
