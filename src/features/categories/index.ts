import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { NAV_KEYS } from '@constants/nav-keys';
import { CategoryListScreen } from './screens/CategoryListScreen';
import { CategoryFormScreen } from './screens/CategoryFormScreen';
import type { CategoriesStackParamList } from './types';

export type { CategoriesStackParamList } from './types';

const Stack = createNativeStackNavigator<CategoriesStackParamList>();

export function CategoriesNavigator() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NAV_KEYS.CATEGORY_LIST}
        component={CategoryListScreen}
        options={{ title: t('tables.categories.title') }}
      />
      <Stack.Screen
        name={NAV_KEYS.CATEGORY_FORM}
        component={CategoryFormScreen}
        options={({ route }) => ({
          title: route.params?.id
            ? t('tables.categories.edit')
            : t('tables.categories.create'),
        })}
      />
    </Stack.Navigator>
  );
}

export { CategoryListScreen, CategoryFormScreen };
