import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import { typography } from '../../lib/constants/typography';
import { colors, themeColors } from '../../lib/constants/colors';

type TextVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5' 
  | 'h6' 
  | 'body' 
  | 'bodySmall' 
  | 'caption' 
  | 'button' 
  | 'buttonSmall';

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: string;
  style?: TextStyle;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  onPress?: () => void;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color,
  style,
  ...props
}) => {
  return (
    <RNText
      style={[
        styles[variant],
        color ? { color } : null,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  h1: {
    ...typography.h1,
    color: themeColors.text,
  },
  h2: {
    ...typography.h2,
    color: themeColors.text,
  },
  h3: {
    ...typography.h3,
    color: themeColors.text,
  },
  h4: {
    ...typography.h4,
    color: themeColors.text,
  },
  h5: {
    ...typography.h5,
    color: themeColors.text,
  },
  h6: {
    ...typography.h6,
    color: themeColors.text,
  },
  body: {
    ...typography.body,
    color: themeColors.text,
  },
  bodySmall: {
    ...typography.bodySmall,
    color: themeColors.text,
  },
  caption: {
    ...typography.caption,
    color: themeColors.textSecondary,
  },
  button: {
    ...typography.button,
    color: themeColors.text,
  },
  buttonSmall: {
    ...typography.buttonSmall,
    color: themeColors.text,
  },
});