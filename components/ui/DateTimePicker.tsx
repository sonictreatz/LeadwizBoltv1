import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  Platform
} from 'react-native';
import { Calendar, Clock, ChevronDown } from 'lucide-react-native';
import { format } from 'date-fns';
import { Text } from './Text';
import { Button } from './Button';
import { colors, themeColors } from '../../lib/constants/colors';
import { spacing } from '../../lib/constants/spacing';
import { typography } from '../../lib/constants/typography';

interface DateTimePickerProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  placeholder?: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  containerStyle?: any;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  value,
  onChange,
  mode = 'date',
  placeholder = 'Select date',
  error,
  minDate,
  maxDate,
  containerStyle,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(value || new Date());
  const [tempTime, setTempTime] = useState<string>(
    value ? format(value, 'HH:mm') : '12:00'
  );

  const handleConfirm = () => {
    let finalDate = new Date(tempDate);
    
    if (mode === 'time' || mode === 'datetime') {
      const [hours, minutes] = tempTime.split(':').map(Number);
      finalDate.setHours(hours || 0);
      finalDate.setMinutes(minutes || 0);
    }
    
    onChange(finalDate);
    setModalVisible(false);
  };

  const formatDisplayValue = () => {
    if (!value) return '';
    
    switch (mode) {
      case 'date':
        return format(value, 'MMMM d, yyyy');
      case 'time':
        return format(value, 'h:mm a');
      case 'datetime':
        return format(value, 'MMMM d, yyyy h:mm a');
      default:
        return '';
    }
  };

  const renderDatePicker = () => {
    // This is a simplified date picker for demo purposes
    return (
      <View style={styles.datePickerContainer}>
        <Text variant="h5" style={styles.datePickerTitle}>Select Date</Text>
        <View style={styles.calendarPlaceholder}>
          <Calendar size={48} color={themeColors.buttonPrimary} />
          <Text variant="body" style={styles.calendarText}>
            {format(tempDate, 'MMMM d, yyyy')}
          </Text>
        </View>
        <View style={styles.dateControls}>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => {
              const newDate = new Date(tempDate);
              newDate.setDate(newDate.getDate() - 1);
              setTempDate(newDate);
            }}
          >
            <Text variant="bodySmall" color={themeColors.buttonPrimary}>Previous Day</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => {
              const newDate = new Date(tempDate);
              newDate.setDate(newDate.getDate() + 1);
              setTempDate(newDate);
            }}
          >
            <Text variant="bodySmall" color={themeColors.buttonPrimary}>Next Day</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderTimePicker = () => {
    // This is a simplified time picker for demo purposes
    return (
      <View style={styles.timePickerContainer}>
        <Text variant="h5" style={styles.datePickerTitle}>Select Time</Text>
        <View style={styles.timeInputContainer}>
          <Clock size={24} color={themeColors.buttonPrimary} style={styles.timeIcon} />
          <TextInput
            style={styles.timeInput}
            value={tempTime}
            onChangeText={setTempTime}
            placeholder="HH:MM"
            keyboardType="numbers-and-punctuation"
          />
        </View>
        <Text variant="caption" color={themeColors.textSecondary} style={styles.timeHint}>
          Enter time in 24-hour format (HH:MM)
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text variant="bodySmall" style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[
          styles.inputContainer,
          error ? styles.inputError : null,
        ]}
        onPress={() => setModalVisible(true)}
      >
        {mode === 'date' || mode === 'datetime' ? (
          <Calendar size={20} color={themeColors.textSecondary} style={styles.icon} />
        ) : (
          <Clock size={20} color={themeColors.textSecondary} style={styles.icon} />
        )}
        <Text 
          variant="body"
          color={value ? themeColors.inputText : themeColors.inputPlaceholder}
          style={styles.input}
        >
          {value ? formatDisplayValue() : placeholder}
        </Text>
        <ChevronDown size={20} color={themeColors.textSecondary} />
      </TouchableOpacity>
      {error && <Text variant="caption" color={colors.danger[500]} style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h4" style={styles.modalTitle}>
                {mode === 'date' ? 'Select Date' : 
                 mode === 'time' ? 'Select Time' : 'Select Date & Time'}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text variant="body" color={themeColors.textSecondary}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {(mode === 'date' || mode === 'datetime') && renderDatePicker()}
            {(mode === 'time' || mode === 'datetime') && renderTimePicker()}

            <Button 
              variant="primary"
              onPress={handleConfirm}
              style={styles.confirmButton}
            >
              Confirm
            </Button>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: spacing[3],
    height: spacing[12],
  },
  icon: {
    marginRight: spacing[2],
  },
  input: {
    flex: 1,
  },
  inputError: {
    borderColor: colors.danger[500],
  },
  errorText: {
    marginTop: spacing[1],
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[4],
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: spacing[3],
    width: '100%',
    maxWidth: 400,
    padding: spacing[4],
    shadowColor: themeColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  modalTitle: {
    fontWeight: '600',
  },
  closeButton: {
    padding: spacing[2],
  },
  datePickerContainer: {
    marginBottom: spacing[4],
  },
  datePickerTitle: {
    marginBottom: spacing[3],
  },
  calendarPlaceholder: {
    height: 200,
    backgroundColor: colors.neutral[50],
    borderRadius: spacing[2],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  calendarText: {
    marginTop: spacing[2],
  },
  dateControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateButton: {
    flex: 1,
    backgroundColor: colors.neutral[100],
    borderRadius: spacing[2],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    marginHorizontal: spacing[1],
    alignItems: 'center',
  },
  timePickerContainer: {
    marginBottom: spacing[4],
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeColors.inputBorder,
    borderRadius: spacing[2],
    paddingHorizontal: spacing[3],
    height: spacing[12],
    marginBottom: spacing[2],
  },
  timeIcon: {
    marginRight: spacing[2],
  },
  timeInput: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: themeColors.inputText,
  },
  timeHint: {
    marginBottom: spacing[2],
  },
  confirmButton: {
    marginTop: spacing[2],
  },
});