import { NAV_KEYS } from '@constants/nav-keys';

export type SuppliersStackParamList = {
  [NAV_KEYS.SUPPLIER_LIST]: undefined;
  [NAV_KEYS.SUPPLIER_FORM]: { id?: number };
};
