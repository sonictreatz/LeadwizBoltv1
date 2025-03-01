import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart2, ChartPie as PieChart, Calendar, Download, Filter, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { TransitionView } from '../../components/TransitionView';
import { useRefreshControl } from '../../hooks/useRefreshControl';

const screenWidth = Dimensions.get('window').width - 32;

export default function Reports() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  
  // Use custom refresh control hook
  const { refreshing, handleRefresh, refreshControl } = useRefreshControl();

  const visitorData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [12, 8, 15, 19],
      },
    ],
  };

  const leadData = {
    labels: ['Hot', 'Warm', 'Cold'],
    datasets: [
      {
        data: [12, 18, 8],
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports & Analytics</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => {/* Show filter options */}}
        >
          <Filter size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      <View style={styles.periodSelector}>
        <TouchableOpacity 
          style={styles.periodButton}
          onPress={() => setShowPeriodDropdown(!showPeriodDropdown)}
        >
          <Text style={styles.periodText}>{selectedPeriod}</Text>
          <ChevronDown size={16} color="#64748b" />
        </TouchableOpacity>
        
        {showPeriodDropdown && (
          <View style={styles.periodDropdown}>
            <TouchableOpacity 
              style={styles.periodOption}
              onPress={() => {
                setSelectedPeriod('This Week');
                setShowPeriodDropdown(false);
              }}
            >
              <Text style={styles.periodOptionText}>This Week</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.periodOption}
              onPress={() => {
                setSelectedPeriod('This Month');
                setShowPeriodDropdown(false);
              }}
            >
              <Text style={styles.periodOptionText}>This Month</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.periodOption}
              onPress={() => {
                setSelectedPeriod('Last 3 Months');
                setShowPeriodDropdown(false);
              }}
            >
              <Text style={styles.periodOptionText}>Last 3 Months</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.periodOption}
              onPress={() => {
                setSelectedPeriod('This Year');
                setShowPeriodDropdown(false);
              }}
            >
              <Text style={styles.periodOptionText}>This Year</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.periodOption}
              onPress={() => {
                setSelectedPeriod('Custom Range');
                setShowPeriodDropdown(false);
              }}
            >
              <Text style={styles.periodOptionText}>Custom Range</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'visitors' && styles.activeTab]}
          onPress={() => setActiveTab('visitors')}
        >
          <Text style={[styles.tabText, activeTab === 'visitors' && styles.activeTabText]}>
            Visitors
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'leads' && styles.activeTab]}
          onPress={() => setActiveTab('leads')}
        >
          <Text style={[styles.tabText, activeTab === 'leads' && styles.activeTabText]}>
            Leads
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'properties' && styles.activeTab]}
          onPress={() => setActiveTab('properties')}
        >
          <Text style={[styles.tabText, activeTab === 'properties' && styles.activeTabText]}>
            Properties
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={refreshControl}
      >
        {activeTab === 'overview' && (
          <>
            <TransitionView type="fade" duration={300} delay={50}>
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>5</Text>
                  <Text style={styles.statLabel}>Open Houses</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>42</Text>
                  <Text style={styles.statLabel}>Total Visitors</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>18</Text>
                  <Text style={styles.statLabel}>New Leads</Text>
                </View>
              </View>
            </TransitionView>

            <TransitionView type="fade" duration={300} delay={100}>
              <View style={styles.chartContainer}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>Visitor Trends</Text>
                  <BarChart2 size={20} color="#3b82f6" />
                </View>
                <BarChart
                  data={visitorData}
                  width={screenWidth}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </View>
            </TransitionView>

            <TransitionView type="fade" duration={300} delay={150}>
              <View style={styles.chartContainer}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>Lead Distribution</Text>
                  <PieChart size={20} color="#3b82f6" />
                </View>
                <BarChart
                  data={leadData}
                  width={screenWidth}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </View>
            </TransitionView>

            <TransitionView type="fade" duration={300} delay={200}>
              <View style={styles.topPropertiesContainer}>
                <Text style={styles.sectionTitle}>Top Performing Properties</Text>
                <View style={styles.propertyCard}>
                  <View style={styles.propertyInfo}>
                    <Text style={styles.propertyAddress}>123 Main Street</Text>
                    <Text style={styles.propertyDetails}>15 visitors • 8 hot leads</Text>
                  </View>
                  <Text style={styles.conversionRate}>53%</Text>
                </View>
                <View style={styles.propertyCard}>
                  <View style={styles.propertyInfo}>
                    <Text style={styles.propertyAddress}>456 Oak Avenue</Text>
                    <Text style={styles.propertyDetails}>12 visitors • 5 hot leads</Text>
                  </View>
                  <Text style={styles.conversionRate}>42%</Text>
                </View>
                <View style={styles.propertyCard}>
                  <View style={styles.propertyInfo}>
                    <Text style={styles.propertyAddress}>789 Pine Boulevard</Text>
                    <Text style={styles.propertyDetails}>9 visitors • 3 hot leads</Text>
                  </View>
                  <Text style={styles.conversionRate}>33%</Text>
                </View>
              </View>
            </TransitionView>
          </>
        )}

        {activeTab === 'visitors' && (
          <TransitionView type="fade" duration={300}>
            <View style={styles.emptyState}>
              <Calendar size={48} color="#94a3b8" />
              <Text style={styles.emptyStateTitle}>Visitor Analytics</Text>
              <Text style={styles.emptyStateText}>
                Detailed visitor analytics will appear here. Select a date range to view data.
              </Text>
            </View>
          </TransitionView>
        )}

        {activeTab === 'leads' && (
          <TransitionView type="fade" duration={300}>
            <View style={styles.emptyState}>
              <PieChart size={48} color="#94a3b8" />
              <Text style={styles.emptyStateTitle}>Lead Analytics</Text>
              <Text style={styles.emptyStateText}>
                Detailed lead analytics will appear here. Select a date range to view data.
              </Text>
            </View>
          </TransitionView>
        )}

        {activeTab === 'properties' && (
          <TransitionView type="fade" duration={300}>
            <View style={styles.emptyState}>
              <BarChart2 size={48} color="#94a3b8" />
              <Text style={styles.emptyStateTitle}>Property Analytics</Text>
              <Text style={styles.emptyStateText}>
                Detailed property analytics will appear here. Select a date range to view data.
              </Text>
            </View>
          </TransitionView>
        )}
      </ScrollView>

      <View style={styles.exportContainer}>
        <TouchableOpacity 
          style={styles.exportButton}
          onPress={() => {/* Export report */}}
        >
          <Download size={20} color="#ffffff" />
          <Text style={styles.exportButtonText}>Export Report</Text>
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
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodSelector: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'relative',
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginRight: 8,
  },
  periodDropdown: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  periodOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  periodOptionText: {
    fontSize: 14,
    color: '#1e293b',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  activeTab: {
    backgroundColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  activeTabText: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  topPropertiesContainer: {
    marginBottom: 24,
  },
  propertyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  propertyDetails: {
    fontSize: 14,
    color: '#64748b',
  },
  conversionRate: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b82f6',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  exportContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  exportButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});