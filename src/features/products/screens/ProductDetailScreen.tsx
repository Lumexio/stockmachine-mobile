import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useThemeStore } from '@store/theme-store';
import { useProductsStore } from '../store/products-store';
import { StockActionSheet, StockAction } from '../components/StockActionSheet';
import { NAV_KEYS } from '@constants/nav-keys';
import { Colors } from '@constants/theme';
import type { ProductsStackParamList } from '../types';

type Props = NativeStackScreenProps<
  ProductsStackParamList,
  typeof NAV_KEYS.PRODUCT_DETAIL
>;

export function ProductDetailScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { colors } = useThemeStore();
  const { id } = route.params;
  const { selectedProduct, loading, fetchById, entry, withdrawal, remove } =
    useProductsStore();
  const [sheetAction, setSheetAction] = useState<StockAction | null>(null);

  const loadProduct = useCallback(() => {
    fetchById(id);
  }, [id, fetchById]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleStockAction = async (quantity: number, notes: string) => {
    if (sheetAction === 'entry') {
      await entry(id, { quantity, notes });
    } else if (sheetAction === 'withdrawal') {
      await withdrawal(id, { quantity, notes });
    }
  };

  const handleDelete = () => {
    Alert.alert(t('actions.delete'), t('modals.deleteConfirm'), [
      { text: t('actions.cancel'), style: 'cancel' },
      {
        text: t('actions.delete'),
        style: 'destructive',
        onPress: async () => {
          await remove(id);
          navigation.goBack();
        },
      },
    ]);
  };

  if (loading || selectedProduct === null || selectedProduct.id !== id) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadProduct} />
      }
    >
      <View className="p-4">
        <View className="rounded-xl p-5 mb-4 shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}>
          <Text className="text-xl font-bold mb-1" style={{ color: colors.text }}>
            {selectedProduct.name}
          </Text>
          <View className="flex-row items-baseline mt-2">
            <Text className="text-4xl font-bold text-red-600">
              {selectedProduct.quantity}
            </Text>
            <Text className="ml-2 text-sm" style={{ color: colors.textSecondary }}>
              {t('common.quantity')}
            </Text>
          </View>
        </View>

        <View className="flex-row mb-4" style={{ gap: 12 }}>
          <TouchableOpacity
            onPress={() => setSheetAction('entry')}
            className="flex-1 bg-green-600 rounded-xl py-4 items-center"
            testID="entry-button"
          >
            <Text className="text-white font-semibold">
              {t('actions.entry')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSheetAction('withdrawal')}
            className="flex-1 bg-orange-500 rounded-xl py-4 items-center"
            testID="withdrawal-button"
          >
            <Text className="text-white font-semibold">
              {t('actions.withdrawal')}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row" style={{ gap: 12 }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(NAV_KEYS.PRODUCT_FORM, {
                id: selectedProduct.id,
              })
            }
            className="flex-1 border border-red-600 rounded-xl py-3 items-center"
            testID="edit-button"
          >
            <Text className="text-red-600 font-medium">
              {t('actions.edit')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            className="flex-1 border border-red-600 rounded-xl py-3 items-center"
            testID="delete-button"
          >
            <Text className="text-red-600 font-medium">
              {t('actions.delete')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <StockActionSheet
        visible={sheetAction !== null}
        action={sheetAction}
        onClose={() => setSheetAction(null)}
        onConfirm={handleStockAction}
      />
    </ScrollView>
  );
}
