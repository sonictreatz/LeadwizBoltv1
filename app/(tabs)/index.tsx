import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chrome as HomeIcon, Plus, QrCode, ChartBar as BarChart2, Bell, Calendar, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StatCard } from '../../components/StatCard';
import { LeadCard } from '../../components/LeadCard';
import { OpenHouseCard } from '../../components/OpenHouseCard';
import { NotificationBell } from '../../components/NotificationBell';
import { NotificationsPanel } from '../../components/NotificationsPanel';
import { FABMenu } from '../../components/FABMenu';
import { TransitionView } from '../../components/TransitionView';
import { Text } from '../../components/ui/Text';
import { colors, themeColors } from '../../lib/constants/colors';
import { spacing } from '../../lib/constants/spacing';

export default function Dashboard() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const fabItems = [
    {
      icon: <Calendar size={20} color={colors.white} />,
      label: "Create Open House",
      onPress: () => router.push('/open-houses/create')
    },
    {
      icon: <QrCode size={20} color={colors.white} />,
      label: "Generate QR Code",
      onPress: () => router.push('/qr-code')
    },
    {
      icon: <BarChart2 size={20} color={colors.white} />,
      label: "View Reports",
      onPress: () => router.push('/reports')
    }
  ];

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <HomeIcon size={48} color={themeColors.buttonPrimary} />
        <Text variant="h3" style={styles.loadingText}>Loading dashboard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TransitionView type="fade" duration={400}>
          <View style={styles.header}>
            <View>
              <Text variant="h1" style={styles.greeting}>Hello, Agent</Text>
              <Text variant="body" color={themeColors.textSecondary} style={styles.subtitle}>Welcome back to your dashboard</Text>
            </View>
            <NotificationBell onPress={() => setShowNotifications(true)} />
          </View>
        </TransitionView>

        <TransitionView type="slide-up" duration={500} delay={100}>
          <View style={styles.statsContainer}>
            <StatCard 
              title="Active Open Houses" 
              value="5" 
              icon={Calendar}
            />
            <StatCard 
              title="Total Visitors" 
              value="28" 
              icon={Users}
            />
            <StatCard 
              title="Hot Leads" 
              value="12" 
              icon={BarChart2}
              color={colors.danger[500]}
            />
          </View>
        </TransitionView>

        <TransitionView type="slide-up" duration={500} delay={200}>
          <Text variant="h4" style={styles.sectionTitle}>Upcoming Open Houses</Text>
          <View style={styles.upcomingContainer}>
            <OpenHouseCard
              id="1"
              address="123 Main Street"
              details="3 bed • 2 bath • 1,800 sqft"
              price="$450,000"
              date="Today"
              time="1:00 PM - 4:00 PM"
              status="upcoming"
              onPress={() => router.push('/open-houses/details')}
              onQrCodePress={() => router.push('/qr-code')}
            />

            <OpenHouseCard
              id="2"
              address="456 Oak Avenue"
              details="4 bed • 3 bath • 2,200 sqft"
              price="$575,000"
              date="Tomorrow"
              time="2:00 PM - 5:00 PM"
              status="upcoming"
              onPress={() => router.push('/open-houses/details')}
              onQrCodePress={() => router.push('/qr-code')}
            />
          </View>
        </TransitionView>

        <TransitionView type="slide-up" duration={500} delay={300}>
          <Text variant="h4" style={styles.sectionTitle}>Recent Leads</Text>
          <View style={styles.leadsContainer}>
            <LeadCard
              id="1"
              name="John Smith"
              details="Pre-approved buyer • 123 Main St"
              time="2h ago"
              status="hot"
              onPress={() => router.push('/leads')}
              onPhonePress={() => console.log('Call John Smith')}
              onEmailPress={() => console.log('Email John Smith')}
            />

            <LeadCard
              id="2"
              name="Sarah Johnson"
              details="Actively searching • 456 Oak Ave"
              time="5h ago"
              status="warm"
              onPress={() => router.push('/leads')}
              onPhonePress={() => console.log('Call Sarah Johnson')}
              onEmailPress={() => console.log('Email Sarah Johnson')}
            />

            <LeadCard
              id="3"
              name="Michael Brown"
              details="Just browsing • 123 Main St"
              time="1d ago"
              status="cold"
              onPress={() => router.push('/leads')}
              onPhonePress={() => console.log('Call Michael Brown')}
              onEmailPress={() => console.log('Email Michael Brown')}
            />
          </View>
        </TransitionView>
      </ScrollView>

      <FABMenu items={fabItems} />

      <Modal
        visible={showNotifications}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.notificationsContainer}>
            <NotificationsPanel onClose={() => setShowNotifications(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral[50],
  },
  loadingText: {
    marginTop: spacing[4],
    color: themeColors.text,
  },
  scrollView: {
    flex: 1,
    padding: spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  greeting: {
    marginBottom: spacing[1],
  },
  subtitle: {
    marginTop: spacing[1],
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[6],
  },
  sectionTitle: {
    marginBottom: spacing[4],
  },
  upcomingContainer: {
    marginBottom: spacing[6],
  },
  leadsContainer: {
    marginBottom: spacing[6],
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[4],
  },
  notificationsContainer: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    borderRadius: spacing[3],
    overflow: 'hidden',
  },
});