import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabNavigator } from './MainTabNavigator';
import { ScannerScreen } from '../screens/ScannerScreen';
import { ScanProcessingScreen } from '../screens/ScanProcessingScreen';
import { IngredientConfirmScreen } from '../screens/IngredientConfirmScreen';
import { RecipeDetailScreen } from '../screens/RecipeDetailScreen';
import { CookingModeScreen } from '../screens/CookingModeScreen';
import { IngredientDetailScreen } from '../screens/IngredientDetailScreen';
import { GroceryListScreen } from '../screens/GroceryListScreen';
import { MealHistoryScreen } from '../screens/MealHistoryScreen';
import { MealRecommendationsScreen } from '../screens/MealRecommendationsScreen';
import { PantryScreen } from '../screens/PantryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { PreferencesScreen } from '../screens/PreferencesScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { THEME } from '../constants/theme';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: THEME.colors.primary,
          background: THEME.colors.canvas,
          card: THEME.colors.surface,
          text: THEME.colors.textPrimary,
          border: THEME.colors.border,
          notification: THEME.colors.primary,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '800' },
        },
      }}
    >
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: THEME.colors.canvas },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="ScanProcessing"
          component={ScanProcessingScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="IngredientConfirm"
          component={IngredientConfirmScreen}
        />
        <Stack.Screen
          name="RecipeDetail"
          component={RecipeDetailScreen}
        />
        <Stack.Screen
          name="CookingMode"
          component={CookingModeScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="IngredientDetail"
          component={IngredientDetailScreen}
        />
        <Stack.Screen
          name="Grocery"
          component={GroceryListScreen}
        />
        <Stack.Screen
          name="History"
          component={MealHistoryScreen}
        />
        <Stack.Screen
          name="MealRecommendations"
          component={MealRecommendationsScreen}
        />
        <Stack.Screen
          name="Recipes"
          component={MealRecommendationsScreen}
        />
        <Stack.Screen
          name="Pantry"
          component={PantryScreen}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
        />
        <Stack.Screen
          name="Preferences"
          component={PreferencesScreen}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
        />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ animation: 'fade' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
