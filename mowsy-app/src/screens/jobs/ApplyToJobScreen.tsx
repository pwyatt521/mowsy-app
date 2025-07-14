import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Card } from '../../components';
import { colors, textStyles, spacing } from '../../constants';
import { useAppSelector } from '../../store/hooks';
import { useGetJobByIdQuery, useApplyToJobMutation } from '../../store/slices/jobsApi';

type ApplyToJobScreenRouteProp = RouteProp<{ params: { id: string } }, 'params'>;

export const ApplyToJobScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ApplyToJobScreenRouteProp>();
  const { id } = route.params;
  const user = useAppSelector((state) => state.auth.user);

  const { data: job, isLoading: isLoadingJob, error: jobError } = useGetJobByIdQuery(id);
  const [applyToJob, { isLoading: isApplying }] = useApplyToJobMutation();

  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message explaining why you\'re interested in this job.');
      return;
    }

    try {
      await applyToJob({ 
        id, 
        data: { message: message.trim() } 
      }).unwrap();
      
      Alert.alert(
        'Application Submitted',
        'Your application has been submitted successfully! The job poster will review your application and get back to you.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error applying to job:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    }
  };

  if (isLoadingJob) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading job details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (jobError || !job) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading job details</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} variant="secondary" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Apply to Job</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Job Summary */}
        <Card style={styles.jobSummaryCard}>
          <Text style={styles.cardTitle}>Job Summary</Text>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobPrice}>${job.fixed_price}</Text>
          <Text style={styles.jobDescription} numberOfLines={3}>{job.description}</Text>
          
          <View style={styles.jobMeta}>
            <View style={styles.jobMetaItem}>
              <Ionicons name="location" size={16} color={colors.textSecondary} />
              <Text style={styles.jobMetaText}>{job.address}</Text>
            </View>
            <View style={styles.jobMetaItem}>
              <Ionicons name="time" size={16} color={colors.textSecondary} />
              <Text style={styles.jobMetaText}>{job.estimated_hours}h</Text>
            </View>
          </View>
          
          <Text style={styles.jobPoster}>Posted by {job.user.first_name} {job.user.last_name}</Text>
        </Card>

        {/* Your Information */}
        <Card style={styles.yourInfoCard}>
          <Text style={styles.cardTitle}>Your Information</Text>
          <Text style={styles.infoText}>
            The following information from your profile will be shared with the job poster:
          </Text>
          
          <View style={styles.profileInfo}>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Name:</Text>
              <Text style={styles.profileValue}>{user?.firstName} {user?.lastName}</Text>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Email:</Text>
              <Text style={styles.profileValue}>{user?.email}</Text>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Address:</Text>
              <Text style={styles.profileValue}>{user?.address || 'Not provided'}</Text>
            </View>
          </View>
        </Card>

        {/* Application Message */}
        <Card style={styles.messageCard}>
          <Text style={styles.cardTitle}>Your Message *</Text>
          <Text style={styles.messageInstruction}>
            Tell the job poster why you're interested in this job and what makes you a good fit.
          </Text>
          
          <Input
            placeholder="I'm interested in this job because..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            style={[styles.messageInput]}
            maxLength={500}
          />
          
          <Text style={styles.characterCount}>{message.length}/500 characters</Text>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="secondary"
            style={styles.cancelButton}
          />
          <Button
            title={isApplying ? "Submitting..." : "Submit Application"}
            onPress={handleSubmit}
            variant="primary"
            style={styles.submitButton}
            disabled={isApplying}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    minWidth: 40,
  },
  title: {
    ...textStyles.h2,
    color: colors.primary,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...textStyles.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...textStyles.h4,
    color: colors.error,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  jobSummaryCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  yourInfoCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  messageCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    ...textStyles.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  jobTitle: {
    ...textStyles.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  jobPrice: {
    ...textStyles.h3,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  jobDescription: {
    ...textStyles.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  jobMeta: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  jobMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  jobMetaText: {
    ...textStyles.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  jobPoster: {
    ...textStyles.bodySmall,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  infoText: {
    ...textStyles.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  profileInfo: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.md,
  },
  profileItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  profileLabel: {
    ...textStyles.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
    width: 80,
  },
  profileValue: {
    ...textStyles.bodySmall,
    color: colors.textPrimary,
    flex: 1,
  },
  messageInstruction: {
    ...textStyles.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  messageInput: {
    height: 150,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  characterCount: {
    ...textStyles.caption,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  cancelButton: {
    width: '48%',
  },
  submitButton: {
    width: '48%',
  },
});