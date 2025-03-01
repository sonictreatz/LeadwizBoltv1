import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MapPin, Chrome as Home, Plus, Trash, Check, DollarSign } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { DateTimePicker } from '../../components/ui/DateTimePicker';
import { Select } from '../../components/ui/Select';
import { Tabs } from '../../components/ui/Tabs';
import { useForm } from '../../hooks/useForm';

const questionSets = {
  buyer: [
    { id: '1', text: 'Are you currently in the market to buy a home?', type: 'yes_no' },
    { id: '2', text: 'Have you been pre-approved for a mortgage?', type: 'yes_no' },
    { id: '3', text: 'What is your budget range?', type: 'multiple_choice' },
    { id: '4', text: 'How soon are you looking to purchase?', type: 'multiple_choice' }
  ],
  seller: [
    { id: '5', text: 'Are you looking to sell your home soon?', type: 'multiple_choice' },
    { id: '6', text: 'Have you had a recent home appraisal?', type: 'yes_no' },
    { id: '7', text: 'Are you working with an agent to sell your property?', type: 'yes_no' },
    { id: '8', text: 'What is your timeline for selling?', type: 'multiple_choice' }
  ],
  investor: [
    { id: '9', text: 'Are you an active real estate investor?', type: 'multiple_choice' },
    { id: '10', text: 'What type of properties are you interested in?', type: 'multiple_choice' },
    { id: '11', text: 'What is your investment strategy?', type: 'multiple_choice' },
    { id: '12', text: 'How many properties do you currently own?', type: 'multiple_choice' }
  ],
  renter: [
    { id: '13', text: 'Are you currently looking for a rental property?', type: 'yes_no' },
    { id: '14', text: 'What lease length are you considering?', type: 'multiple_choice' },
    { id: '15', text: 'What is your monthly budget for rent?', type: 'multiple_choice' },
    { id: '16', text: 'When do you need to move in?', type: 'multiple_choice' }
  ]
};

