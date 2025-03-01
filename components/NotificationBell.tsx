import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useNotifications } from '../hooks/useNotifications';
import { Text } from './ui/Text';
import { colors, themeColors } from '../lib/constants/colors';
import { spacing } from '../lib/constants/spacing';

interface NotificationBellProps {
  onPress: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onPress }) => {
  const { unreadCount } = useNotifications();
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Bell size={24} color={themeColors.text} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text 
            variant="caption" 
            color={colors.white} 
            style={styles.badgeText}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: spacing[11],
    height: spacing[11],
    borderRadius: spacing[5.5],
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: spacing[4.5],
    height: spacing[4.5],
    borderRadius: spacing[2.25],
    backgroundColor: colors.danger[500],
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[1],
  },
  badgeText: {
    fontWeight: '700',
  },
});