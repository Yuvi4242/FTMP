import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Moon, Clock, AlertTriangle } from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { useAuthStore } from '../stores/useAuthStore';
import { AppHeader } from '../components/common/AppHeader';
import { ActionButton } from '../components/common/ActionButton';

export const NotificationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, updateNotifications } = useAuthStore();

  const [sameDay, setSameDay] = useState(user.notifications.sameDayExpiry);
  const [twoDay, setTwoDay] = useState(user.notifications.twoDayWarning);
  const [recipeRescue, setRecipeRescue] = useState(user.notifications.recipeRescue);
  const [dinnerPrompt, setDinnerPrompt] = useState(user.notifications.dinnerPrompt);
  const [pushEnabled, setPushEnabled] = useState(user.notifications.pushEnabled);

  const handleSave = async () => {
    await updateNotifications({
      sameDayExpiry: sameDay,
      twoDayWarning: twoDay,
      recipeRescue: recipeRescue,
      dinnerPrompt: dinnerPrompt,
      pushEnabled: pushEnabled,
    });
    Alert.alert('Saved', 'Your notification alert settings have been updated.');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.canvas} />
      <AppHeader
        title="Expiry & Cooking Alerts"
        subtitle="Stay ahead of food waste without spam"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Master Push Toggle */}
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={styles.iconBox}>
              <Bell size={20} color={THEME.colors.primary} />
            </View>
            <View style={styles.toggleTextCol}>
              <Text style={styles.cardTitle}>Push Notifications</Text>
              <Text style={styles.cardSubtitle}>
                Receive alerts on this device
              </Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: THEME.colors.surfaceElevated, true: THEME.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Expiry Alert Triggers */}
        <Text style={styles.sectionHeader}>Expiry Alert Triggers</Text>
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={styles.itemTitle}>Same-Day Expiry Alert</Text>
              <Text style={styles.itemSubtitle}>
                Notifies you at 8:00 AM if anything expires today
              </Text>
            </View>
            <Switch
              value={sameDay}
              onValueChange={setSameDay}
              trackColor={{ false: THEME.colors.surfaceElevated, true: THEME.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.toggleRow, styles.rowBorder]}>
            <View style={styles.toggleTextCol}>
              <Text style={styles.itemTitle}>2-Day Warning</Text>
              <Text style={styles.itemSubtitle}>
                Advance notice for produce & dairy nearing end of shelf-life
              </Text>
            </View>
            <Switch
              value={twoDay}
              onValueChange={setTwoDay}
              trackColor={{ false: THEME.colors.surfaceElevated, true: THEME.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.toggleRow, styles.rowBorder]}>
            <View style={styles.toggleTextCol}>
              <Text style={styles.itemTitle}>Recipe Rescue Push</Text>
              <Text style={styles.itemSubtitle}>
                Suggests a 15-minute dinner recipe matching your expiring items
              </Text>
            </View>
            <Switch
              value={recipeRescue}
              onValueChange={setRecipeRescue}
              trackColor={{ false: THEME.colors.surfaceElevated, true: THEME.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.toggleRow, styles.rowBorder]}>
            <View style={styles.toggleTextCol}>
              <Text style={styles.itemTitle}>Dinner Prompt</Text>
              <Text style={styles.itemSubtitle}>
                Gentle nudge at 6:00 PM: "Ready to cook dinner?"
              </Text>
            </View>
            <Switch
              value={dinnerPrompt}
              onValueChange={setDinnerPrompt}
              trackColor={{ false: THEME.colors.surfaceElevated, true: THEME.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Quiet Hours */}
        <Text style={styles.sectionHeader}>Quiet Hours</Text>
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={styles.iconBox}>
              <Moon size={20} color={THEME.colors.warning} />
            </View>
            <View style={styles.toggleTextCol}>
              <Text style={styles.cardTitle}>Do Not Disturb Window</Text>
              <Text style={styles.cardSubtitle}>
                Silenced from 10:00 PM to 7:00 AM
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomBar}>
        <ActionButton
          title="Save Notification Settings"
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderSubtle,
    paddingTop: 12,
    marginTop: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: THEME.colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  toggleTextCol: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  itemSubtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 6,
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
