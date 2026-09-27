import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Clock,
  Flame,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  Utensils,
  Play,
  Layers,
  ShoppingBag,
} from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { useRecipeStore } from '../stores/useRecipeStore';
import { useGroceryStore } from '../stores/useGroceryStore';
import { AppHeader } from '../components/common/AppHeader';
import { ActionButton } from '../components/common/ActionButton';
import { safeGoBack } from '../utils/navigation';

export const RecipeDetailScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { selectedRecipe, currentServings, scaleServings } = useRecipeStore();
  const { addItem: addGroceryItem } = useGroceryStore();

  if (!selectedRecipe) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader title="Recipe" onBack={() => safeGoBack(navigation)} />
      </SafeAreaView>
    );
  }

  const handleAddMissingToGrocery = async (ingredientName: string) => {
    await addGroceryItem(ingredientName, '1 unit', 'Pantry', selectedRecipe.title);
    Alert.alert('Added to Grocery List', `${ingredientName} was added to your shopping list.`);
  };

  const handleStartCooking = () => {
    navigation.navigate('CookingMode');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.canvas} />
      <AppHeader
        title={selectedRecipe.title}
        subtitle={`${selectedRecipe.difficulty} · ${selectedRecipe.cookTimeMinutes} min cook`}
        onBack={() => safeGoBack(navigation)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <View style={styles.heroCard}>
          {selectedRecipe.imageUrl ? (
            <Image
              source={{ uri: selectedRecipe.imageUrl }}
              style={styles.recipeHeroImage}
              resizeMode="cover"
            />
          ) : null}

          <View style={styles.badgeRow}>
            <View style={styles.matchBadge}>
              <CheckCircle2 size={13} color={THEME.colors.success} />
              <Text style={styles.matchBadgeText}>
                {selectedRecipe.matchPercentage}% Ingredients Ready
              </Text>
            </View>
            {selectedRecipe.usesExpiringCount > 0 ? (
              <View style={styles.rescueBadge}>
                <Flame size={11} color={THEME.colors.primary} />
                <Text style={styles.rescueBadgeText}>
                  Rescues {selectedRecipe.usesExpiringCount} Expiring
                </Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.recipeDescription}>{selectedRecipe.description}</Text>

          {/* Servings Scaler Widget */}
          <View style={styles.servingsWidget}>
            <View style={styles.servingsLabelCol}>
              <Text style={styles.servingsTitle}>Portion Size</Text>
              <Text style={styles.servingsSubtitle}>Single-serving scaled</Text>
            </View>
            <View style={styles.counterRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => scaleServings(Math.max(1, currentServings - 1))}
                style={styles.counterBtn}
              >
                <Minus size={16} color={THEME.colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.counterVal}>{currentServings} serving</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => scaleServings(currentServings + 1)}
                style={styles.counterBtn}
              >
                <Plus size={16} color={THEME.colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Macro Nutrition Split */}
          <View style={styles.macrosRow}>
            <View style={styles.macroBox}>
              <Text style={styles.macroVal}>{selectedRecipe.calories}</Text>
              <Text style={styles.macroLabel}>Calories</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={[styles.macroVal, { color: THEME.colors.primary }]}>
                {selectedRecipe.macros.protein}
              </Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={styles.macroVal}>{selectedRecipe.macros.carbs}</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={styles.macroVal}>{selectedRecipe.macros.fat}</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
        </View>

        {/* Ingredients Checklist */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            Ingredients ({selectedRecipe.ingredients.length})
          </Text>

          {selectedRecipe.ingredients.map((ing, idx) => (
            <View key={idx} style={styles.ingredientRow}>
              <View style={styles.ingLeft}>
                {ing.inStock ? (
                  <CheckCircle2 size={18} color={THEME.colors.success} />
                ) : (
                  <XCircle size={18} color={THEME.colors.warning} />
                )}
                <View style={styles.ingTextCol}>
                  <Text style={styles.ingName}>{ing.name}</Text>
                  {ing.storageLocation ? (
                    <Text style={styles.ingLocation}>
                      In {ing.storageLocation}
                      {ing.isExpiringSoon ? ' · (Expiring Soon)' : ''}
                    </Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.ingRight}>
                <Text style={styles.ingAmount}>{ing.amount}</Text>
                {!ing.inStock ? (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleAddMissingToGrocery(ing.name)}
                    style={styles.addToListBtn}
                  >
                    <ShoppingBag size={12} color={THEME.colors.primary} />
                    <Text style={styles.addToListText}>Add to List</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ))}
        </View>

        {/* Cooking Equipment Needed */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Equipment Needed</Text>
          <View style={styles.equipmentPillsRow}>
            {selectedRecipe.equipmentNeeded.map((eq, idx) => (
              <View key={idx} style={styles.equipmentPill}>
                <Utensils size={12} color={THEME.colors.textSecondary} />
                <Text style={styles.equipmentText}>{eq}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Cooking Action */}
      <View style={styles.bottomBar}>
        <ActionButton
          title={`Start Cooking Mode (${selectedRecipe.instructions.length} Steps)`}
          onPress={handleStartCooking}
          icon={<Play size={18} color="#FFFFFF" />}
          size="lg"
          style={styles.startCookingBtn}
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: THEME.spacing.md,
    paddingBottom: 100,
  },
  heroCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  recipeHeroImage: {
    width: '100%',
    height: 190,
    borderRadius: 12,
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  matchBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.success,
    marginLeft: 4,
  },
  rescueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rescueBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.primary,
    marginLeft: 4,
  },
  recipeDescription: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  servingsWidget: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceElevated,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  servingsLabelCol: {
    flex: 1,
  },
  servingsTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  servingsSubtitle: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  counterVal: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginHorizontal: 12,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderSubtle,
  },
  macroBox: {
    flex: 1,
    alignItems: 'center',
  },
  macroVal: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  macroLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  sectionCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 12,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderSubtle,
  },
  ingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ingTextCol: {
    marginLeft: 10,
    flex: 1,
  },
  ingName: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  ingLocation: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 1,
  },
  ingRight: {
    alignItems: 'flex-end',
  },
  ingAmount: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  addToListBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: THEME.colors.primaryMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  addToListText: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.colors.primary,
    marginLeft: 3,
  },
  equipmentPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  equipmentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  equipmentText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginLeft: 6,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: THEME.spacing.md,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  startCookingBtn: {
    width: '100%',
  },
});
