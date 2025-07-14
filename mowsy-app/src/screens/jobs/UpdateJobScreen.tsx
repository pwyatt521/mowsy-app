import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Card } from '../../components';
import { colors, textStyles, spacing } from '../../constants';
import { useAppSelector } from '../../store/hooks';
import { useGetJobByIdQuery, useUpdateJobMutation } from '../../store/slices/jobsApi';

type UpdateJobScreenRouteProp = RouteProp<{ params: { id: string } }, 'params'>;

export const UpdateJobScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<UpdateJobScreenRouteProp>();
  const { id } = route.params;
  const user = useAppSelector((state) => state.auth.user);

  const { data: job, isLoading: isLoadingJob, error: jobError } = useGetJobByIdQuery(id);
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    special_notes: '',
    category: '',
    fixed_price: '',
    estimated_hours: '',
    address: '',
    visibility: 'public',
    scheduled_date: '',
  });

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        special_notes: job.special_notes || '',
        category: job.category || '',
        fixed_price: job.fixed_price?.toString() || '',
        estimated_hours: job.estimated_hours?.toString() || '',
        address: job.address || '',
        visibility: job.visibility || 'public',
        scheduled_date: job.scheduled_date || '',
      });
    }
  }, [job]);

  const categories = [
    { label: 'Lawn Mowing', value: 'lawn_mowing' },
    { label: 'Hedge Trimming', value: 'hedge_trimming' },
    { label: 'Leaf Cleanup', value: 'leaf_cleanup' },
    { label: 'Garden Maintenance', value: 'garden_maintenance' },
    { label: 'Tree Service', value: 'tree_service' },
    { label: 'Snow Removal', value: 'snow_removal' },
    { label: 'Other', value: 'other' },
  ];

  const visibilityOptions = [
    { label: 'Public', value: 'public' },
    { label: 'Private', value: 'private' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleDropdown = (field: string) => {
    setActiveDropdown(activeDropdown === field ? null : field);
  };

  const selectOption = (field: string, value: string) => {
    handleInputChange(field, value);
    setActiveDropdown(null);
  };

  const getSelectedLabel = (field: string, value: string) => {
    const fieldOptions: {[key: string]: Array<{label: string, value: string}>} = {
      category: categories,
      visibility: visibilityOptions,
    };
    
    const options = fieldOptions[field] || [];
    return options.find((option: {label: string, value: string}) => option.value === value)?.label || `Select ${field.replace('_', ' ')}`;
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      Alert.alert('Error', 'Please fill in all required fields (title, description, and category).');
      return;
    }

    if (!formData.fixed_price.trim() || isNaN(parseFloat(formData.fixed_price))) {
      Alert.alert('Error', 'Please enter a valid price.');
      return;
    }

    if (!formData.estimated_hours.trim() || isNaN(parseFloat(formData.estimated_hours))) {
      Alert.alert('Error', 'Please enter valid estimated hours.');
      return;
    }

    try {
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        special_notes: formData.special_notes.trim(),
        category: formData.category,
        fixed_price: parseFloat(formData.fixed_price),
        estimated_hours: parseFloat(formData.estimated_hours),
        address: formData.address.trim() || user?.address || '',
        visibility: formData.visibility,
        scheduled_date: formData.scheduled_date ? new Date(formData.scheduled_date).toISOString() : null,
      };

      await updateJob({ id, data: updateData }).unwrap();
      navigation.goBack();
    } catch (error) {
      console.error('Error updating job:', error);
      Alert.alert('Error', 'Failed to update job. Please try again.');
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
        <Text style={styles.title}>Update Job</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>Job Details</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Job Title *</Text>
            <Input
              placeholder="e.g., Lawn mowing needed"
              value={formData.title}
              onChangeText={(value: string) => handleInputChange('title', value)}
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description *</Text>
            <Input
              placeholder="Describe the work needed..."
              value={formData.description}
              onChangeText={(value: string) => handleInputChange('description', value)}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Special Notes</Text>
            <Input
              placeholder="Any special instructions or requirements..."
              value={formData.special_notes}
              onChangeText={(value: string) => handleInputChange('special_notes', value)}
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textArea]}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category *</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => toggleDropdown('category')}
            >
              <Text style={styles.dropdownText}>
                {getSelectedLabel('category', formData.category)}
              </Text>
              <Ionicons 
                name={activeDropdown === 'category' ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Fixed Price ($) *</Text>
              <Input
                placeholder="0.00"
                value={formData.fixed_price}
                onChangeText={(value: string) => handleInputChange('fixed_price', value)}
                keyboardType="decimal-pad"
                style={styles.input}
              />
            </View>

            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Estimated Hours *</Text>
              <Input
                placeholder="0.0"
                value={formData.estimated_hours}
                onChangeText={(value: string) => handleInputChange('estimated_hours', value)}
                keyboardType="decimal-pad"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Address</Text>
            <Input
              placeholder={user?.address || "Enter job location"}
              value={formData.address}
              onChangeText={(value: string) => handleInputChange('address', value)}
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Visibility</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => toggleDropdown('visibility')}
            >
              <Text style={styles.dropdownText}>
                {getSelectedLabel('visibility', formData.visibility)}
              </Text>
              <Ionicons 
                name={activeDropdown === 'visibility' ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Scheduled Date (Optional)</Text>
            <Input
              placeholder="YYYY-MM-DD"
              value={formData.scheduled_date}
              onChangeText={(value: string) => handleInputChange('scheduled_date', value)}
              style={styles.input}
            />
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="secondary"
            style={styles.cancelButton}
          />
          <Button
            title={isUpdating ? "Updating..." : "Update Job"}
            onPress={handleSubmit}
            variant="primary"
            style={styles.submitButton}
            disabled={isUpdating}
          />
        </View>
      </ScrollView>

      {/* Dropdown overlay at the bottom */}
      {activeDropdown && (
        <>
          <TouchableOpacity
            style={styles.dropdownOverlay}
            onPress={() => setActiveDropdown(null)}
            activeOpacity={1}
          />
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownTitle}>
              Select {activeDropdown === 'category' ? 'Category' : 'Visibility'}
            </Text>
            <ScrollView style={styles.dropdownList} showsVerticalScrollIndicator={false}>
              {activeDropdown === 'category' && categories.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.dropdownOption}
                  onPress={() => selectOption('category', option.value)}
                >
                  <Text style={styles.dropdownOptionText}>{option.label}</Text>
                  {formData.category === option.value && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
              {activeDropdown === 'visibility' && visibilityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.dropdownOption}
                  onPress={() => selectOption('visibility', option.value)}
                >
                  <Text style={styles.dropdownOptionText}>{option.label}</Text>
                  {formData.visibility === option.value && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}
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
  formCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  formTitle: {
    ...textStyles.h3,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  formGroup: {
    marginBottom: spacing.lg,
    position: 'relative',
  },
  label: {
    ...textStyles.body,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    backgroundColor: colors.surface,
    ...textStyles.body,
    color: colors.textPrimary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
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
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  dropdownText: {
    ...textStyles.body,
    color: colors.textPrimary,
    flex: 1,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 999,
  },
  dropdownContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: spacing.lg,
    maxHeight: '60%',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  dropdownTitle: {
    ...textStyles.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownOptionText: {
    ...textStyles.body,
    color: colors.textPrimary,
    flex: 1,
  },
});