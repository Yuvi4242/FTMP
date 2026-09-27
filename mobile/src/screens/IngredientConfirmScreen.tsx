import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Check,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Info,
  ArrowRight,
} from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { IDetectedIngredient } from '../types';
import { useInventoryStore } from '../stores/useInventoryStore';
import { AppHeader } from '../components/common/AppHeader';
import { ActionButton } from '../components/common/ActionButton';
import { StatusBadge } from '../components/common/StatusBadge';
import { safeGoBack } from '../utils/navigation';

const INITIAL_DETECTED: IDetectedIngredient[] = [
  {
    name: 'Chicken Breast',
    quantity: 500,
    unit: 'g',
    category: 'Meat & Poultry',
    storageLocation: 'Main Shelf',
    estimatedExpiryDays: 0,
    confidence: 98,
  },
  {
    name: 'Baby Spinach',
    quantity: 1,
    unit: 'bag',
    category: 'Produce',
    storageLocation: 'Crisper Drawer',
    estimatedExpiryDays: 2,
    confidence: 95,
  },
  {
    name: 'Greek Yogurt',
    quantity: 450,
    unit: 'g',
    category: 'Dairy & Eggs',
    storageLocation: 'Main Shelf',
    estimatedExpiryDays: 3,
    confidence: 94,
  },
  {
    name: 'Eggs (Large)',
    quantity: 6,
    unit: 'pcs',
    category: 'Dairy & Eggs',
    storageLocation: 'Fridge Door',
    estimatedExpiryDays: 8,
    confidence: 99,
  },
];

