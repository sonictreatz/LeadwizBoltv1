import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Heart, Share as ShareIcon, MapPin, Bed, Bath, Square, Tag, Calendar, Clock, Phone, Mail } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { TransitionView } from '../components/TransitionView';
import { ImageGallery } from '../components/ImageGallery';
import { Share } from 'react-native';

const { width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 70;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function PropertyDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [liked, setLiked] = useState(false);

  // Mock property data - in a real app, this would be fetched from an API
  const property = useMemo(() => ({
    id: id || '1',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    price: 450000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    yearBuilt: 2015,
    description: 'Beautiful single-family home in a quiet neighborhood. Recently renovated with modern appliances and finishes. Open floor plan with lots of natural light. Large backyard perfect for entertaining. Close to schools, parks, and shopping centers.',
    features: [
      'Hardwood floors throughout',
      'Granite countertops',
      'Stainless steel appliances',
      'Central air conditioning',
      'Attached two-car garage',
      'Fenced backyard with patio',
      'Smart home features',
      'Energy-efficient windows'
    ],
    openHouse: {
      date: 'Sunday, June 15, 2025',
      time: '1:00 PM - 4:00 PM'
    },
    agent: {
      name: 'Jane Doe',
      phone: '(555) 123-4567',
      email: 'jane.doe@realestate.com'
    },
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=1000',
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=1000',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1000'
    ]
  }), [id]);

  // Memoize handlers to prevent recreating functions on each render
  const handleLikeToggle = useCallback(() => {
    setLiked(prev => !prev);
  }, []);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Check out this property: ${property.address}, ${property.city}, ${property.state} ${property.zipCode} - $${property.price.toLocaleString()}`,
        title: 'Property Details',
      });
    } catch (error) {
      console.error('Error sharing property:', error);
    }
  }, [property]);

  const handleCallAgent = useCallback(() => {
    // In a real app, this would use Linking to make a phone call
    console.log(`Calling agent at ${property.agent.phone}`);
  }, [property.agent.phone]);

  const handleEmailAgent = useCallback(() => {
    // In a real app, this would use Linking to open email app
    console.log(`Emailing agent at ${property.agent.email}`);
  }, [property.agent.email]);

  // Animated header styles - memoize these calculations
  const headerHeight = useMemo(() => {
    return scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp',
    });
  }, [scrollY]);

  const headerOpacity = useMemo(() => {
    return scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0.5, 1],
      extrapolate: 'clamp',
    });
  }, [scrollY]);

  const imageOpacity = useMemo(() => {
    return scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 0.5, 0],
      extrapolate: 'clamp',
    });
  }, [scrollY]);

  const imageTranslateY = useMemo(() => {
    return scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -50],
      extrapolate: 'clamp',
    });
  }, [scrollY]);

  const titleScale = useMemo(() => {
    return scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 0.9, 0.8],
      extrapolate: 'clamp',
    });
  }, [scrollY]);

  const titleTranslateY = useMemo(() => {
    return scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -20, -40],
      extrapolate: 'clamp',
    });
  }, [scrollY]);

  // Optimize scroll event handling
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  // Memoize feature list to prevent unnecessary re-renders
  const featuresList = useMemo(() => (
    property.features.map((feature, index) => (
      <View key={index} style={styles.featureListItem}>
        <View style={styles.featureBullet} />
        <Text style={styles.featureText}>{feature}</Text>
      </View>
    ))
  ), [property.features]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View
          style={[
            styles.headerBackground,
            {
              opacity: headerOpacity,
            },
          ]}
        />
        
        <Animated.View
          style={[
            styles.imageContainer,
            {
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslateY }],
            },
          ]}
        >
          <ImageGallery images={property.images} />
        </Animated.View>
        
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ChevronLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLikeToggle}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Heart 
                size={24} 
                color="#ffffff" 
                fill={liked ? "#ef4444" : "transparent"} 
                stroke={liked ? "#ef4444" : "#ffffff"} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ShareIcon size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
        
        <Animated.View
          style={[
            styles.titleContainer,
            {
              transform: [
                { scale: titleScale },
                { translateY: titleTranslateY },
              ],
            },
          ]}
        >
          <Badge variant="primary" style={styles.priceBadge}>
            ${property.price.toLocaleString()}
          </Badge>
        </Animated.View>
      </Animated.View>
      
      {/* Content */}
      <Animated.ScrollView
        contentContainerStyle={styles.scrollViewContent}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        showsVerticalScrollIndicator={false}
      >
        <TransitionView type="fade" duration={300}>
          <View style={styles.addressContainer}>
            <MapPin size={20} color="#64748b" style={styles.addressIcon} />
            <Text style={styles.address}>
              {property.address}, {property.city}, {property.state} {property.zipCode}
            </Text>
          </View>
        </TransitionView>
        
        <TransitionView type="slide-up" duration={300} delay={100}>
          <Card style={styles.featuresCard}>
            <View style={styles.featuresRow}>
              <View style={styles.featureItem}>
                <Bed size={20} color="#3b82f6" />
                <Text style={styles.featureValue}>{property.bedrooms}</Text>
                <Text style={styles.featureLabel}>Beds</Text>
              </View>
              <View style={styles.featureDivider} />
              <View style={styles.featureItem}>
                <Bath size={20} color="#3b82f6" />
                <Text style={styles.featureValue}>{property.bathrooms}</Text>
                <Text style={styles.featureLabel}>Baths</Text>
              </View>
              <View style={styles.featureDivider} />
              <View style={styles.featureItem}>
                <Square size={20} color="#3b82f6" />
                <Text style={styles.featureValue}>{property.squareFeet.toLocaleString()}</Text>
                <Text style={styles.featureLabel}>Sq Ft</Text>
              </View>
              <View style={styles.featureDivider} />
              <View style={styles.featureItem}>
                <Tag size={20} color="#3b82f6" />
                <Text style={styles.featureValue}>{property.yearBuilt}</Text>
                <Text style={styles.featureLabel}>Year</Text>
              </View>
            </View>
          </Card>
        </TransitionView>
        
        <TransitionView type="slide-up" duration={300} delay={150}>
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </Card>
        </TransitionView>
        
        <TransitionView type="slide-up" duration={300} delay={200}>
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresList}>
              {featuresList}
            </View>
          </Card>
        </TransitionView>
        
        <TransitionView type="slide-up" duration={300} delay={250}>
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Open House</Text>
            <View style={styles.openHouseInfo}>
              <View style={styles.openHouseItem}>
                <Calendar size={20} color="#3b82f6" />
                <Text style={styles.openHouseText}>{property.openHouse.date}</Text>
              </View>
              <View style={styles.openHouseItem}>
                <Clock size={20} color="#3b82f6" />
                <Text style={styles.openHouseText}>{property.openHouse.time}</Text>
              </View>
            </View>
            <Button 
              variant="outline" 
              style={styles.openHouseButton}
              onPress={() => router.push('/qr-code')}
            >
              Generate QR Code for Sign-In
            </Button>
          </Card>
        </TransitionView>
        
        <TransitionView type="slide-up" duration={300} delay={300}>
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Agent</Text>
            <View style={styles.agentInfo}>
              <Text style={styles.agentName}>{property.agent.name}</Text>
              <View style={styles.agentActions}>
                <TouchableOpacity 
                  style={styles.agentAction}
                  onPress={handleCallAgent}
                >
                  <Phone size={20} color="#3b82f6" />
                  <Text style={styles.agentActionText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.agentAction}
                  onPress={handleEmailAgent}
                >
                  <Mail size={20} color="#3b82f6" />
                  <Text style={styles.agentActionText}>Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </TransitionView>
        
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
      
      <View style={styles.footer}>
        <Button 
          variant="primary" 
          style={styles.footerButton}
          onPress={() => router.push('/visitor-form')}
        >
          Schedule a Viewing
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 10,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#3b82f6',
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  priceBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#3b82f6',
  },
  scrollViewContent: {
    paddingTop: HEADER_MAX_HEIGHT,
    paddingHorizontal: 16,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  addressIcon: {
    marginRight: 8,
  },
  address: {
    fontSize: 16,
    color: '#1e293b',
    flex: 1,
  },
  featuresCard: {
    marginBottom: 16,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
  },
  featureValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 8,
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
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#334155',
  },
  featuresList: {
    marginTop: 8,
  },
  featureListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b82f6',
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#334155',
  },
  openHouseInfo: {
    marginBottom: 16,
  },
  openHouseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  openHouseText: {
    fontSize: 14,
    color: '#334155',
    marginLeft: 8,
  },
  openHouseButton: {
    marginTop: 8,
  },
  agentInfo: {
    marginTop: 8,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  agentActions: {
    flexDirection: 'row',
  },
  agentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  agentActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 80,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    padding: 16,
  },
  footerButton: {
    width: '100%',
  },
});