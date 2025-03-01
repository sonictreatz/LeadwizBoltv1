import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Skeleton, SkeletonCircle } from './ui/Skeleton';
import { colors } from '../lib/constants/colors';
import { spacing } from '../lib/constants/spacing';

export const SettingsSkeleton: React.FC = () => {
  return (
    <ScrollView style={styles.scrollView}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <SkeletonCircle size={spacing[15]} style={styles.profileAvatar} />
        <View style={styles.profileInfo}>
          <Skeleton width="60%" height={spacing[5]} style={styles.profileName} />
          <Skeleton width="80%" height={spacing[4]} style={styles.profileEmail} />
        </View>
        <Skeleton width={spacing[12.5]} height={spacing[7.5]} borderRadius={spacing[1.5]} style={styles.editButton} />
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Skeleton width="30%" height={spacing[4.5]} style={styles.sectionTitle} />
        
        <View style={styles.settingItem}>
          <SkeletonCircle size={spacing[5]} />
          <Skeleton width="70%" height={spacing[4.5]} style={styles.settingText} />
          <SkeletonCircle size={spacing[5]} />
        </View>
        
        <View style={styles.settingItem}>
          <SkeletonCircle size={spacing[5]} />
          <Skeleton width="60%" height={spacing[4.5]} style={styles.settingText} />
          <Skeleton width={spacing[10]} height={spacing[5]} borderRadius={spacing[2.5]} />
        </View>
        
        <View style={styles.settingItem}>
          <SkeletonCircle size={spacing[5]} />
          <Skeleton width="50%" height={spacing[4.5]} style={styles.settingText} />
          <Skeleton width={spacing[10]} height={spacing[5]} borderRadius={spacing[2.5]} />
        </View>
      </View>

      {/* Open House Settings Section */}
      <View style={styles.section}>
        <Skeleton width="40%" height={spacing[4.5]} style={styles.sectionTitle} />
        
        <View style={styles.settingItem}>
          <Skeleton width="80%" height={spacing[4.5]} style={styles.settingText} />
          <SkeletonCircle size={spacing[5]} />
        </View>
        
        <View style={styles.settingItem}>
          <Skeleton width="60%" height={spacing[4.5]} style={styles.settingText} />
          <SkeletonCircle size={spacing[5]} />
        </View>
        
        <View style={styles.settingItem}>
          <Skeleton width="70%" height={spacing[4.5]} style={styles.settingText} />
          <SkeletonCircle size={spacing[5]} />
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Skeleton width="25%" height={spacing[4.5]} style={styles.sectionTitle} />
        
        <View style={styles.settingItem}>
          <SkeletonCircle size={spacing[5]} />
          <Skeleton width="65%" height={spacing[4.5]} style={styles.settingText} />
          <SkeletonCircle size={spacing[5]} />
        </View>
        
        <View style={styles.settingItem}>
          <SkeletonCircle size={spacing[5]} />
          <Skeleton width="70%" height={spacing[4.5]} style={styles.settingText} />
          <SkeletonCircle size={spacing[5]} />
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutButtonContainer}>
        <Skeleton width={spacing[30]} height={spacing[5]} style={styles.logoutButton} />
      </View>

      {/* Version Info */}
      <View style={styles.versionInfo}>
        <Skeleton width={spacing[20]} height={spacing[3.5]} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing[4],
    marginBottom: spacing[6],
  },
  profileAvatar: {
    marginRight: spacing[4],
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    marginBottom: spacing[2],
  },
  profileEmail: {
  },
  editButton: {
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    marginBottom: spacing[2],
    paddingHorizontal: spacing[4],
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  settingText: {
    flex: 1,
    marginLeft: spacing[3],
  },
  logoutButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing[4],
    marginBottom: spacing[6],
  },
  logoutButton: {
    alignSelf: 'center',
  },
  versionInfo: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
});