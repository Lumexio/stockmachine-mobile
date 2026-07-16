import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { HistoryRecord } from '../api/history-api';

const OPERATION_COLORS: Record<string, string> = {
  entry: '#4CAF50',
  withdrawal: '#FF5722',
  create: '#2196F3',
  update: '#FF9800',
  delete: '#9E9E9E',
};

interface HistoryItemProps {
  record: HistoryRecord;
}

export function HistoryItem({ record }: HistoryItemProps) {
  const { t } = useTranslation();
  const badgeColor = OPERATION_COLORS[record.operation] ?? '#9E9E9E';
  const date = new Date(record.created_at).toLocaleDateString();

  const qtyChange =
    record.quantity_before !== null && record.quantity_after !== null
      ? `${record.quantity_before} → ${record.quantity_after}`
      : null;

  return (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
      <View className="flex-row items-center justify-between mb-2">
        <View
          className="px-2 rounded"
          style={{ paddingVertical: 2, backgroundColor: `${badgeColor}22` }}
        >
          <Text
            className="text-xs font-semibold capitalize"
            style={{ color: badgeColor }}
          >
            {record.operation}
          </Text>
        </View>
        <Text className="text-xs text-gray-400">{date}</Text>
      </View>

      <Text className="text-sm text-gray-700">
        {t('history.entity')}: {record.entity_type} #{record.entity_id}
      </Text>

      {qtyChange !== null && (
        <Text className="text-sm text-gray-500 mt-1">
          {t('history.quantityBefore')} / {t('history.quantityAfter')}:{' '}
          {qtyChange}
        </Text>
      )}

      {record.notes !== null && record.notes.length > 0 && (
        <Text className="text-xs text-gray-400 mt-1 italic">
          {record.notes}
        </Text>
      )}
    </View>
  );
}
