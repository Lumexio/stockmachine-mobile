import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { NAV_KEYS } from '@constants/nav-keys';
import { SupplierListScreen } from './screens/SupplierListScreen';
import { SupplierFormScreen } from './screens/SupplierFormScreen';
import { HeaderRight } from '../../components/HeaderRight';
import type { SuppliersStackParamList } from './types';

export type { SuppliersStackParamList } from './types';

const Stack = createNativeStackNavigator<SuppliersStackParamList>();

export function SuppliersNavigator() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator screenOptions={{ headerRight: () => <HeaderRight /> }}>
      <Stack.Screen
        name={NAV_KEYS.SUPPLIER_LIST}
        component={SupplierListScreen}
        options={{ title: t('tables.suppliers.title', 'Suppliers') }}
      />
      <Stack.Screen
        name={NAV_KEYS.SUPPLIER_FORM}
        component={SupplierFormScreen}
        options={({ route }) => ({
          title: route.params?.id
            ? t('tables.suppliers.edit', 'Edit Supplier')
            : t('tables.suppliers.create', 'New Supplier'),
        })}
      />
    </Stack.Navigator>
  );
}

export { SupplierListScreen, SupplierFormScreen };
