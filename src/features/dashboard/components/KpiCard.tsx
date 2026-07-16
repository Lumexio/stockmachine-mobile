import React from 'react';
import { View, Text } from 'react-native';

interface KpiCardProps {
  label: string;
  value: number | string;
  accent?: string;
}

export function KpiCard({ label, value, accent = '#E53935' }: KpiCardProps) {
  return (
    <View
      className="bg-white rounded-xl shadow-sm p-4"
      style={{ flex: 1, margin: 4, minWidth: '45%' }}
    >
      <Text className="text-xs text-gray-500 mb-1">{label}</Text>
      <Text className="text-2xl font-bold" style={{ color: accent }}>
        {value}
      </Text>
    </View>
  );
}
