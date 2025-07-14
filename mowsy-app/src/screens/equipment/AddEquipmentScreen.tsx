import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from '../../components';
import { colors, textStyles, spacing } from '../../constants';
import { config } from '../../constants/config';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateLastActivity, checkSessionExpiry } from '../../store/slices/authSlice';

interface AddEquipmentScreenProps {
  navigation: any;
}

const EQUIPMENT_CATEGORIES = [
  { label: 'Mower', value: 'mower' },
  { label: 'Trimmer', value: 'trimmer' },
  { label: 'Blower', value: 'blower' },
  { label: 'Edger', value: 'edger' },
  { label: 'Chainsaw', value: 'chainsaw' },
  { label: 'Other', value: 'other' },
];

const FUEL_TYPES = [
  { label: 'Gas', value: 'gas' },
  { label: 'Electric', value: 'electric' },
  { label: 'Battery', value: 'battery' },
  { label: 'Manual', value: 'manual' },
];

const POWER_TYPES = [
  { label: 'Self-Propelled', value: 'self_propelled' },
  { label: 'Push', value: 'push' },
  { label: 'Ride-On', value: 'ride_on' },
  { label: 'Handheld', value: 'handheld' },
];

const VISIBILITY_OPTIONS = [
  { label: 'Zip Code', value: 'zip_code' },
  { label: 'Neighborhood', value: 'neighborhood' },
  { label: 'City', value: 'city' },
];

