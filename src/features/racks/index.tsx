import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { NAV_KEYS } from '@constants/nav-keys';
import { RackListScreen } from './screens/RackListScreen';
import { RackFormScreen } from './screens/RackFormScreen';
import { HeaderRight } from '../../components/HeaderRight';
import type { RacksStackParamList } from './types';

export type { RacksStackParamList } from './types';

const Stack = createNativeStackNavigator<RacksStackParamList>();

export function RacksNavigator() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator screenOptions={{ headerRight: () => <HeaderRight /> }}>
      <Stack.Screen
        name={NAV_KEYS.RACK_LIST}
        component={RackListScreen}
        options={{ title: t('tables.racks.title') }}
      />
      <Stack.Screen
        name={NAV_KEYS.RACK_FORM}
        component={RackFormScreen}
        options={({ route }) => ({
          title: route.params?.id
            ? t('tables.racks.edit')
            : t('tables.racks.create'),
        })}
      />
    </Stack.Navigator>
  );
}

export { RackListScreen, RackFormScreen };
