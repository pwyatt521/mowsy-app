import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card } from '../../components';
import { colors, textStyles, spacing } from '../../constants';
import { useAppSelector } from '../../store/hooks';

export const HomeScreen = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {getGreeting()}, {user?.firstName || 'there'}!
          </Text>
          <View style={styles.weatherWidget}>
            <Ionicons name="sunny" size={20} color={colors.accent} />
            <Text style={styles.weatherText}>72°F - Perfect for yard work!</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <Card style={styles.actionCard}>
              <Ionicons name="add-circle" size={32} color={colors.primary} />
              <Text style={styles.actionTitle}>Post a Job</Text>
              <Text style={styles.actionDescription}>Need yard work done?</Text>
            </Card>
            <Card style={styles.actionCard}>
              <Ionicons name="search" size={32} color={colors.primary} />
              <Text style={styles.actionTitle}>Find Work</Text>
              <Text style={styles.actionDescription}>Browse available jobs</Text>
            </Card>
            <Card style={styles.actionCard}>
              <Ionicons name="construct" size={32} color={colors.primary} />
              <Text style={styles.actionTitle}>Rent Equipment</Text>
              <Text style={styles.actionDescription}>Borrow tools nearby</Text>
            </Card>
            <Card style={styles.actionCard}>
              <Ionicons name="hammer" size={32} color={colors.primary} />
              <Text style={styles.actionTitle}>List Equipment</Text>
              <Text style={styles.actionDescription}>Rent out your tools</Text>
            </Card>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Card style={styles.activityCard}>
            <View style={styles.activityItem}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Lawn mowing completed</Text>
                <Text style={styles.activityDescription}>Great job on Sarah's lawn!</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Jobs</Text>
            <Button title="See All" variant="text" size="small" onPress={() => {}} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <JobCard
              title="Lawn Mowing"
              price="$45"
              distance="0.3 miles"
              poster="Mike"
              rating={4.8}
            />
            <JobCard
              title="Hedge Trimming"
              price="$35"
              distance="0.5 miles"
              poster="Janet"
              rating={4.9}
            />
            <JobCard
              title="Leaf Cleanup"
              price="$60"
              distance="0.8 miles"
              poster="David"
              rating={4.7}
            />
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Equipment</Text>
            <Button title="See All" variant="text" size="small" onPress={() => {}} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <EquipmentCard
              title="Honda Mower"
              price="$25/day"
              distance="0.2 miles"
              owner="Tom"
              rating={4.9}
            />
            <EquipmentCard
              title="Leaf Blower"
              price="$15/day"
              distance="0.4 miles"
              owner="Lisa"
              rating={4.8}
            />
          </ScrollView>
        </View>

        <View style={styles.communityStats}>
          <Text style={styles.statsTitle}>Community Impact</Text>
          <Text style={styles.statsText}>
            47 jobs completed in your neighborhood this month
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const JobCard = ({ title, price, distance, poster, rating }) => (
  <Card style={styles.jobCard}>
    <View style={styles.jobImagePlaceholder}>
      <Ionicons name="image" size={32} color={colors.placeholder} />
    </View>
    <Text style={styles.jobTitle}>{title}</Text>
    <Text style={styles.jobPrice}>{price}</Text>
    <View style={styles.jobMeta}>
      <Text style={styles.jobDistance}>{distance}</Text>
      <View style={styles.jobRating}>
        <Ionicons name="star" size={12} color={colors.accent} />
        <Text style={styles.ratingText}>{rating}</Text>
      </View>
    </View>
    <Text style={styles.jobPoster}>by {poster}</Text>
  </Card>
);

const EquipmentCard = ({ title, price, distance, owner, rating }) => (
  <Card style={styles.equipmentCard}>
    <View style={styles.equipmentImagePlaceholder}>
      <Ionicons name="construct" size={32} color={colors.placeholder} />
    </View>
    <Text style={styles.equipmentTitle}>{title}</Text>
    <Text style={styles.equipmentPrice}>{price}</Text>
    <View style={styles.equipmentMeta}>
      <Text style={styles.equipmentDistance}>{distance}</Text>
      <View style={styles.equipmentRating}>
        <Ionicons name="star" size={12} color={colors.accent} />
        <Text style={styles.ratingText}>{rating}</Text>
      </View>
    </View>
    <Text style={styles.equipmentOwner}>by {owner}</Text>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  greeting: {
    ...textStyles.h2,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  weatherWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: 8,
  },
  weatherText: {
    ...textStyles.bodySmall,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  quickActions: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.lg,
  },
  actionTitle: {
    ...textStyles.h4,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  actionDescription: {
    ...textStyles.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  section: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  activityCard: {
    padding: spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  activityTitle: {
    ...textStyles.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  activityDescription: {
    ...textStyles.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  activityTime: {
    ...textStyles.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  jobCard: {
    width: 150,
    marginRight: spacing.md,
  },
  jobImagePlaceholder: {
    height: 80,
    backgroundColor: colors.background,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  jobTitle: {
    ...textStyles.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  jobPrice: {
    ...textStyles.body,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  jobMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  jobDistance: {
    ...textStyles.caption,
    color: colors.textSecondary,
  },
  jobRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    ...textStyles.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  jobPoster: {
    ...textStyles.caption,
    color: colors.textSecondary,
  },
  equipmentCard: {
    width: 150,
    marginRight: spacing.md,
  },
  equipmentImagePlaceholder: {
    height: 80,
    backgroundColor: colors.background,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  equipmentTitle: {
    ...textStyles.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  equipmentPrice: {
    ...textStyles.body,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  equipmentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  equipmentDistance: {
    ...textStyles.caption,
    color: colors.textSecondary,
  },
  equipmentRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equipmentOwner: {
    ...textStyles.caption,
    color: colors.textSecondary,
  },
  communityStats: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    margin: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  statsTitle: {
    ...textStyles.h4,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  statsText: {
    ...textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});