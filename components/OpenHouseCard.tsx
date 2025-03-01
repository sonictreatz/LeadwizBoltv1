import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Chrome as Home, Calendar, Clock, QrCode } from 'lucide-react-native';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Text } from './ui/Text';
import { colors, themeColors } from '../lib/constants/colors';
import { spacing } from '../lib/constants/spacing';

export interface OpenHouseCardProps {
  id: string;
  address: string;
  details: string;
  price: string | number;
  date: string;
  time: string;
  status: 'upcoming' | 'active' | 'past';
  visitorCount?: number;
  onPress: () => void;
  onQrCodePress?: () => void;
}

export const OpenHouseCard: React.FC<OpenHouseCardProps> = memo(({
  address,
  details,
  price,
  date,
  time,
  status,
  visitorCount,
  onPress,
  onQrCodePress,
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active Now</Badge>;
      case 'upcoming':
        return <Badge variant="primary">Upcoming</Badge>;
      case 'past':
        return <Badge variant="default">Past</Badge>;
      default:
        return null;
    }
  };

  const formattedPrice = typeof price === 'number' 
    ? `$${price.toLocaleString()}` 
    : price;

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.propertyHeader}>
          <View style={styles.propertyImagePlaceholder}>
            <Home size={24} color={themeColors.buttonPrimary} />
          </View>
          <View style={styles.propertyInfo}>
            <Text variant="h5" style={styles.propertyAddress}>{address}</Text>
            <Text variant="bodySmall" color={themeColors.textSecondary} style={styles.propertyDetails}>{details}</Text>
            <Text variant="h5" color={themeColors.buttonPrimary} style={styles.propertyPrice}>{formattedPrice}</Text>
            <View style={styles.badgeContainer}>
              {getStatusBadge()}
            </View>
          </View>
        </View>
        <View style={styles.propertyFooter}>
          <View style={styles.propertyDateContainer}>
            <View style={styles.dateRow}>
              <Calendar size={16} color={themeColors.textSecondary} />
              <Text variant="bodySmall" style={styles.propertyDate}>{date}</Text>
            </View>
            <View style={styles.dateRow}>
              <Clock size={16} color={themeColors.textSecondary} />
              <Text variant="bodySmall" style={styles.propertyDate}>{time}</Text>
            </View>
          </View>
          {status === 'past' && visitorCount !== undefined ? (
            <View style={styles.statsContainer}>
              <Text variant="bodySmall" color={themeColors.buttonPrimary}>{visitorCount} visitors</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.qrButton}
              onPress={(e) => {
                e.stopPropagation();
                onQrCodePress?.();
              }}
            >
              <QrCode size={20} color={themeColors.buttonPrimary} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing[4],
  },
  propertyHeader: {
    flexDirection: 'row',
    padding: spacing[4],
  },
  propertyImagePlaceholder: {
    width: spacing[20],
    height: spacing[20],
    borderRadius: spacing[2],
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[4],
  },
  propertyInfo: {
    flex: 1,
  },
  propertyAddress: {
    marginBottom: spacing[1],
  },
  propertyDetails: {
    marginBottom: spacing[1],
  },
  propertyPrice: {
    marginBottom: spacing[1],
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: spacing[1],
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  propertyDate: {
    marginLeft: spacing[2],
  },
  qrButton: {
    width: spacing[10],
    height: spacing[10],
    borderRadius: spacing[5],
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    backgroundColor: colors.neutral[100],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: spacing[4],
  },
});