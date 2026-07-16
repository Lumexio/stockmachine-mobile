import { NAV_KEYS } from '@constants/nav-keys';

export type CategoriesStackParamList = {
  [NAV_KEYS.CATEGORY_LIST]: undefined;
  [NAV_KEYS.CATEGORY_FORM]: { id?: number };
};
