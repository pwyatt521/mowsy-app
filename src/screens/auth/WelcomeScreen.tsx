import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
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
          <Image
            source={require('../../assets/images/mowsy-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome to Mowsy</Text>
          <Text style={styles.subtitle}>
            Connect with neighbors for affordable yard work
          </Text>
        </View>

        <View style={styles.heroContainer}>
          <Image
            source={require('../../assets/images/neighbors-helping.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
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
          />
          <Button
            title="I already have an account"
            onPress={() => navigation.navigate('Login')}
            variant="text"
            size="medium"
            fullWidth
            style={styles.loginButton}
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
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: spacing.md,
  },
  title: {
    ...textStyles.h1,
    color: colors.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  features: {
    marginBottom: spacing.xl,
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
    marginTop: 'auto',
  },
  loginButton: {
    marginTop: spacing.md,
  },
});