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
  ArrowRight,
  PackageCheck,
  ShoppingBag,
} from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { useGroceryStore } from '../stores/useGroceryStore';
import { useInventoryStore } from '../stores/useInventoryStore';
import { AppHeader } from '../components/common/AppHeader';
import { ActionButton } from '../components/common/ActionButton';

export const GroceryListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    items,
    addItem,
    togglePurchased,
    transferCheckedToPantry,
    deleteItem,
    getPendingCount,
    getPurchasedCount,
  } = useGroceryStore();

  const { fetchInventory } = useInventoryStore();

  const [newItemName, setNewItemName] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  const pending = items.filter((i) => !i.isPurchased);
  const purchased = items.filter((i) => i.isPurchased);

  const handleAddItem = async () => {
    if (!newItemName.trim()) return;
    await addItem(newItemName.trim(), '1 unit', 'Pantry');
    setNewItemName('');
  };

  const handleTransfer = async () => {
    setIsTransferring(true);
    const count = await transferCheckedToPantry();
    await fetchInventory();
    setIsTransferring(false);
    Alert.alert(
      'Pantry Restocked!',
      `Transferred ${count} purchased items directly into your pantry inventory.`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.canvas} />
      <AppHeader
        title="Smart Grocery List"
        subtitle={`${pending.length} needed · ${purchased.length} checked`}
      />

      {/* Quick Add Bar */}
      <View style={styles.addBarContainer}>
        <TextInput
          style={styles.addInput}
          placeholder="Add grocery item (e.g. Olive Oil, Garlic)..."
          placeholderTextColor={THEME.colors.textMuted}
          value={newItemName}
          onChangeText={setNewItemName}
          onSubmitEditing={handleAddItem}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleAddItem}
          style={styles.addBtn}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Zero Waste Transfer Banner */}
      {purchased.length > 0 ? (
        <View style={styles.transferBanner}>
          <View style={styles.transferTextCol}>
            <Text style={styles.transferTitle}>
              {purchased.length} Items Ready for Pantry
            </Text>
            <Text style={styles.transferDesc}>
              Move checked groceries into your inventory with 1 tap.
            </Text>
          </View>
          <ActionButton
            title="Transfer to Pantry"
            onPress={handleTransfer}
            loading={isTransferring}
            icon={<PackageCheck size={16} color="#FFFFFF" />}
            size="sm"
            style={styles.transferBtn}
          />
        </View>
      ) : null}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Pending Items Section */}
        <Text style={styles.sectionHeader}>To Buy ({pending.length})</Text>

        {pending.length === 0 ? (
          <View style={styles.emptyCard}>
            <ShoppingBag size={28} color={THEME.colors.textMuted} />
            <Text style={styles.emptyTitle}>Your grocery list is empty</Text>
            <Text style={styles.emptySubtitle}>
              Items from recipes or manual additions appear here.
            </Text>
          </View>
        ) : (
          pending.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => togglePurchased(item.id)}
                style={styles.checkbox}
              />
              <View style={styles.itemInfoCol}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSubtext}>
                  {item.quantity} · {item.category}
                  {item.forRecipeTitle ? ` · For: ${item.forRecipeTitle}` : ''}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => deleteItem(item.id)}
                style={styles.deleteBtn}
              >
                <Trash2 size={16} color={THEME.colors.textMuted} />
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Purchased Items Section */}
        {purchased.length > 0 ? (
          <View style={styles.purchasedSection}>
            <Text style={styles.sectionHeader}>Purchased ({purchased.length})</Text>
            {purchased.map((item) => (
              <View key={item.id} style={[styles.itemRow, styles.purchasedRow]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => togglePurchased(item.id)}
                  style={[styles.checkbox, styles.checkboxChecked]}
                >
                  <Check size={13} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.itemInfoCol}>
                  <Text style={[styles.itemName, styles.purchasedText]}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemSubtext}>{item.quantity}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => deleteItem(item.id)}
                  style={styles.deleteBtn}
                >
                  <Trash2 size={16} color={THEME.colors.textMuted} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.canvas,
  },
  addBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
  },
  addInput: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.input,
    paddingHorizontal: 14,
    height: 46,
    color: THEME.colors.textPrimary,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    fontSize: THEME.typography.sizes.sm,
  },
  addBtn: {
    width: 46,
    height: 46,
    borderRadius: THEME.radii.button,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  transferBanner: {
    backgroundColor: THEME.colors.surface,
    marginHorizontal: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    padding: THEME.spacing.md,
    borderRadius: THEME.radii.card,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  transferTextCol: {
    marginBottom: 10,
  },
  transferTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  transferDesc: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  transferBtn: {
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: THEME.spacing.md,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: 12,
    borderRadius: THEME.radii.card,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  purchasedRow: {
    opacity: 0.65,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: THEME.colors.success,
    borderColor: THEME.colors.success,
  },
  itemInfoCol: {
    flex: 1,
  },
  itemName: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  purchasedText: {
    textDecorationLine: 'line-through',
    color: THEME.colors.textMuted,
  },
  itemSubtext: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 6,
  },
  emptyCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  purchasedSection: {
    marginTop: 12,
  },
});
