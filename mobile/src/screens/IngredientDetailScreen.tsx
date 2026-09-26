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
  Calendar,
  Layers,
  Camera,
  Trash2,
  CheckCircle,
  Lightbulb,
  ChefHat,
} from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { IInventoryItem } from '../types';
import { useInventoryStore } from '../stores/useInventoryStore';
import { useRecipeStore } from '../stores/useRecipeStore';
import { AppHeader } from '../components/common/AppHeader';
import { ActionButton } from '../components/common/ActionButton';
import { StatusBadge } from '../components/common/StatusBadge';

export const IngredientDetailScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const item: IInventoryItem = route.params?.item;
  const { deleteItem } = useInventoryStore();
  const { recipes, selectRecipe } = useRecipeStore();

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader title="Ingredient" onBack={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const relatedRecipes = recipes.filter((r) =>
    r.ingredients.some((ing) => ing.name.toLowerCase().includes(item.name.toLowerCase()))
  );

  const handleDelete = () => {
    Alert.alert('Remove Item', `Are you sure you want to remove ${item.name} from your pantry?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await deleteItem(item.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleMarkConsumed = async () => {
    await deleteItem(item.id);
    Alert.alert('Consumed!', `${item.name} has been marked as used. Great job avoiding waste!`, [
      { text: 'Done', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.canvas} />
      <AppHeader
        title={item.name}
        subtitle={`${item.quantity} ${item.unit} · ${item.category}`}
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity onPress={handleDelete} style={styles.deleteHeaderBtn}>
            <Trash2 size={20} color={THEME.colors.danger} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Expiry Status Hero Card */}
        <View style={styles.heroCard}>
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.ingredientImage}
              resizeMode="cover"
            />
          ) : null}

          <View style={styles.heroTopRow}>
            <StatusBadge
              status={item.expiryStatus}
              daysUntilExpiry={item.daysUntilExpiry}
            />
            {item.addedViaScan ? (
              <View style={styles.visionBadge}>
                <Camera size={11} color={THEME.colors.primary} />
                <Text style={styles.visionText}>Smart Scanned Item</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.daysNumber}>{item.daysUntilExpiry}</Text>
          <Text style={styles.daysLabel}>
            {item.daysUntilExpiry === 0
              ? 'Days Remaining (Expires Today)'
              : item.daysUntilExpiry === 1
              ? 'Day Remaining (Expires Tomorrow)'
              : 'Days of Freshness Remaining'}
          </Text>

          <View style={styles.locationContainer}>
            <Layers size={14} color={THEME.colors.textSecondary} />
            <Text style={styles.locationText}>
              Stored in: <Text style={styles.boldText}>{item.storageLocation}</Text>
            </Text>
          </View>
        </View>

        {/* Shelf-Life Preservation Tip */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Lightbulb size={18} color={THEME.colors.warning} />
            <Text style={styles.tipTitle}>Shelf-Life Extension Tip</Text>
          </View>
          <Text style={styles.tipBody}>
            {item.category === 'Produce'
              ? 'Line container with paper towels to absorb excess moisture and double freshness.'
              : item.category === 'Meat & Poultry'
              ? 'Keep on the coldest lower shelf. If not cooking today, freeze in a portion-sized bag.'
              : item.category === 'Dairy & Eggs'
              ? 'Keep inside the main fridge compartment rather than door shelf for stable temperature.'
              : 'Store in an airtight container away from heat or direct sunlight.'}
          </Text>
        </View>

        {/* Recipes using this ingredient */}
        <View style={styles.recipeSection}>
          <View style={styles.sectionHeader}>
            <ChefHat size={18} color={THEME.colors.primary} />
            <Text style={styles.sectionTitle}>Recipes Using {item.name}</Text>
          </View>

          {relatedRecipes.length === 0 ? (
            <Text style={styles.noRecipesText}>
              No specific single-serving recipes found. Generate fresh recommendations on the Recipes tab.
            </Text>
          ) : (
            relatedRecipes.map((r) => (
              <TouchableOpacity
                key={r.id}
                activeOpacity={0.85}
                onPress={() => {
                  selectRecipe(r);
                  navigation.navigate('RecipeDetail');
                }}
                style={styles.recipeCard}
              >
                <View style={styles.recipeTop}>
                  <Text style={styles.recipeTitle}>{r.title}</Text>
                  <Text style={styles.matchText}>{r.matchPercentage}% In Stock</Text>
                </View>
                <Text style={styles.recipeDesc} numberOfLines={2}>
                  {r.description}
                </Text>
                <View style={styles.recipeMeta}>
                  <Text style={styles.recipeMetaText}>{r.cookTimeMinutes} mins · {r.calories} kcal</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <ActionButton
            title="Mark as Cooked / Used"
            onPress={handleMarkConsumed}
            icon={<CheckCircle size={18} color="#FFFFFF" />}
            size="md"
            style={styles.actionBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.canvas,
  },
  deleteHeaderBtn: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: THEME.spacing.md,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  ingredientImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  visionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  visionText: {
    fontSize: 10,
    color: THEME.colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  daysNumber: {
    fontSize: 54,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -1,
  },
  daysLabel: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  locationText: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    marginLeft: 6,
  },
  boldText: {
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  tipCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tipTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginLeft: 8,
  },
  tipBody: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
  },
  recipeSection: {
    marginBottom: THEME.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginLeft: 8,
  },
  noRecipesText: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textMuted,
    fontStyle: 'italic',
  },
  recipeCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 10,
  },
  recipeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recipeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    flex: 1,
  },
  matchText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.success,
  },
  recipeDesc: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    marginBottom: 6,
  },
  recipeMeta: {
    flexDirection: 'row',
  },
  recipeMetaText: {
    fontSize: 11,
    color: THEME.colors.primary,
    fontWeight: '600',
  },
  actionsContainer: {
    marginTop: 8,
  },
  actionBtn: {
    width: '100%',
  },
});
