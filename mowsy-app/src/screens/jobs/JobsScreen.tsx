import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card } from '../../components';
import { colors, textStyles, spacing } from '../../constants';
import { useNavigation, useLinkTo, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useGetUserJobsQuery, useDeleteJobMutation, useGetJobsQuery, Job } from '../../store/slices/jobsApi';
import { JobsStackParamList } from '../../navigation/MainNavigator';

type TabType = 'browse' | 'my-jobs';

export const JobsScreen = () => {
  const linkTo = useLinkTo();
  const [activeTab, setActiveTab] = useState<TabType>('browse');
  const [locationFilter, setLocationFilter] = useState<'zipcode' | 'neighborhood'>('zipcode');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Fetch user's posted jobs - only when on my-jobs tab
  const { data: userJobs, isLoading: userJobsLoading, error: userJobsError, refetch: refetchUserJobs } = useGetUserJobsQuery(undefined, {
    skip: activeTab !== 'my-jobs'
  });

  // Fetch browse jobs - only when on browse tab
  const { data: browseJobs, isLoading: browseJobsLoading, error: browseJobsError, refetch: refetchBrowseJobs } = useGetJobsQuery({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  }, {
    skip: activeTab !== 'browse'
  });

  // Delete job mutation
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();

  const handleDeleteJob = async (jobId: number, jobTitle: string) => {
    console.log('=== DELETE JOB DEBUG ===');
    console.log('handleDeleteJob called with:', { jobId, jobTitle });
    console.log('Delete mutation function:', typeof deleteJob);
    
    try {
      console.log('About to call deleteJob with ID:', jobId, typeof jobId);
      const result = await deleteJob(String(jobId)).unwrap();
      console.log('Delete API call successful:', result);
      // Job will be automatically removed from the list due to RTK Query cache invalidation
    } catch (error) {
      console.error('Delete API call failed:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      Alert.alert('Error', 'Failed to delete job. Please try again.');
    }
  };


  // Refetch jobs when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (activeTab === 'my-jobs') {
        refetchUserJobs();
      } else if (activeTab === 'browse') {
        refetchBrowseJobs();
      }
    }, [activeTab, refetchUserJobs, refetchBrowseJobs])
  );

  const categories = [
    { id: 'all', name: 'All', icon: 'apps' as const },
    { id: 'lawn_mowing', name: 'Lawn Mowing', icon: 'leaf' as const },
    { id: 'hedge_trimming', name: 'Hedge Trimming', icon: 'cut' as const },
    { id: 'leaf_cleanup', name: 'Leaf Cleanup', icon: 'trash' as const },
    { id: 'garden_maintenance', name: 'Garden Maintenance', icon: 'flower' as const },
    { id: 'tree_service', name: 'Tree Service', icon: 'git-branch' as const },
    { id: 'snow_removal', name: 'Snow Removal', icon: 'snow' as const },
    { id: 'other', name: 'Other', icon: 'ellipsis-horizontal' as const },
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
                <TouchableOpacity 
                  key={category.id} 
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Ionicons 
                    name={category.icon} 
                    size={20} 
                    color={selectedCategory === category.id ? colors.white : colors.primary} 
                  />
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category.id && styles.categoryButtonTextActive,
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView style={styles.jobsList}>
            {browseJobsLoading && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading available jobs...</Text>
              </View>
            )}
            
            {browseJobsError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error loading jobs</Text>
                <Button
                  title="Retry"
                  onPress={() => refetchBrowseJobs()}
                  variant="secondary"
                  size="small"
                />
              </View>
            )}
            
            {!browseJobsLoading && !browseJobsError && browseJobs && browseJobs.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No jobs available</Text>
                <Text style={styles.emptySubtext}>Try adjusting your filters or check back later</Text>
              </View>
            )}
            
            {!browseJobsLoading && !browseJobsError && browseJobs && browseJobs.length > 0 && (
              browseJobs.map((job) => (
                <BrowseJobCard key={job.id} job={job} />
              ))
            )}
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        <View style={styles.myJobsHeader}>
          <Button
            title="Post New Job"
            onPress={() => linkTo('/jobs/create-job')}
            variant="primary"
            size="medium"
            style={styles.postJobButton}
          />
        </View>
        
        <ScrollView style={styles.jobsList}>
          <Text style={styles.sectionTitle}>Jobs I've Posted</Text>
          
          {userJobsLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading your jobs...</Text>
            </View>
          )}
          
          {userJobsError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error loading jobs</Text>
              <Button
                title="Retry"
                onPress={() => refetchUserJobs()}
                variant="secondary"
                size="small"
              />
            </View>
          )}
          
          {!userJobsLoading && !userJobsError && userJobs && userJobs.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>You haven't posted any jobs yet</Text>
              <Text style={styles.emptySubtext}>Tap "Post New Job" above to get started</Text>
            </View>
          )}
          
          {!userJobsLoading && !userJobsError && userJobs && userJobs.length > 0 && (
            userJobs.map((job) => (
              <MyJobCard 
                key={job.id} 
                job={job} 
                onDelete={() => handleDeleteJob(job.id, job.title)}
                isDeleting={isDeleting}
              />
            ))
          )}
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

