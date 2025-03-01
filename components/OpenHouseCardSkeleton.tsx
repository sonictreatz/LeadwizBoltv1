import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from './ui/Card';
import { Skeleton } from './ui/Skeleton';
import { colors } from '../lib/constants/colors';
import { spacing } from '../lib/constants/spacing';

export const OpenHouseCardSkeleton: React.FC = () => {
  return (
    <Card style={styles.card}>
      <View style={styles.propertyHeader}>
        <Skeleton width={spacing[20]} height={spacing[20]} borderRadius={spacing[2]} style={styles.propertyImagePlaceholder} />
        <View style={styles.propertyInfo}>
          <Skeleton width="90%" height={spacing[4.5]} style={styles.propertyAddress} />
          <Skeleton width="70%" height={spacing[4]} style={styles.propertyDetails} />
          <Skeleton width={spacing[25]} height={spacing[4.5]} style={styles.propertyPrice} />
          <Skeleton width={spacing[20]} height={spacing[6]} style={styles.badgeContainer} borderRadius={spacing[3]} />
        </View>
      </View>
      <View style={styles.propertyFooter}>
        <View style={styles.propertyDateContainer}>
          <Skeleton width="60%" height={spacing[4]} style={styles.dateRow} />
          <Skeleton width="50%" height={spacing[4]} style={styles.dateRow} />
        </View>
        <Skeleton width={spacing[10]} height={spacing[10]} borderRadius={spacing[5]} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing[4],
  },
  propertyHeader: {
    flexDirection: 'row',
    padding: spacing[4],
  },
  propertyImagePlaceholder: {
    marginRight: spacing[4],
  },
  propertyInfo: {
    flex: 1,
  },
  propertyAddress: {
    marginBottom: spacing[2],
  },
  propertyDetails: {
    marginBottom: spacing[2],
  },
  propertyPrice: {
    marginBottom: spacing[2],
  },
  badgeContainer: {
  },
  propertyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
    padding: spacing[4],
  },
  propertyDateContainer: {
    flex: 1,
  },
  dateRow: {
    marginBottom: spacing[2],
  },
});

export { OpenHouseCardSkeleton }