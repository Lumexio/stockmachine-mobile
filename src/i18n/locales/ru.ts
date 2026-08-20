import type { Translations } from './en';

const ru: Translations = {
  "app": {
    "title": "STOCKMACHINE",
    "theme": {
      "dark": "Тёмная тема",
      "light": "Светлая тема"
    }
  },
  "navigation": {
    "dashboard": "Панель",
    "products": "Товары",
    "categories": "Категории",
    "racks": "Стеллажи",
    "shelves": "Полки",
    "suppliers": "Suppliers",
    "history": "История",
    "settings": "Настройки"
  },
  "auth": {
    "login": "Войти",
    "register": "Зарегистрироваться",
    "logout": "Выйти",
    "email": "Электронная почта",
    "password": "Пароль",
    "name": "Полное имя",
    "orgName": "Название организации",
    "orgNameHint": "Оставьте пустым для регистрации как физическое лицо",
    "noAccount": "Нет аккаунта? Зарегистрироваться",
    "hasAccount": "Уже есть аккаунт? Войти",
    "invalidCredentials": "Неверный email или пароль",
    "sessionExpired": "Сессия истекла. Пожалуйста, войдите снова.",
    "createAccount": "Создать аккаунт",
    "accountType": "Тип аккаунта",
    "individual": "Физическое лицо",
    "individualDesc": "Личное использование — один склад",
    "organization": "Организация",
    "orgDesc": "Многоуровневый склад для команд",
    "forgotPassword": "Забыли пароль?",
    "continueOffline": "Продолжить оффлайн",
    "error": "Ошибка"
  },
  "actions": {
    "create": "Создать",
    "edit": "Редактировать",
    "delete": "Удалить",
    "save": "Сохранить",
    "cancel": "Отмена",
    "close": "Закрыть",
    "confirm": "Подтвердить",
    "entry": "Приход",
    "withdrawal": "Расход",
    "import": "Импорт",
    "export": "Экспорт",
    "data": "Данные",
    "discard": "Отменить"
  },
  "modals": {
    "deleteConfirm": "Вы хотите удалить эту запись?",
    "import": {
      "title": "Импорт данных"
    }
  },
  "messages": {
    "success": {
      "created": "Запись успешно создана",
      "updated": "Запись успешно обновлена",
      "deleted": "Запись успешно удалена",
      "exported": "Успешно экспортировано"
    },
    "error": {
      "create": "Ошибка при создании записи",
      "update": "Ошибка при обновлении записи",
      "delete": "Ошибка при удалении записи",
      "network": "Ошибка сети. Пожалуйста, попробуйте снова.",
      "export": "Ошибка экспорта",
      "noLocation": "Нет локации"
    },
    "confirm": {
      "discard": "Отменить изменения?"
    }
  },
  "common": {
    "search": "Поиск",
    "actions": "Действия",
    "loading": "Загрузка…",
    "noData": "Данные не найдены",
    "quantity": "Количество",
    "notes": "Заметки",
    "optional": "необязательно"
  },
  "dashboard": {
    "title": "Панель",
    "totalProducts": "Всего товаров",
    "totalStock": "Общий склад",
    "lowStock": "Мало на складе",
    "movementsToday": "Движений сегодня",
    "movements": "Движение склада (30 дней)",
    "topProducts": "Топ товаров",
    "entries": "Приходы",
    "withdrawals": "Расходы",
    "totalValue": "Общая стоимость",
    "lowStockAlert": "Оповещение о низком запасе",
    "totalEntries": "Всего приходов",
    "totalWithdrawals": "Всего расходов",
    "categoryStock": "Запас категории",
    "noData": "Нет данных",
    "recentOperations": "Последние операции"
  },
  "tables": {
    "products": {
      "title": "Товары",
      "create": "Создать товар",
      "edit": "Редактировать товар",
      "delete": "Удалить товар",
      "columns": {
        "name": "Название",
        "category_name": "Категория",
        "shelve_name": "Полка",
        "rack_name": "Стеллаж",
        "quantity": "Количество",
        "description": "Описание",
        "supplier_name": "Поставщик",
        "cost_price": "Себестоимость",
        "selling_price": "Цена продажи",
        "min_stock": "Мин. запас"
      }
    },
    "categories": {
      "title": "Категории",
      "create": "Создать категорию",
      "edit": "Редактировать категорию",
      "delete": "Удалить категорию",
      "columns": {
        "id": "ID",
        "name": "Название",
        "description": "Описание"
      }
    },
    "shelves": {
      "title": "Полки",
      "create": "Создать полку",
      "edit": "Редактировать полку",
      "delete": "Удалить полку",
      "columns": {
        "id": "ID",
        "name": "Название"
      }
    },
    "racks": {
      "title": "Стеллажи",
      "create": "Создать стеллаж",
      "edit": "Редактировать стеллаж",
      "delete": "Удалить стеллаж",
      "columns": {
        "id": "ID",
        "name": "Название",
        "shelve_name": "Полка"
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
      "title": "История",
      "columns": {
        "created_at": "Дата",
        "user": "Пользователь",
        "entity": "Сущность",
        "operation": "Операция",
        "qty_change": "Изменение кол-ва",
        "notes": "Заметки",
        "entity_type": "Тип",
        "quantity_before": "До",
        "quantity_after": "После"
      }
    }
  },
  "forms": {
    "label": {
      "products": {
        "name": "Название",
        "quantity": "Количество",
        "description": "Описание",
        "category_name": "Категория",
        "shelve_name": "Полка",
        "rack_name": "Стеллаж",
        "status": "Статус",
        "supplier_name": "Поставщик",
        "cost_price": "Себестоимость",
        "selling_price": "Цена продажи",
        "min_stock": "Мин. запас"
      },
      "categories": {
        "name": "Название",
        "description": "Описание"
      },
      "shelves": {
        "name": "Название",
        "description": "Описание"
      },
      "racks": {
        "name": "Название",
        "shelve_name": "Полка",
        "description": "Описание"
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
      "name": "Введите название",
      "description": "Введите описание",
      "quantity": "Введите количество",
      "category": "Выберите категорию",
      "shelve": "Выберите полку",
      "rack": "Выберите стеллаж",
      "status": "Выберите статус",
      "notes": "Введите заметки (необязательно)",
      "contact_name": "Enter contact name",
      "email": "Enter email",
      "phone": "Enter phone",
      "address": "Enter address"
    },
    "validation": {
      "required": "Это поле обязательно"
    }
  },
  "history": {
    "title": "История операций",
    "operation": "Операция",
    "entity": "Сущность",
    "quantityBefore": "До",
    "quantityAfter": "После",
    "date": "Дата",
    "filters": {
      "all": "Все",
      "entry": "Приходы",
      "withdrawal": "Расходы",
      "product": "Товары",
      "category": "Категории",
      "rack": "Стеллажи",
      "shelf": "Полки"
    }
  },
  "settings": {
    "userProfile": "Профиль пользователя",
    "language": "Язык",
    "appearance": "Внешний вид",
    "connection": "Подключение",
    "account": "Аккаунт",
    "title": "Настройки",
    "catalogSnapshot": "Снимок каталога",
    "snapshotDescription": "Резервное копирование",
    "snapshotWarning": "Внимание",
    "exportSnapshot": "Экспорт",
    "importSnapshot": "Импорт",
    "snapshotAdminOnly": "Только администратор",
    "googleConnected": "Google подключен",
    "googleNotConnected": "Google не подключен",
    "connectGoogleDrive": "Подключить Google Drive",
    "syncThisDevice": "Синхронизировать это устр.",
    "restoreGoogleDrive": "Восстановить из Drive",
    "snapshotInvalid": "Недействительный снимок",
    "googleSynced": "Синхронизировано",
    "snapshotConfirm": "Подтвердить?",
    "googleRestored": "Восстановлено",
    "snapshotExported": "Экспортировано",
    "snapshotTooLarge": "Слишком большой снимок",
    "snapshotImported": "Импортировано",
    "colorSchemes": "Цветовые схемы"
  },
  "welcome": {
    "title": "Добро пожаловать в STOCKMACHINE",
    "subtitle": "Подключите аккаунт для синхронизации инвентаря между устройствами или продолжите работу оффлайн.",
    "loginBtn": "Войти",
    "registerBtn": "Зарегистрироваться онлайн",
    "offlineBtn": "Продолжить оффлайн"
  },
  "sync": {
    "online": "В сети",
    "offline": "Не в сети",
    "failed": "Ошибка синх"
  }
};

export default ru;
