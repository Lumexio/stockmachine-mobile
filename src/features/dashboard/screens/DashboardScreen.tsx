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

export function DashboardScreen() {
  const { t } = useTranslation();
  const { summary, movements, topProducts, loading, fetchAll } =
    useDashboardStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const onRefresh = useCallback(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading && summary === null) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
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
            label={t('dashboard.lowStock')}
            value={summary?.low_stock_count ?? 0}
            accent={
              (summary?.low_stock_count ?? 0) > 0 ? '#FF5722' : Colors.primary
            }
          />
          <KpiCard
            label={t('dashboard.movementsToday')}
            value={summary?.movements_today ?? 0}
          />
        </View>
      </View>

      {movements.length > 0 && (
        <MovementsChart data={movements} label={t('dashboard.movements')} />
      )}

      <View className="px-4 pb-8">
        <Text className="text-base font-semibold text-gray-800 mb-2">
          {t('dashboard.topProducts')}
        </Text>
        {topProducts.map((p) => (
          <View
            key={p.id}
            className="flex-row justify-between items-center py-3 border-b border-gray-200"
          >
            <Text className="text-gray-800 flex-1">{p.name}</Text>
            <Text className="text-gray-500 text-sm">{p.quantity}</Text>
          </View>
        ))}
        {topProducts.length === 0 && (
          <Text className="text-gray-400 text-center mt-4">
            {t('common.noData')}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
