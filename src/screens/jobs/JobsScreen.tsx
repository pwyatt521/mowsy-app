import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card } from '../../components';
import { colors, textStyles, spacing } from '../../constants';

type TabType = 'browse' | 'my-jobs';

export const JobsScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>('browse');
  const [locationFilter, setLocationFilter] = useState<'zipcode' | 'neighborhood'>('zipcode');

  const categories = [
    { id: 'all', name: 'All', icon: 'apps' },
    { id: 'mowing', name: 'Mowing', icon: 'leaf' },
    { id: 'trimming', name: 'Trimming', icon: 'cut' },
    { id: 'cleanup', name: 'Cleanup', icon: 'trash' },
    { id: 'planting', name: 'Planting', icon: 'flower' },
  ];

  const jobs = [
    {
      id: 1,
      title: 'Weekly Lawn Mowing',
      description: 'Need someone to mow my front and back yard weekly. Small property, should take about 1 hour.',
      price: 45,
      distance: '0.3 miles',
      poster: 'Mike Johnson',
      rating: 4.8,
      category: 'mowing',
      posted: '2 hours ago',
    },
    {
      id: 2,
      title: 'Hedge Trimming',
      description: 'Have several hedges that need trimming. Tools provided.',
      price: 35,
      distance: '0.5 miles',
      poster: 'Janet Smith',
      rating: 4.9,
      category: 'trimming',
      posted: '4 hours ago',
    },
    {
      id: 3,
      title: 'Fall Leaf Cleanup',
      description: 'Large yard with lots of leaves. Need help raking and bagging.',
      price: 60,
      distance: '0.8 miles',
      poster: 'David Wilson',
      rating: 4.7,
      category: 'cleanup',
      posted: '1 day ago',
    },
  ];

  const myJobs = [
    {
      id: 1,
      title: 'Garden Weeding',
      status: 'open',
      applications: 3,
      posted: '2 days ago',
    },
    {
      id: 2,
      title: 'Lawn Mowing',
      status: 'in-progress',
      assignedTo: 'Tom Brown',
      posted: '1 week ago',
    },
  ];

  const renderTabContent = () => {
    if (activeTab === 'browse') {
      return (
        <View style={styles.tabContent}>
          <View style={styles.filters}>
            <View style={styles.locationFilter}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  locationFilter === 'zipcode' && styles.filterButtonActive,
                ]}
                onPress={() => setLocationFilter('zipcode')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    locationFilter === 'zipcode' && styles.filterButtonTextActive,
                  ]}
                >
                  My Zip Code
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  locationFilter === 'neighborhood' && styles.filterButtonActive,
                ]}
                onPress={() => setLocationFilter('neighborhood')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    locationFilter === 'neighborhood' && styles.filterButtonTextActive,
                  ]}
                >
                  My Neighborhood
                </Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
              {categories.map((category) => (
                <TouchableOpacity key={category.id} style={styles.categoryButton}>
                  <Ionicons name={category.icon} size={20} color={colors.primary} />
                  <Text style={styles.categoryButtonText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView style={styles.jobsList}>
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        <View style={styles.myJobsHeader}>
          <Button
            title="Post New Job"
            onPress={() => {}}
            variant="primary"
            size="medium"
            style={styles.postJobButton}
          />
        </View>
        
        <ScrollView style={styles.jobsList}>
          <Text style={styles.sectionTitle}>Jobs I've Posted</Text>
          {myJobs.map((job) => (
            <MyJobCard key={job.id} job={job} />
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Jobs</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'browse' && styles.activeTab]}
          onPress={() => setActiveTab('browse')}
        >
          <Text style={[styles.tabText, activeTab === 'browse' && styles.activeTabText]}>
            Browse Jobs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my-jobs' && styles.activeTab]}
          onPress={() => setActiveTab('my-jobs')}
        >
          <Text style={[styles.tabText, activeTab === 'my-jobs' && styles.activeTabText]}>
            My Jobs
          </Text>
        </TouchableOpacity>
      </View>

      {renderTabContent()}
    </SafeAreaView>
  );
};

const JobCard = ({ job }) => (
  <Card style={styles.jobCard}>
    <View style={styles.jobCardHeader}>
      <Text style={styles.jobTitle}>{job.title}</Text>
      <Text style={styles.jobPrice}>${job.price}</Text>
    </View>
    
    <Text style={styles.jobDescription}>{job.description}</Text>
    
    <View style={styles.jobMeta}>
      <View style={styles.jobMetaItem}>
        <Ionicons name="location" size={16} color={colors.textSecondary} />
        <Text style={styles.jobMetaText}>{job.distance}</Text>
      </View>
      <View style={styles.jobMetaItem}>
        <Ionicons name="star" size={16} color={colors.accent} />
        <Text style={styles.jobMetaText}>{job.rating}</Text>
      </View>
      <View style={styles.jobMetaItem}>
        <Ionicons name="time" size={16} color={colors.textSecondary} />
        <Text style={styles.jobMetaText}>{job.posted}</Text>
      </View>
    </View>
    
    <View style={styles.jobFooter}>
      <Text style={styles.jobPoster}>by {job.poster}</Text>
      <Button
        title="Apply Now"
        onPress={() => {}}
        variant="primary"
        size="small"
      />
    </View>
  </Card>
);

const MyJobCard = ({ job }) => (
  <Card style={styles.myJobCard}>
    <View style={styles.myJobHeader}>
      <Text style={styles.myJobTitle}>{job.title}</Text>
      <View style={[styles.statusBadge, styles[`${job.status}Badge`]]}>
        <Text style={[styles.statusText, styles[`${job.status}Text`]]}>
          {job.status.replace('-', ' ')}
        </Text>
      </View>
    </View>
    
    <View style={styles.myJobMeta}>
      <Text style={styles.myJobMetaText}>Posted {job.posted}</Text>
      {job.applications && (
        <Text style={styles.myJobMetaText}>{job.applications} applications</Text>
      )}
      {job.assignedTo && (
        <Text style={styles.myJobMetaText}>Assigned to {job.assignedTo}</Text>
      )}
    </View>
    
    <View style={styles.myJobActions}>
      <Button title="View Details" variant="text" size="small" onPress={() => {}} />
      <Button title="Edit" variant="secondary" size="small" onPress={() => {}} />
    </View>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...textStyles.h2,
    color: colors.primary,
  },
  searchButton: {
    padding: spacing.sm,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...textStyles.body,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  filters: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  locationFilter: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    ...textStyles.bodySmall,
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  categoryFilter: {
    flexDirection: 'row',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  categoryButtonText: {
    ...textStyles.bodySmall,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  jobsList: {
    flex: 1,
    padding: spacing.md,
  },
  jobCard: {
    marginBottom: spacing.md,
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  jobTitle: {
    ...textStyles.h4,
    color: colors.textPrimary,
    flex: 1,
  },
  jobPrice: {
    ...textStyles.h4,
    color: colors.primary,
    fontWeight: '600',
  },
  jobDescription: {
    ...textStyles.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  jobMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  jobMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobMetaText: {
    ...textStyles.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobPoster: {
    ...textStyles.bodySmall,
    color: colors.textSecondary,
  },
  myJobsHeader: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  postJobButton: {
    alignSelf: 'flex-end',
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  myJobCard: {
    marginBottom: spacing.md,
  },
  myJobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  myJobTitle: {
    ...textStyles.h4,
    color: colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  openBadge: {
    backgroundColor: colors.success + '20',
  },
  'in-progressBadge': {
    backgroundColor: colors.warning + '20',
  },
  statusText: {
    ...textStyles.caption,
    textTransform: 'capitalize',
  },
  openText: {
    color: colors.success,
  },
  'in-progressText': {
    color: colors.warning,
  },
  myJobMeta: {
    marginBottom: spacing.md,
  },
  myJobMetaText: {
    ...textStyles.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  myJobActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});