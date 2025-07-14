import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card } from '../../components';
import { colors, textStyles, spacing } from '../../constants';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';

export const ProfileScreen = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };

  const profileStats = [
    { label: 'Jobs Completed', value: '12', icon: 'checkmark-circle' },
    { label: 'Equipment Rented', value: '8', icon: 'construct' },
    { label: 'Average Rating', value: '4.8', icon: 'star' },
    { label: 'Member Since', value: 'Jan 2024', icon: 'calendar' },
  ];

  const menuItems = [
    { title: 'Edit Profile', icon: 'person-outline', onPress: () => {} },
    { title: 'Payment Methods', icon: 'card-outline', onPress: () => {} },
    { title: 'Insurance Info', icon: 'shield-checkmark-outline', onPress: () => {} },
    { title: 'Notifications', icon: 'notifications-outline', onPress: () => {} },
    { title: 'Privacy Settings', icon: 'lock-closed-outline', onPress: () => {} },
    { title: 'Help & Support', icon: 'help-circle-outline', onPress: () => {} },
    { title: 'Terms of Service', icon: 'document-text-outline', onPress: () => {} },
    { title: 'About Mowsy', icon: 'information-circle-outline', onPress: () => {} },
  ];

  const recentReviews = [
    {
      id: 1,
      reviewer: 'Sarah M.',
      rating: 5,
      comment: 'Great job on the lawn mowing! Very professional and thorough.',
      date: '2 days ago',
      jobTitle: 'Weekly Lawn Mowing',
    },
    {
      id: 2,
      reviewer: 'Mike R.',
      rating: 5,
      comment: 'Equipment was in excellent condition and pickup was smooth.',
      date: '1 week ago',
      jobTitle: 'Honda Mower Rental',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={48} color={colors.white} />
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.verificationBadge}>
                <Ionicons name="shield-checkmark" size={16} color={colors.success} />
                <Text style={styles.verificationText}>
                  {user?.isVerified ? 'Verified' : 'Not Verified'}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.ratingContainer}>
            <View style={styles.rating}>
              <Ionicons name="star" size={20} color={colors.accent} />
              <Text style={styles.ratingValue}>{user?.rating || '4.8'}</Text>
            </View>
            <Text style={styles.reviewCount}>
              {user?.reviewCount || 24} reviews
            </Text>
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <View style={styles.statsGrid}>
            {profileStats.map((stat, index) => (
              <Card key={index} style={styles.statCard}>
                <Ionicons name={stat.icon} size={24} color={colors.primary} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Card>
            ))}
          </View>
        </View>

        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          {recentReviews.map((review) => (
            <Card key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>{review.reviewer}</Text>
                <View style={styles.reviewRating}>
                  {Array.from({ length: review.rating }, (_, i) => (
                    <Ionicons key={i} name="star" size={14} color={colors.accent} />
                  ))}
                </View>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              <Text style={styles.reviewJobTitle}>For: {review.jobTitle}</Text>
            </Card>
          ))}
          <Button
            title="View All Reviews"
            variant="text"
            size="small"
            onPress={() => {}}
            style={styles.viewAllButton}
          />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <Ionicons name={item.icon} size={24} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.logoutSection}>
          <Button
            title="Sign Out"
            onPress={handleLogout}
            variant="secondary"
            size="large"
            fullWidth
            style={styles.logoutButton}
          />
        </View>

        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Mowsy v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...textStyles.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...textStyles.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationText: {
    ...textStyles.bodySmall,
    color: colors.success,
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  ratingContainer: {
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  ratingValue: {
    ...textStyles.h3,
    color: colors.textPrimary,
    marginLeft: spacing.xs,
  },
  reviewCount: {
    ...textStyles.bodySmall,
    color: colors.textSecondary,
  },
  statsSection: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.lg,
  },
  statValue: {
    ...textStyles.h2,
    color: colors.primary,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...textStyles.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  reviewsSection: {
    padding: spacing.lg,
  },
  reviewCard: {
    marginBottom: spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reviewerName: {
    ...textStyles.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  reviewRating: {
    flexDirection: 'row',
    marginRight: spacing.sm,
  },
  reviewDate: {
    ...textStyles.caption,
    color: colors.textSecondary,
    marginLeft: 'auto',
  },
  reviewComment: {
    ...textStyles.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  reviewJobTitle: {
    ...textStyles.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  viewAllButton: {
    alignSelf: 'center',
    marginTop: spacing.sm,
  },
  menuSection: {
    padding: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemText: {
    ...textStyles.body,
    color: colors.textPrimary,
    flex: 1,
    marginLeft: spacing.md,
  },
  logoutSection: {
    padding: spacing.lg,
  },
  logoutButton: {
    borderColor: colors.error,
  },
  appInfo: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  appVersion: {
    ...textStyles.caption,
    color: colors.textSecondary,
  },
});