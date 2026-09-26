import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScanLine, Check, Cpu } from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { ActionButton } from '../components/common/ActionButton';

export const ScanProcessingScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    'Detecting items & object boundaries...',
    'Classifying proteins, produce & dairy...',
    'Estimating freshness & shelf life...',
    'Preparing ingredient confirmation...',
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setStepIndex(1), 700);
    const t2 = setTimeout(() => setStepIndex(2), 1400);
    const t3 = setTimeout(() => setStepIndex(3), 2100);
    const t4 = setTimeout(() => {
      navigation.replace('IngredientConfirm', {
        detectedIngredients: [
          {
            name: 'Chicken Breast',
            quantity: 500,
            unit: 'g',
            category: 'Meat & Poultry',
            storageLocation: 'Main Shelf',
            estimatedExpiryDays: 0,
            confidence: 98,
            boundingBox: { x: 20, y: 15, width: 35, height: 30 },
          },
          {
            name: 'Baby Spinach',
            quantity: 1,
            unit: 'bag',
            category: 'Produce',
            storageLocation: 'Crisper Drawer',
            estimatedExpiryDays: 2,
            confidence: 95,
            boundingBox: { x: 60, y: 18, width: 30, height: 28 },
          },
          {
            name: 'Greek Yogurt',
            quantity: 450,
            unit: 'g',
            category: 'Dairy & Eggs',
            storageLocation: 'Main Shelf',
            estimatedExpiryDays: 3,
            confidence: 94,
            boundingBox: { x: 22, y: 55, width: 25, height: 25 },
          },
          {
            name: 'Eggs (Large)',
            quantity: 6,
            unit: 'pcs',
            category: 'Dairy & Eggs',
            storageLocation: 'Fridge Door',
            estimatedExpiryDays: 8,
            confidence: 99,
            boundingBox: { x: 55, y: 52, width: 38, height: 30 },
          },
        ],
      });
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.canvas} />
      <View style={styles.content}>
        {/* Processing Icon */}
        <View style={styles.pulseBox}>
          <Cpu size={48} color={THEME.colors.primary} />
        </View>

        <Text style={styles.title}>Analyzing Pantry Contents</Text>
        <Text style={styles.subtitle}>
          Visual recognition is segmenting ingredients and cataloging shelf-life.
        </Text>

        {/* Steps Progress List */}
        <View style={styles.stepsContainer}>
          {steps.map((step, idx) => {
            const isCompleted = stepIndex > idx;
            const isCurrent = stepIndex === idx;

            return (
              <View key={idx} style={styles.stepRow}>
                <View
                  style={[
                    styles.stepIndicator,
                    isCompleted && styles.stepCompleted,
                    isCurrent && styles.stepCurrent,
                  ]}
                >
                  {isCompleted ? (
                    <Check size={14} color="#FFFFFF" />
                  ) : isCurrent ? (
                    <ActivityIndicator size="small" color={THEME.colors.primary} />
                  ) : (
                    <View style={styles.stepPendingDot} />
                  )}
                </View>
                <Text
                  style={[
                    styles.stepText,
                    isCompleted && styles.stepTextCompleted,
                    isCurrent && styles.stepTextCurrent,
                  ]}
                >
                  {step}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Recognition Notice */}
        <View style={styles.confidenceBox}>
          <ScanLine size={16} color={THEME.colors.primary} />
          <Text style={styles.confidenceText}>
            Detection Accuracy: 96.5% · 4 items cataloged
          </Text>
        </View>

        <ActionButton
          title="Skip to Review"
          onPress={() => {
            navigation.replace('IngredientConfirm', {});
          }}
          variant="ghost"
          size="sm"
          style={styles.skipBtn}
        />
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
  pulseBox: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: THEME.colors.surface,
    borderWidth: 2,
    borderColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  stepsContainer: {
    width: '100%',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 24,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderSubtle,
  },
  stepIndicator: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: THEME.colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepCompleted: {
    backgroundColor: THEME.colors.success,
  },
  stepCurrent: {
    backgroundColor: THEME.colors.primaryMuted,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  stepPendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.textMuted,
  },
  stepText: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textMuted,
    flex: 1,
  },
  stepTextCompleted: {
    color: THEME.colors.textPrimary,
    fontWeight: '500',
  },
  stepTextCurrent: {
    color: THEME.colors.primary,
    fontWeight: '600',
  },
  confidenceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.radii.badge,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 20,
  },
  confidenceText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginLeft: 8,
    fontWeight: '500',
  },
  skipBtn: {
    marginTop: 8,
  },
});
