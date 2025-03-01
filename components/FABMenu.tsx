import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import { Text } from './ui/Text';
import { colors, themeColors } from '../lib/constants/colors';
import { spacing } from '../lib/constants/spacing';
import { shadows } from '../lib/constants/spacing';

interface FABMenuItem {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

interface FABMenuProps {
  items: FABMenuItem[];
  onPress?: () => void;
}

export const FABMenu: React.FC<FABMenuProps> = ({ items, onPress }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleMenu = useCallback(() => {
    const toValue = isOpen ? 0 : 1;
    
    Animated.timing(animation, {
      toValue,
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();
    
    setIsOpen(!isOpen);
    
    if (onPress) {
      onPress();
    }
  }, [isOpen, animation, onPress]);

  const backdropOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const menuItemsOpacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const menuItemsTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const rotateZ = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <>
      {isOpen && (
        <Animated.View 
          style={[
            styles.backdrop,
            { opacity: backdropOpacity }
          ]}
          pointerEvents={isOpen ? 'auto' : 'none'}
          onTouchStart={toggleMenu}
        />
      )}
      
      <View style={styles.container}>
        {isOpen && (
          <Animated.View 
            style={[
              styles.menuItems,
              {
                opacity: menuItemsOpacity,
                transform: [{ translateY: menuItemsTranslateY }],
              }
            ]}
          >
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  toggleMenu();
                  item.onPress();
                }}
              >
                {item.icon}
                <Text 
                  variant="bodySmall" 
                  color={colors.white} 
                  style={styles.menuItemText}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
        
        <TouchableOpacity
          style={styles.fab}
          onPress={toggleMenu}
        >
          <Animated.View style={{ transform: [{ rotate: rotateZ }] }}>
            {isOpen ? (
              <X size={24} color={colors.white} />
            ) : (
              <Plus size={24} color={colors.white} />
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black,
    zIndex: 1,
  },
  container: {
    position: 'absolute',
    right: spacing[4],
    bottom: spacing[4],
    alignItems: 'flex-end',
    zIndex: 2,
  },
  fab: {
    width: spacing[14],
    height: spacing[14],
    borderRadius: spacing[7],
    backgroundColor: themeColors.buttonPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  menuItems: {
    marginBottom: spacing[4],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeColors.buttonPrimary,
    borderRadius: spacing[6],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
    ...shadows.sm,
  },
  menuItemText: {
    marginLeft: spacing[2],
    fontWeight: '500',
  },
});