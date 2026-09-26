import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { THEME } from '../../constants/theme';
import { ExpiryStatus } from '../../types';

interface StatusBadgeProps {
  status?: ExpiryStatus;
  label?: string;
  daysUntilExpiry?: number;
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = 'fresh',
  label,
  daysUntilExpiry,
  style,
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'critical':
        return {
          bg: THEME.colors.expiry.criticalBg,
          text: THEME.colors.expiry.critical,
          border: THEME.colors.expiry.criticalBorder,
          defaultLabel:
            daysUntilExpiry === 0
              ? 'Expires Today'
              : daysUntilExpiry === 1
              ? 'Expires Tomorrow'
              : 'Critical',
        };
      case 'soon':
        return {
          bg: THEME.colors.expiry.soonBg,
          text: THEME.colors.expiry.soon,
          border: THEME.colors.expiry.soonBorder,
          defaultLabel:
            daysUntilExpiry !== undefined
              ? `${daysUntilExpiry} days left`
              : 'Use Soon',
        };
      case 'fresh':
      default:
        return {
          bg: THEME.colors.expiry.freshBg,
          text: THEME.colors.expiry.fresh,
          border: THEME.colors.expiry.freshBorder,
          defaultLabel:
            daysUntilExpiry !== undefined
              ? `${daysUntilExpiry} days left`
              : 'Fresh',
        };
    }
  };

  const config = getBadgeConfig();
  const displayLabel = label || config.defaultLabel;

  return (
    <View
      style={[
        styles.badgeContainer,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
        },
        style,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: config.text }]} />
      <Text style={[styles.badgeText, { color: config.text }]}>
        {displayLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radii.badge,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
