import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
type AvatarVariant = 'circle' | 'rounded' | 'square';

interface AvatarProps {
  source?: { uri: string } | null;
  initials?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  initials,
  size = 'md',
  variant = 'circle',
  backgroundColor = '#3b82f6',
  style,
}) => {
  const getSize = (): number => {
    switch (size) {
      case 'sm': return 32;
      case 'md': return 40;
      case 'lg': return 56;
      case 'xl': return 80;
      default: return 40;
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'sm': return 12;
      case 'md': return 16;
      case 'lg': return 24;
      case 'xl': return 32;
      default: return 16;
    }
  };

  const getBorderRadius = (): number => {
    const sizeValue = getSize();
    switch (variant) {
      case 'circle': return sizeValue / 2;
      case 'rounded': return 8;
      case 'square': return 0;
      default: return sizeValue / 2;
    }
  };

  const containerStyle: ViewStyle = {
    width: getSize(),
    height: getSize(),
    borderRadius: getBorderRadius(),
    backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  return (
    <View style={[containerStyle, style]}>
      {source ? (
        <Image
          source={source}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.initials, { fontSize: getFontSize() }]}>
          {initials}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: '#ffffff',
    fontWeight: '600',
  },
});