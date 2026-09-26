import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {
  X,
  Zap,
  ZapOff,
  Image as ImageIcon,
  Camera,
  ScanLine,
  Layers,
} from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { ActionButton } from '../components/common/ActionButton';

const { width, height } = Dimensions.get('window');

export const ScannerScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState(false);
  const cameraRef = useRef<any>(null);

  const handleCapture = async () => {
    // Navigate to processing screen with simulated or live photo
    navigation.navigate('ScanProcessing', {
      source: 'camera',
    });
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        navigation.navigate('ScanProcessing', {
          imageUri: result.assets[0].uri,
          source: 'gallery',
        });
      }
    } catch (err) {
      // Fallback directly to scan processing
      navigation.navigate('ScanProcessing', { source: 'sample' });
    }
  };

  if (!permission) {
    return <View style={styles.darkBg} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <StatusBar barStyle="light-content" backgroundColor={THEME.colors.canvas} />
        <View style={styles.permissionCard}>
          <Camera size={40} color={THEME.colors.primary} style={styles.permissionIcon} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionDesc}>
            FreshTrack needs camera permissions to identify food items, shelf-life dates,
            and quantities in your pantry.
          </Text>
          <ActionButton
            title="Grant Camera Access"
            onPress={requestPermission}
            size="md"
            style={styles.permissionBtn}
          />
          <ActionButton
            title="Choose from Photo Library"
            onPress={handlePickImage}
            variant="secondary"
            size="md"
            style={styles.permissionBtnSecondary}
          />
          <ActionButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="ghost"
            size="sm"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.cameraWrapper}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          enableTorch={flash}
        />

        {/* Top Control Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={styles.circleButton}
          >
            <X size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.modeBadge}>
            <Layers size={13} color={THEME.colors.primary} />
            <Text style={styles.modeText}>Fridge Vision HUD</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setFlash(!flash)}
            style={styles.circleButton}
          >
            {flash ? <Zap size={20} color={THEME.colors.warning} /> : <ZapOff size={20} color="#FFFFFF" />}
          </TouchableOpacity>
        </View>

        {/* Viewfinder Target Guidelines */}
        <View style={styles.viewfinderCenter}>
          <View style={styles.targetFrame}>
            <View style={[styles.cornerBracket, styles.topLeft]} />
            <View style={[styles.cornerBracket, styles.topRight]} />
            <View style={[styles.cornerBracket, styles.bottomLeft]} />
            <View style={[styles.cornerBracket, styles.bottomRight]} />

            <View style={styles.detectionHintBadge}>
              <ScanLine size={13} color={THEME.colors.primary} />
              <Text style={styles.detectionHintText}>
                Center shelf or crisper drawer
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Shutter & Gallery Controls */}
        <View style={styles.bottomControls}>
          <View style={styles.bottomBarRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePickImage}
              style={styles.galleryButton}
            >
              <ImageIcon size={22} color="#FFFFFF" />
              <Text style={styles.controlLabel}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCapture}
              style={styles.shutterOuter}
            >
              <View style={styles.shutterInner} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('ScanProcessing', { source: 'sample' })}
              style={styles.galleryButton}
            >
              <ScanLine size={22} color={THEME.colors.primary} />
              <Text style={styles.controlLabel}>Sample Scan</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.bottomHelpText}>
            Detects proteins, dairy, vegetables & suggests zero-waste single meals
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  darkBg: {
    flex: 1,
    backgroundColor: THEME.colors.canvas,
  },
  cameraWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.md,
    zIndex: 10,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(31, 41, 55, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radii.badge,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  modeText: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
    letterSpacing: 0.3,
  },
  viewfinderCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  targetFrame: {
    width: width * 0.82,
    height: height * 0.42,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cornerBracket: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: THEME.colors.primary,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  detectionHintBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radii.badge,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  detectionHintText: {
    fontSize: THEME.typography.sizes.xs,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
  },
  bottomControls: {
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    paddingTop: 16,
    paddingBottom: 28,
    paddingHorizontal: THEME.spacing.lg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  bottomBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 12,
  },
  galleryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  controlLabel: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  shutterOuter: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 4,
    borderColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  bottomHelpText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: THEME.colors.canvas,
    justifyContent: 'center',
    padding: THEME.spacing.lg,
  },
  permissionCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.card,
    padding: THEME.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  permissionIcon: {
    marginBottom: 16,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionDesc: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  permissionBtn: {
    width: '100%',
    marginBottom: 10,
  },
  permissionBtnSecondary: {
    width: '100%',
    marginBottom: 6,
  },
});
