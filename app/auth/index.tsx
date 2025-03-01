import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../../contexts/AuthContext';
import { Mail, Lock } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Text } from '../../components/ui/Text';
import { useForm } from '../../hooks/useForm';
import { colors, themeColors } from '../../lib/constants/colors';
import { spacing } from '../../lib/constants/spacing';

export default function AuthScreen() {
  const router = useRouter();
  const { signIn, signUp } = useAuthContext();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    email: {
      value: '',
      rules: [
        {
          validate: (value) => value.trim().length > 0,
          message: 'Email is required',
        },
        {
          validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
          message: 'Please enter a valid email address',
        },
      ],
    },
    password: {
      value: '',
      rules: [
        {
          validate: (value) => value.trim().length > 0,
          message: 'Password is required',
        },
        {
          validate: (value) => value.length >= 6,
          message: 'Password must be at least 6 characters',
        },
      ],
    },
  });

  const handleAuth = async () => {
    const { isValid } = form.validateForm();
    
    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await signUp(form.values.email, form.values.password);
      } else {
        result = await signIn(form.values.email, form.values.password);
      }

      if (result.error) {
        Alert.alert('Authentication Error', result.error.message);
      } else {
        // Navigate to main app
        router.replace('/');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text variant="h1" style={styles.title}>Open House Pro</Text>
            <Text variant="body" color={themeColors.textSecondary} style={styles.subtitle}>
              {isSignUp
                ? 'Create an account to get started'
                : 'Sign in to your account'}
            </Text>
          </View>

          <Card style={styles.form}>
            <Input
              label="Email"
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              icon={Mail}
              {...form.getFieldProps('email')}
            />

            <Input
              label="Password"
              placeholder="Password"
              isPassword
              icon={Lock}
              {...form.getFieldProps('password')}
            />

            <Button
              variant="primary"
              onPress={handleAuth}
              disabled={loading}
              loading={loading}
              style={styles.authButton}
              fullWidth
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>

            <Button
              variant="ghost"
              onPress={() => {
                setIsSignUp(!isSignUp);
                form.reset();
              }}
              style={styles.switchModeButton}
            >
              {isSignUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up "}
            </Button>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing[6],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing[10],
  },
  title: {
    marginBottom: spacing[2],
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  authButton: {
    marginTop: spacing[2],
    marginBottom: spacing[4],
  },
  switchModeButton: {
    alignSelf: 'center',
  },
});