import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, Filter, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { OpenHouseCardSkeleton } from '../../components/OpenHouseCardSkeleton';
import { TransitionView } from '../../components/TransitionView';
import { useRefreshControl } from '../../hooks/useRefreshControl';
import { OpenHouseCard } from '../../components/OpenHouseCard';
import { EmptyState } from '../../components/EmptyState';
import { Text } from '../../components/ui/Text';
import { colors, themeColors } from '../../lib/constants/colors';
import { spacing } from '../../lib/constants/spacing';

// Mock data for properties
const upcomingProperties = [
  {
    id: '1',
    address: '123 Main Street',
    details: '3 bed • 2 bath • 1,800 sqft',
    price: '$450,000',
    date: 'Today',
    time: '1:00 PM - 4:00 PM',
    status: 'upcoming' as const,
  },
  {
    id: '2',
    address: '456 Oak Avenue',
    details: '4 bed • 3 bath • 2,200 sqft',
    price: '$575,000',
    date: 'Tomorrow',
    time: '2:00 PM - 5:00 PM',
    status: 'upcoming' as const,
  },
  {
    id: '3',
    address: '789 Pine Boulevard',
    details: '5 bed • 3.5 bath • 3,100 sqft',
    price: '$725,000',
    date: 'Saturday',
    time: '12:00 PM - 3:00 PM',
    status: 'upcoming' as const,
  }
];

const pastProperties = [
  {
    id: '4',
    address: '321 Elm Street',
    details: '3 bed • 2 bath • 1,950 sqft',
    price: '$485,000',
    date: 'Last Sunday',
    time: '1:00 PM - 4:00 PM',
    status: 'past' as const,
    visitorCount: 12
  },
  {
    id: '5',
    address: '654 Maple Drive',
    details: '4 bed • 2.5 bath • 2,400 sqft',
    price: '$625,000',
    date: 'Last Saturday',
    time: '2:00 PM - 5:00 PM',
    status: 'past' as const,
    visitorCount: 8
  }
];

// Active properties (currently happening)
const activeProperties = [
  {
    id: '6',
    address: '987 Cedar Lane',
    details: '4 bed • 2 bath • 2,100 sqft',
    price: '$520,000',
    date: 'Today',
    time: '1:00 PM - 4:00 PM',
    status: 'active' as const,
  }
];

export default function OpenHouses() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'active' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use custom refresh control hook
  const { refreshing, handleRefresh, refreshControl } = useRefreshControl(
    async () => {
      // In a real app, this would fetch fresh data from the API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  );

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Get properties based on active tab
  const getPropertiesByTab = useCallback(() => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingProperties;
      case 'active':
        return activeProperties;
      case 'past':
        return pastProperties;
      default:
        return [];
    }
  }, [activeTab]);

  // Filter properties based on search query
  const filteredProperties = useCallback(() => {
    const properties = getPropertiesByTab();
    
    if (!searchQuery) return properties;
    
    const query = searchQuery.toLowerCase();
    return properties.filter(property => 
      property.address.toLowerCase().includes(query) ||
      property.details.toLowerCase().includes(query)
    );
  }, [activeTab, searchQuery, getPropertiesByTab]);

  // Memoized render functions
  const renderEmptyState = useCallback(() => (
    <EmptyState
      icon={Calendar}
      title="No Properties Found"
      description={
        activeTab === 'active' 
          ? "You don't have any open houses happening right now."
          : "No properties match your search criteria."
      }
      actionLabel={activeTab === 'upcoming' ? "Create Open House" : undefined}
      onAction={activeTab === 'upcoming' ? () => router.push('/open-houses/create') : undefined}
    />
  ), [activeTab, router]);

  const renderProperty = useCallback(({ item, index }) => (
    <TransitionView type="fade" duration={300} delay={index * 50}>
      <OpenHouseCard 
        id={item.id}
        address={item.address}
        details={item.details}
        price={item.price}
        date={item.date}
        time={item.time}
        status={item.status}
        visitorCount={item.visitorCount}
        onPress={() => router.push(`/open-houses/details?id=${item.id}`)}
        onQrCodePress={() => router.push('/qr-code')}
      />
    </TransitionView>
  ), [router]);

  const renderSkeletons = useCallback(() => (
    <>
      <OpenHouseCardSkeleton />
      <OpenHouseCardSkeleton />
      <OpenHouseCardSkeleton />
    </>
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="h1" style={styles.title}>Open Houses</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/open-houses/create')}
        >
          <Plus size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={themeColors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search open houses..."
            placeholderTextColor={themeColors.inputPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={themeColors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text 
            variant="bodySmall" 
            color={activeTab === 'upcoming' ? colors.white : themeColors.textSecondary}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text 
            variant="bodySmall" 
            color={activeTab === 'active' ? colors.white : themeColors.textSecondary}
          >
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab
          ]
          }
  )
}