import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@store/theme-store';

interface KpiCardProps {
  label: string;
  value: number | string;
  accent?: string;
  onPress?: () => void;
}

export function KpiCard({ label, value, accent = '#E53935', onPress }: KpiCardProps) {
  const { colors } = useThemeStore();
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      className="rounded-xl shadow-sm p-4"
      style={{ flex: 1, margin: 4, minWidth: '45%', backgroundColor: colors.surface }}
    >
      <Text className="text-xs mb-1" style={{ color: colors.textSecondary }}>{label}</Text>
      <Text className="text-2xl font-bold" style={{ color: accent }}>
        {value}
      </Text>
    </Container>
  );
}
