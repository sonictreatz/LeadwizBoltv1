import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Download, Share as ShareIcon, QrCode as QrCodeIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import QRCode from 'react-native-qrcode-svg';

export default function QRCodeGenerator() {
  const router = useRouter();
  const [qrValue, setQrValue] = useState('https://openhouse.example.com/signin/123');
  const [qrSize, setQrSize] = useState(200);
  const [qrColor, setQrColor] = useState('#3b82f6');
  const [qrBackgroundColor, setQrBackgroundColor] = useState('#ffffff');
  const [selectedOpenHouse, setSelectedOpenHouse] = useState('123');
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [includeLogoEnabled, setIncludeLogoEnabled] = useState(true);
  const [addBorderEnabled, setAddBorderEnabled] = useState(false);

  // Mock data for open houses
  const openHouses = [
    { label: '123 Main Street', value: '123' },
    { label: '456 Oak Avenue', value: '456' },
    { label: '789 Pine Boulevard', value: '789' },
  ];

  const colorOptions = [
    { label: 'Blue', value: '#3b82f6' },
    { label: 'Red', value: '#ef4444' },
    { label: 'Green', value: '#10b981' },
    { label: 'Black', value: '#1e293b' },
  ];

  const shareQRCode = async () => {
    try {
      const selectedHouse = openHouses.find(house => house.value === selectedOpenHouse);
      await Share.share({
        message: `Please scan this QR code to sign in to the open house at ${selectedHouse?.label}. ${qrValue}`,
        title: 'Open House QR Code',
      });
    } catch (error) {
      console.error('Error sharing QR code:', error);
      Alert.alert('Error', 'Failed to share QR code');
    }
  };

  const handleOpenHouseChange = (value: string) => {
    setSelectedOpenHouse(value);
    setQrValue(`https://openhouse.example.com/signin/${value}`);
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
        <Text style={styles.title}>QR Code Generator</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Card 
          style={styles.qrContainer} 
          variant={addBorderEnabled ? 'outlined' : 'default'}
          padding="lg"
        >
          <QRCode
            value={qrValue}
            size={qrSize}
            color={qrColor}
            backgroundColor={qrBackgroundColor}
            logo={includeLogoEnabled ? require('../assets/images/icon.png') : undefined}
            logoSize={includeLogoEnabled ? qrSize * 0.2 : 0}
            logoBackgroundColor="white"
          />
        </Card>

        <Card style={styles.formContainer}>
          <Text style={styles.sectionTitle}>QR Code Settings</Text>
          
          <Select
            label="Select Open House"
            value={selectedOpenHouse}
            onChange={handleOpenHouseChange}
            options={openHouses}
            placeholder="Select an open house"
          />

          <Input
            label="QR Code URL"
            value={qrValue}
            onChangeText={setQrValue}
            placeholder="Enter URL for QR code"
          />

          <Button 
            variant="outline"
            onPress={() => setShowColorOptions(!showColorOptions)}
            style={styles.colorSelectorButton}
          >
            {showColorOptions ? 'Hide Color Options' : 'Show Color Options'}
          </Button>

          {showColorOptions && (
            <View style={styles.colorContainer}>
              <Text style={styles.colorLabel}>QR Color</Text>
              <Select
                value={qrColor}
                onChange={setQrColor}
                options={colorOptions}
              />
            </View>
          )}

          <View style={styles.actionButtons}>
            <Button 
              variant="primary"
              icon={ShareIcon}
              onPress={shareQRCode}
              style={styles.actionButton}
            >
              Share QR Code
            </Button>
            
            <Button 
              variant="primary"
              icon={QrCodeIcon}
              onPress={() => router.push({
                pathname: '/visitor-form',
                params: { 
                  openHouseId: selectedOpenHouse, 
                  address: openHouses.find(h => h.value === selectedOpenHouse)?.label 
                }
              })}
              style={styles.actionButton}
            >
              Test Sign-in Form
            </Button>
          </View>
        </Card>
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
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  colorSelectorButton: {
    alignSelf: 'flex-start',
    marginVertical: 16,
  },
  colorContainer: {
    marginBottom: 16,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 8,
  },
  actionButtons: {
    marginTop: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
});