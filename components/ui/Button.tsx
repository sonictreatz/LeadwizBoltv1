import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ComponentType<{ size: number; color: string }>;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  disabled,
  ...props
}) => {
  const getButtonStyles = (): ViewStyle => {
    return {
      ...styles.button,
      ...styles[`${variant}Button`],
      ...styles[`${size}Button`],
      ...(fullWidth && styles.fullWidth),
      ...(disabled && styles.disabledButton),
    };
  };

  const getTextStyles = (): TextStyle => {
    return {
      ...styles.text,
      ...styles[`${variant}Text`],
      ...styles[`${size}Text`],
      ...(disabled && styles.disabledText),
    };
  };

  const getIconSize = (): number => {
    switch (size) {
      case 'sm': return 16;
      case 'md': return 20;
      case 'lg': return 24;
      default: return 20;
    }
  };

  const getIconColor = (): string => {
    if (disabled) {
      return styles.disabledText.opacity ? 
        `rgba(100, 116, 139, ${styles.disabledText.opacity})` : 
        '#94a3b8';
    }
    
    switch (variant) {
      case 'primary': return '#ffffff';
      case 'danger': return '#ffffff';
      case 'secondary': return '#3b82f6';
      case 'outline': return '#3b82f6';
      case 'ghost': return '#64748b';
      default: return '#64748b';
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' || variant === 'danger' ? '#ffffff' : '#3b82f6'} 
          size="small" 
        />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon size={getIconSize()} color={getIconColor()} style={styles.leftIcon} />
          )}
          <Text style={[getTextStyles(), textStyle]}>{children}</Text>
          {Icon && iconPosition === 'right' && (
            <Icon size={getIconSize()} color={getIconColor()} style={styles.rightIcon} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
  secondaryButton: {
    backgroundColor: '#eff6ff',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  dangerButton: {
    backgroundColor: '#ef4444',
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  smButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  mdButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  lgButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  fullWidth: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '500',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#3b82f6',
  },
  outlineText: {
    color: '#3b82f6',
  },
  dangerText: {
    color: '#ffffff',
  },
  ghostText: {
    color: '#64748b',
  },
  smText: {
    fontSize: 14,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 18,
  },
  disabledText: {
    opacity: 0.7,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});