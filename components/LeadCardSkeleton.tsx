import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from './ui/Card';
import { Skeleton } from './ui/Skeleton';
import { colors } from '../lib/constants/colors';
import { spacing } from '../lib/constants/spacing';

export const LeadCardSkeleton: React.FC = () => {
  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <Skeleton width={spacing[3]} height={spacing[3]} borderRadius={spacing[1.5]} style={styles.leadIndicator} />
        <View style={styles.leadInfo}>
          <Skeleton width="70%" height={spacing[4.5]} style={styles.leadName} />
          <Skeleton width="90%" height={spacing[4]} style={styles.leadDetails} />
        </View>
        <Skeleton width={spacing[10]} height={spacing[3.5]} style={styles.leadTime} />
      </View>
      
      <View style={styles.actionContainer}>
        <Skeleton width={spacing[9]} height={spacing[9]} borderRadius={spacing[4.5]} style={styles.actionButton} />
        <Skeleton width={spacing[9]} height={spacing[9]} borderRadius={spacing[4.5]} style={styles.actionButton} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing[3],
    padding: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
  },
  leadIndicator: {
    marginRight: spacing[4],
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    marginBottom: spacing[2],
  },
  leadDetails: {
  },
  leadTime: {
  },
  actionContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
    padding: spacing[2],
  },
  actionButton: {
    marginHorizontal: spacing[1],
  },
});