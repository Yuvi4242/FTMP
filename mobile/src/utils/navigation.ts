/**
 * Safe Navigation helper to prevent "GO_BACK was not handled by any navigator" error
 */
export const safeGoBack = (navigation: any, fallbackRoute: string = 'MainTabs'): void => {
  if (navigation && typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
    navigation.goBack();
  } else if (navigation && typeof navigation.navigate === 'function') {
    navigation.navigate(fallbackRoute);
  }
};
