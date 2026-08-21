const en = {
  "app": {
    "title": "STOCKMACHINE",
    "theme": {
      "dark": "Dark Mode",
      "light": "Light Mode"
    }
  },
  "navigation": {
    "dashboard": "Dashboard",
    "products": "Products",
    "categories": "Categories",
    "racks": "Racks",
    "shelves": "Shelves",
    "suppliers": "Suppliers",
    "history": "History",
    "settings": "Settings"
  },
  "auth": {
    "login": "Log In",
    "register": "Register",
    "logout": "Log Out",
    "email": "Email",
    "password": "Password",
    "name": "Full Name",
    "orgName": "Organization Name",
    "orgNameHint": "Leave blank to sign up as an individual",
    "noAccount": "Don't have an account? Register",
    "hasAccount": "Already have an account? Log In",
    "invalidCredentials": "Invalid email or password",
    "sessionExpired": "Session expired. Please log in again.",
    "createAccount": "Create Account",
    "accountType": "Account Type",
    "individual": "Individual",
    "individualDesc": "Personal use — one inventory",
    "organization": "Organization",
    "orgDesc": "Multi-location inventory for teams",
    "forgotPassword": "Forgot password?",
    "continueOffline": "Continue Offline",
    "error": "Error"
  },
  "actions": {
    "create": "Create",
    "edit": "Edit",
    "delete": "Delete",
    "save": "Save",
    "cancel": "Cancel",
    "close": "Close",
    "confirm": "Confirm",
    "entry": "Stock Entry",
    "withdrawal": "Stock Withdrawal",
    "import": "Import",
    "export": "Export",
    "data": "Data",
    "discard": "Discard"
  },
  "modals": {
    "deleteConfirm": "Do you want to delete this record?",
    "import": {
      "title": "Import Data"
    }
  },
  "messages": {
    "success": {
      "created": "Record created successfully",
      "updated": "Record updated successfully",
      "deleted": "Record deleted successfully",
      "exported": "Exported successfully"
    },
    "error": {
      "create": "Error creating record",
      "update": "Error updating record",
      "delete": "Error deleting record",
      "network": "Network error. Please try again.",
      "export": "Error exporting",
      "noLocation": "No location",
      "permissionRequired": "Permission required",
      "cameraPermission": "Camera permission is needed to scan barcodes."
    },
    "info": {
      "pointCamera": "Point camera at barcode"
    },
    "confirm": {
      "discard": "Discard changes?"
    }
  },
  "common": {
    "search": "Search",
    "actions": "Actions",
    "loading": "Loading…",
    "noData": "No data found",
    "quantity": "Quantity",
    "notes": "Notes",
    "optional": "optional"
  },
  "dashboard": {
    "title": "Dashboard",
    "totalProducts": "Total Products",
    "totalStock": "Total Stock",
    "lowStock": "Low Stock",
    "movementsToday": "Movements Today",
    "movements": "Stock Movements (30 days)",
    "topProducts": "Top Products",
    "entries": "Entries",
    "withdrawals": "Withdrawals",
    "totalValue": "Total Value",
    "lowStockAlert": "Low Stock Alert",
    "totalEntries": "Total Entries",
    "totalWithdrawals": "Total Withdrawals",
    "categoryStock": "Category Stock",
    "noData": "No Data Available",
    "recentOperations": "Recent Operations"
  },
  "tables": {
    "products": {
      "title": "Products",
      "create": "Create Product",
      "edit": "Edit Product",
      "delete": "Delete Product",
      "columns": {
        "name": "Name",
        "barcode": "Barcode",
        "category_name": "Category",
        "shelve_name": "Shelve",
        "rack_name": "Rack",
        "quantity": "Quantity",
        "description": "Description",
        "supplier_name": "Supplier",
        "cost_price": "Cost Price",
        "selling_price": "Selling Price",
        "min_stock": "Min Stock"
      }
    },
    "categories": {
      "title": "Categories",
      "create": "Create Category",
      "edit": "Edit Category",
      "delete": "Delete Category",
      "columns": {
        "id": "ID",
        "name": "Name",
        "description": "Description"
      }
    },
    "shelves": {
      "title": "Shelves",
      "create": "Create Shelve",
      "edit": "Edit Shelve",
      "delete": "Delete Shelve",
      "columns": {
        "id": "ID",
        "name": "Name"
      }
    },
    "racks": {
      "title": "Racks",
      "create": "Create Rack",
      "edit": "Edit Rack",
      "delete": "Delete Rack",
      "columns": {
        "id": "ID",
        "name": "Name",
        "shelve_name": "Shelve"
      }
    },
    "suppliers": {
      "title": "Suppliers",
      "create": "Create Supplier",
      "edit": "Edit Supplier",
      "delete": "Delete Supplier",
      "columns": {
        "id": "ID",
        "name": "Name",
        "contact_name": "Contact Name",
        "email": "Email",
        "phone": "Phone"
      }
    },
    "history": {
      "title": "History",
      "columns": {
        "created_at": "Date",
        "user": "User",
        "entity": "Entity",
        "operation": "Operation",
        "qty_change": "Qty Change",
        "notes": "Notes",
        "entity_type": "Type",
        "quantity_before": "Before",
        "quantity_after": "After"
      }
    }
  },
  "forms": {
    "label": {
      "products": {
        "name": "Name",
        "barcode": "Barcode",
        "quantity": "Quantity",
        "description": "Description",
        "category_name": "Category",
        "shelve_name": "Shelve",
        "rack_name": "Rack",
        "status": "Status",
        "supplier_name": "Supplier",
        "cost_price": "Cost Price",
        "selling_price": "Selling Price",
        "min_stock": "Min Stock"
      },
      "categories": {
        "name": "Name",
        "description": "Description"
      },
      "shelves": {
        "name": "Name",
        "description": "Description"
      },
      "racks": {
        "name": "Name",
        "shelve_name": "Shelve",
        "description": "Description"
      },
      "suppliers": {
        "name": "Name",
        "contact_name": "Contact Name",
        "email": "Email",
        "phone": "Phone",
        "address": "Address"
      }
    },
    "placeholders": {
      "name": "Enter name",
      "barcode": "Scan or enter barcode",
      "description": "Enter description",
      "quantity": "Enter quantity",
      "category": "Select category",
      "shelve": "Select shelve",
      "rack": "Select rack",
      "status": "Select status",
      "notes": "Enter notes (optional)",
      "contact_name": "Enter contact name",
      "email": "Enter email",
      "phone": "Enter phone",
      "address": "Enter address"
    },
    "validation": {
      "required": "This field is required"
    }
  },
  "history": {
    "title": "Operation History",
    "operation": "Operation",
    "entity": "Entity",
    "quantityBefore": "Before",
    "quantityAfter": "After",
    "date": "Date",
    "filters": {
      "all": "All",
      "entry": "Entries",
      "withdrawal": "Withdrawals",
      "product": "Products",
      "category": "Categories",
      "rack": "Racks",
      "shelf": "Shelves"
    }
  },
  "settings": {
    "userProfile": "User Profile",
    "language": "Language",
    "appearance": "Appearance",
    "connection": "Connection",
    "account": "Account",
    "title": "Settings",
    "catalogSnapshot": "Catalog Snapshot",
    "snapshotDescription": "Backup your data",
    "snapshotWarning": "Warning",
    "exportSnapshot": "Export Snapshot",
    "importSnapshot": "Import Snapshot",
    "snapshotAdminOnly": "Admin only",
    "googleConnected": "Google Connected",
    "googleNotConnected": "Google Not Connected",
    "connectGoogleDrive": "Connect Google Drive",
    "syncThisDevice": "Sync this device",
    "restoreGoogleDrive": "Restore from Drive",
    "snapshotInvalid": "Invalid snapshot",
    "googleSynced": "Synced",
    "snapshotConfirm": "Confirm?",
    "googleRestored": "Restored",
    "snapshotExported": "Snapshot Exported",
    "snapshotTooLarge": "Snapshot too large",
    "snapshotImported": "Snapshot Imported",
    "colorSchemes": "Color Schemes"
  },
  "welcome": {
    "title": "Welcome to STOCKMACHINE",
    "subtitle": "Connect your account to sync inventory across devices, or continue working offline.",
    "loginBtn": "Log In",
    "registerBtn": "Register Online",
    "offlineBtn": "Continue Offline"
  },
  "sync": {
    "online": "Online",
    "offline": "Offline",
    "failed": "Sync Failed"
  }
} as const;

export type Translations = typeof en;
export default en;
