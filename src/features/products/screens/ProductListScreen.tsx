import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useThemeStore } from '@store/theme-store';
import { useAuthStore } from '@store/auth-store';
import { useProductsStore } from '../store/products-store';
import { NAV_KEYS } from '@constants/nav-keys';
import type { ProductsStackParamList } from '../types';

type Props = NativeStackScreenProps<
  ProductsStackParamList,
  typeof NAV_KEYS.PRODUCT_LIST
>;

export function ProductListScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { colors } = useThemeStore();
  const { products, loading, fetchAll } = useProductsStore();
  const currentLocationId = useAuthStore(s => s.currentLocationId);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAll();
  }, [fetchAll, currentLocationId]);

  const onRefresh = useCallback(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="px-4 pt-4 pb-2">
        <TextInput
          className="border rounded-lg px-4 py-2"
          style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
          placeholderTextColor={colors.textSecondary}
          placeholder={t('common.search')}
          value={search}
          onChangeText={setSearch}
          testID="search-input"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        ListEmptyComponent={
          !loading ? (
            <Text className="text-center text-gray-400 mt-12">
              {t('common.noData')}
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(NAV_KEYS.PRODUCT_DETAIL, { id: item.id })
            }
            className="rounded-xl p-4 mb-3 shadow-sm"
            style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}
            testID={`product-item-${item.id}`}
          >
            <Text className="text-base font-medium" style={{ color: colors.text }}>
              {item.name}
            </Text>
            <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
              {t('tables.products.columns.quantity')}: {item.quantity}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate(NAV_KEYS.PRODUCT_FORM, {})}
        className="absolute bottom-6 right-6 bg-red-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        testID="add-product-button"
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
