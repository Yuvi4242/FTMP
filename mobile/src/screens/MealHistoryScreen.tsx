import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CheckCircle2,
  DollarSign,
  Flame,
  Award,
  Clock,
  Leaf,
  TrendingUp,
} from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { AppHeader } from '../components/common/AppHeader';
import { StatCard } from '../components/common/StatCard';
import apiClient from '../api/client';
import { IMealHistory } from '../types';

const RECIPE_IMAGES: Record<string, string> = {
  'recipe-1': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80',
  'recipe-2': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=300&q=80',
  'recipe-3': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80',
  'recipe-4': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80',
  'recipe-5': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=300&q=80',
};

export const MealHistoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [history, setHistory] = useState<IMealHistory[]>([
    {
      id: 'h-1',
      userId: 'user-alex-1',
      recipeId: 'recipe-1',
      recipeTitle: 'Garlic Butter Chicken & Crispy Greens',
      cookedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      servingsCooked: 1,
      cookTimeMinutes: 20,
      calories: 480,
      ingredientsRescuedCount: 2,
      estimatedSavingsUsd: 8.5,
      zeroWasteBadge: true,
    },
    {
      id: 'h-2',
      userId: 'user-alex-1',
      recipeId: 'recipe-2',
      recipeTitle: 'Quick Spinach & Egg Scramble',
      cookedAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
      servingsCooked: 1,
      cookTimeMinutes: 10,
      calories: 310,
      ingredientsRescuedCount: 1,
      estimatedSavingsUsd: 4.2,
      zeroWasteBadge: true,
    },
    {
      id: 'h-3',
      userId: 'user-alex-1',
      recipeId: 'recipe-4',
      recipeTitle: 'One-Pan Bell Pepper & Feta Skillet',
      cookedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      servingsCooked: 1,
      cookTimeMinutes: 15,
      calories: 340,
      ingredientsRescuedCount: 2,
      estimatedSavingsUsd: 6.0,
      zeroWasteBadge: true,
    },
  ]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await apiClient.get('/meals/history');
        if (response.data && response.data.history) {
          setHistory(response.data.history);
        }
      } catch (err) {
        // Fallback default mock
      }
    };
    fetchHistory();
  }, []);

  const totalMeals = history.length;
  const totalRescued = history.reduce((acc, curr) => acc + curr.ingredientsRescuedCount, 0);
  const totalSavings = history.reduce((acc, curr) => acc + curr.estimatedSavingsUsd, 0);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.canvas} />
      <AppHeader
        title="Waste Analytics & History"
        subtitle="Your real solo-dweller sustainability metrics"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Metric Cards Row */}
        <View style={styles.statsRow}>
          <StatCard
            label="Money Saved"
            value={`$${totalSavings.toFixed(2)}`}
            subtext="From rescued groceries"
            accentColor={THEME.colors.success}
            icon={<DollarSign size={16} color={THEME.colors.success} />}
            style={{ marginRight: 6 }}
          />
          <StatCard
            label="Rescued"
            value={totalRescued}
            subtext="Expiring items cooked"
            accentColor={THEME.colors.primary}
            icon={<Leaf size={16} color={THEME.colors.primary} />}
            style={{ marginLeft: 6 }}
          />
        </View>

        {/* Zero Waste Champion Badge Card */}
        <View style={styles.achievementCard}>
          <View style={styles.badgeIconBox}>
            <Award size={24} color={THEME.colors.primary} />
          </View>
          <View style={styles.achievementTextCol}>
            <Text style={styles.achievementTitle}>Zero Waste Solo Chef</Text>
            <Text style={styles.achievementDesc}>
              100% of your cooked recipes successfully utilized food before expiry dates.
            </Text>
          </View>
        </View>

        {/* Cooked Meal Log */}
        <Text style={styles.sectionTitle}>Cooked Meals Log ({totalMeals})</Text>

        {history.map((meal) => (
          <View key={meal.id} style={styles.mealCard}>
            <View style={styles.mealHeaderRow}>
              <Image
                source={{ uri: RECIPE_IMAGES[meal.recipeId] || RECIPE_IMAGES['recipe-1'] }}
                style={styles.mealThumbnail}
                resizeMode="cover"
              />
              <View style={styles.mealHeaderTextCol}>
                <View style={styles.mealTop}>
                  <Text style={styles.mealTitle} numberOfLines={1}>
                    {meal.recipeTitle}
                  </Text>
                  <View style={styles.badgeBox}>
                    <CheckCircle2 size={12} color={THEME.colors.success} />
                    <Text style={styles.badgeText}>Zero Waste</Text>
                  </View>
                </View>

                <View style={styles.mealMetaRow}>
                  <View style={styles.metaItem}>
                    <Clock size={12} color={THEME.colors.textSecondary} />
                    <Text style={styles.metaText}>{formatDate(meal.cookedAt)}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Flame size={12} color={THEME.colors.textSecondary} />
                    <Text style={styles.metaText}>{meal.calories} kcal</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.impactFooter}>
              <Text style={styles.impactText}>
                Rescued {meal.ingredientsRescuedCount} expiring items · Saved $
                {meal.estimatedSavingsUsd.toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.canvas,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: THEME.spacing.md,
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: THEME.spacing.md,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.radii.card,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  badgeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: THEME.colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementTextCol: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  achievementDesc: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 6,
  },
  mealCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  mealHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 12,
  },
  mealHeaderTextCol: {
    flex: 1,
  },
  mealTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  mealTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  badgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.success,
    marginLeft: 3,
  },
  mealMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
  },
  metaText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginLeft: 4,
  },
  impactFooter: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderSubtle,
  },
  impactText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
});
