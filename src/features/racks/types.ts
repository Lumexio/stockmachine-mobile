import { NAV_KEYS } from '@constants/nav-keys';

export type RacksStackParamList = {
  [NAV_KEYS.RACK_LIST]: undefined;
  [NAV_KEYS.RACK_FORM]: { id?: number };
};
