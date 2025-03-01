import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, Text } from 'react-native';
import 'react-native-url-polyfill/auto';
import { AuthProvider } from '../contexts/AuthContext';
import { setupNotificationListeners } from '../lib/notifications';
import { colors } from '../lib/constants/colors';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.frameworkReady?.();
    }
    
    // Set up notification listeners
    const unsubscribe = setupNotificationListeners();
    
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <AuthProvider>
        <Stack 
          screenOptions={{ 
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 200,
            contentStyle: { backgroundColor: colors.neutral[50] },
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="auth" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen 
            name="qr-code" 
            options={{ 
              presentation: 'modal',
              animation: 'slide_from_bottom',
              animationDuration: 250,
            }} 
          />
          <Stack.Screen 
            name="visitor-form" 
            options={{ 
              presentation: 'modal',
              animation: 'slide_from_bottom',
              animationDuration: 250,
            }} 
          />
          <Stack.Screen 
            name="open-houses/create" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="open-houses/details" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="property-details" 
            options={{ 
              headerShown: false,
              animation: 'fade',
              animationDuration: 300,
            }} 
          />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
});