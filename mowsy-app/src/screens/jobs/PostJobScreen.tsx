import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from '../../components';
import { colors, textStyles, spacing } from '../../constants';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { config } from '../../constants/config';
import { updateLastActivity, checkSessionExpiry } from '../../store/slices/authSlice';

interface PostJobScreenProps {
  navigation: any;
}

const JOB_CATEGORIES = [
  { label: 'Mowing', value: 'mowing' },
  { label: 'Weeding', value: 'weeding' },
  { label: 'Leaf Removal', value: 'leaf_removal' },
  { label: 'Trimming', value: 'trimming' },
  { label: 'Cleanup', value: 'cleanup' },
  { label: 'Other', value: 'other' },
];

const JOB_SIZES = [
  { label: 'Small - $15 (15 mins)', value: 'small', price: 15, hours: 0.25 },
  { label: 'Medium - $30 (1 hour)', value: 'medium', price: 30, hours: 1 },
  { label: 'Large - $50 (2 hours)', value: 'large', price: 50, hours: 2 },
  { label: 'Extra Large - $100 (4 hours)', value: 'extra_large', price: 100, hours: 4 },
];

export const PostJobScreen: React.FC<PostJobScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [notes, setNotes] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Debug token state
  console.log('PostJobScreen - Auth state:', {
    isAuthenticated,
    hasToken: !!token,
    tokenLength: token?.length,
    hasUser: !!user,
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please log in to post a job.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('JobsList'),
          },
        ]
      );
    }
  }, [isAuthenticated, navigation]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedCategory) newErrors.category = 'Please select a job category';
    if (!selectedSize) newErrors.size = 'Please select a job size';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Check if we have a token
    if (!token) {
      Alert.alert(
        'Authentication Required',
        'Please log in to post a job.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Check session before making API call
    const isExpired = await dispatch(checkSessionExpiry()).unwrap();
    if (isExpired) {
      Alert.alert(
        'Session Expired',
        'Your session has expired. Please log in again.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Update activity
    dispatch(updateLastActivity());

    setIsSubmitting(true);

    try {
      const selectedSizeData = JOB_SIZES.find(size => size.value === selectedSize);
      
      const jobData = {
        title: `${JOB_CATEGORIES.find(cat => cat.value === selectedCategory)?.label} - ${selectedSizeData?.label}`,
        description: notes || '',
        special_notes: '', // Ignoring for now as requested
        category: selectedCategory,
        fixed_price: selectedSizeData?.price || 0,
        estimated_hours: selectedSizeData?.hours || 0,
        address: user?.address || '',
        visibility: 'zip_code', // Default to zip_code visibility
        scheduled_date: null, // Not implemented in form yet
      };

      console.log('Making request with token:', token ? 'Token present' : 'No token');
      console.log('Token value:', token);
      console.log('Authorization header:', `Bearer ${token}`);
      console.log('API URL:', `${config.apiUrl}/v1/jobs`);
      console.log('Job data being sent:', JSON.stringify(jobData, null, 2));

      console.log('About to make fetch request...');
      
      let response;
      try {
        response = await fetch(`${config.apiUrl}/v1/jobs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(jobData),
        });

        console.log('Fetch completed successfully');
        console.log('API Response status:', response.status);
        console.log('API Response ok:', response.ok);
      } catch (fetchError) {
        console.error('Fetch request failed:', fetchError);
        throw fetchError;
      }

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401) {
          await dispatch(checkSessionExpiry());
          throw new Error('Your session has expired. Please log in again.');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create job');
      }

      console.log('Job posted successfully, navigating back to jobs page...');
      navigation.navigate('JobsList');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to post job. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryLabel = JOB_CATEGORIES.find(cat => cat.value === selectedCategory)?.label || 'Select Category';
  const selectedSizeData = JOB_SIZES.find(size => size.value === selectedSize);
  const selectedSizeLabel = selectedSizeData?.label || 'Select Size';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.navigate('JobsList')}
            >
              <Ionicons name="chevron-back" size={24} color={colors.primary} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Post a Job</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Job Details</Text>
            
            {/* Job Category Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Job Category <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={[styles.dropdown, errors.category && styles.dropdownError]}
                onPress={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              >
                <Text style={[
                  styles.dropdownText,
                  !selectedCategory && styles.placeholder
                ]}>
                  {selectedCategoryLabel}
                </Text>
                <Ionicons 
                  name={categoryDropdownOpen ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
              {categoryDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {JOB_CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category.value}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedCategory(category.value);
                        setCategoryDropdownOpen(false);
                        if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{category.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            </View>

            {/* Job Size Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Job Size <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={[styles.dropdown, errors.size && styles.dropdownError]}
                onPress={() => setSizeDropdownOpen(!sizeDropdownOpen)}
              >
                <Text style={[
                  styles.dropdownText,
                  !selectedSize && styles.placeholder
                ]}>
                  {selectedSizeLabel}
                </Text>
                <Ionicons 
                  name={sizeDropdownOpen ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
              {sizeDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {JOB_SIZES.map((size) => (
                    <TouchableOpacity
                      key={size.value}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedSize(size.value);
                        setSizeDropdownOpen(false);
                        if (errors.size) setErrors(prev => ({ ...prev, size: '' }));
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{size.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {errors.size && <Text style={styles.errorText}>{errors.size}</Text>}
            </View>

            {/* Job Notes */}
            <View style={styles.notesContainer}>
              <Input
                label="Job Notes"
                value={notes}
                onChangeText={(value) => {
                  if (value.length <= 250) {
                    setNotes(value);
                    if (errors.notes) setErrors(prev => ({ ...prev, notes: '' }));
                  }
                }}
                placeholder="Describe what needs to be done, any special requirements, etc."
                multiline
                numberOfLines={4}
                maxLength={250}
                error={errors.notes}
                style={styles.notesInput}
                containerStyle={styles.notesInputContainer}
              />
              <Text style={styles.characterCount}>{notes.length}/250 characters</Text>
            </View>

            {/* Job Address */}
            <View style={styles.addressSection}>
              <Text style={styles.label}>Job Address</Text>
              <View style={styles.addressDisplay}>
                <Ionicons name="location" size={20} color={colors.primary} />
                <Text style={styles.addressText}>{user?.address || 'No address on file'}</Text>
              </View>
              <Text style={styles.helperText}>
                Using your profile address. Update in settings if needed.
              </Text>
            </View>

            {/* Summary */}
            {selectedSize && (
              <View style={styles.summary}>
                <Text style={styles.summaryTitle}>Job Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Category:</Text>
                  <Text style={styles.summaryValue}>{selectedCategoryLabel}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Size & Price:</Text>
                  <Text style={styles.summaryValue}>${selectedSizeData?.price}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Address:</Text>
                  <Text style={styles.summaryValue}>{user?.address || 'No address'}</Text>
                </View>
              </View>
            )}

            <Button
              title="Post Job"
              onPress={handleSubmit}
              variant="primary"
              size="large"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: spacing.xl,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    ...textStyles.body,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  title: {
    ...textStyles.h1,
    color: colors.primary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    ...textStyles.body,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  required: {
    color: colors.error,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    minHeight: 48,
  },
  dropdownError: {
    borderColor: colors.error,
  },
  dropdownText: {
    ...textStyles.body,
    color: colors.textPrimary,
  },
  placeholder: {
    color: colors.textSecondary,
  },
  dropdownMenu: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginTop: spacing.xs,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemText: {
    ...textStyles.body,
    color: colors.textPrimary,
  },
  errorText: {
    ...textStyles.bodySmall,
    color: colors.error,
    marginTop: spacing.xs,
  },
  notesContainer: {
    marginBottom: spacing.lg,
  },
  notesInputContainer: {
    marginBottom: 0,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  characterCount: {
    ...textStyles.caption,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  addressSection: {
    marginBottom: spacing.lg,
  },
  addressDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addressText: {
    ...textStyles.body,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  helperText: {
    ...textStyles.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  summary: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: 12,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryTitle: {
    ...textStyles.h4,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingVertical: spacing.xs,
  },
  summaryLabel: {
    ...textStyles.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...textStyles.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: spacing.lg,
  },
});