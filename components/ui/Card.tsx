import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, themeColors } from '../../lib/constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'md',
}) => {
  return (
    <View style={[
      styles.card,
      styles[`${variant}Card`],
      styles[`${padding}Padding`],
      style
    ]}>
      {children}
    </View>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({ 
  children, 
  style 
}) => (
  <View style={[styles.cardHeader, style]}>
    {children}
  </View>
);

export const CardContent: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({ 
  children, 
  style 
}) => (
  <View style={[styles.cardContent, style]}>
    {children}
  </View>
);

export const CardFooter: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({ 
  children, 
  style 
}) => (
  <View style={[styles.cardFooter, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: themeColors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  defaultCard: {
    shadowColor: themeColors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  elevatedCard: {
    shadowColor: themeColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  outlinedCard: {
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  nonePadding: {
    padding: 0,
  },
  smPadding: {
    padding: 8,
  },
  mdPadding: {
    padding: 16,
  },
  lgPadding: {
    padding: 24,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardContent: {
    marginBottom: 12,
  },
  cardFooter: {
    marginTop: 8,
  },
});