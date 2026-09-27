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
import { Refrigerator, ArrowRight, AlertCircle } from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { ActionButton } from '../components/common/ActionButton';
import { useAuthStore } from '../stores/useAuthStore';

export const AuthScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('alex.morgan@email.com');
  const [password, setPassword] = useState('password123');
  const [localError, setLocalError] = useState<string | null>(null);

  const { login, register, loginAsDemo, isLoading, error } = useAuthStore();

  const handleAuth = async () => {
    setLocalError(null);
    if (!email.trim() || !password) {
      setLocalError('Please enter your email and password.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    if (isRegister) {
      if (!name.trim()) {
        setLocalError('Please enter your full name.');
        return;
      }
      const success = await register(name.trim(), email.trim(), password);
      if (success) {
        try {
          navigation?.navigate?.('MainTabs');
        } catch (e) {}
      } else {
        setLocalError(useAuthStore.getState().error || 'Registration failed.');
      }
    } else {
      const success = await login(email.trim(), password);
      if (success) {
        try {
          navigation?.navigate?.('MainTabs');
        } catch (e) {}
      } else {
        setLocalError(useAuthStore.getState().error || 'Invalid email or password.');
      }
    }
  };

  const handleDemoLogin = async () => {
    setLocalError(null);
    const success = await loginAsDemo();
    if (success) {
      try {
        navigation?.navigate?.('MainTabs');
      } catch (e) {}
    }
  };

  const activeError = localError || error;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.canvas} />
      <View style={styles.content}>
        {/* Brand Logo Box */}
        <View style={styles.logoBox}>
          <Refrigerator size={38} color={THEME.colors.primary} />
        </View>

        <Text style={styles.appTitle}>FridgeAI</Text>
        <Text style={styles.tagline}>
          AI Fridge-to-Meal Planner for Solo Dwellers
        </Text>

        {/* Auth Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </Text>

          {activeError ? (
            <View style={styles.errorBox}>
              <AlertCircle size={16} color={THEME.colors.danger} />
              <Text style={styles.errorText}>{activeError}</Text>
            </View>
          ) : null}

          {isRegister ? (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Alex Morgan"
                placeholderTextColor={THEME.colors.textMuted}
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  setLocalError(null);
                }}
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
              onChangeText={(t) => {
                setEmail(t);
                setLocalError(null);
              }}
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
              onChangeText={(t) => {
                setPassword(t);
                setLocalError(null);
              }}
            />
          </View>

          <ActionButton
            title={isRegister ? 'Create Account' : 'Sign In'}
            onPress={handleAuth}
            loading={isLoading}
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
            onPress={() => {
              setIsRegister(!isRegister);
              setLocalError(null);
            }}
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
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  appTitle: {
    fontSize: THEME.typography.sizes.xxl,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  tagline: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.xl,
    textAlign: 'center',
  },
  formCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.xl,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  formTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.md,
    textAlign: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: THEME.colors.danger,
    borderRadius: THEME.radii.input,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  errorText: {
    color: THEME.colors.danger,
    fontSize: THEME.typography.sizes.xs + 1,
    fontWeight: '500',
    flex: 1,
  },
  inputGroup: {
    marginBottom: THEME.spacing.md,
  },
  inputLabel: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderRadius: THEME.radii.input,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: 12,
    color: THEME.colors.textPrimary,
    fontSize: THEME.typography.sizes.sm + 1,
  },
  submitBtn: {
    marginTop: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  demoBtn: {
    marginBottom: THEME.spacing.lg,
  },
  switchRow: {
    alignItems: 'center',
  },
  switchText: {
    color: THEME.colors.primary,
    fontSize: THEME.typography.sizes.sm,
    fontWeight: '600',
  },
});