const BrowseJobCard = ({ job }: { job: Job }) => {
  const navigation = useNavigation<StackNavigationProp<JobsStackParamList>>();
  
  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffHours < 1) return 'Just now';
      if (diffHours === 1) return '1 hour ago';
      if (diffHours < 24) return `${diffHours} hours ago`;
      if (diffDays === 1) return '1 day ago';
      return `${diffDays} days ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <Card style={styles.jobCard} padding="lg">
      <View style={styles.jobCardHeader}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.jobPrice}>${job.fixed_price}</Text>
      </View>
      
      <Text style={styles.jobDescription} numberOfLines={3}>{job.description}</Text>
      
      {job.special_notes && (
        <View style={styles.jobSpecialNotesContainer}>
          <Text style={styles.jobSpecialNotes} numberOfLines={2}>
            Special notes: {job.special_notes}
          </Text>
        </View>
      )}
      
      <View style={styles.jobMeta}>
        <View style={styles.jobMetaLeft}>
          <View style={styles.jobMetaItem}>
            <Ionicons name="location" size={16} color={colors.textSecondary} />
            <Text style={styles.jobMetaText}>{job.address}</Text>
          </View>
          <View style={styles.jobMetaItem}>
            <Ionicons name="star" size={16} color={colors.accent} />
            <Text style={styles.jobMetaText}>{job.user.rating?.toFixed(1) || '0.0'} ({job.user.review_count || 0})</Text>
          </View>
        </View>
        <View style={styles.jobMetaItem}>
          <Ionicons name="time" size={16} color={colors.textSecondary} />
          <Text style={styles.jobMetaText}>{job.estimated_hours}h</Text>
        </View>
      </View>
      
      <View style={styles.jobFooter}>
        <Text style={styles.jobPoster}>by {job.user.first_name} {job.user.last_name}</Text>
        <View style={styles.jobFooterRight}>
          <Text style={styles.jobPosted}>{formatTimeAgo(job.created_at)}</Text>
          <Button
            title="Apply Now"
            onPress={() => navigation.navigate('ApplyToJob', { id: String(job.id) })}
            variant="primary"
            size="small"
          />
        </View>
      </View>
    </Card>
  );
};

const MyJobCard = ({ job, onDelete, isDeleting }: { job: Job; onDelete: () => void; isDeleting: boolean }) => {
  const navigation = useNavigation<StackNavigationProp<JobsStackParamList>>();
  
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'open':
        return styles.openBadge;
      case 'in-progress':
        return styles.inProgressBadge;
      case 'completed':
        return styles.completedBadge;
      default:
        return styles.openBadge;
    }
  };

  const getStatusTextStyle = (status: string) => {
    switch (status) {
      case 'open':
        return styles.openText;
      case 'in-progress':
        return styles.inProgressText;
      case 'completed':
        return styles.completedText;
      default:
        return styles.openText;
    }
  };
  // Format the date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
      return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <Card style={styles.myJobCard}>
      <View style={styles.myJobHeader}>
        <View style={styles.myJobHeaderLeft}>
          <Text style={styles.myJobTitle}>{job.title}</Text>
          <View style={[styles.statusBadge, getStatusBadgeStyle(job.status)]}>
            <Text style={[styles.statusText, getStatusTextStyle(job.status)]}>
              {job.status.replace('-', ' ')}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            console.log('Delete button pressed for job:', job.id);
            onDelete();
          }}
          disabled={isDeleting}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons 
            name="trash" 
            size={20} 
            color={colors.error} 
          />
        </TouchableOpacity>
      </View>
      
      {job.description && (
        <Text style={styles.myJobDescription} numberOfLines={2}>
          {job.description}
        </Text>
      )}
      
      <View style={styles.myJobMeta}>
        <View style={styles.myJobMetaRow}>
          <Ionicons name="cash" size={16} color={colors.primary} />
          <Text style={styles.myJobMetaText}>${job.fixed_price}</Text>
        </View>
        <View style={styles.myJobMetaRow}>
          <Ionicons name="time" size={16} color={colors.textSecondary} />
          <Text style={styles.myJobMetaText}>{job.estimated_hours}h</Text>
        </View>
        <View style={styles.myJobMetaRow}>
          <Ionicons name="calendar" size={16} color={colors.textSecondary} />
          <Text style={styles.myJobMetaText}>Posted {formatDate(job.created_at)}</Text>
        </View>
      </View>
      
      <View style={styles.myJobActions}>
        <Button title="View Details" variant="text" size="small" onPress={() => {}} />
        <Button title="Edit" variant="secondary" size="small" onPress={() => navigation.navigate('UpdateJob', { id: String(job.id) })} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
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
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryButtonText: {
    ...textStyles.bodySmall,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  categoryButtonTextActive: {
    color: colors.white,
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
    marginBottom: spacing.lg,
  },
  jobTitle: {
    ...textStyles.h4,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.md,
    flexWrap: 'wrap',
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
    lineHeight: 22,
    minHeight: 66,
  },
  jobSpecialNotesContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  jobSpecialNotes: {
    ...textStyles.caption,
    color: colors.primary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  jobMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  jobMetaLeft: {
    flex: 1,
  },
  jobMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
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
  jobFooterRight: {
    alignItems: 'flex-end',
  },
  jobPosted: {
    ...textStyles.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
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
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  myJobHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: spacing.md,
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
  inProgressBadge: {
    backgroundColor: colors.warning + '20',
  },
  completedBadge: {
    backgroundColor: colors.primary + '20',
  },
  statusText: {
    ...textStyles.caption,
    textTransform: 'capitalize',
  },
  openText: {
    color: colors.success,
  },
  inProgressText: {
    color: colors.warning,
  },
  completedText: {
    color: colors.primary,
  },
  myJobMeta: {
    marginBottom: spacing.md,
  },
  myJobMetaText: {
    ...textStyles.bodySmall,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  myJobActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  myJobDescription: {
    ...textStyles.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  myJobMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    ...textStyles.body,
    color: colors.textSecondary,
  },
  errorContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  errorText: {
    ...textStyles.body,
    color: colors.error,
    marginBottom: spacing.md,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...textStyles.h4,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    ...textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  deleteButton: {
    padding: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    minHeight: 40,
  },
});