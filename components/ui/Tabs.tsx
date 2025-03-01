import React from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  ViewStyle 
} from 'react-native';
import { Text } from './Text';
import { colors, themeColors } from '../../lib/constants/colors';
import { spacing } from '../../lib/constants/spacing';

interface TabProps {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: TabProps[];
  value: string;
  onChange: (value: string) => void;
  variant?: 'default' | 'pills' | 'underlined';
  scrollable?: boolean;
  style?: ViewStyle;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  value,
  onChange,
  variant = 'default',
  scrollable = false,
  style,
}) => {
  const Container = scrollable ? ScrollView : View;
  const containerProps = scrollable ? { 
    horizontal: true, 
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: styles.scrollableContainer
  } : {};

  return (
    <Container 
      style={[styles.container, style]} 
      {...containerProps}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.value}
          style={[
            styles.tab,
            styles[`${variant}Tab`],
            value === tab.value && styles[`${variant}ActiveTab`],
          ]}
          onPress={() => onChange(tab.value)}
        >
          <Text
            variant="bodySmall"
            color={
              value === tab.value 
                ? styles[`${variant}ActiveTabText`].color 
                : styles[`${variant}TabText`].color
            }
            style={styles.tabText}
          >
            {tab.label}
          </Text>
          {variant === 'underlined' && value === tab.value && (
            <View style={styles.underline} />
          )}
        </TouchableOpacity>
      ))}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  scrollableContainer: {
    paddingHorizontal: spacing[1],
  },
  tab: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    marginRight: spacing[2],
  },
  defaultTab: {
    borderRadius: spacing[5],
    backgroundColor: colors.neutral[100],
  },
  defaultActiveTab: {
    backgroundColor: themeColors.buttonPrimary,
  },
  defaultTabText: {
    color: themeColors.textSecondary,
  },
  defaultActiveTabText: {
    color: colors.white,
  },
  pillsTab: {
    borderRadius: spacing[5],
    backgroundColor: 'transparent',
  },
  pillsActiveTab: {
    backgroundColor: colors.primary[50],
  },
  pillsTabText: {
    color: themeColors.textSecondary,
  },
  pillsActiveTabText: {
    color: themeColors.buttonPrimary,
  },
  underlinedTab: {
    backgroundColor: 'transparent',
    paddingVertical: spacing[3],
    position: 'relative',
  },
  underlinedActiveTab: {
    backgroundColor: 'transparent',
  },
  underlinedTabText: {
    color: themeColors.textSecondary,
  },
  underlinedActiveTabText: {
    color: themeColors.buttonPrimary,
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: themeColors.buttonPrimary,
  },
  tabText: {
    textAlign: 'center',
    fontWeight: '500',
  },
});