export const AddEquipmentScreen: React.FC<AddEquipmentScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [formData, setFormData] = useState({
    name: '',
    make: '',
    model: '',
    category: '',
    fuel_type: '',
    power_type: '',
    daily_rental_price: '',
    description: '',
    address: user?.address || '',
    visibility: 'zip_code',
  });

  const [dropdownStates, setDropdownStates] = useState({
    category: false,
    fuel_type: false,
    power_type: false,
    visibility: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please log in to add equipment.',
        [{ text: 'OK', onPress: () => navigation.navigate('EquipmentList') }]
      );
    }
  }, [isAuthenticated, navigation]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Equipment name is required';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.daily_rental_price || parseFloat(formData.daily_rental_price) <= 0) {
      newErrors.daily_rental_price = 'Please enter a valid daily rental price';
    }
    if (!formData.visibility) newErrors.visibility = 'Please select visibility';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!token) {
      Alert.alert('Authentication Required', 'Please log in to add equipment.');
      return;
    }

    // Check session before making API call
    const isExpired = await dispatch(checkSessionExpiry()).unwrap();
    if (isExpired) {
      Alert.alert('Session Expired', 'Your session has expired. Please log in again.');
      return;
    }

    dispatch(updateLastActivity());
    setIsSubmitting(true);

    try {
      const equipmentData = {
        name: formData.name.trim(),
        make: formData.make.trim(),
        model: formData.model.trim(),
        category: formData.category,
        fuel_type: formData.fuel_type || null,
        power_type: formData.power_type || null,
        daily_rental_price: parseFloat(formData.daily_rental_price),
        description: formData.description.trim(),
        image_urls: [], // Not implemented yet
        address: formData.address.trim() || user?.address || '',
        visibility: formData.visibility,
      };

      console.log('Adding equipment with data:', JSON.stringify(equipmentData, null, 2));

      const response = await fetch(`${config.apiUrl}/v1/equipment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(equipmentData),
      });

      console.log('API Response status:', response.status);
      console.log('API Response ok:', response.ok);

      if (!response.ok) {
        if (response.status === 401) {
          await dispatch(checkSessionExpiry());
          throw new Error('Your session has expired. Please log in again.');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add equipment');
      }

      console.log('Equipment added successfully, navigating back...');
      navigation.navigate('EquipmentList');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add equipment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDropdown = (field: string) => {
    setDropdownStates(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const selectOption = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setDropdownStates(prev => ({ ...prev, [field]: false }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getDropdownOptions = (field: string) => {
    switch (field) {
      case 'category': return EQUIPMENT_CATEGORIES;
      case 'fuel_type': return FUEL_TYPES;
      case 'power_type': return POWER_TYPES;
      case 'visibility': return VISIBILITY_OPTIONS;
      default: return [];
    }
  };

  const getSelectedLabel = (field: string, value: string) => {
    const options = getDropdownOptions(field);
    return options.find(option => option.value === value)?.label || `Select ${field.replace('_', ' ')}`;
  };

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
              onPress={() => navigation.navigate('EquipmentList')}
            >
              <Ionicons name="chevron-back" size={24} color={colors.primary} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Add Equipment</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Equipment Details</Text>
            
            {/* Equipment Name */}
            <Input
              label="Equipment Name"
              value={formData.name}
              onChangeText={(value) => setFormData(prev => ({ ...prev, name: value }))}
              placeholder="e.g., Honda Self-Propelled Mower"
              error={errors.name}
              required
            />

            {/* Make */}
            <Input
              label="Make"
              value={formData.make}
              onChangeText={(value) => setFormData(prev => ({ ...prev, make: value }))}
              placeholder="e.g., Honda, Craftsman, Ryobi"
              error={errors.make}
            />

            {/* Model */}
            <Input
              label="Model"
              value={formData.model}
              onChangeText={(value) => setFormData(prev => ({ ...prev, model: value }))}
              placeholder="e.g., HRR216VKA"
              error={errors.model}
            />

            {/* Category Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Category <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={[styles.dropdown, errors.category && styles.dropdownError]}
                onPress={() => toggleDropdown('category')}
              >
                <Text style={[
                  styles.dropdownText,
                  !formData.category && styles.placeholder
                ]}>
                  {getSelectedLabel('category', formData.category)}
                </Text>
                <Ionicons 
                  name={dropdownStates.category ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
              {dropdownStates.category && (
                <View style={styles.dropdownMenu}>
                  {EQUIPMENT_CATEGORIES.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={styles.dropdownItem}
                      onPress={() => selectOption('category', option.value)}
                    >
                      <Text style={styles.dropdownItemText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            </View>

            {/* Fuel Type Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Fuel Type</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => toggleDropdown('fuel_type')}
              >
                <Text style={[
                  styles.dropdownText,
                  !formData.fuel_type && styles.placeholder
                ]}>
                  {getSelectedLabel('fuel_type', formData.fuel_type)}
                </Text>
                <Ionicons 
                  name={dropdownStates.fuel_type ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
              {dropdownStates.fuel_type && (
                <View style={styles.dropdownMenu}>
                  {FUEL_TYPES.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={styles.dropdownItem}
                      onPress={() => selectOption('fuel_type', option.value)}
                    >
                      <Text style={styles.dropdownItemText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Power Type Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Power Type</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => toggleDropdown('power_type')}
              >
                <Text style={[
                  styles.dropdownText,
                  !formData.power_type && styles.placeholder
                ]}>
                  {getSelectedLabel('power_type', formData.power_type)}
                </Text>
                <Ionicons 
                  name={dropdownStates.power_type ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
              {dropdownStates.power_type && (
                <View style={styles.dropdownMenu}>
                  {POWER_TYPES.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={styles.dropdownItem}
                      onPress={() => selectOption('power_type', option.value)}
                    >
                      <Text style={styles.dropdownItemText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Daily Rental Price */}
            <Input
              label="Daily Rental Price"
              value={formData.daily_rental_price}
              onChangeText={(value) => setFormData(prev => ({ ...prev, daily_rental_price: value }))}
              placeholder="0.00"
              keyboardType="numeric"
              error={errors.daily_rental_price}
              required
            />

            {/* Description */}
            <Input
              label="Description"
              value={formData.description}
              onChangeText={(value) => setFormData(prev => ({ ...prev, description: value }))}
              placeholder="Describe the equipment condition, features, etc."
              multiline
              numberOfLines={4}
              maxLength={500}
              error={errors.description}
            />

            {/* Address */}
            <Input
              label="Address"
              value={formData.address}
              onChangeText={(value) => setFormData(prev => ({ ...prev, address: value }))}
              placeholder="Equipment pickup location"
              error={errors.address}
            />

            {/* Visibility Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Visibility <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={[styles.dropdown, errors.visibility && styles.dropdownError]}
                onPress={() => toggleDropdown('visibility')}
              >
                <Text style={styles.dropdownText}>
                  {getSelectedLabel('visibility', formData.visibility)}
                </Text>
                <Ionicons 
                  name={dropdownStates.visibility ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
              {dropdownStates.visibility && (
                <View style={styles.dropdownMenu}>
                  {VISIBILITY_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={styles.dropdownItem}
                      onPress={() => selectOption('visibility', option.value)}
                    >
                      <Text style={styles.dropdownItemText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {errors.visibility && <Text style={styles.errorText}>{errors.visibility}</Text>}
            </View>

            <Button
              title="Add Equipment"
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
  submitButton: {
    marginTop: spacing.lg,
  },
});