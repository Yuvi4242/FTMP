import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
} from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { useRecipeStore } from '../stores/useRecipeStore';
import { useInventoryStore } from '../stores/useInventoryStore';
import { ActionButton } from '../components/common/ActionButton';

export const CookingModeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    selectedRecipe,
    currentServings,
    activeCookingStep,
    setCookingStep,
    activeTimerSeconds,
    isTimerRunning,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    decrementTimer,
    logMealCooked,
  } = useRecipeStore();

  const { fetchInventory } = useInventoryStore();

  if (!selectedRecipe) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: '#FFFFFF', padding: 20 }}>Close</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const steps = selectedRecipe.instructions;
  const currentStep = steps[activeCookingStep] || steps[0];
  const totalSteps = steps.length;
  const isLastStep = activeCookingStep === totalSteps - 1;

  // Timer interval hook
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && activeTimerSeconds > 0) {
      interval = setInterval(() => {
        decrementTimer();
      }, 1000);
    } else if (activeTimerSeconds === 0 && isTimerRunning) {
      pauseTimer();
      Alert.alert('Timer Finished!', `Step ${activeCookingStep + 1} timer complete.`);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, activeTimerSeconds]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextStep = () => {
    if (!isLastStep) {
      setCookingStep(activeCookingStep + 1);
    } else {
      handleCompleteCooking();
    }
  };

  const handlePrevStep = () => {
    if (activeCookingStep > 0) {
      setCookingStep(activeCookingStep - 1);
    }
  };

  const handleCompleteCooking = () => {
    Alert.alert(
      'Meal Finished!',
      `You just cooked ${selectedRecipe.title} and rescued ${selectedRecipe.usesExpiringCount} expiring items!`,
      [
        {
          text: 'Log & View Waste Stats',
          onPress: async () => {
            await logMealCooked(selectedRecipe.id, currentServings);
            await fetchInventory();
            navigation.navigate('History');
          },
        },
      ]
    );
  };

  const handleExit = () => {
    Alert.alert('Exit Cooking Mode?', 'Your timer and step progress will be reset.', [
      { text: 'Keep Cooking', style: 'cancel' },
      { text: 'Exit', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.canvas} />

      {/* Top Header */}
      <View style={styles.topBar}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>
            STEP {activeCookingStep + 1} OF {totalSteps}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleExit}
          style={styles.closeBtn}
        >
          <X size={20} color={THEME.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Step Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${((activeCookingStep + 1) / totalSteps) * 100}%` },
          ]}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.recipeNameHeader}>{selectedRecipe.title}</Text>
        <Text style={styles.stepTitle}>{currentStep.title}</Text>

        {/* Step Instruction Card */}
        <View style={styles.instructionCard}>
          <Text style={styles.instructionText}>{currentStep.description}</Text>
        </View>

        {/* Ingredients for this step */}
        {currentStep.neededIngredients && currentStep.neededIngredients.length > 0 ? (
          <View style={styles.ingredientsBox}>
            <Text style={styles.neededTitle}>Ingredients Needed for this step:</Text>
            <View style={styles.neededRow}>
              {currentStep.neededIngredients.map((ing, i) => (
                <View key={i} style={styles.neededPill}>
                  <Text style={styles.neededPillText}>{ing}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Interactive Step Timer */}
        {currentStep.timerSeconds ? (
          <View style={styles.timerCard}>
            <Text style={styles.timerHeaderLabel}>Active Step Timer</Text>
            <Text style={styles.timerDigits}>{formatTimer(activeTimerSeconds)}</Text>

            <View style={styles.timerControlsRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={resetTimer}
                style={styles.timerSubBtn}
              >
                <RotateCcw size={18} color={THEME.colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={isTimerRunning ? pauseTimer : resumeTimer}
                style={styles.timerMainBtn}
              >
                {isTimerRunning ? (
                  <Pause size={22} color="#FFFFFF" />
                ) : (
                  <Play size={22} color="#FFFFFF" style={{ marginLeft: 3 }} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Chef Tip Card */}
        {currentStep.chefTip ? (
          <View style={styles.tipCard}>
            <View style={styles.tipTop}>
              <Lightbulb size={16} color={THEME.colors.warning} />
              <Text style={styles.tipTitle}>Solo Chef Tip</Text>
            </View>
            <Text style={styles.tipDesc}>{currentStep.chefTip}</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Bottom Step Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handlePrevStep}
          disabled={activeCookingStep === 0}
          style={[styles.navBtn, activeCookingStep === 0 && styles.navBtnDisabled]}
        >
          <ChevronLeft
            size={20}
            color={activeCookingStep === 0 ? THEME.colors.textMuted : THEME.colors.textPrimary}
          />
          <Text
            style={[
              styles.navBtnText,
              activeCookingStep === 0 && styles.navBtnTextDisabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <ActionButton
          title={isLastStep ? 'Finish Cooking' : 'Next Step'}
          onPress={handleNextStep}
          icon={
            isLastStep ? (
              <CheckCircle2 size={18} color="#FFFFFF" />
            ) : (
              <ChevronRight size={18} color="#FFFFFF" />
            )
          }
          size="md"
          style={styles.nextActionBtn}
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.md,
    paddingBottom: 8,
  },
  stepBadge: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: THEME.radii.badge,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.primary,
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: THEME.radii.button,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: THEME.colors.surface,
    width: '100%',
    marginBottom: 12,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: THEME.colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: THEME.spacing.md,
    paddingBottom: 100,
  },
  recipeNameHeader: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginBottom: 16,
  },
  instructionCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  instructionText: {
    fontSize: 17,
    lineHeight: 26,
    color: THEME.colors.textPrimary,
    fontWeight: '400',
  },
  ingredientsBox: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  neededTitle: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginBottom: 8,
  },
  neededRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  neededPill: {
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  neededPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  timerCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  timerHeaderLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  timerDigits: {
    fontSize: 52,
    fontWeight: '800',
    color: THEME.colors.primary,
    letterSpacing: 2,
    marginBottom: 16,
  },
  timerControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerSubBtn: {
    width: 44,
    height: 44,
    borderRadius: THEME.radii.button,
    backgroundColor: THEME.colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  timerMainBtn: {
    width: 58,
    height: 58,
    borderRadius: THEME.radii.button,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipCard: {
    backgroundColor: 'rgba(251, 191, 36, 0.08)',
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.25)',
  },
  tipTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.warning,
    marginLeft: 6,
  },
  tipDesc: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: THEME.spacing.md,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    alignItems: 'center',
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: THEME.radii.button,
    backgroundColor: THEME.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginRight: 10,
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  navBtnText: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
    marginLeft: 4,
  },
  navBtnTextDisabled: {
    color: THEME.colors.textMuted,
  },
  nextActionBtn: {
    flex: 1,
  },
});
