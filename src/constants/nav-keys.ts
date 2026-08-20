export const NAV_KEYS = {
  // Auth stack
  AUTH_STACK: 'AuthStack',
  WELCOME: 'Welcome',
  LOGIN: 'Login',
  REGISTER: 'Register',

  // Main tabs
  MAIN_TABS: 'MainTabs',
  DASHBOARD: 'Dashboard',
  PRODUCTS_STACK: 'ProductsStack',
  CATEGORIES_STACK: 'CategoriesStack',
  SHELVES_STACK: 'ShelvesStack',
  RACKS_STACK: 'RacksStack',
  SUPPLIERS_STACK: 'SuppliersStack',
  HISTORY: 'History',
  SETTINGS: 'Settings',
  PROFILE: 'Profile',
  MENU_STACK: 'MenuStack',
  MENU: 'Menu',

  // Products screens
  PRODUCT_LIST: 'ProductList',
  PRODUCT_DETAIL: 'ProductDetail',
  PRODUCT_FORM: 'ProductForm',

  // Categories screens
  CATEGORY_LIST: 'CategoryList',
  CATEGORY_FORM: 'CategoryForm',

  // Shelves screens
  SHELF_LIST: 'ShelfList',
  SHELF_FORM: 'ShelfForm',

  // Racks screens
  RACK_LIST: 'RackList',
  RACK_FORM: 'RackForm',

  // Suppliers screens
  SUPPLIER_LIST: 'SupplierList',
  SUPPLIER_FORM: 'SupplierForm',
} as const;

export type NavKey = (typeof NAV_KEYS)[keyof typeof NAV_KEYS];
