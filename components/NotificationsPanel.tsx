import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { X, Bell, Check } from 'lucide-react-native';
import { useNotifications } from '../hooks/useNotifications';
import { formatRelativeTime } from '../lib/utils/formatters';
import { Text } from './ui/Text';
import { colors, themeColors } from '../lib/constants/colors';
import { spacing } from '../lib/constants/spacing';
import { shadows } from '../lib/constants/spacing';

interface NotificationsPanelProps {
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  const { 
    notifications, 
    loading, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const renderNotificationItem = ({ item }) => {
    const timeAgo = formatRelativeTime(new Date(item.created_at));
    
    return (
      <TouchableOpacity 
        style={[styles.notificationItem, !item.is_read && styles.unreadItem]}
        onPress={() => markAsRead(item.id)}
      >
        <View style={styles.notificationIcon}>
          <Bell size={20} color={themeColors.buttonPrimary} />
        </View>
        <View style={styles.notificationContent}>
          <Text variant="bodySmall" style={styles.notificationTitle}>{item.title}</Text>
          <Text variant="bodySmall" color={themeColors.textSecondary} style={styles.notificationBody}>{item.body}</Text>
          <Text variant="caption" color={themeColors.textSecondary} style={styles.notificationTime}>{timeAgo}</Text>
        </View>
        {!item.is_read && (
          <View style={styles.unreadDot} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h4" style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color={themeColors.text} />
        </TouchableOpacity>
      </View>
      
      {notifications.length > 0 && (
        <TouchableOpacity 
          style={styles.markAllButton}
          onPress={markAllAsRead}
        >
          <Check size={16} color={themeColors.buttonPrimary} />
          <Text 
            variant="bodySmall" 
            color={themeColors.buttonPrimary} 
            style={styles.markAllText}
          >
            Mark all as read
          </Text>
        </TouchableOpacity>
      )}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.buttonPrimary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Bell size={48} color={colors.neutral[400]} />
          <Text variant="h4" style={styles.emptyTitle}>No notifications</Text>
          <Text 
            variant="bodySmall" 
            color={themeColors.textSecondary} 
            style={styles.emptyText}
          >
            You don't have any notifications yet. They will appear here when you receive them.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: spacing[3],
    ...shadows.lg,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  title: {
    fontWeight: '600',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    padding: spacing[2],
    margin: spacing[2],
  },
  markAllText: {
    marginLeft: spacing[1],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  emptyContainer: {
    padding: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  emptyText: {
    textAlign: 'center',
  },
  listContent: {
    padding: spacing[2],
  },
  notificationItem: {
    flexDirection: 'row',
    padding: spacing[3],
    borderRadius: spacing[2],
    marginBottom: spacing[2],
  },
  unreadItem: {
    backgroundColor: colors.primary[50],
  },
  notificationIcon: {
    width: spacing[10],
    height: spacing[10],
    borderRadius: spacing[5],
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontWeight: '600',
    marginBottom: spacing[1],
  },
  notificationBody: {
    marginBottom: spacing[1],
  },
  notificationTime: {
  },
  unreadDot: {
    width: spacing[2],
    height: spacing[2],
    borderRadius: spacing[1],
    backgroundColor: themeColors.buttonPrimary,
    alignSelf: 'center',
    marginLeft: spacing[2],
  },
});