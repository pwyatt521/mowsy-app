import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components';
import { colors, textStyles, spacing } from '../../constants';

interface WelcomeScreenProps {
  navigation: any;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoPlaceholder}>
            <Ionicons name="leaf" size={48} color={colors.primary} />
          </View>
          <Text style={styles.title}>Welcome to Mowsy</Text>
          <Text style={styles.subtitle}>
            Connect with neighbors for affordable yard work
          </Text>
        </View>

        <View style={styles.heroContainer}>
          <View style={styles.heroImagePlaceholder}>
            <Ionicons name="people" size={64} color={colors.primary} />
            <Text style={styles.heroPlaceholderText}>Neighbors Helping Neighbors</Text>
          </View>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureTitle}>🏡 Find Local Help</Text>
            <Text style={styles.featureDescription}>
              Connect with trusted neighbors in your area
            </Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureTitle}>💰 Fair Pricing</Text>
            <Text style={styles.featureDescription}>
              Set your own rates or find affordable services
            </Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureTitle}>🛠️ Rent Equipment</Text>
            <Text style={styles.featureDescription}>
              Borrow tools from neighbors instead of buying
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Get Started"
            onPress={() => navigation.navigate('Register')}
            variant="primary"
            size="large"
            fullWidth
            style={styles.getStartedButton}
          />
          <Button
            title="Login"
            onPress={() => navigation.navigate('Login')}
            variant="secondary"
            size="large"
            fullWidth
            style={styles.loginButton}
          />
        </View>
        
        <View style={styles.spacer} />
      </ScrollView>
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
  scrollContent: {
    padding: spacing.lg,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  title: {
    ...textStyles.h1,
    color: colors.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 24,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  heroImagePlaceholder: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  heroPlaceholderText: {
    ...textStyles.body,
    color: colors.primary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  features: {
    marginBottom: spacing.md,
  },
  feature: {
    marginBottom: spacing.lg,
  },
  featureTitle: {
    ...textStyles.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    ...textStyles.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  actions: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  loginButton: {
    marginBottom: spacing.md,
  },
  getStartedButton: {
    marginBottom: spacing.xl,
  },
  spacer: {
    height: 80,
  },
});