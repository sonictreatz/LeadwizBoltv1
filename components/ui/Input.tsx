import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TextInputProps, 
  ViewStyle,
  TouchableOpacity
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Text } from './Text';
import { colors, themeColors } from '../../lib/constants/colors';
import { spacing } from '../../lib/constants/spacing';
import { typography } from '../../lib/constants/typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ComponentType<{ size: number; color: string }>;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon: Icon,
  containerStyle,
  isPassword = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text variant="bodySmall" style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        error ? styles.inputError : null,
        props.editable === false ? styles.inputDisabled : null
      ]}>
        {Icon && <Icon size={20} color={themeColors.textSecondary} style={styles.icon} />}
        <TextInput
          style={[
            styles.input,
            Icon ? styles.inputWithIcon : null,
            isPassword && !showPassword ? styles.inputWithRightIcon : null
          ]}
          placeholderTextColor={themeColors.inputPlaceholder}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} color={themeColors.textSecondary} />
            ) : (
              <Eye size={20} color={themeColors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text variant="caption" color={colors.danger[500]} style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  label: {
    marginBottom: spacing[1.5],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeColors.inputBorder,
    borderRadius: spacing[2],
    backgroundColor: themeColors.input,
  },
  input: {
    flex: 1,
    height: spacing[12],
    paddingHorizontal: spacing[3],
    fontSize: typography.body.fontSize,
    color: themeColors.inputText,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: spacing[10],
  },
  icon: {
    marginLeft: spacing[3],
    marginRight: spacing[2],
  },
  eyeIcon: {
    padding: spacing[2.5],
    position: 'absolute',
    right: 0,
  },
  inputError: {
    borderColor: colors.danger[500],
  },
  inputDisabled: {
    backgroundColor: colors.neutral[100],
    opacity: 0.7,
  },
  errorText: {
    marginTop: spacing[1],
  },
});