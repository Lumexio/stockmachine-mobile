import { NAV_KEYS } from '@constants/nav-keys';

export type ShelvesStackParamList = {
  [NAV_KEYS.SHELF_LIST]: undefined;
  [NAV_KEYS.SHELF_FORM]: { id?: number };
};
