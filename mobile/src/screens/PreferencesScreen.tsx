import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, User, Sliders } from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { useAuthStore } from '../stores/useAuthStore';
import { AppHeader } from '../components/common/AppHeader';
import { ActionButton } from '../components/common/ActionButton';
import { safeGoBack } from '../utils/navigation';

export const PreferencesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, updatePreferences } = useAuthStore();

  const [soloDweller, setSoloDweller] = useState(user.preferences.soloDwellerMode);
  const [dietary, setDietary] = useState<string[]>(user.preferences.dietaryRestrictions || []);
  const [skill, setSkill] = useState(user.preferences.cookingSkill || 'Intermediate');
  const [maxTime, setMaxTime] = useState(user.preferences.maxCookTimeMinutes || 30);
  const [spice, setSpice] = useState(user.preferences.spiceTolerance || 'Medium');

  const dietaryOptions = [
    'High Protein',
    'Low Carb',
    'Vegetarian',
    'Vegan',
    'Dairy-Free',
    'Gluten-Free',
  ];

  const skillOptions: ('Beginner' | 'Intermediate' | 'Advanced')[] = [
    'Beginner',
    'Intermediate',
    'Advanced',
  ];

  const timeOptions = [15, 20, 30, 45];
  const spiceOptions: ('None' | 'Mild' | 'Medium' | 'Spicy')[] = [
    'None',
    'Mild',
    'Medium',
    'Spicy',
  ];

  const toggleDietary = (item: string) => {
    if (dietary.includes(item)) {
      setDietary(dietary.filter((d) => d !== item));
    } else {
      setDietary([...dietary, item]);
    }
  };

  const handleSave = async () => {
    await updatePreferences({
      soloDwellerMode: soloDweller,
      dietaryRestrictions: dietary,
      cookingSkill: skill,
      maxCookTimeMinutes: maxTime,
      spiceTolerance: spice,
      defaultServings: 1,
    });
    Alert.alert('Saved', 'Your meal preferences have been updated.');
    safeGoBack(navigation);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.canvas} />
      <AppHeader
        title="Dietary Preferences"
        subtitle="Customizes AI recipe portions & recommendations"
        onBack={() => safeGoBack(navigation)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Solo Dweller Mode Toggle */}
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <View style={styles.badgeRow}>
                <User size={12} color={THEME.colors.primary} />
                <Text style={styles.badgeText}>CORE BEHAVIOR</Text>
              </View>
              <Text style={styles.cardTitle}>Solo-Dweller Optimization</Text>
              <Text style={styles.cardSubtitle}>
                Calibrates recipe portions to strictly 1-serving measurements to eliminate leftovers.
              </Text>
            </View>
            <Switch
              value={soloDweller}
              onValueChange={setSoloDweller}
              trackColor={{ false: THEME.colors.surfaceElevated, true: THEME.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Dietary Restrictions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dietary Goals & Restrictions</Text>
          <Text style={styles.cardSubtitle}>Select all that apply:</Text>
          <View style={styles.chipsRow}>
            {dietaryOptions.map((item) => {
              const isSelected = dietary.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  activeOpacity={0.7}
                  onPress={() => toggleDietary(item)}
                  style={[styles.chip, isSelected && styles.chipActive]}
                >
                  {isSelected ? <Check size={12} color="#FFFFFF" style={{ marginRight: 4 }} /> : null}
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Cooking Skill */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cooking Experience Level</Text>
          <View style={styles.segmentRow}>
            {skillOptions.map((opt) => {
              const isSelected = skill === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  activeOpacity={0.7}
                  onPress={() => setSkill(opt)}
                  style={[styles.segmentBtn, isSelected && styles.segmentBtnActive]}
                >
                  <Text style={[styles.segmentText, isSelected && styles.segmentTextActive]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Max Cook Time */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Max Weeknight Cook Time</Text>
          <View style={styles.segmentRow}>
            {timeOptions.map((t) => {
              const isSelected = maxTime === t;
              return (
                <TouchableOpacity
                  key={t}
                  activeOpacity={0.7}
                  onPress={() => setMaxTime(t)}
                  style={[styles.segmentBtn, isSelected && styles.segmentBtnActive]}
                >
                  <Text style={[styles.segmentText, isSelected && styles.segmentTextActive]}>
                    {t} min
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Spice Tolerance */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spice Tolerance</Text>
          <View style={styles.segmentRow}>
            {spiceOptions.map((s) => {
              const isSelected = spice === s;
              return (
                <TouchableOpacity
                  key={s}
                  activeOpacity={0.7}
                  onPress={() => setSpice(s)}
                  style={[styles.segmentBtn, isSelected && styles.segmentBtnActive]}
                >
                  <Text style={[styles.segmentText, isSelected && styles.segmentTextActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Save Action */}
      <View style={styles.bottomBar}>
        <ActionButton
          title="Save Preferences"
          onPress={handleSave}
          size="lg"
          style={styles.saveBtn}
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
    paddingHorizontal: THEME.spacing.md,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchTextCol: {
    flex: 1,
    marginRight: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.primary,
    marginLeft: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  chipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  chipText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surfaceElevated,
    borderRadius: 10,
    padding: 3,
    marginTop: 12,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: THEME.colors.primary,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  segmentTextActive: {
    color: '#FFFFFF',
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
  saveBtn: {
    width: '100%',
  },
});
