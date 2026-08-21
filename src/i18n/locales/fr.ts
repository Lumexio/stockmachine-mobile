import type { Translations } from './en';

const fr: Translations = {
  "app": {
    "title": "STOCKMACHINE",
    "theme": {
      "dark": "Mode sombre",
      "light": "Mode clair"
    }
  },
  "navigation": {
    "dashboard": "Tableau de bord",
    "products": "Produits",
    "categories": "Catégories",
    "racks": "Étagères",
    "shelves": "Rayons",
    "suppliers": "Suppliers",
    "history": "Historique",
    "settings": "Paramètres"
  },
  "auth": {
    "login": "Se connecter",
    "register": "S'inscrire",
    "logout": "Se déconnecter",
    "email": "E-mail",
    "password": "Mot de passe",
    "name": "Nom complet",
    "orgName": "Nom de l'organisation",
    "orgNameHint": "Laissez vide pour vous inscrire en tant qu'individu",
    "noAccount": "Pas de compte ? S'inscrire",
    "hasAccount": "Déjà un compte ? Se connecter",
    "invalidCredentials": "E-mail ou mot de passe incorrect",
    "sessionExpired": "Session expirée. Veuillez vous reconnecter.",
    "createAccount": "Créer un compte",
    "accountType": "Type de compte",
    "individual": "Individuel",
    "individualDesc": "Usage personnel — un inventaire",
    "organization": "Organisation",
    "orgDesc": "Inventaire multi-sites pour les équipes",
    "forgotPassword": "Mot de passe oublié ?",
    "continueOffline": "Continuer hors ligne",
    "error": "Erreur"
  },
  "actions": {
    "create": "Créer",
    "edit": "Modifier",
    "delete": "Supprimer",
    "save": "Enregistrer",
    "cancel": "Annuler",
    "close": "Fermer",
    "confirm": "Confirmer",
    "entry": "Entrée de stock",
    "withdrawal": "Sortie de stock",
    "import": "Importer",
    "export": "Exporter",
    "data": "Données",
    "discard": "Ignorer"
  },
  "modals": {
    "deleteConfirm": "Voulez-vous supprimer cet enregistrement ?",
    "import": {
      "title": "Importer Données"
    }
  },
  "messages": {
    "success": {
      "created": "Enregistrement créé avec succès",
      "updated": "Enregistrement mis à jour avec succès",
      "deleted": "Enregistrement supprimé avec succès",
      "exported": "Exporté avec succès"
    },
    "error": {
      "create": "Erreur lors de la création",
      "update": "Erreur lors de la mise à jour",
      "delete": "Erreur lors de la suppression",
      "network": "Erreur réseau. Veuillez réessayer.",
      "export": "Erreur lors de l'exportation",
      "noLocation": "Pas d'emplacement",
      "permissionRequired": "Permission requise",
      "cameraPermission": "La permission de la caméra est requise."
    },
    "confirm": {
      "discard": "Ignorer les modifications?"
    },
    "info": {
      "pointCamera": "Pointez la caméra vers le code-barres"
    }
  },
  "common": {
    "search": "Rechercher",
    "actions": "Actions",
    "loading": "Chargement…",
    "noData": "Aucune donnée trouvée",
    "quantity": "Quantité",
    "notes": "Notes",
    "optional": "optionnel"
  },
  "dashboard": {
    "title": "Tableau de bord",
    "totalProducts": "Total produits",
    "totalStock": "Stock total",
    "lowStock": "Stock faible",
    "movementsToday": "Mouvements aujourd'hui",
    "movements": "Mouvements de stock (30 jours)",
    "topProducts": "Produits principaux",
    "entries": "Entrées",
    "withdrawals": "Sorties",
    "totalValue": "Valeur Totale",
    "lowStockAlert": "Alerte de Stock Faible",
    "totalEntries": "Total Entrées",
    "totalWithdrawals": "Total Sorties",
    "categoryStock": "Stock par Catégorie",
    "noData": "Aucune Donnée",
    "recentOperations": "Opérations Récentes"
  },
  "tables": {
    "products": {
      "title": "Produits",
      "create": "Créer un produit",
      "edit": "Modifier le produit",
      "delete": "Supprimer le produit",
      "columns": {
        "name": "Nom",
        "category_name": "Catégorie",
        "shelve_name": "Rayon",
        "rack_name": "Étagère",
        "quantity": "Quantité",
        "description": "Description",
        "supplier_name": "Fournisseur",
        "cost_price": "Prix de Revient",
        "selling_price": "Prix de Vente",
        "min_stock": "Stock Min",
        "barcode": "Code-barres"
      }
    },
    "categories": {
      "title": "Catégories",
      "create": "Créer une catégorie",
      "edit": "Modifier la catégorie",
      "delete": "Supprimer la catégorie",
      "columns": {
        "id": "ID",
        "name": "Nom",
        "description": "Description"
      }
    },
    "shelves": {
      "title": "Rayons",
      "create": "Créer un rayon",
      "edit": "Modifier le rayon",
      "delete": "Supprimer le rayon",
      "columns": {
        "id": "ID",
        "name": "Nom"
      }
    },
    "racks": {
      "title": "Étagères",
      "create": "Créer une étagère",
      "edit": "Modifier l'étagère",
      "delete": "Supprimer l'étagère",
      "columns": {
        "id": "ID",
        "name": "Nom",
        "shelve_name": "Rayon"
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
      "title": "Historique",
      "columns": {
        "created_at": "Date",
        "user": "Utilisateur",
        "entity": "Entité",
        "operation": "Opération",
        "qty_change": "Changement Qté",
        "notes": "Notes",
        "entity_type": "Type",
        "quantity_before": "Avant",
        "quantity_after": "Après"
      }
    }
  },
  "forms": {
    "label": {
      "products": {
        "name": "Nom",
        "quantity": "Quantité",
        "description": "Description",
        "category_name": "Catégorie",
        "shelve_name": "Rayon",
        "rack_name": "Étagère",
        "status": "Statut",
        "supplier_name": "Fournisseur",
        "cost_price": "Prix de Revient",
        "selling_price": "Prix de Vente",
        "min_stock": "Stock Min",
        "barcode": "Code-barres"
      },
      "categories": {
        "name": "Nom",
        "description": "Description"
      },
      "shelves": {
        "name": "Nom",
        "description": "Description"
      },
      "racks": {
        "name": "Nom",
        "shelve_name": "Rayon",
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
      "name": "Entrez le nom",
      "description": "Entrez la description",
      "quantity": "Entrez la quantité",
      "category": "Sélectionner une catégorie",
      "shelve": "Sélectionner un rayon",
      "rack": "Sélectionner une étagère",
      "status": "Sélectionner un statut",
      "notes": "Entrez des notes (optionnel)",
      "contact_name": "Enter contact name",
      "email": "Enter email",
      "phone": "Enter phone",
      "address": "Enter address",
      "barcode": "Scanner ou entrer le code-barres"
    },
    "validation": {
      "required": "Ce champ est obligatoire"
    }
  },
  "history": {
    "title": "Historique des opérations",
    "operation": "Opération",
    "entity": "Entité",
    "quantityBefore": "Avant",
    "quantityAfter": "Après",
    "date": "Date",
    "filters": {
      "all": "Tous",
      "entry": "Entrées",
      "withdrawal": "Sorties",
      "product": "Produits",
      "category": "Catégories",
      "rack": "Étagères",
      "shelf": "Rayons"
    }
  },
  "settings": {
    "userProfile": "Profil utilisateur",
    "language": "Langue",
    "appearance": "Apparence",
    "connection": "Connexion",
    "account": "Compte",
    "title": "Paramètres",
    "catalogSnapshot": "Instantané du Catalogue",
    "snapshotDescription": "Sauvegardez vos données",
    "snapshotWarning": "Avertissement",
    "exportSnapshot": "Exporter",
    "importSnapshot": "Importer",
    "snapshotAdminOnly": "Admin uniquement",
    "googleConnected": "Google Connecté",
    "googleNotConnected": "Google Non Connecté",
    "connectGoogleDrive": "Connecter Google Drive",
    "syncThisDevice": "Synchroniser cet app.",
    "restoreGoogleDrive": "Restaurer depuis Drive",
    "snapshotInvalid": "Instantané invalide",
    "googleSynced": "Synchronisé",
    "snapshotConfirm": "Confirmer ?",
    "googleRestored": "Restauré",
    "snapshotExported": "Exporté",
    "snapshotTooLarge": "Trop volumineux",
    "snapshotImported": "Importé",
    "colorSchemes": "Schémas de Couleurs"
  },
  "welcome": {
    "title": "Bienvenue dans STOCKMACHINE",
    "subtitle": "Connectez votre compte pour synchroniser votre inventaire, ou continuez à travailler hors ligne.",
    "loginBtn": "Se connecter",
    "registerBtn": "S'inscrire en ligne",
    "offlineBtn": "Continuer hors ligne"
  },
  "sync": {
    "online": "En ligne",
    "offline": "Hors ligne",
    "failed": "Échec sync"
  }
};

export default fr;
