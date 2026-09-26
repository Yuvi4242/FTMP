import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Home,
  Refrigerator,
  Camera,
  Utensils,
  User,
  ShoppingBag,
} from 'lucide-react-native';
import { THEME } from '../constants/theme';
import { HomeScreen } from '../screens/HomeScreen';
import { PantryScreen } from '../screens/PantryScreen';
import { MealRecommendationsScreen } from '../screens/MealRecommendationsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { GroceryListScreen } from '../screens/GroceryListScreen';

const Tab = createBottomTabNavigator();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: THEME.colors.primary,
        tabBarInactiveTintColor: THEME.colors.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={20} color={color} />,
        }}
      />

      <Tab.Screen
        name="Pantry"
        component={PantryScreen}
        options={{
          tabBarLabel: 'Pantry',
          tabBarIcon: ({ color, size }) => <Refrigerator size={20} color={color} />,
        }}
      />

      {/* Center Scan Shutter Action */}
      <Tab.Screen
        name="ScanTab"
        component={HomeScreen}
        options={({ navigation }) => ({
          tabBarLabel: 'Scan',
          tabBarButton: () => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Scanner')}
              style={styles.centerScanBtn}
            >
              <View style={styles.centerScanInner}>
                <Camera size={22} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ),
        })}
      />

      <Tab.Screen
        name="Recipes"
        component={MealRecommendationsScreen}
        options={{
          tabBarLabel: 'Recipes',
          tabBarIcon: ({ color, size }) => <Utensils size={20} color={color} />,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={20} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: THEME.colors.surface,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  centerScanBtn: {
    top: -16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerScanInner: {
    width: 52,
    height: 52,
    borderRadius: 14, // 14px rounded rectangle (never pill)
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2,
    borderColor: THEME.colors.canvas,
  },
});