export default function CreateOpenHouse() {
  const router = useRouter();
  const [selectedQuestionSet, setSelectedQuestionSet] = useState('buyer');
  const [customQuestionsEnabled, setCustomQuestionsEnabled] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  const [newCustomQuestion, setNewCustomQuestion] = useState('');

  const form = useForm({
    address: {
      value: '',
      rules: [
        {
          validate: (value) => value.trim().length > 0,
          message: 'Address is required',
        },
      ],
    },
    city: {
      value: '',
      rules: [
        {
          validate: (value) => value.trim().length > 0,
          message: 'City is required',
        },
      ],
    },
    state: {
      value: '',
      rules: [
        {
          validate: (value) => value.trim().length > 0,
          message: 'State is required',
        },
      ],
    },
    zipCode: {
      value: '',
      rules: [
        {
          validate: (value) => value.trim().length > 0,
          message: 'Zip code is required',
        },
      ],
    },
    bedrooms: {
      value: '',
      rules: [
        {
          validate: (value) => /^\d+$/.test(value),
          message: 'Bedrooms must be a number',
        },
      ],
    },
    bathrooms: {
      value: '',
      rules: [
        {
          validate: (value) => /^\d+(\.\d+)?$/.test(value),
          message: 'Bathrooms must be a number',
        },
      ],
    },
    squareFeet: {
      value: '',
      rules: [
        {
          validate: (value) => /^\d+$/.test(value),
          message: 'Square feet must be a number',
        },
      ],
    },
    price: {
      value: '',
      rules: [
        {
          validate: (value) => /^\d+$/.test(value),
          message: 'Price must be a number',
        },
      ],
    },
    description: {
      value: '',
      rules: [],
    },
  });

  const addCustomQuestion = () => {
    if (newCustomQuestion.trim()) {
      setCustomQuestions([...customQuestions, newCustomQuestion]);
      setNewCustomQuestion('');
    }
  };

  const removeCustomQuestion = (index: number) => {
    const updatedQuestions = [...customQuestions];
    updatedQuestions.splice(index, 1);
    setCustomQuestions(updatedQuestions);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate property details
      const { isValid } = form.validateForm();
      if (!isValid) {
        Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
        return;
      }
      
      if (!date) {
        Alert.alert('Validation Error', 'Please select a date for the open house.');
        return;
      }
      
      if (!startTime || !endTime) {
        Alert.alert('Validation Error', 'Please select start and end times for the open house.');
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    // In a real app, this would submit the data to the backend
    console.log({
      ...form.values,
      date,
      startTime,
      endTime,
      questionSet: selectedQuestionSet,
      customQuestions: customQuestionsEnabled ? customQuestions : [],
    });
    
    // Navigate to the details page
    router.push('/open-houses/details');
  };

  const renderStep1 = () => (
    <>
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Property Details</Text>
        
        <Input
          label="Property Address"
          placeholder="Enter property address"
          icon={MapPin}
          {...form.getFieldProps('address')}
        />
        
        <View style={styles.row}>
          <Input
            label="City"
            placeholder="City"
            containerStyle={styles.halfInput}
            {...form.getFieldProps('city')}
          />
          <Input
            label="State"
            placeholder="State"
            containerStyle={styles.halfInput}
            {...form.getFieldProps('state')}
          />
        </View>
        
        <Input
          label="Zip Code"
          placeholder="Zip Code"
          keyboardType="numeric"
          {...form.getFieldProps('zipCode')}
        />

        <View style={styles.row}>
          <Input
            label="Bedrooms"
            placeholder="Number of bedrooms"
            keyboardType="numeric"
            containerStyle={styles.halfInput}
            icon={Home}
            {...form.getFieldProps('bedrooms')}
          />
          <Input
            label="Bathrooms"
            placeholder="Number of bathrooms"
            keyboardType="numeric"
            containerStyle={styles.halfInput}
            {...form.getFieldProps('bathrooms')}
          />
        </View>

        <View style={styles.row}>
          <Input
            label="Square Feet"
            placeholder="Square footage"
            keyboardType="numeric"
            containerStyle={styles.halfInput}
            {...form.getFieldProps('squareFeet')}
          />
          <Input
            label="Price"
            placeholder="Listing price"
            keyboardType="numeric"
            containerStyle={styles.halfInput}
            icon={DollarSign}
            {...form.getFieldProps('price')}
          />
        </View>

        <Input
          label="Property Description"
          placeholder="Enter property description"
          multiline
          numberOfLines={4}
          {...form.getFieldProps('description')}
        />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Open House Schedule</Text>
        
        <DateTimePicker
          label="Date"
          value={date}
          onChange={setDate}
          mode="date"
          placeholder="Select date"
        />

        <View style={styles.row}>
          <DateTimePicker
            label="Start Time"
            value={startTime}
            onChange={setStartTime}
            mode="time"
            placeholder="Select start time"
            containerStyle={styles.halfInput}
          />
          <DateTimePicker
            label="End Time"
            value={endTime}
            onChange={setEndTime}
            mode="time"
            placeholder="Select end time"
            containerStyle={styles.halfInput}
          />
        </View>
      </Card>
    </>
  );

  const renderStep2 = () => (
    <>
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Sign-In Form Questions</Text>
        
        <Text style={styles.label}>Question Set</Text>
        <Tabs
          tabs={[
            { label: 'Buyer', value: 'buyer' },
            { label: 'Seller', value: 'seller' },
            { label: 'Investor', value: 'investor' },
            { label: 'Renter', value: 'renter' },
          ]}
          value={selectedQuestionSet}
          onChange={setSelectedQuestionSet}
          variant="pills"
          scrollable
          style={styles.tabs}
        />

        <View style={styles.questionList}>
          {questionSets[selectedQuestionSet].map((question, index) => (
            <View key={question.id} style={styles.questionItem}>
              <Text style={styles.questionText}>{question.text}</Text>
              <TouchableOpacity style={styles.questionAction}>
                <Trash size={18} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.customQuestionsToggle}>
          <Text style={styles.customQuestionsText}>Add Custom Questions</Text>
          <Switch
            value={customQuestionsEnabled}
            onValueChange={setCustomQuestionsEnabled}
            trackColor={{ false: '#cbd5e1', true: '#bfdbfe' }}
            thumbColor={customQuestionsEnabled ? '#3b82f6' : '#f1f5f9'}
          />
        </View>

        {customQuestionsEnabled && (
          <View style={styles.customQuestionsSection}>
            {customQuestions.map((question, index) => (
              <View key={index} style={styles.questionItem}>
                <Text style={styles.questionText}>{question}</Text>
                <TouchableOpacity 
                  style={styles.questionAction}
                  onPress={() => removeCustomQuestion(index)}
                >
                  <Trash size={18} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            ))}
            
            <Input
              placeholder="Enter a custom question"
              value={newCustomQuestion}
              onChangeText={setNewCustomQuestion}
            />
            
            <TouchableOpacity 
              style={styles.addQuestionButton}
              onPress={addCustomQuestion}
            >
              <Plus size={20} color="#3b82f6" />
              <Text style={styles.addQuestionText}>Add Question</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>QR Code Settings</Text>
        
        <View style={styles.qrPreview}>
          <View style={styles.qrPlaceholder}>
            <Text style={styles.qrPlaceholderText}>QR Preview</Text>
          </View>
          <Button
            variant="primary"
            onPress={() => router.push('/qr-code')}
            style={styles.generateQrButton}
          >
            Generate QR Code
          </Button>
        </View>
      </Card>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            if (currentStep > 1) {
              handleBack();
            } else {
              router.back();
            }
          }}
        >
          <ChevronLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Open House</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.stepIndicator}>
        <View style={[styles.stepDot, currentStep >= 1 && styles.activeStepDot]} />
        <View style={styles.stepLine} />
        <View style={[styles.stepDot, currentStep >= 2 && styles.activeStepDot]} />
      </View>

      <ScrollView style={styles.scrollView}>
        {currentStep === 1 ? renderStep1() : renderStep2()}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep === 1 ? (
          <Button 
            variant="primary"
            fullWidth
            onPress={handleNext}
            icon={Check}
          >
            Next: Questions & QR Code
          </Button>
        ) : (
          <Button 
            variant="primary"
            fullWidth
            onPress={handleSubmit}
            icon={Check}
          >
            Create Open House
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
  },
  activeStepDot: {
    backgroundColor: '#3b82f6',
  },
  stepLine: {
    flex: 0.2,
    height: 2,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 6,
  },
  tabs: {
    marginBottom: 16,
  },
  questionList: {
    marginBottom: 16,
  },
  questionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
  },
  questionAction: {
    padding: 8,
  },
  customQuestionsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  customQuestionsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  customQuestionsSection: {
    marginTop: 16,
  },
  addQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addQuestionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
    marginLeft: 8,
  },
  qrPreview: {
    alignItems: 'center',
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  qrPlaceholderText: {
    fontSize: 14,
    color: '#64748b',
  },
  generateQrButton: {
    minWidth: 200,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
});