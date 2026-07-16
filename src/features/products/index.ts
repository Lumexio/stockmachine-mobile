import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { NAV_KEYS } from '@constants/nav-keys';
import { ProductListScreen } from './screens/ProductListScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { ProductFormScreen } from './screens/ProductFormScreen';
import type { ProductsStackParamList } from './types';

export type { ProductsStackParamList } from './types';

const Stack = createNativeStackNavigator<ProductsStackParamList>();

export function ProductsNavigator() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NAV_KEYS.PRODUCT_LIST}
        component={ProductListScreen}
        options={{ title: t('tables.products.title') }}
      />
      <Stack.Screen
        name={NAV_KEYS.PRODUCT_DETAIL}
        component={ProductDetailScreen}
        options={{ title: t('tables.products.title') }}
      />
      <Stack.Screen
        name={NAV_KEYS.PRODUCT_FORM}
        component={ProductFormScreen}
        options={({ route }) => ({
          title: route.params?.id
            ? t('tables.products.edit')
            : t('tables.products.create'),
        })}
      />
    </Stack.Navigator>
  );
}

export { ProductListScreen, ProductDetailScreen, ProductFormScreen };
