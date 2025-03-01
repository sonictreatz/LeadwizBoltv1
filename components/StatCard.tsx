import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from './ui/Card';
import { Text } from './ui/Text';
import { colors, themeColors } from '../lib/constants/colors';
import { spacing } from '../lib/constants/spacing';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ComponentType<{ size: number; color: string }>;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color = themeColors.buttonPrimary,
  trend,
}) => {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="caption" style={styles.title}>{title}</Text>
        {Icon && <Icon size={20} color={color} />}
      </View>
      <Text variant="h3" style={[styles.value, { color }]}>{value}</Text>
      {trend && (
        <View style={styles.trendContainer}>
          <View 
            style={[
              styles.trendIndicator, 
              { backgroundColor: trend.isPositive ? colors.success[500] : colors.danger[500] }
            ]} 
          />
          <Text 
            variant="caption"
            style={[
              styles.trendText, 
              { color: trend.isPositive ? colors.success[500] : colors.danger[500] }
            ]}
          >
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: spacing[1],
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing[2],
  },
  title: {
    textAlign: 'center',
  },
  value: {
    marginBottom: spacing[1],
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIndicator: {
    width: spacing[2],
    height: spacing[2],
    borderRadius: spacing[1],
    marginRight: spacing[1],
  },
  trendText: {
    fontWeight: '500',
  },
});