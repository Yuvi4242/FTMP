import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Refrigerator, ArrowRight } from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { ActionButton } from '../components/common/ActionButton';
import { useAuthStore } from '../stores/useAuthStore';

export const AuthScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('alex.morgan@email.com');
  const [password, setPassword] = useState('password123');
  const { fetchProfile } = useAuthStore();

  const handleAuth = async () => {
    // Proceed to app
    await fetchProfile();
    navigation.replace('MainTabs');
  };

  const handleDemoLogin = async () => {
    await fetchProfile();
    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.canvas} />
      <View style={styles.content}>
        {/* Brand Logo Box */}
        <View style={styles.logoBox}>
          <Refrigerator size={38} color={THEME.colors.primary} />
        </View>

        <Text style={styles.appTitle}>FreshTrack</Text>
        <Text style={styles.tagline}>
          Smart Pantry & Zero-Waste Meal Studio
        </Text>

        {/* Auth Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </Text>

          {isRegister ? (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Alex Morgan"
                placeholderTextColor={THEME.colors.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="alex.morgan@email.com"
              placeholderTextColor={THEME.colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={THEME.colors.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <ActionButton
            title={isRegister ? 'Create Account' : 'Sign In'}
            onPress={handleAuth}
            size="lg"
            style={styles.submitBtn}
          />

          <ActionButton
            title="Explore as Demo Solo Dweller"
            onPress={handleDemoLogin}
            variant="outline"
            size="md"
            icon={<ArrowRight size={16} color={THEME.colors.primary} />}
            style={styles.demoBtn}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsRegister(!isRegister)}
            style={styles.switchRow}
          >
            <Text style={styles.switchText}>
              {isRegister
                ? 'Already have an account? Sign In'
                : "Don't have an account? Register"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.canvas,
  },
  content: {
    flex: 1,
    paddingHorizontal: THEME.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: THEME.colors.surface,
    borderWidth: 2,
    borderColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 28,
    maxWidth: 280,
  },
  formCard: {
    width: '100%',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderRadius: THEME.radii.input,
    paddingHorizontal: 12,
    height: 46,
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textPrimary,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  submitBtn: {
    marginTop: 8,
    width: '100%',
  },
  demoBtn: {
    marginTop: 10,
    width: '100%',
  },
  switchRow: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchText: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
  },
});
