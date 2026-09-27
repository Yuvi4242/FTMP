import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { THEME } from '../../constants/theme';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryContainer;
      case 'danger':
        return styles.dangerContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'ghost':
        return styles.ghostContainer;
      case 'primary':
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'danger':
        return styles.dangerText;
      case 'outline':
        return styles.outlineText;
      case 'ghost':
        return styles.ghostText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return styles.sizeSmall;
      case 'lg':
        return styles.sizeLarge;
      case 'md':
      default:
        return styles.sizeMedium;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.baseContainer,
        getContainerStyle(),
        getSizeStyle(),
        disabled && styles.disabledContainer,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : THEME.colors.primary}
        />
      ) : (
        <>
          {icon ? <>{icon}</> : null}
          <Text
            style={[
              styles.baseText,
              size === 'sm' && styles.textSmall,
              size === 'lg' && styles.textLarge,
              getTextStyle(),
              icon ? styles.textWithIcon : undefined,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: THEME.radii.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeSmall: {
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  sizeMedium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sizeLarge: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  primaryContainer: {
    backgroundColor: THEME.colors.primary,
    borderWidth: 0,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(255, 107, 53, 0.25)',
      },
      default: {
        shadowColor: THEME.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  secondaryContainer: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  dangerContainer: {
    backgroundColor: THEME.colors.danger,
    borderWidth: 0,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  disabledContainer: {
    opacity: 0.45,
  },
  baseText: {
    fontSize: THEME.typography.sizes.sm + 1,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  textSmall: {
    fontSize: THEME.typography.sizes.xs + 1,
    fontWeight: '600',
  },
  textLarge: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: '700',
  },
  textWithIcon: {
    marginLeft: 7,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: THEME.colors.textPrimary,
  },
  dangerText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: THEME.colors.primary,
  },
  ghostText: {
    color: THEME.colors.textSecondary,
  },
});

