import React, { useEffect } from 'react';
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
  Camera,
  AlertTriangle,
  Flame,
  Clock,
  ArrowRight,
  ScanLine,
  ShoppingBag,
  Refrigerator,
  CheckCircle2,
} from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { useInventoryStore } from '../stores/useInventoryStore';
import { useRecipeStore } from '../stores/useRecipeStore';
import { useAuthStore } from '../stores/useAuthStore';
import { ActionButton } from '../components/common/ActionButton';
import { StatusBadge } from '../components/common/StatusBadge';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { items, fetchInventory, getCriticalCount, getSoonCount, getFreshCount } =
    useInventoryStore();
  const { recipes, fetchRecipes, selectRecipe } = useRecipeStore();
  const { user, fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchInventory();
    fetchRecipes();
    fetchProfile();
  }, []);

  const criticalCount = getCriticalCount();
  const soonCount = getSoonCount();
  const topExpiringItem = items.find((i) => i.expiryStatus === 'critical') || items[0];
  const heroRecipe = recipes[0];

  const handleStartScan = () => {
    navigation.navigate('Scanner');
  };

  const handleOpenRecipe = (recipe: any) => {
    selectRecipe(recipe);
    navigation.navigate('RecipeDetail');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.canvas} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.appName}>FreshTrack</Text>
            <Text style={styles.appTagline}>Smart Kitchen & Zero-Waste Studio</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Profile')}
            style={styles.avatarButton}
          >
            <Text style={styles.avatarInitials}>
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hero Scanner Card */}
        <View style={styles.heroCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80' }}
            style={styles.heroBannerImage}
            resizeMode="cover"
          />
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <ScanLine size={13} color={THEME.colors.primary} />
              <Text style={styles.heroBadgeText}>SMART PANTRY SCANNER</Text>
            </View>
            <Text style={styles.heroTitle}>Scan your pantry to rescue ingredients</Text>
            <Text style={styles.heroSubtitle}>
              Point your camera at shelves or drawers. Quickly log items, track shelf-life,
              and match zero-waste recipes.
            </Text>
            <ActionButton
              title="Open Camera Scanner"
              onPress={handleStartScan}
              icon={<Camera size={18} color="#FFFFFF" />}
              size="md"
              style={styles.heroButton}
            />
          </View>
        </View>

        {/* Expiry Rescue Alert Banner */}
        {criticalCount > 0 ? (
          <View style={styles.alertBanner}>
            <View style={styles.alertHeader}>
              <View style={styles.alertIconBadge}>
                <AlertTriangle size={16} color={THEME.colors.danger} />
              </View>
              <View style={styles.alertTitleCol}>
                <Text style={styles.alertTitle}>
                  {criticalCount} Item Expiring Today
                </Text>
                <Text style={styles.alertSubtitle}>
                  {topExpiringItem?.name} needs to be cooked today to avoid waste
                </Text>
              </View>
            </View>
            <View style={styles.alertActionsRow}>
              <StatusBadge status="critical" daysUntilExpiry={0} />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Recipes')}
                style={styles.rescueLink}
              >
                <Text style={styles.rescueLinkText}>Find Rescue Recipe</Text>
                <ArrowRight size={14} color={THEME.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Pantry Quick Overview Bar */}
        <View style={styles.pantrySummaryCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <Refrigerator size={18} color={THEME.colors.textPrimary} />
              <Text style={styles.sectionTitle}>Pantry Health</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Pantry')}
            >
              <Text style={styles.viewAllLink}>View All ({items.length})</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pantryPillsRow}>
            <View style={[styles.statusPill, styles.criticalPill]}>
              <Text style={styles.pillCount}>{criticalCount}</Text>
              <Text style={styles.pillLabel}>Critical</Text>
            </View>
            <View style={[styles.statusPill, styles.soonPill]}>
              <Text style={styles.pillCount}>{soonCount}</Text>
              <Text style={styles.pillLabel}>Use Soon</Text>
            </View>
            <View style={[styles.statusPill, styles.freshPill]}>
              <Text style={styles.pillCount}>{getFreshCount()}</Text>
              <Text style={styles.pillLabel}>Fresh</Text>
            </View>
          </View>
        </View>

        {/* Featured Rescue Dinner Recipe */}
        {heroRecipe ? (
          <View style={styles.recipeSection}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleRow}>
                <Flame size={18} color={THEME.colors.primary} />
                <Text style={styles.sectionTitle}>Tonight's Rescue Dinner</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Recipes')}
              >
                <Text style={styles.viewAllLink}>All Recipes</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => handleOpenRecipe(heroRecipe)}
              style={styles.recipeCard}
            >
              {heroRecipe.imageUrl ? (
                <Image
                  source={{ uri: heroRecipe.imageUrl }}
                  style={styles.recipeHeroImg}
                  resizeMode="cover"
                />
              ) : null}

              <View style={styles.recipeTagRow}>
                <View style={styles.matchTag}>
                  <CheckCircle2 size={12} color={THEME.colors.success} />
                  <Text style={styles.matchTagText}>{heroRecipe.matchPercentage}% In Stock</Text>
                </View>
                <View style={styles.expiringTag}>
                  <Text style={styles.expiringTagText}>
                    Rescues {heroRecipe.usesExpiringCount} Expiring
                  </Text>
                </View>
              </View>

              <Text style={styles.recipeTitle}>{heroRecipe.title}</Text>
              <Text style={styles.recipeDesc} numberOfLines={2}>
                {heroRecipe.description}
              </Text>

              <View style={styles.recipeMetaRow}>
                <View style={styles.metaItem}>
                  <Clock size={14} color={THEME.colors.textSecondary} />
                  <Text style={styles.metaText}>{heroRecipe.cookTimeMinutes} mins</Text>
                </View>
                <View style={styles.metaItem}>
                  <Flame size={14} color={THEME.colors.textSecondary} />
                  <Text style={styles.metaText}>{heroRecipe.calories} kcal</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaTextBold}>
                    {heroRecipe.macros.protein} protein
                  </Text>
                </View>
              </View>

              <ActionButton
                title="View Recipe & Cook"
                onPress={() => handleOpenRecipe(heroRecipe)}
                variant="secondary"
                size="sm"
                style={styles.recipeCookBtn}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Quick Utility Shortcuts */}
        <View style={styles.utilityRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Grocery')}
            style={styles.utilityCard}
          >
            <View style={styles.utilityIconBox}>
              <ShoppingBag size={20} color={THEME.colors.primary} />
            </View>
            <Text style={styles.utilityTitle}>Smart Grocery List</Text>
            <Text style={styles.utilityDesc}>Auto-fill missing ingredients</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('History')}
            style={styles.utilityCard}
          >
            <View style={styles.utilityIconBox}>
              <CheckCircle2 size={20} color={THEME.colors.success} />
            </View>
            <Text style={styles.utilityTitle}>Waste Analytics</Text>
            <Text style={styles.utilityDesc}>Track money saved & meals</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.canvas,
  },
  container: {
    flex: 1,
    backgroundColor: THEME.colors.canvas,
  },
  contentContainer: {
    padding: THEME.spacing.md,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
    marginTop: 4,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    marginTop: 1,
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: THEME.radii.button,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  heroCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
    overflow: 'hidden',
  },
  heroBannerImage: {
    width: '100%',
    height: 120,
    opacity: 0.65,
  },
  heroContent: {
    padding: THEME.spacing.md,
    marginTop: -20,
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radii.badge,
    alignSelf: 'flex-start',
    marginBottom: THEME.spacing.sm,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.primary,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 6,
    lineHeight: 26,
  },
  heroSubtitle: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    lineHeight: 20,
    marginBottom: THEME.spacing.md,
  },
  heroButton: {
    width: '100%',
  },
  alertBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: THEME.spacing.md,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  alertIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: THEME.colors.expiry.criticalBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  alertTitleCol: {
    flex: 1,
  },
  alertTitle: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  alertSubtitle: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  alertActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(239, 68, 68, 0.15)',
  },
  rescueLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rescueLinkText: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: '600',
    color: THEME.colors.primary,
    marginRight: 4,
  },
  pantrySummaryCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginLeft: 8,
  },
  viewAllLink: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
  pantryPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusPill: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
  },
  criticalPill: {
    backgroundColor: THEME.colors.expiry.criticalBg,
    borderColor: THEME.colors.expiry.criticalBorder,
  },
  soonPill: {
    backgroundColor: THEME.colors.expiry.soonBg,
    borderColor: THEME.colors.expiry.soonBorder,
  },
  freshPill: {
    backgroundColor: THEME.colors.expiry.freshBg,
    borderColor: THEME.colors.expiry.freshBorder,
  },
  pillCount: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  pillLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  recipeSection: {
    marginBottom: THEME.spacing.md,
  },
  recipeCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  recipeHeroImg: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  recipeTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  matchTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  matchTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.success,
    marginLeft: 4,
  },
  expiringTag: {
    backgroundColor: THEME.colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  expiringTagText: {
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
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    lineHeight: 19,
    marginBottom: 10,
  },
  recipeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
  },
  metaText: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    marginLeft: 4,
  },
  metaTextBold: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  recipeCookBtn: {
    width: '100%',
  },
  utilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  utilityCard: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginHorizontal: 4,
  },
  utilityIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: THEME.colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  utilityTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 2,
  },
  utilityDesc: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 15,
  },
});
