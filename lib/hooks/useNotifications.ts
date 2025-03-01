import { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { supabaseApi } from '../supabase';
import { Notification } from '../types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pushToken, setPushToken] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseApi.notifications.getAll();
      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }
      
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
    } catch (error) {
      console.error('Error in fetchNotifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      const { error } = await supabaseApi.notifications.markAsRead(id);
      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }
      
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      return true;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      return false;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const { error } = await supabaseApi.notifications.markAllAsRead();
      if (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
      }
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
      return true;
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
      return false;
    }
  }, []);

  const registerForPushNotifications = useCallback(async () => {
    if (Platform.OS === 'web') {
      console.log('Push notifications are not supported on web');
      return null;
    }

    if (!Device.isDevice) {
      console.log('Push notifications are only available on physical devices');
      return null;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permission not granted for push notifications');
        return null;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setPushToken(token);
      
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#3B82F6',
        });
      }

      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }, []);

  const sendLocalNotification = useCallback(async (title: string, body: string, data?: any) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
        },
        trigger: null, // Send immediately
      });
      return true;
    } catch (error) {
      console.error('Error sending local notification:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    registerForPushNotifications();

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      // Refresh notifications when a new one is received
      fetchNotifications();
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
      // Handle notification tap
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [fetchNotifications, registerForPushNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    pushToken,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    sendLocalNotification,
  };
}