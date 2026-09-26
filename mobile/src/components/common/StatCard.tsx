import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { THEME } from '../../constants/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  accentColor = THEME.colors.primary,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <Text style={styles.labelText}>{label}</Text>
        {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
      </View>
      <Text style={[styles.valueText, { color: accentColor }]}>{value}</Text>
      {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  labelText: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconContainer: {
    padding: 2,
  },
  valueText: {
    fontSize: THEME.typography.sizes.xxl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtext: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textMuted,
    marginTop: 4,
  },
});
