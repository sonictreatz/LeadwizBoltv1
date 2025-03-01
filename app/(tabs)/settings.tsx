import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Palette, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { TransitionView } from '../../components/TransitionView';
import { SettingsSkeleton } from '../../components/SettingsSkeleton';

export default function Settings() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Simulate loading state
  useState(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  });

  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>
        <SettingsSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
          />
        }
      >
        <TransitionView type="fade" duration={300}>
          <View style={styles.profileSection}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitials}>JD</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Jane Doe</Text>
              <Text style={styles.profileEmail}>jane.doe@realestate.com</Text>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => router.push('/profile/edit')}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </TransitionView>

        <TransitionView type="slide-up" duration={300} delay={100}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('/profile')}
            >
              <User size={20} color="#64748b" />
              <Text style={styles.settingText}>Personal Information</Text>
              <ChevronRight size={20} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('/notifications/settings')}
            >
              <Bell size={20} color="#64748b" />
              <Text style={styles.settingText}>Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#cbd5e1', true: '#bfdbfe' }}
                thumbColor={notificationsEnabled ? '#3b82f6' : '#f1f5f9'}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('/appearance')}
            >
              <Palette size={20} color="#64748b" />
              <Text style={styles.settingText}>Appearance</Text>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: '#cbd5e1', true: '#bfdbfe' }}
                thumbColor={darkModeEnabled ? '#3b82f6' : '#f1f5f9'}
              />
            </TouchableOpacity>
          </View>
        </TransitionView>

        <TransitionView type="slide-up" duration={300} delay={200}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Open House Settings</Text>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('/settings/branding')}
            >
              <Text style={styles.settingText}>Branding & Customization</Text>
              <ChevronRight size={20} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('/settings/question-sets')}
            >
              <Text style={styles.settingText}>Question Sets</Text>
              <ChevronRight size={20} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('/settings/lead-scoring')}
            >
              <Text style={styles.settingText}>Lead Scoring Rules</Text>
              <ChevronRight size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </TransitionView>

        <TransitionView type="slide-up" duration={300} delay={300}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('/help')}
            >
              <HelpCircle size={20} color="#64748b" />
              <Text style={styles.settingText}>Help & Support</Text>
              <ChevronRight size={20} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('/privacy')}
            >
              <Shield size={20} color="#64748b" />
              <Text style={styles.settingText}>Privacy & Security</Text>
              <ChevronRight size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </TransitionView>

        <TransitionView type="slide-up" duration={300} delay={400}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => {/* Handle logout */}}
          >
            <LogOut size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </TransitionView>

        <TransitionView type="fade" duration={300} delay={500}>
          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </TransitionView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 24,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitials: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748b',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 8,
  },
  versionInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#94a3b8',
  },
});