export const IngredientConfirmScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const incoming = route.params?.detectedIngredients || INITIAL_DETECTED;
  const [items, setItems] = useState<IDetectedIngredient[]>(incoming);
  const [selectedIndices, setSelectedIndices] = useState<number[]>(
    incoming.map((_: any, idx: number) => idx)
  );
  const [isSaving, setIsSaving] = useState(false);
  const { addItem } = useInventoryStore();

  const toggleSelect = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    setSelectedIndices(selectedIndices.filter((i) => i !== index));
  };

  const handleConfirmAll = async () => {
    setIsSaving(true);
    const selectedItems = items.filter((_, idx) => selectedIndices.includes(idx));

    for (const item of selectedItems) {
      const expiry = new Date(Date.now() + item.estimatedExpiryDays * 24 * 3600 * 1000).toISOString();
      const status = item.estimatedExpiryDays <= 0 ? 'critical' : item.estimatedExpiryDays <= 3 ? 'soon' : 'fresh';
      await addItem({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: (item.category as any) || 'Produce',
        storageLocation: (item.storageLocation as any) || 'Main Shelf',
        expiryDate: expiry,
        expiryStatus: status,
        daysUntilExpiry: item.estimatedExpiryDays,
        addedViaScan: true,
      });
    }

    setIsSaving(false);
    Alert.alert(
      'Pantry Updated',
      `Successfully added ${selectedItems.length} scanned ingredients into your inventory!`,
      [
        {
          text: 'View Rescue Recipes',
          onPress: () => navigation.navigate('MainTabs', { screen: 'Recipes' }),
        },
        {
          text: 'Go to Pantry',
          onPress: () => navigation.navigate('MainTabs', { screen: 'Pantry' }),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.canvas} />
      <AppHeader
        title="Confirm Ingredients"
        subtitle={`${items.length} items detected from scan`}
        onBack={() => safeGoBack(navigation)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.infoBanner}>
          <Info size={16} color={THEME.colors.primary} />
          <Text style={styles.infoBannerText}>
            Review detected quantities & shelf-life before adding to your inventory.
          </Text>
        </View>

        {/* List of Detected Ingredients */}
        {items.map((item, idx) => {
          const isSelected = selectedIndices.includes(idx);
          const expiryStatus =
            item.estimatedExpiryDays <= 0
              ? 'critical'
              : item.estimatedExpiryDays <= 3
              ? 'soon'
              : 'fresh';

          return (
            <View
              key={idx}
              style={[
                styles.itemCard,
                isSelected ? styles.itemCardSelected : styles.itemCardUnselected,
              ]}
            >
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => toggleSelect(idx)}
                  style={[styles.checkbox, isSelected && styles.checkboxActive]}
                >
                  {isSelected ? <Check size={14} color="#FFFFFF" /> : null}
                </TouchableOpacity>

                <View style={styles.nameConfidenceCol}>
                  <TextInput
                    style={styles.nameInput}
                    value={item.name}
                    onChangeText={(val) => handleUpdateItem(idx, 'name', val)}
                    placeholder="Ingredient Name"
                    placeholderTextColor={THEME.colors.textMuted}
                  />
                  <View style={styles.confidenceRow}>
                    <Text style={styles.confidenceLabel}>
                      Confidence: {item.confidence}%
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleDeleteItem(idx)}
                  style={styles.deleteBtn}
                >
                  <Trash2 size={16} color={THEME.colors.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Quantity & Unit Row */}
              <View style={styles.cardDetailsRow}>
                <View style={styles.detailBox}>
                  <Text style={styles.fieldLabel}>Quantity</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={String(item.quantity)}
                    keyboardType="numeric"
                    onChangeText={(val) =>
                      handleUpdateItem(idx, 'quantity', parseInt(val) || 1)
                    }
                  />
                </View>

                <View style={styles.detailBox}>
                  <Text style={styles.fieldLabel}>Unit</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={item.unit}
                    onChangeText={(val) => handleUpdateItem(idx, 'unit', val)}
                  />
                </View>

                <View style={styles.detailBox}>
                  <Text style={styles.fieldLabel}>Days Left</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={String(item.estimatedExpiryDays)}
                    keyboardType="numeric"
                    onChangeText={(val) =>
                      handleUpdateItem(
                        idx,
                        'estimatedExpiryDays',
                        parseInt(val) || 0
                      )
                    }
                  />
                </View>
              </View>

              {/* Location & Status Bar */}
              <View style={styles.cardFooter}>
                <View style={styles.locationBadge}>
                  <Layers size={12} color={THEME.colors.textSecondary} />
                  <Text style={styles.locationText}>{item.storageLocation}</Text>
                </View>
                <StatusBadge
                  status={expiryStatus}
                  daysUntilExpiry={item.estimatedExpiryDays}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Fixed Bottom Confirmation Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomTextRow}>
          <Text style={styles.selectedCountText}>
            {selectedIndices.length} of {items.length} items selected
          </Text>
        </View>
        <ActionButton
          title={`Confirm & Add to Pantry (${selectedIndices.length})`}
          onPress={handleConfirmAll}
          loading={isSaving}
          disabled={selectedIndices.length === 0}
          icon={<Plus size={18} color="#FFFFFF" />}
          size="lg"
          style={styles.confirmBtn}
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.radii.card,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  infoBannerText: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  itemCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
  },
  itemCardSelected: {
    borderColor: THEME.colors.primary,
  },
  itemCardUnselected: {
    borderColor: THEME.colors.border,
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: THEME.colors.surfaceElevated,
  },
  checkboxActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  nameConfidenceCol: {
    flex: 1,
  },
  nameInput: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    padding: 0,
  },
  confidenceRow: {
    marginTop: 2,
  },
  confidenceLabel: {
    fontSize: 10,
    color: THEME.colors.success,
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 6,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailBox: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceElevated,
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 3,
  },
  fieldLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
    fontWeight: '600',
  },
  fieldInput: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textPrimary,
    fontWeight: '600',
    padding: 0,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderSubtle,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: THEME.typography.sizes.xs,
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
  bottomTextRow: {
    marginBottom: 8,
  },
  selectedCountText: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
  confirmBtn: {
    width: '100%',
  },
});
