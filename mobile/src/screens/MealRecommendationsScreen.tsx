import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Flame,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  ArrowRight,
  Utensils,
  ChefHat,
} from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { useRecipeStore } from '../stores/useRecipeStore';
import { AppHeader } from '../components/common/AppHeader';
import { ActionButton } from '../components/common/ActionButton';

export const MealRecommendationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { recipes, activeFilter, setActiveFilter, selectRecipe } = useRecipeStore();

  const filterTabs = ['All', '100% Ready', 'Use Expiring First', 'Under 20 min'];

  const filteredRecipes = recipes.filter((r) => {
    if (activeFilter === '100% Ready') return r.matchPercentage === 100;
    if (activeFilter === 'Use Expiring First') return r.usesExpiringCount > 0;
    if (activeFilter === 'Under 20 min') return r.cookTimeMinutes <= 20;
    return true;
  });

  const handleSelectRecipe = (recipe: any) => {
    selectRecipe(recipe);
    navigation.navigate('RecipeDetail');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.canvas} />
      <AppHeader
        title="Recipe Recommendations"
        subtitle="Optimized for solo dining & zero food waste"
      />

      {/* Expiring Priority Alert Banner */}
      <View style={styles.priorityBanner}>
        <Flame size={16} color={THEME.colors.primary} />
        <Text style={styles.priorityText}>
          Prioritizing recipes using Chicken Breast (today) & Baby Spinach (2d left)
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.7}
                onPress={() => setActiveFilter(tab)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Recipes List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredRecipes.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            activeOpacity={0.88}
            onPress={() => handleSelectRecipe(recipe)}
            style={styles.recipeCard}
          >
            {recipe.imageUrl ? (
              <Image
                source={{ uri: recipe.imageUrl }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            ) : null}

            {/* Tag Row */}
            <View style={styles.tagRow}>
              <View
                style={[
                  styles.matchTag,
                  recipe.matchPercentage === 100 ? styles.fullMatch : styles.partialMatch,
                ]}
              >
                <CheckCircle2
                  size={12}
                  color={recipe.matchPercentage === 100 ? THEME.colors.success : THEME.colors.warning}
                />
                <Text
                  style={[
                    styles.matchText,
                    {
                      color:
                        recipe.matchPercentage === 100 ? THEME.colors.success : THEME.colors.warning,
                    },
                  ]}
                >
                  {recipe.matchPercentage}% In Stock
                </Text>
              </View>

              {recipe.usesExpiringCount > 0 ? (
                <View style={styles.rescueTag}>
                  <Text style={styles.rescueTagText}>
                    Rescues {recipe.usesExpiringCount} Expiring
                  </Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            <Text style={styles.recipeDesc} numberOfLines={2}>
              {recipe.description}
            </Text>

            {/* Metrics: Cook time, Calories, Protein */}
            <View style={styles.metaRow}>
              <View style={styles.metaCol}>
                <Clock size={13} color={THEME.colors.textSecondary} />
                <Text style={styles.metaVal}>{recipe.cookTimeMinutes} min</Text>
              </View>
              <View style={styles.metaCol}>
                <Flame size={13} color={THEME.colors.textSecondary} />
                <Text style={styles.metaVal}>{recipe.calories} kcal</Text>
              </View>
              <View style={styles.metaCol}>
                <Text style={styles.proteinVal}>{recipe.macros.protein} protein</Text>
              </View>
              <View style={styles.servingsBadge}>
                <Text style={styles.servingsText}>{recipe.servings} serving</Text>
              </View>
            </View>

            {/* Missing Ingredients Warning if any */}
            {recipe.missingCount > 0 ? (
              <View style={styles.missingBox}>
                <AlertCircle size={12} color={THEME.colors.warning} />
                <Text style={styles.missingText}>
                  {recipe.missingCount} item needed from grocery list
                </Text>
              </View>
            ) : null}

            {/* Cook Button */}
            <ActionButton
              title="Cook This Meal"
              onPress={() => handleSelectRecipe(recipe)}
              variant="secondary"
              size="sm"
              icon={<Utensils size={14} color={THEME.colors.textPrimary} />}
              style={styles.cardCookBtn}
            />
          </TouchableOpacity>
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
  priorityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: 10,
    marginHorizontal: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
    borderRadius: THEME.radii.card,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  priorityText: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textPrimary,
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  filterRow: {
    paddingHorizontal: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  filterText: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: THEME.spacing.md,
    paddingBottom: 40,
  },
  recipeCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.md,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  matchTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  fullMatch: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
  },
  partialMatch: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
  },
  matchText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  rescueTag: {
    backgroundColor: THEME.colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  rescueTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  recipeTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  recipeDesc: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaCol: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
  },
  metaVal: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    marginLeft: 4,
  },
  proteinVal: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  servingsBadge: {
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  servingsText: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
  },
  missingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  missingText: {
    fontSize: 11,
    color: THEME.colors.warning,
    marginLeft: 6,
    fontWeight: '500',
  },
  cardCookBtn: {
    width: '100%',
  },
});
