import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { NAV_KEYS } from '@constants/nav-keys';
import { ShelfListScreen } from './screens/ShelfListScreen';
import { ShelfFormScreen } from './screens/ShelfFormScreen';
import type { ShelvesStackParamList } from './types';

export type { ShelvesStackParamList } from './types';

const Stack = createNativeStackNavigator<ShelvesStackParamList>();

export function ShelvesNavigator() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NAV_KEYS.SHELF_LIST}
        component={ShelfListScreen}
        options={{ title: t('tables.shelves.title') }}
      />
      <Stack.Screen
        name={NAV_KEYS.SHELF_FORM}
        component={ShelfFormScreen}
        options={({ route }) => ({
          title: route.params?.id
            ? t('tables.shelves.edit')
            : t('tables.shelves.create'),
        })}
      />
    </Stack.Navigator>
  );
}

export { ShelfListScreen, ShelfFormScreen };
