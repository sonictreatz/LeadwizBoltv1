import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  cancelAnimation,
  Easing
} from 'react-native-reanimated';
import { colors } from '../../lib/constants/colors';
import { spacing } from '../../lib/constants/spacing';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
  shimmerEnabled?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  shimmerEnabled = true,
}) => {
  const opacity = useSharedValue(shimmerEnabled ? 0.3 : 0.5);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    if (shimmerEnabled) {
      opacity.value = withRepeat(
        withTiming(0.6, { duration: 1000, easing: Easing.ease }),
        -1,
        true
      );
    }

    return () => {
      cancelAnimation(opacity);
    };
  }, [shimmerEnabled]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius },
        animatedStyle,
        style,
      ]}
    />
  );
};

export const SkeletonCircle: React.FC<{ 
  size?: number; 
  style?: ViewStyle;
  shimmerEnabled?: boolean;
}> = ({
  size = 40,
  style,
  shimmerEnabled = true,
}) => {
  return (
    <Skeleton
      width={size}
      height={size}
      borderRadius={size / 2}
      style={style}
      shimmerEnabled={shimmerEnabled}
    />
  );
};

export const SkeletonText: React.FC<{
  lines?: number;
  lineHeight?: number;
  spacing?: number;
  width?: number | string;
  style?: ViewStyle;
  shimmerEnabled?: boolean;
  randomWidths?: boolean;
}> = ({
  lines = 3,
  lineHeight = 16,
  spacing: lineSpacing = 8,
  width = '100%',
  style,
  shimmerEnabled = true,
  randomWidths = true,
}) => {
  // Generate random widths for more natural looking text skeletons
  const lineWidths = React.useMemo(() => {
    if (!randomWidths) return Array(lines).fill(1);
    
    return Array.from({ length: lines }).map((_, index) => {
      if (index === lines - 1) return 0.6 + Math.random() * 0.2; // Last line shorter
      return 0.85 + Math.random() * 0.15; // Other lines between 85-100%
    });
  }, [lines, randomWidths]);

  return (
    <View style={[styles.textContainer, style]}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={typeof width === 'string' ? width : (width * lineWidths[index])}
          height={lineHeight}
          style={{ marginBottom: index === lines - 1 ? 0 : lineSpacing }}
          shimmerEnabled={shimmerEnabled}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.neutral[200],
  },
  textContainer: {
    width: '100%',
  },
});