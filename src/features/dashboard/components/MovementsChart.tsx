import React from 'react';
import { View, Text } from 'react-native';
import { CartesianChart, Bar } from 'victory-native';
import type { MovementData } from '../api/dashboard-api';

interface MovementsChartProps {
  data: MovementData[];
  label: string;
}

export function MovementsChart({ data, label }: MovementsChartProps) {
  const chartData = data.map((d) => ({
    day: new Date(d.date).getDate(),
    entries: d.entries,
    withdrawals: d.withdrawals,
  }));

  return (
    <View className="mx-4 mb-4">
      <Text className="text-base font-semibold text-gray-800 mb-2">
        {label}
      </Text>
      <View style={{ height: 200 }}>
        <CartesianChart
          data={chartData}
          xKey="day"
          yKeys={['entries', 'withdrawals']}
        >
          {({ points, chartBounds }) => (
            <>
              <Bar
                points={points.entries}
                chartBounds={chartBounds}
                color="#E53935"
                roundedCorners={{ topLeft: 4, topRight: 4 }}
              />
              <Bar
                points={points.withdrawals}
                chartBounds={chartBounds}
                color="#90A4AE"
                roundedCorners={{ topLeft: 4, topRight: 4 }}
              />
            </>
          )}
        </CartesianChart>
      </View>
    </View>
  );
}
