import type { Translations } from './en';

const ja: Translations = {
  "app": {
    "title": "STOCKMACHINE",
    "theme": {
      "dark": "ダークモード",
      "light": "ライトモード"
    }
  },
  "navigation": {
    "dashboard": "ダッシュボード",
    "products": "製品",
    "categories": "カテゴリー",
    "racks": "ラック",
    "shelves": "棚",
    "suppliers": "Suppliers",
    "history": "履歴",
    "settings": "設定"
  },
  "auth": {
    "login": "ログイン",
    "register": "登録",
    "logout": "ログアウト",
    "email": "メールアドレス",
    "password": "パスワード",
    "name": "氏名",
    "orgName": "組織名",
    "orgNameHint": "個人として登録する場合は空白のままにしてください",
    "noAccount": "アカウントをお持ちでない方は登録してください",
    "hasAccount": "アカウントをお持ちの方はログインしてください",
    "invalidCredentials": "メールアドレスまたはパスワードが正しくありません",
    "sessionExpired": "セッションが期限切れです。再度ログインしてください。",
    "createAccount": "アカウント作成",
    "accountType": "アカウントの種類",
    "individual": "個人",
    "individualDesc": "個人利用 — 1つの在庫",
    "organization": "組織",
    "orgDesc": "チーム向け複数拠点の在庫管理",
    "forgotPassword": "パスワードをお忘れですか？",
    "continueOffline": "オフラインで続ける",
    "error": "エラー"
  },
  "actions": {
    "create": "作成",
    "edit": "編集",
    "delete": "削除",
    "save": "保存",
    "cancel": "キャンセル",
    "close": "閉じる",
    "confirm": "確認",
    "entry": "入庫",
    "withdrawal": "出庫",
    "import": "インポート",
    "export": "エクスポート",
    "data": "データ",
    "discard": "破棄"
  },
  "modals": {
    "deleteConfirm": "このレコードを削除しますか？",
    "import": {
      "title": "データのインポート"
    }
  },
  "messages": {
    "success": {
      "created": "レコードが正常に作成されました",
      "updated": "レコードが正常に更新されました",
      "deleted": "レコードが正常に削除されました",
      "exported": "エクスポートに成功しました"
    },
    "error": {
      "create": "レコードの作成中にエラーが発生しました",
      "update": "レコードの更新中にエラーが発生しました",
      "delete": "レコードの削除中にエラーが発生しました",
      "network": "ネットワークエラーが発生しました。再試行してください。",
      "export": "エクスポートエラー",
      "noLocation": "場所がありません",
      "permissionRequired": "許可が必要です",
      "cameraPermission": "スキャンするにはカメラの許可が必要です。"
    },
    "confirm": {
      "discard": "変更を破棄しますか？"
    },
    "info": {
      "pointCamera": "カメラをバーコードに向けてください"
    }
  },
  "common": {
    "search": "検索",
    "actions": "アクション",
    "loading": "読み込み中…",
    "noData": "データが見つかりません",
    "quantity": "数量",
    "notes": "メモ",
    "optional": "任意"
  },
  "dashboard": {
    "title": "ダッシュボード",
    "totalProducts": "製品合計",
    "totalStock": "在庫合計",
    "lowStock": "在庫不足",
    "movementsToday": "本日の動き",
    "movements": "在庫推移（30日間）",
    "topProducts": "上位製品",
    "entries": "入庫",
    "withdrawals": "出庫",
    "totalValue": "総価値",
    "lowStockAlert": "在庫不足アラート",
    "totalEntries": "入庫合計",
    "totalWithdrawals": "出庫合計",
    "categoryStock": "カテゴリストック",
    "noData": "データなし",
    "recentOperations": "最近の操作"
  },
  "tables": {
    "products": {
      "title": "製品",
      "create": "製品作成",
      "edit": "製品編集",
      "delete": "製品削除",
      "columns": {
        "name": "名前",
        "category_name": "カテゴリー",
        "shelve_name": "棚",
        "rack_name": "ラック",
        "quantity": "数量",
        "description": "説明",
        "supplier_name": "サプライヤー",
        "cost_price": "原価",
        "selling_price": "販売価格",
        "min_stock": "最小在庫",
        "barcode": "バーコード"
      }
    },
    "categories": {
      "title": "カテゴリー",
      "create": "カテゴリー作成",
      "edit": "カテゴリー編集",
      "delete": "カテゴリー削除",
      "columns": {
        "id": "ID",
        "name": "名前",
        "description": "説明"
      }
    },
    "shelves": {
      "title": "棚",
      "create": "棚作成",
      "edit": "棚編集",
      "delete": "棚削除",
      "columns": {
        "id": "ID",
        "name": "名前"
      }
    },
    "racks": {
      "title": "ラック",
      "create": "ラック作成",
      "edit": "ラック編集",
      "delete": "ラック削除",
      "columns": {
        "id": "ID",
        "name": "名前",
        "shelve_name": "棚"
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
      "title": "履歴",
      "columns": {
        "created_at": "日付",
        "user": "ユーザー",
        "entity": "エンティティ",
        "operation": "操作",
        "qty_change": "数量変更",
        "notes": "メモ",
        "entity_type": "タイプ",
        "quantity_before": "前",
        "quantity_after": "後"
      }
    }
  },
  "forms": {
    "label": {
      "products": {
        "name": "名前",
        "quantity": "数量",
        "description": "説明",
        "category_name": "カテゴリー",
        "shelve_name": "棚",
        "rack_name": "ラック",
        "status": "ステータス",
        "supplier_name": "サプライヤー",
        "cost_price": "原価",
        "selling_price": "販売価格",
        "min_stock": "最小在庫",
        "barcode": "バーコード"
      },
      "categories": {
        "name": "名前",
        "description": "説明"
      },
      "shelves": {
        "name": "名前",
        "description": "説明"
      },
      "racks": {
        "name": "名前",
        "shelve_name": "棚",
        "description": "説明"
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
      "name": "名前を入力",
      "description": "説明を入力",
      "quantity": "数量を入力",
      "category": "カテゴリーを選択",
      "shelve": "棚を選択",
      "rack": "ラックを選択",
      "status": "ステータスを選択",
      "notes": "メモを入力（任意）",
      "contact_name": "Enter contact name",
      "email": "Enter email",
      "phone": "Enter phone",
      "address": "Enter address",
      "barcode": "バーコードをスキャンまたは入力"
    },
    "validation": {
      "required": "この項目は必須です"
    }
  },
  "history": {
    "title": "操作履歴",
    "operation": "操作",
    "entity": "エンティティ",
    "quantityBefore": "変更前",
    "quantityAfter": "変更後",
    "date": "日付",
    "filters": {
      "all": "すべて",
      "entry": "入庫",
      "withdrawal": "出庫",
      "product": "製品",
      "category": "カテゴリー",
      "rack": "ラック",
      "shelf": "棚"
    }
  },
  "settings": {
    "userProfile": "ユーザープロフィール",
    "language": "言語",
    "appearance": "外観",
    "connection": "接続設定",
    "account": "アカウント",
    "title": "設定",
    "catalogSnapshot": "カタログスナップショット",
    "snapshotDescription": "データをバックアップ",
    "snapshotWarning": "警告",
    "exportSnapshot": "エクスポート",
    "importSnapshot": "インポート",
    "snapshotAdminOnly": "管理者のみ",
    "googleConnected": "Google 接続済み",
    "googleNotConnected": "Google 未接続",
    "connectGoogleDrive": "Google Driveに接続",
    "syncThisDevice": "このデバイスを同期",
    "restoreGoogleDrive": "Driveから復元",
    "snapshotInvalid": "無効なスナップショット",
    "googleSynced": "同期済み",
    "snapshotConfirm": "確認しますか？",
    "googleRestored": "復元済み",
    "snapshotExported": "エクスポート済み",
    "snapshotTooLarge": "サイズが大きすぎます",
    "snapshotImported": "インポート済み",
    "colorSchemes": "カラースキーム"
  },
  "welcome": {
    "title": "STOCKMACHINEへようこそ",
    "subtitle": "アカウントを接続してデバイス間で在庫を同期するか、オフラインで作業を続けてください。",
    "loginBtn": "ログイン",
    "registerBtn": "オンラインで登録",
    "offlineBtn": "オフラインで続行"
  },
  "sync": {
    "online": "オンライン",
    "offline": "オフライン",
    "failed": "同期失敗"
  }
};

export default ja;
