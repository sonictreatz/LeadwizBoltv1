import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Chrome as Home, MapPin, Calendar, Clock, Users, QrCode, Share as ShareIcon, CreditCard as Edit, Trash, User, Phone, Mail } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { Avatar } from '../../components/ui/Avatar';
import { EmptyState } from '../../components/EmptyState';
import { TransitionView } from '../../components/TransitionView';

export default function OpenHouseDetails() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('details');

  // Mock data for the open house
  const openHouse = {
    id: '1',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    price: 450000,
    description: 'Beautiful single-family home in a quiet neighborhood. Recently renovated with modern appliances and finishes. Open floor plan with lots of natural light. Large backyard perfect for entertaining.',
    date: 'Sunday, June 15, 2025',
    startTime: '1:00 PM',
    endTime: '4:00 PM',
    status: 'upcoming',
    visitors: [
      { id: '1', name: 'John Smith', time: '1:15 PM', status: 'hot', phone: '(555) 123-4567', email: 'john.smith@example.com' },
      { id: '2', name: 'Sarah Johnson', time: '1:45 PM', status: 'warm', phone: '(555) 234-5678', email: 'sarah.j@example.com' },
      { id: '3', name: 'Michael Brown', time: '2:30 PM', status: 'cold', phone: '(555) 345-6789', email: 'mbrown@example.com' },
    ],
    stats: {
      totalVisitors: 3,
      hotLeads: 1,
      warmLeads: 1,
      coldLeads: 1,
      conversionRate: '33%'
    }
  };

  const shareOpenHouse = async () => {
    try {
      await Share.share({
        message: `Check out this open house at ${openHouse.address}, ${openHouse.city}, ${openHouse.state} ${openHouse.zipCode} on ${openHouse.date} from ${openHouse.startTime} to ${openHouse.endTime}.`,
        title: 'Open House Details',
      });
    } catch (error) {
      console.error('Error sharing open house:', error);
      Alert.alert('Error', 'Failed to share open house details');
    }
  };

  const handleDeleteOpenHouse = () => {
    Alert.alert(
      'Delete Open House',
      'Are you sure you want to delete this open house? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // In a real app, this would delete the open house from the backend
            router.push('/open-houses');
          },
        },
      ]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hot':
        return <Badge variant="danger">Hot Lead</Badge>;
      case 'warm':
        return <Badge variant="warning">Warm Lead</Badge>;
      case 'cold':
        return <Badge variant="primary">Cold Lead</Badge>;
      default:
        return null;
    }
  };

  const renderDetailsTab = () => (
    <View style={styles.tabContent}>
      <TransitionView type="fade" duration={300}>
        <Card style={styles.propertyHeader}>
          <CardContent>
            <Text style={styles.propertyAddress}>{openHouse.address}</Text>
            <Text style={styles.propertyLocation}>{openHouse.city}, {openHouse.state} {openHouse.zipCode}</Text>
            <Text style={styles.propertyPrice}>${openHouse.price.toLocaleString()}</Text>
          </CardContent>
        </Card>
      </TransitionView>

      <TransitionView type="fade" duration={300} delay={100}>
        <Card style={styles.propertyFeatures}>
          <CardContent style={styles.featuresContent}>
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>{openHouse.bedrooms}</Text>
              <Text style={styles.featureLabel}>Bedrooms</Text>
            </View>
            <View style={styles.featureDivider} />
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>{openHouse.bathrooms}</Text>
              <Text style={styles.featureLabel}>Bathrooms</Text>
            </View>
            <View style={styles.featureDivider} />
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>{openHouse.squareFeet.toLocaleString()}</Text>
              <Text style={styles.featureLabel}>Sq Ft</Text>
            </View>
          </CardContent>
        </Card>
      </TransitionView>

      <TransitionView type="fade" duration={300} delay={200}>
        <Card style={styles.section}>
          <CardHeader>
            <Text style={styles.sectionTitle}>Open House Schedule</Text>
          </CardHeader>
          <CardContent>
            <View style={styles.scheduleItem}>
              <Calendar size={20} color="#64748b" />
              <Text style={styles.scheduleText}>{openHouse.date}</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Clock size={20} color="#64748b" />
              <Text style={styles.scheduleText}>{openHouse.startTime} - {openHouse.endTime}</Text>
            </View>
          </CardContent>
        </Card>
      </TransitionView>

      <TransitionView type="fade" duration={300} delay={300}>
        <Card style={styles.section}>
          <CardHeader>
            <Text style={styles.sectionTitle}>Description</Text>
          </CardHeader>
          <CardContent>
            <Text style={styles.descriptionText}>{openHouse.description}</Text>
          </CardContent>
        </Card>
      </TransitionView>

      <TransitionView type="fade" duration={300} delay={400}>
        <View style={styles.actionsContainer}>
          <Button 
            variant="secondary"
            icon={QrCode}
            onPress={() => router.push('/qr-code')}
            style={styles.actionButton}
          >
            QR Code
          </Button>
          <Button 
            variant="danger"
            icon={Trash}
            onPress={handleDeleteOpenHouse}
            style={styles.actionButton}
          >
            Delete
          </Button>
        </View>
      </TransitionView>
    </View>
  );

  const renderVisitorsTab = () => (
    <View style={styles.tabContent}>
      <TransitionView type="fade" duration={300}>
        <View style={styles.visitorStats}>
          <Card style={styles.visitorStatItem}>
            <CardContent style={styles.statContent}>
              <Text style={styles.visitorStatNumber}>{openHouse.stats.totalVisitors}</Text>
              <Text style={styles.visitorStatLabel}>Total Visitors</Text>
            </CardContent>
          </Card>
          <Card style={styles.visitorStatItem}>
            <CardContent style={styles.statContent}>
              <Text style={styles.visitorStatNumber}>{openHouse.stats.hotLeads}</Text>
              <Text style={styles.visitorStatLabel}>Hot Leads</Text>
            </CardContent>
          </Card>
          <Card style={styles.visitorStatItem}>
            <CardContent style={styles.statContent}>
              <Text style={styles.visitorStatNumber}>{openHouse.stats.conversionRate}</Text>
              <Text style={styles.visitorStatLabel}>Conversion</Text>
            </CardContent>
          </Card>
        </View>
      </TransitionView>

      <TransitionView type="fade" duration={300} delay={100}>
        <Text style={styles.sectionTitle}>Visitor List</Text>
      </TransitionView>
      
      {openHouse.visitors.map((visitor, index) => (
        <TransitionView key={visitor.id} type="slide-up" duration={300} delay={150 + index * 50}>
          <Card style={styles.visitorCard}>
            <CardContent style={styles.visitorCardContent}>
              <View style={[
                styles.visitorStatusIndicator, 
                visitor.status === 'hot' ? styles.hotLead : 
                visitor.status === 'warm' ? styles.warmLead : styles.coldLead
              ]} />
              <View style={styles.visitorInfo}>
                <Text style={styles.visitorName}>{visitor.name}</Text>
                <Text style={styles.visitorTime}>Checked in: {visitor.time}</Text>
                <View style={styles.badgeContainer}>
                  {getStatusBadge(visitor.status)}
                </View>
              </View>
              <View style={styles.visitorActions}>
                <TouchableOpacity style={styles.visitorActionButton}>
                  <Phone size={18} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.visitorActionButton}>
                  <Mail size={18} color="#3b82f6" />
                </TouchableOpacity>
              </View>
            </CardContent>
          </Card>
        </TransitionView>
      ))}

      <TransitionView type="fade" duration={300} delay={300}>
        <Button 
          variant="outline"
          icon={User}
          onPress={() => router.push('/visitor-form')}
          style={styles.addVisitorButton}
        >
          Add Visitor Manually
        </Button>
      </TransitionView>
    </View>
  );

  const renderStatsTab = () => (
    <View style={styles.tabContent}>
      <TransitionView type="fade" duration={300}>
        <Card style={styles.statCard}>
          <CardHeader>
            <Text style={styles.statCardTitle}>Visitor Summary</Text>
          </CardHeader>
          <CardContent>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Visitors:</Text>
              <Text style={styles.statValue}>{openHouse.stats.totalVisitors}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Hot Leads:</Text>
              <Text style={styles.statValue}>{openHouse.stats.hotLeads}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Warm Leads:</Text>
              <Text style={styles.statValue}>{openHouse.stats.warmLeads}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Cold Leads:</Text>
              <Text style={styles.statValue}>{openHouse.stats.coldLeads}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Conversion Rate:</Text>
              <Text style={styles.statValue}>{openHouse.stats.conversionRate}</Text>
            </View>
          </CardContent>
        </Card>
      </TransitionView>

      <TransitionView type="fade" duration={300} delay={100}>
        <Card style={styles.statCard}>
          <CardHeader>
            <Text style={styles.statCardTitle}>Visitor Traffic</Text>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Users}
              title="No Traffic Data"
              description="Traffic data will be available once visitors check in to your open house."
            />
          </CardContent>
        </Card>
      </TransitionView>

      <TransitionView type="fade" duration={300} delay={200}>
        <Card style={styles.statCard}>
          <CardHeader>
            <Text style={styles.statCardTitle}>Lead Distribution</Text>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Users}
              title="No Lead Data"
              description="Lead distribution data will be available once visitors check in to your open house."
            />
          </CardContent>
        </Card>
      </TransitionView>

      <TransitionView type="fade" duration={300} delay={300}>
        <Button 
          variant="primary"
          icon={Download}
          style={styles.exportButton}
        >
          Export Report
        </Button>
      </TransitionView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.title}>Open House Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={shareOpenHouse}
          >
            <ShareIcon size={20} color="#1e293b" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/open-houses/create')}
          >
            <Edit size={20} color="#1e293b" />
          </TouchableOpacity>
        </View>
      </View>

      <TransitionView type="fade" duration={400}>
        <View style={styles.propertyImageContainer}>
          <View style={styles.propertyImagePlaceholder}>
            <Home size={48} color="#3b82f6" />
          </View>
        </View>
      </TransitionView>

      <Tabs
        tabs={[
          { label: 'Details', value: 'details' },
          { label: 'Visitors', value: 'visitors' },
          { label: 'Stats', value: 'stats' },
        ]}
        value={activeTab}
        onChange={setActiveTab}
        style={styles.tabs}
      />

      <ScrollView style={styles.scrollView}>
        {activeTab === 'details' && renderDetailsTab()}
        {activeTab === 'visitors' && renderVisitorsTab()}
        {activeTab === 'stats' && renderStatsTab()}
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
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  propertyHeader: {
    marginBottom: 16,
  },
  propertyAddress: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3b82f6',
  },
  propertyFeatures: {
    marginBottom: 16,
  },
  featuresContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
  },
  featureValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  featureLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  featureDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleText: {
    fontSize: 14,
    color: '#1e293b',
    marginLeft: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  visitorStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  visitorStatItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  statContent: {
    alignItems: 'center',
  },
  visitorStatNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 4,
  },
  visitorStatLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  visitorCard: {
    marginBottom: 12,
  },
  visitorCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visitorStatusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  hotLead: {
    backgroundColor: '#ef4444',
  },
  warmLead: {
    backgroundColor: '#f59e0b',
  },
  coldLead: {
    backgroundColor: '#3b82f6',
  },
  visitorInfo: {
    flex: 1,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  visitorTime: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  visitorActions: {
    flexDirection: 'row',
  },
  visitorActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addVisitorButton: {
    marginTop: 16,
  },
  statCard: {
    marginBottom: 16,
  },
  statCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  exportButton: {
    marginTop: 8,
  },
});