import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Phone, Mail } from 'lucide-react-native';
import { Card } from './ui/Card';
import { Text } from './ui/Text';
import { colors, themeColors } from '../lib/constants/colors';
import { spacing } from '../lib/constants/spacing';

interface LeadCardProps {
  id: string;
  name: string;
  details: string;
  time: string;
  status: 'hot' | 'warm' | 'cold';
  onPress: () => void;
  onPhonePress?: () => void;
  onEmailPress?: () => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  name,
  details,
  time,
  status,
  onPress,
  onPhonePress,
  onEmailPress,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'hot':
        return themeColors.statusHot;
      case 'warm':
        return themeColors.statusWarm;
      case 'cold':
        return themeColors.statusCold;
      default:
        return themeColors.textSecondary;
    }
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity 
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View 
          style={[
            styles.leadIndicator, 
            { backgroundColor: getStatusColor() }
          ]} 
        />
        <View style={styles.leadInfo}>
          <Text variant="h5" style={styles.leadName}>{name}</Text>
          <Text variant="bodySmall" color={themeColors.textSecondary}>{details}</Text>
        </View>
        <Text variant="caption" color={themeColors.textSecondary}>{time}</Text>
      </TouchableOpacity>
      
      {(onPhonePress || onEmailPress) && (
        <View style={styles.actionContainer}>
          {onPhonePress && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onPhonePress}
            >
              <Phone size={18} color={themeColors.buttonPrimary} />
            </TouchableOpacity>
          )}
          {onEmailPress && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onEmailPress}
            >
              <Mail size={18} color={themeColors.buttonPrimary} />
            </TouchableOpacity>
          )}
        </View>
      )}
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
    width: spacing[3],
    height: spacing[3],
    borderRadius: spacing[1.5],
    marginRight: spacing[4],
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    marginBottom: spacing[1],
  },
  actionContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
    padding: spacing[2],
  },
  actionButton: {
    width: spacing[9],
    height: spacing[9],
    borderRadius: spacing[4.5],
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacing[1],
  },
});