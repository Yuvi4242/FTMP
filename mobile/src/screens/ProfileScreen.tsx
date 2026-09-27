import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Sliders,
  Bell,
  ShieldCheck,
  FileText,
  LogOut,
  ChevronRight,
  UserCheck,
} from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { useAuthStore } from '../stores/useAuthStore';
import { AppHeader } from '../components/common/AppHeader';
import { ActionButton } from '../components/common/ActionButton';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useAuthStore();

  const handleSignOut = () => {
    logout();
    try {
      navigation?.getParent?.()?.navigate?.('Auth');
    } catch (e) {}
    try {
      navigation?.navigate?.('Auth');
    } catch (e) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.canvas} />
      <AppHeader title="Account Profile" subtitle="Settings & preferences" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)}
            </Text>
          </View>
          <View style={styles.userInfoCol}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.soloTag}>
              <UserCheck size={11} color={THEME.colors.primary} />
              <Text style={styles.soloTagText}>Solo Dweller Mode Active</Text>
            </View>
          </View>
        </View>

        {/* Settings Group */}
        <Text style={styles.sectionHeader}>Preferences & Setup</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Preferences')}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconBox}>
                <Sliders size={18} color={THEME.colors.primary} />
              </View>
              <View>
                <Text style={styles.menuTitle}>Dietary & Cooking Goals</Text>
                <Text style={styles.menuSubtitle}>
                  Skill level, restrictions & portions
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={THEME.colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Notifications')}
            style={[styles.menuItem, styles.menuItemBorder]}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconBox}>
                <Bell size={18} color={THEME.colors.warning} />
              </View>
              <View>
                <Text style={styles.menuTitle}>Expiry Notifications</Text>
                <Text style={styles.menuSubtitle}>
                  Same-day alerts & quiet hours
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={THEME.colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Legal & App Details */}
        <Text style={styles.sectionHeader}>Legal & Information</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                'Privacy Policy',
                'FridgeAI respects your privacy. Photos scanned for ingredient detection are processed securely and are never sold to advertisers or third parties.'
              )
            }
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconBox}>
                <ShieldCheck size={18} color={THEME.colors.success} />
              </View>
              <Text style={styles.menuTitle}>Privacy Policy</Text>
            </View>
            <ChevronRight size={18} color={THEME.colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                'Terms of Service',
                'By using FridgeAI, you acknowledge that automated expiration suggestions are estimates and standard safe food handling practices should always be followed.'
              )
            }
            style={[styles.menuItem, styles.menuItemBorder]}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconBox}>
                <FileText size={18} color={THEME.colors.textSecondary} />
              </View>
              <Text style={styles.menuTitle}>Terms & Conditions</Text>
            </View>
            <ChevronRight size={18} color={THEME.colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <ActionButton
          title="Sign Out"
          onPress={handleSignOut}
          variant="secondary"
          size="md"
          icon={<LogOut size={16} color={THEME.colors.danger} />}
          textStyle={{ color: THEME.colors.danger }}
          style={styles.signOutBtn}
        />
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.radii.card,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  avatarBox: {
    width: 56,
    height: 56,
    borderRadius: THEME.radii.button,
    backgroundColor: THEME.colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    marginRight: 14,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  userInfoCol: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  userEmail: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  soloTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  soloTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.primary,
    marginLeft: 4,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 10,
  },
  menuGroup: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  menuItemBorder: {
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderSubtle,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  menuTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  menuSubtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  signOutBtn: {
    marginTop: 10,
    width: '100%',
  },
});
