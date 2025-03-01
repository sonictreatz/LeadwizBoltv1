import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabaseApi } from './supabase';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Register for push notifications
export const registerForPushNotifications = async () => {
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

    // If permission not determined, ask for it
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // If permission not granted, exit
    if (finalStatus !== 'granted') {
      console.log('Permission not granted for push notifications');
      return null;
    }

    // Get push token
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    
    // Configure notification behavior for Android
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
};

// Send a local notification
export const sendLocalNotification = async (title: string, body: string, data?: any) => {
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
};

// Set up notification listeners
export const setupNotificationListeners = () => {
  // On web, we don't need to set up notification listeners
  if (Platform.OS === 'web') {
    return () => {};
  }

  try {
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
      // Handle notification tap
      const data = response.notification.request.content.data;
      
      // You can add navigation logic here based on the notification type
      if (data.type === 'visitor_checkin' && data.relatedId) {
        // Navigate to visitor details
        // navigation.navigate('Leads', { screen: 'VisitorDetails', params: { id: data.relatedId } });
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  } catch (error) {
    console.error('Error setting up notification listeners:', error);
    return () => {};
  }
};