import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Phone, Mail } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LeadCardSkeleton } from '../../components/LeadCardSkeleton';
import { TransitionView } from '../../components/TransitionView';
import { useRefreshControl } from '../../hooks/useRefreshControl';
import { Card } from '../../components/ui/Card';
import { Text } from '../../components/ui/Text';
import { colors, themeColors } from '../../lib/constants/colors';
import { spacing } from '../../lib/constants/spacing';

// Lead type definition
interface Lead {
  id: string;
  name: string;
  property: string;
  details: string;
  time: string;
  status: 'hot' | 'warm' | 'cold';
  phone: string;
  email: string;
  notes: string;
  followUp: string;
}

// Lead card component
const LeadCard = ({ lead, onPress }: { lead: Lead; onPress: () => void }) => {
  return (
    <Card style={styles.leadCard}>
      <TouchableOpacity 
        style={styles.leadCardContent}
        onPress={onPress}
      >
        <View style={[
          styles.leadIndicator, 
          lead.status === 'hot' ? styles.hotLead : 
          lead.status === 'warm' ? styles.warmLead : styles.coldLead
        ]} />
        <View style={styles.leadInfo}>
          <Text variant="h5" style={styles.leadName}>{lead.name}</Text>
          <Text variant="bodySmall" color={themeColors.textSecondary}>{lead.details} • {lead.property}</Text>
        </View>
        <Text variant="caption" color={themeColors.textSecondary}>{lead.time}</Text>
      </TouchableOpacity>
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Phone size={18} color={themeColors.buttonPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Mail size={18} color={themeColors.buttonPrimary} />
        </TouchableOpacity>
      </View>
    </Card>
  );
};

// Sample lead data
const leadsData: Lead[] = [
  { 
    id: '1', 
    name: 'John Smith', 
    property: '123 Main Street',
    details: 'Pre-approved buyer',
    time: '2h ago',
    status: 'hot',
    phone: '(555) 123-4567',
    email: 'john.smith@example.com',
    notes: 'Looking for a 3-bedroom home in the downtown area. Has financing pre-approved up to $500,000.',
    followUp: 'Tomorrow, 10:00 AM'
  },
  { 
    id: '2', 
    name: 'Sarah Johnson', 
    property: '456 Oak Avenue',
    details: 'Actively searching',
    time: '5h ago',
    status: 'warm',
    phone: '(555) 234-5678',
    email: 'sarah.j@example.com',
    notes: 'Interested in properties with large backyards. Currently renting, lease ends in 3 months.',
    followUp: 'Friday, 2:00 PM'
  },
  { 
    id: '3', 
    name: 'Michael Brown', 
    property: '123 Main Street',
    details: 'Just browsing',
    time: '1d ago',
    status: 'cold',
    phone: '(555) 345-6789',
    email: 'mbrown@example.com',
    notes: 'Just starting to look at properties. Not in a rush to buy.',
    followUp: 'Next week'
  },
  { 
    id: '4', 
    name: 'Emily Davis', 
    property: '789 Pine Boulevard',
    details: 'Investor, looking for rental properties',
    time: '2d ago',
    status: 'hot',
    phone: '(555) 456-7890',
    email: 'emily.d@example.com',
    notes: 'Looking for investment properties with good rental potential. Has purchased 3 properties in the last year.',
    followUp: 'Wednesday, 11:30 AM'
  },
  { 
    id: '5', 
    name: 'Robert Wilson', 
    property: '456 Oak Avenue',
    details: 'First-time homebuyer',
    time: '3d ago',
    status: 'warm',
    phone: '(555) 567-8901',
    email: 'rwilson@example.com',
    notes: 'First-time homebuyer looking in the $300-350k range. Prequalified for FHA loan.',
    followUp: 'Thursday, 1:00 PM'
  }
];

export default function Leads() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Use custom refresh control hook
  const { refreshing, handleRefresh, refreshControl } = useRefreshControl();

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter leads based on active tab and search query
  const filteredLeads = useCallback(() => {
    let filtered = leadsData;
    
    // Filter by tab
    if (activeTab === 'hot') {
      filtered = leadsData.filter(lead => lead.status === 'hot');
    } else if (activeTab === 'warm') {
      filtered = leadsData.filter(lead => lead.status === 'warm');
    } else if (activeTab === 'cold') {
      filtered = leadsData.filter(lead => lead.status === 'cold');
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(query) ||
        lead.property.toLowerCase().includes(query) ||
        lead.details.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [activeTab, searchQuery]);

  // Memoized render functions
  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <Text variant="h4" style={styles.emptyStateTitle}>No leads found</Text>
      <Text 
        variant="body" 
        color={themeColors.textSecondary} 
        style={styles.emptyStateText}
      >
        Try adjusting your filters or search criteria.
      </Text>
    </View>
  ), []);

  const renderLeadItem = useCallback(({ item, index }) => (
    <TransitionView 
      key={item.id} 
      type="fade" 
      duration={300} 
      delay={index * 50}
    >
      <LeadCard 
        lead={item}
        onPress={() => {/* Navigate to lead details */}}
      />
    </TransitionView>
  ), []);

  const renderSkeletons = useCallback(() => (
    <>
      <LeadCardSkeleton />
      <LeadCardSkeleton />
      <LeadCardSkeleton />
      <LeadCardSkeleton />
      <LeadCardSkeleton />
    </>
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="h1" style={styles.title}>Leads</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => {/* Show filter options */}}
        >
          <Filter size={20} color={themeColors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={themeColors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search leads..."
            placeholderTextColor={themeColors.inputPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text 
            variant="bodySmall" 
            color={activeTab === 'all' ? colors.white : themeColors.textSecondary}
          >
            All Leads
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'hot' && styles.activeTab]}
          onPress={() => setActiveTab('hot')}
        >
          <Text 
            variant="bodySmall" 
            color={activeTab === 'hot' ? colors.white : themeColors.textSecondary}
          >
            Hot
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'warm' && styles.activeTab]}
          onPress={() => setActiveTab('warm')}
        >
          <Text 
            variant="bodySmall" 
            color={activeTab === 'warm' ? colors.white : themeColors.textSecondary}
          >
            Warm
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'cold' && styles.activeTab]}
          onPress={() => setActiveTab('cold')}
        >
          <Text 
            variant="bodySmall" 
            color={activeTab === 'cold' ? colors.white : themeColors.textSecondary}
          >
            Cold
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.scrollView}>
          {renderSkeletons()}
        </View>
      ) : (
        <FlatList
          style={styles.scrollView}
          data={filteredLeads()}
          renderItem={renderLeadItem}
          keyExtractor={item => item.id}
          refreshControl={refreshControl}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={filteredLeads().length === 0 ? { flex: 1 } : null}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={5}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
  title: {
    marginBottom: 0,
  },
  filterButton: {
    width: spacing[11],
    height: spacing[11],
    borderRadius: spacing[5.5],
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing[2],
    paddingHorizontal: spacing[3],
    height: spacing[11],
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing[2],
    fontSize: 16,
    color: themeColors.inputText,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  tab: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    marginRight: spacing[2],
    borderRadius: spacing[5],
    backgroundColor: colors.neutral[100],
  },
  activeTab: {
    backgroundColor: themeColors.buttonPrimary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  leadCard: {
    marginBottom: spacing[3],
    padding: 0,
  },
  leadCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
  },
  leadIndicator: {
    width: spacing[3],
    height: spacing[3],
    borderRadius: spacing[1.5],
    marginRight: spacing[4],
  },
  hotLead: {
    backgroundColor: themeColors.statusHot,
  },
  warmLead: {
    backgroundColor: themeColors.statusWarm,
  },
  coldLead: {
    backgroundColor: themeColors.statusCold,
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    marginBottom: spacing[1],
  },
  actionContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
    padding: spacing[2],
  },
  actionButton: {
    width: spacing[9],
    height: spacing[9],
    borderRadius: spacing[4.5],
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacing[1],
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[15],
  },
  emptyStateTitle: {
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  emptyStateText: {
    textAlign: 'center',
    paddingHorizontal: spacing[8],
  },
});