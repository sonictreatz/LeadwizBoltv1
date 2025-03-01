import CryptoJS from 'crypto-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Key for storing the encryption key
const ENCRYPTION_KEY_STORAGE = 'OPEN_HOUSE_APP_ENCRYPTION_KEY';

// Generate a random encryption key if not already stored
const generateEncryptionKey = (): string => {
  return CryptoJS.lib.WordArray.random(256 / 8).toString();
};

// Get or create the encryption key
export const getEncryptionKey = async (): Promise<string> => {
  if (Platform.OS === 'web') {
    // For web, use localStorage with a fallback
    const storedKey = localStorage.getItem(ENCRYPTION_KEY_STORAGE);
    if (storedKey) {
      return storedKey;
    }
    
    const newKey = generateEncryptionKey();
    localStorage.setItem(ENCRYPTION_KEY_STORAGE, newKey);
    return newKey;
  } else {
    // For native platforms, use SecureStore
    try {
      const storedKey = await SecureStore.getItemAsync(ENCRYPTION_KEY_STORAGE);
      if (storedKey) {
        return storedKey;
      }
      
      const newKey = generateEncryptionKey();
      await SecureStore.setItemAsync(ENCRYPTION_KEY_STORAGE, newKey);
      return newKey;
    } catch (error) {
      console.error('Error accessing secure storage:', error);
      // Fallback to a derived key if secure storage fails
      return CryptoJS.SHA256('OPEN_HOUSE_APP_FALLBACK_KEY').toString();
    }
  }
};

// Encrypt data using AES-256
export const encryptData = async (data: any): Promise<string> => {
  try {
    const key = await getEncryptionKey();
    const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, key).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

// Decrypt data
export const decryptData = async (encryptedData: string): Promise<any> => {
  try {
    const key = await getEncryptionKey();
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
    
    try {
      // Try to parse as JSON first
      return JSON.parse(decrypted);
    } catch {
      // If not valid JSON, return as string
      return decrypted;
    }
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

// Encrypt sensitive visitor data
export const encryptVisitorData = async (visitor: any) => {
  const sensitiveFields = ['email', 'phone', 'notes'];
  const encryptedVisitor = { ...visitor };
  
  for (const field of sensitiveFields) {
    if (encryptedVisitor[field]) {
      encryptedVisitor[field] = await encryptData(encryptedVisitor[field]);
    }
  }
  
  return encryptedVisitor;
};

// Decrypt sensitive visitor data
export const decryptVisitorData = async (encryptedVisitor: any) => {
  const sensitiveFields = ['email', 'phone', 'notes'];
  const decryptedVisitor = { ...encryptedVisitor };
  
  for (const field of sensitiveFields) {
    if (decryptedVisitor[field] && typeof decryptedVisitor[field] === 'string') {
      try {
        decryptedVisitor[field] = await decryptData(decryptedVisitor[field]);
      } catch (error) {
        // If decryption fails, keep the original value
        console.warn(`Failed to decrypt ${field}`);
      }
    }
  }
  
  return decryptedVisitor;
};

// Encrypt an array of visitors
export const encryptVisitors = async (visitors: any[]) => {
  return Promise.all(visitors.map(visitor => encryptVisitorData(visitor)));
};

// Decrypt an array of visitors
export const decryptVisitors = async (encryptedVisitors: any[]) => {
  return Promise.all(encryptedVisitors.map(visitor => decryptVisitorData(visitor)));
};