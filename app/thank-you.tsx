import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleCheck as CheckCircle, Chrome as Home, ArrowRight } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TransitionView } from '../components/TransitionView';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  Easing
} from 'react-native-reanimated';

export default function ThankYouScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams();
  
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Animate the checkmark icon
    scale.value = withSequence(
      withTiming(1.2, { duration: 400, easing: Easing.out(Easing.back()) }),
      withTiming(1, { duration: 200 })
    );
    
    opacity.value = withTiming(1, { duration: 400 });
    
    rotation.value = withSequence(
      withTiming(-10, { duration: 100 }),
      withTiming(10, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
      opacity: opacity.value
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, animatedStyle]}>
          <CheckCircle size={80} color="#3b82f6" />
        </Animated.View>
        
        <TransitionView type="fade" duration={400} delay={300}>
          <Text style={styles.title}>Thank You!</Text>
          <Text style={styles.message}>
            {name ? `${name}, thank` : 'Thank'} you for signing in to our open house. 
            We appreciate your visit and hope you enjoyed the property.
          </Text>
        </TransitionView>
        
        <TransitionView type="slide-up" duration={400} delay={600}>
          <Card style={styles.infoContainer}>
            <Text style={styles.infoTitle}>What's Next?</Text>
            <Text style={styles.infoText}>
              Our agent will follow up with you soon to answer any questions you may have about the property.
            </Text>
          </Card>
        </TransitionView>
        
        <TransitionView type="slide-up" duration={400} delay={800}>
          <View style={styles.actionsContainer}>
            <Button 
              variant="primary"
              icon={Home}
              onPress={() => router.push('/')}
              style={styles.primaryButton}
            >
              Return to Home
            </Button>
            
            <Button 
              variant="secondary"
              iconPosition="right"
              icon={ArrowRight}
              onPress={() => router.push('/open-houses')}
              style={styles.secondaryButton}
            >
              View More Properties
            </Button>
          </View>
        </TransitionView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  infoContainer: {
    backgroundColor: '#eff6ff',
    marginBottom: 32,
    width: '100%',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  actionsContainer: {
    width: '100%',
  },
  primaryButton: {
    marginBottom: 12,
  },
  secondaryButton: {
    marginBottom: 12,
  },
});