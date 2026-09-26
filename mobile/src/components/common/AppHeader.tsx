import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { THEME } from '../../constants/theme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
  style,
}) => {
  return (
    <View style={[styles.headerContainer, style]}>
      <View style={styles.leftRow}>
        {onBack ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBack}
            style={styles.backButton}
          >
            <ChevronLeft size={24} color={THEME.colors.textPrimary} />
          </TouchableOpacity>
        ) : null}
        <View style={styles.titleColumn}>
          <Text style={styles.titleText}>{title}</Text>
          {subtitle ? <Text style={styles.subtitleText}>{subtitle}</Text> : null}
        </View>
      </View>
      {rightAction ? <View style={styles.rightActionContainer}>{rightAction}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.sm,
    backgroundColor: THEME.colors.canvas,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: THEME.radii.button,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  titleColumn: {
    flex: 1,
  },
  titleText: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  subtitleText: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  rightActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
