import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDashboardStore } from '../store/dashboard-store';
import { KpiCard } from '../components/KpiCard';
import { MovementsChart } from '../components/MovementsChart';
import { Colors } from '@constants/theme';
import { useThemeStore } from '@store/theme-store';
import { useAuthStore } from '@store/auth-store';
import { NAV_KEYS } from '@constants/nav-keys';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export function DashboardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { summary, movements, topProducts, loading, fetchAll } = useDashboardStore();
  const { colors } = useThemeStore();
  const currentLocationId = useAuthStore(s => s.currentLocationId);

  useEffect(() => {
    fetchAll();
  }, [fetchAll, currentLocationId]);

  const onRefresh = useCallback(() => {
    fetchAll();
  }, [fetchAll]);

  const totalEntries = movements.reduce((acc, cur) => acc + cur.entries, 0);
  const totalWithdrawals = movements.reduce((acc, cur) => acc + cur.withdrawals, 0);

  if (loading && summary === null) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      <View className="p-4">
        <View className="flex-row flex-wrap">
          <KpiCard
            label={t('dashboard.totalProducts')}
            value={summary?.total_products ?? 0}
          />
          <KpiCard
            label={t('dashboard.totalStock')}
            value={summary?.total_stock ?? 0}
          />
          <KpiCard
            label="Total Value"
            value={`$${(summary?.total_value ?? 0).toFixed(2)}`}
            accent="#4CAF50"
          />
          <KpiCard
            label={t('dashboard.lowStock')}
            value={summary?.low_stock_count ?? 0}
            onPress={() => {
              navigation.navigate(NAV_KEYS.PRODUCTS_STACK);
            }}
            accent={
              (summary?.low_stock_count ?? 0) > 0 ? '#FF5722' : Colors.primary
            }
          />
          <KpiCard
            label={t('dashboard.movementsToday')}
            value={summary?.movements_today ?? 0}
          />
          <KpiCard
            label="Total Entries"
            value={totalEntries}
            accent="#2196F3"
          />
          <KpiCard
            label="Total Withdrawals"
            value={totalWithdrawals}
            accent="#F44336"
          />
        </View>
      </View>

      {movements.length > 0 && (
        <MovementsChart data={movements} label={t('dashboard.movements')} />
      )}

      <View className="px-4 pb-8">
        <Text className="text-base font-semibold mb-2" style={{ color: colors.text }}>
          {t('dashboard.topProducts')}
        </Text>
        {topProducts.map((p) => (
          <View
            key={p.id}
            className="flex-row justify-between items-center py-3 border-b"
            style={{ borderBottomColor: colors.border }}
          >
            <Text className="flex-1" style={{ color: colors.text }}>{p.name}</Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>{p.quantity}</Text>
          </View>
        ))}
        {topProducts.length === 0 && (
          <Text className="text-center mt-4" style={{ color: colors.textSecondary }}>
            {t('common.noData')}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
