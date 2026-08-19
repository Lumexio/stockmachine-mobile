import type { Translations } from './en';

const es: Translations = {
  "app": {
    "title": "STOCKMACHINE",
    "theme": {
      "dark": "Modo Oscuro",
      "light": "Modo Claro"
    }
  },
  "navigation": {
    "dashboard": "Panel",
    "products": "Productos",
    "categories": "Categorías",
    "racks": "Estantes",
    "shelves": "Repisas",
    "suppliers": "Suppliers",
    "history": "Historial",
    "settings": "Ajustes"
  },
  "auth": {
    "login": "Iniciar sesión",
    "register": "Registrarse",
    "logout": "Cerrar sesión",
    "email": "Correo electrónico",
    "password": "Contraseña",
    "name": "Nombre completo",
    "orgName": "Nombre de la organización",
    "orgNameHint": "Déjelo en blanco para registrarse como individuo",
    "noAccount": "¿No tienes cuenta? Regístrate",
    "hasAccount": "¿Ya tienes cuenta? Inicia sesión",
    "invalidCredentials": "Correo o contraseña incorrectos",
    "sessionExpired": "Sesión expirada. Inicia sesión de nuevo.",
    "createAccount": "Crear cuenta",
    "accountType": "Tipo de cuenta",
    "individual": "Individual",
    "individualDesc": "Uso personal — un inventario",
    "organization": "Organización",
    "orgDesc": "Inventario multi-ubicación para equipos",
    "forgotPassword": "¿Olvidaste tu contraseña?",
    "continueOffline": "Continuar sin conexión",
    "error": "Error"
  },
  "actions": {
    "create": "Crear",
    "edit": "Editar",
    "delete": "Eliminar",
    "save": "Guardar",
    "cancel": "Cancelar",
    "close": "Cerrar",
    "confirm": "Confirmar",
    "entry": "Entrada de stock",
    "withdrawal": "Salida de stock",
    "import": "Importar",
    "export": "Exportar",
    "data": "Datos",
    "discard": "Descartar"
  },
  "modals": {
    "deleteConfirm": "¿Quieres eliminar este registro?",
    "import": {
      "title": "Importar Datos"
    }
  },
  "messages": {
    "success": {
      "created": "Registro creado correctamente",
      "updated": "Registro actualizado correctamente",
      "deleted": "Registro eliminado correctamente",
      "exported": "Exportado con éxito"
    },
    "error": {
      "create": "Error al crear el registro",
      "update": "Error al actualizar el registro",
      "delete": "Error al eliminar el registro",
      "network": "Error de red. Por favor, inténtalo de nuevo.",
      "export": "Error al exportar",
      "noLocation": "Sin ubicación"
    },
    "confirm": {
      "discard": "¿Descartar cambios?"
    }
  },
  "common": {
    "search": "Buscar",
    "actions": "Acciones",
    "loading": "Cargando…",
    "noData": "No se encontraron datos",
    "quantity": "Cantidad",
    "notes": "Notas",
    "optional": "opcional"
  },
  "dashboard": {
    "title": "Panel",
    "totalProducts": "Total de productos",
    "totalStock": "Stock total",
    "lowStock": "Stock bajo",
    "movementsToday": "Movimientos hoy",
    "movements": "Movimientos de stock (30 días)",
    "topProducts": "Productos principales",
    "entries": "Entradas",
    "withdrawals": "Salidas",
    "totalValue": "Valor Total",
    "lowStockAlert": "Alerta de Bajo Stock",
    "totalEntries": "Total Entradas",
    "totalWithdrawals": "Total Salidas",
    "categoryStock": "Stock por Categoría",
    "noData": "Sin Datos",
    "recentOperations": "Operaciones Recientes"
  },
  "tables": {
    "products": {
      "title": "Productos",
      "create": "Crear producto",
      "edit": "Editar producto",
      "delete": "Eliminar producto",
      "columns": {
        "name": "Nombre",
        "category_name": "Categoría",
        "shelve_name": "Repisa",
        "rack_name": "Estante",
        "quantity": "Cantidad",
        "description": "Descripción",
        "supplier_name": "Proveedor",
        "cost_price": "Precio Costo",
        "selling_price": "Precio Venta",
        "min_stock": "Stock Min"
      }
    },
    "categories": {
      "title": "Categorías",
      "create": "Crear categoría",
      "edit": "Editar categoría",
      "delete": "Eliminar categoría",
      "columns": {
        "id": "ID",
        "name": "Nombre",
        "description": "Descripción"
      }
    },
    "shelves": {
      "title": "Repisas",
      "create": "Crear repisa",
      "edit": "Editar repisa",
      "delete": "Eliminar repisa",
      "columns": {
        "id": "ID",
        "name": "Nombre"
      }
    },
    "racks": {
      "title": "Estantes",
      "create": "Crear estante",
      "edit": "Editar estante",
      "delete": "Eliminar estante",
      "columns": {
        "id": "ID",
        "name": "Nombre",
        "shelve_name": "Repisa"
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
      "title": "Historial",
      "columns": {
        "created_at": "Fecha",
        "user": "Usuario",
        "entity": "Entidad",
        "operation": "Operación",
        "qty_change": "Cambio Cantidad",
        "notes": "Notas",
        "entity_type": "Tipo",
        "quantity_before": "Antes",
        "quantity_after": "Después"
      }
    }
  },
  "forms": {
    "label": {
      "products": {
        "name": "Nombre",
        "quantity": "Cantidad",
        "description": "Descripción",
        "category_name": "Categoría",
        "shelve_name": "Repisa",
        "rack_name": "Estante",
        "status": "Estado",
        "supplier_name": "Proveedor",
        "cost_price": "Precio Costo",
        "selling_price": "Precio Venta",
        "min_stock": "Stock Min"
      },
      "categories": {
        "name": "Nombre",
        "description": "Descripción"
      },
      "shelves": {
        "name": "Nombre",
        "description": "Descripción"
      },
      "racks": {
        "name": "Nombre",
        "shelve_name": "Repisa",
        "description": "Descripción"
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
      "name": "Ingresa el nombre",
      "description": "Ingresa la descripción",
      "quantity": "Ingresa la cantidad",
      "category": "Selecciona categoría",
      "shelve": "Selecciona repisa",
      "rack": "Selecciona estante",
      "status": "Selecciona estado",
      "notes": "Ingresa notas (opcional)",
      "contact_name": "Enter contact name",
      "email": "Enter email",
      "phone": "Enter phone",
      "address": "Enter address"
    },
    "validation": {
      "required": "Este campo es obligatorio"
    }
  },
  "history": {
    "title": "Historial de operaciones",
    "operation": "Operación",
    "entity": "Entidad",
    "quantityBefore": "Antes",
    "quantityAfter": "Después",
    "date": "Fecha",
    "filters": {
      "all": "Todos",
      "entry": "Entradas",
      "withdrawal": "Salidas",
      "product": "Productos",
      "category": "Categorías",
      "rack": "Estantes",
      "shelf": "Repisas"
    }
  },
  "settings": {
    "userProfile": "Perfil de usuario",
    "language": "Idioma",
    "appearance": "Apariencia",
    "connection": "Conexión",
    "account": "Cuenta",
    "title": "Ajustes",
    "catalogSnapshot": "Respaldo de Catálogo",
    "snapshotDescription": "Respalda tus datos",
    "snapshotWarning": "Advertencia",
    "exportSnapshot": "Exportar",
    "importSnapshot": "Importar",
    "snapshotAdminOnly": "Solo admin",
    "googleConnected": "Google Conectado",
    "googleNotConnected": "Google No Conectado",
    "connectGoogleDrive": "Conectar Google Drive",
    "syncThisDevice": "Sincronizar este disp.",
    "restoreGoogleDrive": "Restaurar de Drive",
    "snapshotInvalid": "Respaldo inválido",
    "googleSynced": "Sincronizado",
    "snapshotConfirm": "¿Confirmar?",
    "googleRestored": "Restaurado",
    "snapshotExported": "Exportado",
    "snapshotTooLarge": "Respaldo muy grande",
    "snapshotImported": "Importado",
    "colorSchemes": "Esquemas de Color"
  },
  "welcome": {
    "title": "Bienvenido a STOCKMACHINE",
    "subtitle": "Conecta tu cuenta para sincronizar el inventario entre dispositivos, o continúa trabajando sin conexión.",
    "loginBtn": "Iniciar sesión",
    "registerBtn": "Registrarse en línea",
    "offlineBtn": "Continuar sin conexión"
  },
  "sync": {
    "online": "En línea",
    "offline": "Desconectado",
    "failed": "Fallo sinc"
  }
};

export default es;
