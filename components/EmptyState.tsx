import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from './ui/Button';
import { Text } from './ui/Text';
import { spacing } from '../lib/constants/spacing';
import { colors, themeColors } from '../lib/constants/colors';

interface EmptyStateProps {
  icon?: React.ComponentType<{ size: number; color: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      {Icon && <Icon size={48} color={colors.neutral[400]} />}
      <Text variant="h4" style={styles.title}>{title}</Text>
      <Text 
        variant="bodySmall" 
        color={themeColors.textSecondary} 
        style={styles.description}
      >
        {description}
      </Text>
      {actionLabel && onAction && (
        <Button
          variant="primary"
          onPress={onAction}
          style={styles.button}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[15],
    paddingHorizontal: spacing[6],
  },
  title: {
    marginTop: spacing[4],
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  button: {
    minWidth: spacing[37.5],
  },
});