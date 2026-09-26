import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Plus,
  Filter,
  Layers,
  Calendar,
  X,
  Camera,
  ArrowUpDown,
} from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { useInventoryStore } from '../stores/useInventoryStore';
import { AppHeader } from '../components/common/AppHeader';
import { ActionButton } from '../components/common/ActionButton';
import { StatusBadge } from '../components/common/StatusBadge';
import { IInventoryItem } from '../types';

export const PantryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    items,
    selectedLocation,
    setSelectedLocation,
    searchQuery,
    setSearchQuery,
    addItem,
  } = useInventoryStore();

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('1');
  const [newItemUnit, setNewItemUnit] = useState('pcs');
  const [newItemCategory, setNewItemCategory] = useState<'Produce' | 'Dairy & Eggs' | 'Meat & Poultry' | 'Pantry Staples'>('Produce');
  const [newItemLocation, setNewItemLocation] = useState<'Main Shelf' | 'Crisper Drawer' | 'Freezer Door' | 'Pantry'>('Main Shelf');
  const [newItemDays, setNewItemDays] = useState('7');

  const locations = ['All', 'Fridge', 'Freezer', 'Pantry'];

  const filteredItems = items.filter((item) => {
    // Location filter
    if (selectedLocation === 'Fridge') {
      if (item.storageLocation !== 'Main Shelf' && item.storageLocation !== 'Crisper Drawer' && item.storageLocation !== 'Fridge Door') {
        return false;
      }
    } else if (selectedLocation === 'Freezer') {
      if (item.storageLocation !== 'Freezer Door') return false;
    } else if (selectedLocation === 'Pantry') {
      if (item.storageLocation !== 'Pantry') return false;
    }

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    }

    return true;
  });

  const handleCreateItem = async () => {
    if (!newItemName.trim()) return;
    const days = parseInt(newItemDays) || 7;
    const expiry = new Date(Date.now() + days * 24 * 3600 * 1000).toISOString();
    const status = days <= 0 ? 'critical' : days <= 3 ? 'soon' : 'fresh';

    await addItem({
      name: newItemName.trim(),
      quantity: parseFloat(newItemQty) || 1,
      unit: newItemUnit,
      category: newItemCategory,
      storageLocation: newItemLocation,
      expiryDate: expiry,
      expiryStatus: status,
      daysUntilExpiry: days,
    });

    setNewItemName('');
    setNewItemQty('1');
    setAddModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.canvas} />
      <AppHeader
        title="My Pantry & Fridge"
        subtitle={`${items.length} items logged`}
        rightAction={
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setAddModalVisible(true)}
            style={styles.headerAddBtn}
          >
            <Plus size={18} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputRow}>
          <Search size={18} color={THEME.colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search groceries, proteins, produce..."
            placeholderTextColor={THEME.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color={THEME.colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Storage Location Filter Pills */}
      <View style={styles.filterPillsRow}>
        {locations.map((loc) => {
          const isActive = selectedLocation === loc;
          return (
            <TouchableOpacity
              key={loc}
              activeOpacity={0.7}
              onPress={() => setSelectedLocation(loc)}
              style={[styles.filterPill, isActive && styles.filterPillActive]}
            >
              <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                {loc}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Inventory List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Layers size={36} color={THEME.colors.textMuted} />
            <Text style={styles.emptyTitle}>No ingredients found</Text>
            <Text style={styles.emptyDesc}>
              Try scanning your fridge or change the filter tab.
            </Text>
            <ActionButton
              title="Scan Fridge Now"
              onPress={() => navigation.navigate('Scanner')}
              size="sm"
              style={styles.emptyScanBtn}
            />
          </View>
        ) : (
          filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('IngredientDetail', { item })}
              style={styles.itemCard}
            >
              <View style={styles.itemTopRow}>
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.itemThumbnail}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.itemThumbPlaceholder}>
                    <Layers size={18} color={THEME.colors.primary} />
                  </View>
                )}
                <View style={styles.itemTitleCol}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemMeta}>
                    {item.quantity} {item.unit} · {item.category}
                  </Text>
                </View>
                <StatusBadge
                  status={item.expiryStatus}
                  daysUntilExpiry={item.daysUntilExpiry}
                />
              </View>

              <View style={styles.itemBottomRow}>
                <View style={styles.locationTag}>
                  <Layers size={11} color={THEME.colors.textSecondary} />
                  <Text style={styles.locationTagText}>{item.storageLocation}</Text>
                </View>
                {item.addedViaScan ? (
                  <View style={styles.scanTag}>
                    <Camera size={10} color={THEME.colors.primary} />
                    <Text style={styles.scanTagText}>Scanned</Text>
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Manual Add Item Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Food Item</Text>
              <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                <X size={20} color={THEME.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Item Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Greek Yogurt, Salmon, Broccoli"
                placeholderTextColor={THEME.colors.textMuted}
                value={newItemName}
                onChangeText={setNewItemName}
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  value={newItemQty}
                  onChangeText={setNewItemQty}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Unit</Text>
                <TextInput
                  style={styles.input}
                  value={newItemUnit}
                  onChangeText={setNewItemUnit}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Shelf Life (Days remaining)</Text>
              <TextInput
                style={styles.input}
                value={newItemDays}
                onChangeText={setNewItemDays}
                keyboardType="numeric"
              />
            </View>

            <ActionButton
              title="Save to Inventory"
              onPress={handleCreateItem}
              size="lg"
              style={styles.modalSaveBtn}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.canvas,
  },
  headerAddBtn: {
    width: 36,
    height: 36,
    borderRadius: THEME.radii.button,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textPrimary,
    marginLeft: 8,
  },
  filterPillsRow: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  filterPillText: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: THEME.spacing.md,
    paddingBottom: 40,
  },
  itemCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 10,
    marginRight: 12,
  },
  itemThumbPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: THEME.colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemTitleCol: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  itemMeta: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  itemBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderSubtle,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  locationTagText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginLeft: 4,
  },
  scanTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primaryMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scanTagText: {
    fontSize: 10,
    color: THEME.colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginTop: 12,
  },
  emptyDesc: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  emptyScanBtn: {
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: THEME.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderRadius: THEME.radii.input,
    paddingHorizontal: 12,
    height: 46,
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textPrimary,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  modalSaveBtn: {
    marginTop: 8,
  },
});
