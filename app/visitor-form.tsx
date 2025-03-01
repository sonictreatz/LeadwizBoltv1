import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, User, Mail, Phone, Check, X } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TransitionView } from '../components/TransitionView';

export default function VisitorForm() {
  const router = useRouter();
  const { openHouseId, address } = useLocalSearchParams();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('buyer');
  const [answers, setAnswers] = useState({});
  const [agreeToContact, setAgreeToContact] = useState(true);
  
  // Mock questions based on selected category
  const questionSets = {
    buyer: [
      { id: '1', text: 'Are you currently in the market to buy a home?', type: 'yes_no' },
      { id: '2', text: 'Have you been pre-approved for a mortgage?', type: 'yes_no' },
      { id: '3', text: 'What is your budget range?', type: 'multiple_choice', options: ['<$250K', '$250K-$500K', '$500K-$750K', '$750K+'] },
      { id: '4', text: 'How soon are you looking to purchase?', type: 'multiple_choice', options: ['Immediately', '1-3 months', '3-6 months', '6+ months'] }
    ],
    seller: [
      { id: '5', text: 'Are you looking to sell your home soon?', type: 'multiple_choice', options: ['Yes', 'No', 'Considering in the future'] },
      { id: '6', text: 'Have you had a recent home appraisal?', type: 'yes_no' },
      { id: '7', text: 'Are you working with an agent to sell your property?', type: 'yes_no' },
      { id: '8', text: 'What is your timeline for selling?', type: 'multiple_choice', options: ['Immediately', '1-3 months', '3-6 months', '6+ months'] }
    ],
    investor: [
      { id: '9', text: 'Are you an active real estate investor?', type: 'multiple_choice', options: ['Yes', 'No', 'Just starting'] },
      { id: '10', text: 'What type of properties are you interested in?', type: 'multiple_choice', options: ['Single-family', 'Multi-family', 'Commercial', 'Land', 'Other'] },
      { id: '11', text: 'What is your investment strategy?', type: 'multiple_choice', options: ['Buy and hold', 'Fix and flip', 'BRRRR', 'Wholesaling', 'Other'] },
      { id: '12', text: 'How many properties do you currently own?', type: 'multiple_choice', options: ['None', '1-5', '6-10', '11+'] }
    ],
    renter: [
      { id: '13', text: 'Are you currently looking for a rental property?', type: 'yes_no' },
      { id: '14', text: 'What lease length are you considering?', type: 'multiple_choice', options: ['6 months', '12 months', '18+ months', 'Flexible'] },
      { id: '15', text: 'What is your monthly budget for rent?', type: 'multiple_choice', options: ['<$1000', '$1000-$1500', '$1500-$2000', '$2000-$2500', '$2500+'] },
      { id: '16', text: 'When do you need to move in?', type: 'multiple_choice', options: ['Immediately', 'Within 30 days', '1-2 months', '3+ months'] }
    ]
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    if (!name || !email || !phone) {
      Alert.alert('Please fill in all required fields');
      return;
    }

    // In a real app, this would submit the data to the backend
    console.log({
      openHouseId,
      name,
      email,
      phone,
      category: selectedCategory,
      answers,
      agreeToContact
    });

    // Navigate to thank you screen
    router.push({
      pathname: '/thank-you',
      params: { name }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.title}>Open House Sign-In</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <TransitionView type="fade" duration={300}>
          <View style={styles.propertyInfo}>
            <Text style={styles.propertyAddress}>{address || '123 Main Street'}</Text>
            <Text style={styles.propertySubtitle}>Please complete the form below to sign in</Text>
          </View>
        </TransitionView>

        <TransitionView type="slide-up" duration={300} delay={100}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            <View style={styles.inputContainer}>
              <User size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name *"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address *"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Phone size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number *"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>
        </TransitionView>

        <TransitionView type="slide-up" duration={300} delay={200}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>I am a:</Text>
            
            <View style={styles.categorySelector}>
              <TouchableOpacity 
                style={[styles.categoryButton, selectedCategory === 'buyer' && styles.selectedCategory]}
                onPress={() => setSelectedCategory('buyer')}
              >
                <Text style={[styles.categoryText, selectedCategory === 'buyer' && styles.selectedCategoryText]}>
                  Buyer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.categoryButton, selectedCategory === 'seller' && styles.selectedCategory]}
                onPress={() => setSelectedCategory('seller')}
              >
                <Text style={[styles.categoryText, selectedCategory === 'seller' && styles.selectedCategoryText]}>
                  Seller
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.categoryButton, selectedCategory === 'investor' && styles.selectedCategory]}
                onPress={() => setSelectedCategory('investor')}
              >
                <Text style={[styles.categoryText, selectedCategory === 'investor' && styles.selectedCategoryText]}>
                  Investor
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.categoryButton, selectedCategory === 'renter' && styles.selectedCategory]}
                onPress={() => setSelectedCategory('renter')}
              >
                <Text style={[styles.categoryText, selectedCategory === 'renter' && styles.selectedCategoryText]}>
                  Renter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TransitionView>

        <TransitionView type="slide-up" duration={300} delay={300}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>A Few Quick Questions</Text>
            
            {questionSets[selectedCategory].map(question => (
              <View key={question.id} style={styles.questionContainer}>
                <Text style={styles.questionText}>{question.text}</Text>
                
                {question.type === 'yes_no' ? (
                  <View style={styles.yesNoContainer}>
                    <TouchableOpacity 
                      style={[
                        styles.yesNoButton, 
                        answers[question.id] === 'Yes' && styles.selectedYesNoButton
                      ]}
                      onPress={() => handleAnswerChange(question.id, 'Yes')}
                    >
                      <Text style={[
                        styles.yesNoButtonText,
                        answers[question.id] === 'Yes' && styles.selectedYesNoButtonText
                      ]}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[
                        styles.yesNoButton, 
                        answers[question.id] === 'No' && styles.selectedYesNoButton
                      ]}
                      onPress={() => handleAnswerChange(question.id, 'No')}
                    >
                      <Text style={[
                        styles.yesNoButtonText,
                        answers[question.id] === 'No' && styles.selectedYesNoButtonText
                      ]}>No</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.optionsContainer}>
                    {question.options.map(option => (
                      <TouchableOpacity 
                        key={option}
                        style={[
                          styles.optionButton,
                          answers[question.id] === option && styles.selectedOptionButton
                        ]}
                        onPress={() => handleAnswerChange(question.id, option)}
                      >
                        <Text style={[
                          styles.optionButtonText,
                          answers[question.id] === option && styles.selectedOptionButtonText
                        ]}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </TransitionView>

        <TransitionView type="slide-up" duration={300} delay={400}>
          <View style={styles.consentSection}>
            <View style={styles.switchContainer}>
              <Switch
                value={agreeToContact}
                onValueChange={setAgreeToContact}
                trackColor={{ false: '#cbd5e1', true: '#bfdbfe' }}
                thumbColor={agreeToContact ? '#3b82f6' : '#f1f5f9'}
              />
              <Text style={styles.consentText}>
                I agree to be contacted about this property and future listings
              </Text>
            </View>
          </View>
        </TransitionView>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <X size={20} color="#64748b" />
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Check size={20} color="#ffffff" />
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  propertyInfo: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  propertyAddress: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  propertySubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  formSection: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#1e293b',
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: '#3b82f6',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 12,
  },
  yesNoContainer: {
    flexDirection: 'row',
  },
  yesNoButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  selectedYesNoButton: {
    backgroundColor: '#3b82f6',
  },
  yesNoButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  selectedYesNoButtonText: {
    color: '#ffffff',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOptionButton: {
    backgroundColor: '#3b82f6',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#64748b',
  },
  selectedOptionButtonText: {
    color: '#ffffff',
  },
  consentSection: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  consentText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#1e293b',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginLeft: 8,
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 8,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginLeft: 8,
  },
});