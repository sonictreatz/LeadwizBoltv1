import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  FlatList,
  TextInput
} from 'react-native';
import { ChevronDown, Search, Check } from 'lucide-react-native';
import { Text } from './Text';
import { colors, themeColors } from '../../lib/constants/colors';
import { spacing } from '../../lib/constants/spacing';
import { typography } from '../../lib/constants/typography';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  searchable?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  searchable = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOption = options.find(option => option.value === value);

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      {label && <Text variant="bodySmall" style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[
          styles.selectContainer,
          error ? styles.selectError : null,
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text 
          variant="body"
          color={selectedOption ? themeColors.inputText : themeColors.inputPlaceholder}
          style={styles.selectText}
        >
          {selectedOption ? selectedOption.label : placeholder}
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
              <Text variant="h4" style={styles.modalTitle}>Select an option</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false);
                  setSearchQuery('');
                }}
              >
                <Text variant="body" color={themeColors.textSecondary}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {searchable && (
              <View style={styles.searchContainer}>
                <Search size={20} color={themeColors.textSecondary} />
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search..."
                  placeholderTextColor={themeColors.inputPlaceholder}
                  autoCapitalize="none"
                />
              </View>
            )}

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text variant="body" style={styles.optionText}>{item.label}</Text>
                  {item.value === value && (
                    <Check size={20} color={themeColors.buttonPrimary} />
                  )}
                </TouchableOpacity>
              )}
              style={styles.optionsList}
              contentContainerStyle={
                filteredOptions.length === 0 ? styles.emptyList : undefined
              }
              ListEmptyComponent={
                <Text 
                  variant="body" 
                  color={themeColors.textSecondary} 
                  style={styles.emptyText}
                >
                  No options found
                </Text>
              }
            />
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
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: themeColors.inputBorder,
    borderRadius: spacing[2],
    backgroundColor: themeColors.input,
    paddingHorizontal: spacing[3],
    height: spacing[12],
  },
  selectText: {
    flex: 1,
  },
  selectError: {
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
    maxHeight: '80%',
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
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  modalTitle: {
    fontWeight: '600',
  },
  closeButton: {
    padding: spacing[2],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeColors.inputBorder,
    borderRadius: spacing[2],
    margin: spacing[4],
    paddingHorizontal: spacing[3],
    height: spacing[11],
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing[2],
    fontSize: typography.body.fontSize,
    color: themeColors.inputText,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  optionText: {
    color: themeColors.text,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  emptyText: {
    textAlign: 'center',
  },
});