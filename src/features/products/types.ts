import { NAV_KEYS } from '@constants/nav-keys';

export type ProductsStackParamList = {
  [NAV_KEYS.PRODUCT_LIST]: undefined;
  [NAV_KEYS.PRODUCT_DETAIL]: { id: number };
  [NAV_KEYS.PRODUCT_FORM]: { id?: number };
};
