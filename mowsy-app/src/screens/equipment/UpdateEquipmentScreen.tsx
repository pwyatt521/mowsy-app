import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Card } from '../../components';
import { colors, textStyles, spacing } from '../../constants';
import { useAppSelector } from '../../store/hooks';
import { useGetEquipmentByIdQuery, useUpdateEquipmentMutation } from '../../store/slices/equipmentApi';

type UpdateEquipmentScreenRouteProp = RouteProp<{ params: { id: string } }, 'params'>;

export const UpdateEquipmentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<UpdateEquipmentScreenRouteProp>();
  const { id } = route.params;
  const user = useAppSelector((state) => state.auth.user);

  const { data: equipment, isLoading: isLoadingEquipment, error: equipmentError } = useGetEquipmentByIdQuery(id);
  const [updateEquipment, { isLoading: isUpdating }] = useUpdateEquipmentMutation();

  const [formData, setFormData] = useState({
    name: '',
    make: '',
    model: '',
    category: '',
    fuel_type: '',
    power_type: '',
    daily_rental_price: '',
    description: '',
    address: '',
    visibility: 'public',
    is_available: true,
  });

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name || '',
        make: equipment.make || '',
        model: equipment.model || '',
        category: equipment.category || '',
        fuel_type: equipment.fuel_type || '',
        power_type: equipment.power_type || '',
        daily_rental_price: equipment.daily_rental_price?.toString() || '',
        description: equipment.description || '',
        address: equipment.address || '',
        visibility: equipment.visibility || 'public',
        is_available: true, // Default to available since this field might not exist in current data
      });
    }
  }, [equipment]);

  const categories = [
    { label: 'Lawn Mowers', value: 'lawn_mowers' },
    { label: 'Trimmers', value: 'trimmers' },
    { label: 'Blowers', value: 'blowers' },
    { label: 'Edgers', value: 'edgers' },
    { label: 'Tillers', value: 'tillers' },
    { label: 'Chainsaws', value: 'chainsaws' },
    { label: 'Pressure Washers', value: 'pressure_washers' },
    { label: 'Other', value: 'other' },
  ];

  const fuelTypes = [
    { label: 'Gas', value: 'gas' },
    { label: 'Electric', value: 'electric' },
    { label: 'Battery', value: 'battery' },
    { label: 'Manual', value: 'manual' },
    { label: 'None', value: 'none' },
  ];

  const powerTypes = [
    { label: 'Self-Propelled', value: 'self_propelled' },
    { label: 'Push', value: 'push' },
    { label: 'Riding', value: 'riding' },
    { label: 'Handheld', value: 'handheld' },
    { label: 'Stationary', value: 'stationary' },
    { label: 'None', value: 'none' },
  ];

  const visibilityOptions = [
    { label: 'Public', value: 'public' },
    { label: 'Private', value: 'private' },
  ];

  const availabilityOptions = [
    { label: 'Available', value: true },
    { label: 'Not Available', value: false },
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleDropdown = (field: string) => {
    setActiveDropdown(activeDropdown === field ? null : field);
  };

  const selectOption = (field: string, value: string | boolean) => {
    handleInputChange(field, value);
    setActiveDropdown(null);
  };

  const getSelectedLabel = (field: string, value: string | boolean) => {
    const fieldOptions: {[key: string]: Array<{label: string, value: any}>} = {
      category: categories,
      fuel_type: fuelTypes,
      power_type: powerTypes,
      visibility: visibilityOptions,
      is_available: availabilityOptions,
    };
    
    const options = fieldOptions[field] || [];
    return options.find((option: {label: string, value: any}) => option.value === value)?.label || `Select ${field.replace('_', ' ')}`;
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.category) {
      Alert.alert('Error', 'Please fill in all required fields (name and category).');
      return;
    }

    if (!formData.daily_rental_price.trim() || isNaN(parseFloat(formData.daily_rental_price))) {
      Alert.alert('Error', 'Please enter a valid daily rental price.');
      return;
    }

    try {
      const updateData = {
        name: formData.name.trim(),
        make: formData.make.trim(),
        model: formData.model.trim(),
        category: formData.category,
        fuel_type: formData.fuel_type || null,
        power_type: formData.power_type || null,
        daily_rental_price: parseFloat(formData.daily_rental_price),
        description: formData.description.trim(),
        image_urls: [], // Keep existing or empty for now
        address: formData.address.trim() || user?.address || '',
        visibility: formData.visibility,
        is_available: formData.is_available,
      };

      await updateEquipment({ id, data: updateData }).unwrap();
      navigation.goBack();
    } catch (error) {
      console.error('Error updating equipment:', error);
      Alert.alert('Error', 'Failed to update equipment. Please try again.');
    }
  };

  if (isLoadingEquipment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading equipment details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (equipmentError || !equipment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading equipment details</Text>
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
        <Text style={styles.title}>Update Equipment</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>Equipment Details</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Equipment Name *</Text>
            <Input
              placeholder="e.g., Honda Self-Propelled Mower"
              value={formData.name}
              onChangeText={(value: string) => handleInputChange('name', value)}
              style={styles.input}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Make</Text>
              <Input
                placeholder="e.g., Honda"
                value={formData.make}
                onChangeText={(value: string) => handleInputChange('make', value)}
                style={styles.input}
              />
            </View>

            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Model</Text>
              <Input
                placeholder="e.g., HRR216VKA"
                value={formData.model}
                onChangeText={(value: string) => handleInputChange('model', value)}
                style={styles.input}
              />
            </View>
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
              <Text style={styles.label}>Fuel Type</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => toggleDropdown('fuel_type')}
              >
                <Text style={styles.dropdownText}>
                  {getSelectedLabel('fuel_type', formData.fuel_type)}
                </Text>
                <Ionicons 
                  name={activeDropdown === 'fuel_type' ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Power Type</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => toggleDropdown('power_type')}
              >
                <Text style={styles.dropdownText}>
                  {getSelectedLabel('power_type', formData.power_type)}
                </Text>
                <Ionicons 
                  name={activeDropdown === 'power_type' ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Daily Rental Price ($) *</Text>
            <Input
              placeholder="0.00"
              value={formData.daily_rental_price}
              onChangeText={(value: string) => handleInputChange('daily_rental_price', value)}
              keyboardType="decimal-pad"
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <Input
              placeholder="Describe the equipment condition, features, etc..."
              value={formData.description}
              onChangeText={(value: string) => handleInputChange('description', value)}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Address</Text>
            <Input
              placeholder={user?.address || "Enter equipment location"}
              value={formData.address}
              onChangeText={(value: string) => handleInputChange('address', value)}
              style={styles.input}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
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

            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Availability</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => toggleDropdown('is_available')}
              >
                <Text style={styles.dropdownText}>
                  {getSelectedLabel('is_available', formData.is_available)}
                </Text>
                <Ionicons 
                  name={activeDropdown === 'is_available' ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>
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
            title={isUpdating ? "Updating..." : "Update Equipment"}
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
              Select {activeDropdown === 'category' ? 'Category' : 
                     activeDropdown === 'fuel_type' ? 'Fuel Type' :
                     activeDropdown === 'power_type' ? 'Power Type' :
                     activeDropdown === 'visibility' ? 'Visibility' : 'Availability'}
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
              {activeDropdown === 'fuel_type' && fuelTypes.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.dropdownOption}
                  onPress={() => selectOption('fuel_type', option.value)}
                >
                  <Text style={styles.dropdownOptionText}>{option.label}</Text>
                  {formData.fuel_type === option.value && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
              {activeDropdown === 'power_type' && powerTypes.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.dropdownOption}
                  onPress={() => selectOption('power_type', option.value)}
                >
                  <Text style={styles.dropdownOptionText}>{option.label}</Text>
                  {formData.power_type === option.value && (
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
              {activeDropdown === 'is_available' && availabilityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.dropdownOption}
                  onPress={() => selectOption('is_available', option.value)}
                >
                  <Text style={styles.dropdownOptionText}>{option.label}</Text>
                  {formData.is_available === option.value && (
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