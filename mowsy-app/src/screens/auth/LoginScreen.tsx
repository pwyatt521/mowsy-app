import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from '../../components';
import { colors, textStyles, spacing } from '../../constants';
import { useLoginMutation } from '../../store/slices/authApi';
import { useAppDispatch } from '../../store/hooks';
import { persistAuth } from '../../store/slices/authSlice';
import { tokenStorage } from '../../services/storage/tokenStorage';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const validateForm = () => {
    let isValid = true;
    
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      console.log('=== STARTING LOGIN FLOW ===');
      
      // Make the login request
      const loginPromise = login({ email, password });
      console.log('Login promise created');
      
      const result = await loginPromise.unwrap();
      console.log('=== LOGIN RESPONSE RECEIVED ===');
      
      // Immediately log the raw result to prevent any timing issues
      const resultString = JSON.stringify(result);
      console.log('RAW RESULT STRING:', resultString);
      
      // Parse it back to ensure no serialization issues
      const parsedResult = JSON.parse(resultString);
      console.log('PARSED RESULT:', parsedResult);
      
      console.log('result object:', result);
      console.log('result keys:', Object.keys(result || {}));
      console.log('result.access_token direct access:', result.access_token);
      console.log('result["access_token"] bracket access:', result["access_token"]);
      
      // Try all possible field variations
      const possibleTokenFields = ['access_token', 'accessToken', 'token', 'authToken', 'jwt'];
      const possibleRefreshFields = ['refresh_token', 'refreshToken', 'refresh'];
      
      let accessToken = null;
      let refreshToken = null;
      
      for (const field of possibleTokenFields) {
        if (result[field]) {
          accessToken = result[field];
          console.log(`Found access token in field: ${field} = ${accessToken}`);
          break;
        }
      }
      
      for (const field of possibleRefreshFields) {
        if (result[field]) {
          refreshToken = result[field];
          console.log(`Found refresh token in field: ${field} = ${refreshToken}`);
          break;
        }
      }
      
      if (!accessToken) {
        console.error('CRITICAL ERROR: No access token found in any expected field');
        console.error('Full result object keys:', Object.keys(result || {}));
        console.error('Full result object values:', Object.values(result || {}));
        throw new Error('Login response missing access token');
      }
      
      if (!result.user) {
        console.error('CRITICAL ERROR: No user found in result');
        throw new Error('Login response missing user data');
      }
      
      // Create auth data with explicit token assignment
      const authData = {
        user: result.user,
        token: String(accessToken), // Ensure it's a string
        refreshToken: refreshToken ? String(refreshToken) : undefined,
      };
      
      console.log('FINAL AUTH DATA:', JSON.stringify(authData, null, 2));
      console.log('FINAL AUTH DATA TOKEN:', authData.token);
      console.log('FINAL AUTH DATA TOKEN TYPE:', typeof authData.token);
      
      // Verify token is valid before proceeding
      if (!authData.token || authData.token === 'undefined' || authData.token === 'null') {
        throw new Error(`Invalid token value: ${authData.token}`);
      }
      
      console.log('About to call persistAuth...');
      const persistResult = await dispatch(persistAuth(authData));
      console.log('persistAuth completed:', persistResult);
      
      // Double-check storage
      const verifyToken = await tokenStorage.getToken();
      console.log('Final verification - token in storage:', verifyToken);
      
      navigation.navigate('Main', { screen: 'Home' });
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.data?.message || error.message || 'An error occurred');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
              required
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              error={passwordError}
              required
            />

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              style={styles.loginButton}
            />

            <Button
              title="Forgot Password?"
              onPress={() => navigation.navigate('ForgotPassword')}
              variant="text"
              size="small"
              style={styles.forgotButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate('Register')}
              >
                Sign up
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
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
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
  loginButton: {
    marginTop: spacing.lg,
  },
  forgotButton: {
    marginTop: spacing.md,
    alignSelf: 'center',
  },
  footer: {
    marginTop: 'auto',
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