import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from '../../components';
import { colors, textStyles, spacing } from '../../constants';
import { useRegisterMutation } from '../../store/slices/authApi';
import { useAppDispatch } from '../../store/hooks';
import { persistAuth } from '../../store/slices/authSlice';

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zip_code) newErrors.zip_code = 'Zip code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const result = await register({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        phone: formData.phone || undefined,
      }).unwrap();

      // Map the API response to our internal format
      const authData = {
        user: result.user,
        token: result.access_token,
        refreshToken: result.refresh_token,
      };
      
      await dispatch(persistAuth(authData));
      navigation.navigate('Main', { screen: 'Home' });
    } catch (error: any) {
      Alert.alert('Registration Failed', error.data?.message || 'An error occurred');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.topBar}>
            <TouchableOpacity 
              style={styles.homeButton}
              onPress={() => navigation.navigate('Welcome')}
            >
              <Ionicons name="chevron-back" size={24} color={colors.primary} />
              <Text style={styles.homeButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.header}>
            <Text style={styles.title}>Join Mowsy</Text>
            <Text style={styles.subtitle}>Create your account to get started</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.nameRow}>
              <Input
                label="First Name"
                value={formData.firstName}
                onChangeText={(value) => updateField('firstName', value)}
                placeholder="First name"
                error={errors.firstName}
                containerStyle={styles.nameInput}
                required
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChangeText={(value) => updateField('lastName', value)}
                placeholder="Last name"
                error={errors.lastName}
                containerStyle={styles.nameInput}
                required
              />
            </View>

            <Input
              label="Email"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              required
            />

            <Input
              label="Password"
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              placeholder="Create a password"
              secureTextEntry
              error={errors.password}
              helperText="At least 8 characters"
              required
            />

            <Input
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => updateField('confirmPassword', value)}
              placeholder="Confirm your password"
              secureTextEntry
              error={errors.confirmPassword}
              required
            />

            <Input
              label="Address"
              value={formData.address}
              onChangeText={(value) => updateField('address', value)}
              placeholder="Enter your street address"
              error={errors.address}
              required
            />

            <View style={styles.addressRow}>
              <Input
                label="City"
                value={formData.city}
                onChangeText={(value) => updateField('city', value)}
                placeholder="City"
                error={errors.city}
                containerStyle={styles.cityInput}
                required
              />
              <Input
                label="State"
                value={formData.state}
                onChangeText={(value) => updateField('state', value)}
                placeholder="State"
                error={errors.state}
                containerStyle={styles.stateInput}
                required
              />
            </View>

            <Input
              label="Zip Code"
              value={formData.zip_code}
              onChangeText={(value) => updateField('zip_code', value)}
              placeholder="12345"
              keyboardType="number-pad"
              error={errors.zip_code}
              helperText="We'll use your location to show you nearby jobs"
              required
            />

            <Input
              label="Phone Number"
              value={formData.phone}
              onChangeText={(value) => updateField('phone', value)}
              placeholder="(555) 123-4567"
              keyboardType="phone-pad"
              helperText="Optional - for urgent notifications"
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              fullWidth
              style={styles.registerButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate('Login')}
              >
                Sign in
              </Text>
            </Text>
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
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
    paddingBottom: 100,
  },
  topBar: {
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
  },
  homeButtonText: {
    ...textStyles.body,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
  },
  title: {
    ...textStyles.h1,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: spacing.xs,
  },
  form: {
    marginBottom: spacing.xl,
  },
  nameRow: {
    flexDirection: 'row',
    marginHorizontal: -spacing.xs,
  },
  nameInput: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  addressRow: {
    flexDirection: 'row',
    marginHorizontal: -spacing.xs,
  },
  cityInput: {
    flex: 2,
    marginHorizontal: spacing.xs,
  },
  stateInput: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  registerButton: {
    marginTop: spacing.lg,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    ...textStyles.body,
    color: colors.textSecondary,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '600',
  },
});