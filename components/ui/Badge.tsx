import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text } from './Text';
import { colors, themeColors } from '../../lib/constants/colors';
import { spacing } from '../../lib/constants/spacing';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}) => {
  return (
    <View style={[
      styles.badge, 
      styles[`${variant}Badge`], 
      styles[`${size}Badge`], 
      style
    ]}>
      <Text 
        variant={size === 'sm' ? 'caption' : 'bodySmall'} 
        style={[
          styles[`${variant}Text`], 
          textStyle
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: spacing[4],
    alignSelf: 'flex-start',
  },
  defaultBadge: {
    backgroundColor: colors.neutral[100],
  },
  primaryBadge: {
    backgroundColor: colors.primary[50],
  },
  successBadge: {
    backgroundColor: colors.success[50],
  },
  warningBadge: {
    backgroundColor: colors.warning[50],
  },
  dangerBadge: {
    backgroundColor: colors.danger[50],
  },
  infoBadge: {
    backgroundColor: colors.primary[50],
  },
  smBadge: {
    paddingVertical: spacing[0.5],
    paddingHorizontal: spacing[1.5],
  },
  mdBadge: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
  },
  lgBadge: {
    paddingVertical: spacing[1.5],
    paddingHorizontal: spacing[2.5],
  },
  defaultText: {
    color: colors.neutral[600],
  },
  primaryText: {
    color: colors.primary[600],
  },
  successText: {
    color: colors.success[600],
  },
  warningText: {
    color: colors.warning[600],
  },
  dangerText: {
    color: colors.danger[600],
  },
  infoText: {
    color: colors.primary[600],
  },
});