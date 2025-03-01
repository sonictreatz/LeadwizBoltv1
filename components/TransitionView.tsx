import React, { useEffect, memo } from 'react';
import { ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withDelay,
} from 'react-native-reanimated';

type TransitionType = 'fade' | 'slide-up' | 'slide-right' | 'scale';

interface TransitionViewProps extends ViewProps {
  type?: TransitionType;
  duration?: number;
  delay?: number;
  initialValues?: {
    opacity?: number;
    translateY?: number;
    translateX?: number;
    scale?: number;
  };
}

const TransitionViewComponent: React.FC<TransitionViewProps> = ({
  children,
  type = 'fade',
  duration = 300,
  delay = 0,
  initialValues,
  style,
  ...props
}) => {
  // Initialize animation values
  const opacity = useSharedValue(initialValues?.opacity ?? (type === 'fade' ? 0 : 1));
  const translateY = useSharedValue(initialValues?.translateY ?? (type === 'slide-up' ? 20 : 0));
  const translateX = useSharedValue(initialValues?.translateX ?? (type === 'slide-right' ? -20 : 0));
  const scale = useSharedValue(initialValues?.scale ?? (type === 'scale' ? 0.95 : 1));

  // Create animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
        { scale: scale.value },
      ],
    };
  });

  // Run animations on mount
  useEffect(() => {
    const timingConfig = {
      duration,
      easing: Easing.bezier(0.16, 1, 0.3, 1), // Smooth easing curve
    };

    if (type === 'fade' || initialValues?.opacity !== undefined) {
      opacity.value = withDelay(delay, withTiming(1, timingConfig));
    }
    
    if (type === 'slide-up' || initialValues?.translateY !== undefined) {
      translateY.value = withDelay(delay, withTiming(0, timingConfig));
    }
    
    if (type === 'slide-right' || initialValues?.translateX !== undefined) {
      translateX.value = withDelay(delay, withTiming(0, timingConfig));
    }
    
    if (type === 'scale' || initialValues?.scale !== undefined) {
      scale.value = withDelay(delay, withTiming(1, timingConfig));
    }
  }, []);

  return (
    <Animated.View style={[animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const TransitionView = memo(TransitionViewComponent);