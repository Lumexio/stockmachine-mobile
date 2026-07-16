import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import '../i18n';

/**
 * Wrap components with all providers needed for testing.
 * Add more providers here as the app grows (e.g., ThemeProvider).
 */
function AllProviders({ children }: { children: React.ReactNode }) {
  return <NavigationContainer>{children}</NavigationContainer>;
}

function customRender(ui: React.ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export * from '@testing-library/react-native';
export { customRender as render };
