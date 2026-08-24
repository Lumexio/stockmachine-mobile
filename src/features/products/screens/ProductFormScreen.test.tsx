import React from 'react';
import { render } from '@testing-library/react-native';
import { ProductFormScreen } from './ProductFormScreen';
import { NavigationContainer } from '@react-navigation/native';

// Mock dependencies
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback: string) => fallback || key,
  }),
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

jest.mock('../store/products-store', () => ({
  useProductsStore: () => ({
    selectedProduct: null,
    create: jest.fn(),
    update: jest.fn(),
    fetchById: jest.fn(),
  }),
}));

jest.mock('@store/theme-store', () => ({
  useThemeStore: () => ({
    colors: {
      background: '#fff',
      surface: '#fff',
      text: '#000',
      textSecondary: '#666',
      border: '#ccc',
      primary: '#000',
    },
  }),
}));

jest.mock('expo-camera', () => ({
  CameraView: 'CameraView',
  useCameraPermissions: () => [{ granted: true }, jest.fn()],
}));

describe('ProductFormScreen', () => {
  it('renders the barcode input field', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <ProductFormScreen />
      </NavigationContainer>
    );
    
    const barcodeInput = getByTestId('barcode-input');
    expect(barcodeInput).toBeTruthy();
  });
});
