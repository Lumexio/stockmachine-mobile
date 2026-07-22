import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHistoryStore } from '../store/history-store';
import { useAuthStore } from '@store/auth-store';
import { HistoryItem } from '../components/HistoryItem';
import type { EntityType, OperationType } from '../api/history-api';
import { Colors } from '@constants/theme';

type OperationFilter = OperationType | 'all';
type EntityFilter = EntityType | 'all';

export function HistoryScreen() {
  const { t } = useTranslation();
  const {
    items,
    loading,
    page,
    total,
    operationFilter,
    entityTypeFilter,
    fetchPage,
    setOperationFilter,
    setEntityTypeFilter,
  } = useHistoryStore();
  const currentLocationId = useAuthStore(s => s.currentLocationId);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage, currentLocationId]);

  const onRefresh = useCallback(() => {
    fetchPage(1);
  }, [fetchPage]);

  const handleLoadMore = () => {
    if (!loading && items.length < total) {
      fetchPage(page + 1);
    }
  };

  const activeOpFilter: OperationFilter = operationFilter ?? 'all';
  const activeEntityFilter: EntityFilter = entityTypeFilter ?? 'all';

  const opFilters: Array<{ key: OperationFilter; label: string }> = [
    { key: 'all', label: t('history.filters.all') },
    { key: 'entry', label: t('history.filters.entry') },
    { key: 'withdrawal', label: t('history.filters.withdrawal') },
  ];

  const entityFilters: Array<{ key: EntityFilter; label: string }> = [
    { key: 'all', label: t('history.filters.all') },
    { key: 'product', label: t('history.filters.product') },
    { key: 'category', label: t('history.filters.category') },
    { key: 'rack', label: t('history.filters.rack') },
    { key: 'shelf', label: t('history.filters.shelf') },
  ];

  const chipCls = (active: boolean) =>
    `mr-2 px-3 rounded-full border ${
      active ? 'bg-red-600 border-red-600' : 'border-gray-300 bg-white'
    }`;
  const chipTextCls = (active: boolean) =>
    `text-sm py-1.5 ${active ? 'text-white' : 'text-gray-700'}`;

  return (
    <View className="flex-1 bg-gray-50">
      <View className="pt-3 pb-1 px-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {opFilters.map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() =>
                setOperationFilter(
                  f.key === 'all' ? undefined : (f.key as OperationType),
                )
              }
              className={chipCls(f.key === activeOpFilter)}
            >
              <Text className={chipTextCls(f.key === activeOpFilter)}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="py-2 px-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {entityFilters.map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() =>
                setEntityTypeFilter(
                  f.key === 'all' ? undefined : (f.key as EntityType),
                )
              }
              className={chipCls(f.key === activeEntityFilter)}
            >
              <Text className={chipTextCls(f.key === activeEntityFilter)}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={loading && page === 1}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{ padding: 16 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListEmptyComponent={
          !loading ? (
            <Text className="text-center text-gray-400 mt-12">
              {t('common.noData')}
            </Text>
          ) : null
        }
        ListFooterComponent={
          loading && page > 1 ? (
            <ActivityIndicator
              size="small"
              color={Colors.primary}
              style={{ marginVertical: 16 }}
            />
          ) : null
        }
        renderItem={({ item }) => <HistoryItem record={item} />}
      />
    </View>
  );
}
