import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { Notification, OpenHouse, Visitor, Question, Answer } from './types';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// SecureStore adapter for Supabase auth persistence
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

// Create Supabase client
const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: Platform.OS === 'web' 
        ? localStorage 
        : ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Mock data generators
const generateMockOpenHouses = (): OpenHouse[] => [
  {
    id: '1',
    agent_id: '1',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94105',
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1800,
    price: 450000,
    description: 'Beautiful single-family home in a quiet neighborhood.',
    date: '2025-06-15',
    start_time: '13:00',
    end_time: '16:00',
    status: 'upcoming',
    created_at: '2025-05-01T12:00:00Z',
    updated_at: '2025-05-01T12:00:00Z'
  },
  {
    id: '2',
    agent_id: '1',
    address: '456 Oak Avenue',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94110',
    bedrooms: 4,
    bathrooms: 3,
    square_feet: 2200,
    price: 575000,
    description: 'Spacious family home with modern amenities.',
    date: '2025-06-16',
    start_time: '14:00',
    end_time: '17:00',
    status: 'upcoming',
    created_at: '2025-05-02T12:00:00Z',
    updated_at: '2025-05-02T12:00:00Z'
  }
];

const generateMockNotifications = (): Notification[] => [
  {
    id: '1',
    agent_id: '1',
    title: 'New Visitor Check-in',
    body: 'John Smith just checked in at 123 Main Street',
    type: 'visitor_checkin',
    related_id: '1',
    is_read: false,
    created_at: '2025-06-15T13:15:00Z'
  },
  {
    id: '2',
    agent_id: '1',
    title: 'Lead Status Updated',
    body: 'Sarah Johnson has been updated to warm lead status',
    type: 'lead_update',
    related_id: '2',
    is_read: true,
    created_at: '2025-06-14T15:30:00Z'
  },
  {
    id: '3',
    agent_id: '1',
    title: 'Upcoming Open House',
    body: 'Reminder: Your open house at 456 Oak Avenue is scheduled for tomorrow at 2:00 PM',
    type: 'open_house_reminder',
    related_id: '2',
    is_read: false,
    created_at: '2025-06-15T09:00:00Z'
  }
];

// API functions
export const supabaseApi = {
  // Authentication
  auth: {
    signUp: async (email: string, password: string) => {
      return await supabase.auth.signUp({ email, password });
    },
    signIn: async (email: string, password: string) => {
      return await supabase.auth.signInWithPassword({ email, password });
    },
    signOut: async () => {
      return await supabase.auth.signOut();
    },
    getCurrentUser: async () => {
      return await supabase.auth.getUser();
    },
    getSession: async () => {
      return await supabase.auth.getSession();
    },
  },

  // Open Houses
  openHouses: {
    getAll: async () => {
      // For demo purposes, return mock data
      return { data: generateMockOpenHouses(), error: null };
    },
    getById: async (id: string) => {
      // Mock implementation
      const mockOpenHouses = generateMockOpenHouses();
      const openHouse = mockOpenHouses.find(oh => oh.id === id);
      return { data: openHouse || null, error: null };
    },
    create: async (openHouse: Omit<OpenHouse, 'id' | 'created_at' | 'updated_at'>) => {
      // Mock implementation
      const newOpenHouse: OpenHouse = {
        ...openHouse,
        id: Math.random().toString(36).substring(2, 11),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return { data: newOpenHouse, error: null };
    },
    update: async (id: string, updates: Partial<OpenHouse>) => {
      // Mock implementation
      const mockOpenHouses = generateMockOpenHouses();
      const openHouse = mockOpenHouses.find(oh => oh.id === id);
      if (!openHouse) {
        return { data: null, error: { message: 'Open house not found' } };
      }
      
      const updatedOpenHouse = {
        ...openHouse,
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      return { data: updatedOpenHouse, error: null };
    },
    delete: async (id: string) => {
      // Mock implementation
      return { error: null };
    },
    getByStatus: async (status: OpenHouse['status']) => {
      // Mock implementation
      const mockOpenHouses = generateMockOpenHouses();
      const filteredOpenHouses = mockOpenHouses.filter(oh => oh.status === status);
      return { data: filteredOpenHouses, error: null };
    },
  },

  // Visitors
  visitors: {
    getAll: async () => {
      // Mock implementation
      return { data: [], error: null };
    },
    getById: async (id: string) => {
      // Mock implementation
      return { data: null, error: null };
    },
    getByOpenHouse: async (openHouseId: string) => {
      // Mock implementation
      return { data: [], error: null };
    },
    create: async (visitor: Omit<Visitor, 'id' | 'created_at'>) => {
      // Mock implementation
      const newVisitor: Visitor = {
        ...visitor,
        id: Math.random().toString(36).substring(2, 11),
        created_at: new Date().toISOString()
      };
      return { data: newVisitor, error: null };
    },
    update: async (id: string, updates: Partial<Visitor>) => {
      // Mock implementation
      return { data: null, error: null };
    },
    delete: async (id: string) => {
      // Mock implementation
      return { error: null };
    },
    getByStatus: async (status: Visitor['status']) => {
      // Mock implementation
      return { data: [], error: null };
    },
  },

  // Notifications
  notifications: {
    getAll: async () => {
      // For demo purposes, return mock data
      return { data: generateMockNotifications(), error: null };
    },
    getUnread: async () => {
      // Mock implementation
      const mockNotifications = generateMockNotifications();
      const unreadNotifications = mockNotifications.filter(n => !n.is_read);
      return { data: unreadNotifications, error: null };
    },
    markAsRead: async (id: string) => {
      // Mock implementation
      return { data: null, error: null };
    },
    markAllAsRead: async () => {
      // Mock implementation
      return { data: null, error: null };
    },
    create: async (notification: {
      title: string;
      body: string;
      type: 'visitor_checkin' | 'lead_update' | 'open_house_reminder' | 'system';
      related_id?: string;
    }) => {
      // Mock implementation
      const newNotification: Notification = {
        ...notification,
        id: Math.random().toString(36).substring(2, 11),
        agent_id: '1',
        is_read: false,
        created_at: new Date().toISOString()
      };
      return { data: newNotification, error: null };
    },
  },
};

export default supabase;