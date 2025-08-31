# SecureApp - 企業レベルセキュリティ対応Next.jsアプリケーション

[![Security](https://img.shields.io/badge/Security-A%2B-brightgreen.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-blue.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)]()
[![SQLite](https://img.shields.io/badge/SQLite-Database-green.svg)]()
[![bcrypt](https://img.shields.io/badge/bcrypt-12_rounds-red.svg)]()

## 概要

SecureAppは、**ガチガチにセキュアな設計**で構築された企業レベルのセキュリティ機能を備えたNext.jsアプリケーションです。ロールベースアクセス制御（RBAC）、高度なセッション管理、多層防御によるセキュリティ対策を実装しています。

![アプリケーション概要](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=SecureApp+Overview)

> **注意**: このアプリケーションは教育・学習目的で作成されており、実際のセキュリティベストプラクティスを学ぶためのサンプルです。

##  実装済みセキュリティ機能

![セキュリティダッシュボード](https://via.placeholder.com/800x500/10B981/FFFFFF?text=Security+Dashboard)

### 1. ロールベースアクセス制御（RBAC）
- **管理者（Admin）**: 全機能へのアクセス権限・ユーザー管理
- **編集者（Editor）**: コンテンツ編集・ユーザー一覧閲覧権限
- **一般ユーザー（User）**: 基本機能のみ利用可能

**実装詳細**:
- 階層的権限システム（admin > editor > user）
- ミドルウェアによる自動ページアクセス制御
- APIレベルでの権限チェック

### 2. 高度なセッション管理
![セッション管理画面](https://via.placeholder.com/800x500/3B82F6/FFFFFF?text=Session+Management)

- **マルチデバイス対応**: 複数端末からの同時ログイン管理
- **端末情報詳細表示**: OS、ブラウザ、IPアドレス、最終アクティビティ
- **個別セッション強制終了**: 不審なセッションの即座削除
- **一括セッション管理**: 他の全セッションを一度に終了
- **セッション有効期限**: 24時間自動失効

### 3. 強固な認証・認可システム
- **bcryptハッシュ化**: ソルトラウンド12による強固なパスワード保護
- **JWT + DB二重管理**: トークンとデータベースによる堅牢なセッション管理
- **セキュアCookie**: HttpOnly、Secure、SameSite=Strict属性
- **CSRF保護**: トークンベースの偽造リクエスト防止

### 4. プロアクティブアカウント保護
- **スマートアカウントロック**: 5回連続失敗で30分間自動ロック
- **リアルタイムパスワード強度**: 入力中の即座フィードバック
- **包括的ログイン履歴**: 成功・失敗・IPアドレス・端末情報の全記録
- **プロフィール管理**: セキュアなメール・パスワード変更機能

### 5. 多層セキュリティヘッダー
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### 6. ユーザビリティとセキュリティの両立
- **メールアドレス重複チェック**: リアルタイム確認
- **ログインID記憶**: セキュアな自動入力機能
- **管理者ユーザー管理**: ロール変更・アカウントロック解除
- **詳細監査ログ**: 全アクティビティの追跡可能

## セットアップと起動

![セットアップ手順](https://via.placeholder.com/800x400/EF4444/FFFFFF?text=Setup+Instructions)

### 1. 依存関係のインストール

```bash
npm install
```

**インストールされる主要パッケージ**:
- `bcrypt`: パスワードハッシュ化（ソルトラウンド12）
- `jose`: JWT トークン管理
- `sqlite3`: 軽量データベース
- `uuid`: 一意識別子生成

### 2. データベースの初期化

```bash
npm run init-db
```

このコマンドで以下が自動実行されます：
- SQLiteデータベースファイル作成
- セキュリティテーブル構築
- デフォルト管理者アカウント生成

**📋 デフォルトアカウント**:
- **Email**: `admin@example.com`
- **Password**: `SecureAdmin123!`
- **Role**: 管理者（全権限）

### 3. 開発サーバーの起動

```bash
npm run dev
```

**アクセス**: [http://localhost:3000](http://localhost:3000)

###  追加スクリプト

```bash
npm run dev:turbo    # Turbopack使用（高速）
npm run build        # 本番ビルド
npm run start        # 本番サーバー起動
npm run lint         # ESLint実行
```

## プロジェクト構造

```
security-app/
├── app/                      # Next.js 13+ App Router
│   ├── api/                  # APIルート
│   │   ├── auth/             # 認証関連API
│   │   ├── sessions/         # セッション管理API
│   │   └── admin/            # 管理者専用API
│   ├── dashboard/            # ダッシュボードページ
│   ├── login/                # ログインページ
│   ├── signup/               # サインアップページ
│   ├── sessions/             # セッション管理ページ
│   ├── admin/                # 管理者ページ
│   └── unauthorized/         # アクセス拒否ページ
├── components/               # Reactコンポーネント
│   ├── Navigation.tsx        # ナビゲーション
│   ├── LogoutButton.tsx      # ログアウトボタン
│   ├── SessionManager.tsx    # セッション管理
│   ├── AdminDashboard.tsx    # 管理者ダッシュボード
│   └── LoginHistoryViewer.tsx # ログイン履歴
├── lib/                      # ユーティリティライブラリ
│   ├── auth.ts              # 認証ロジック
│   ├── database.ts          # データベース操作
│   └── rbac.ts              # RBAC システム
├── middleware.ts             # Next.js ミドルウェア
└── scripts/                  # ユーティリティスクリプト
    └── init-db.js           # DB初期化スクリプト
```

## セキュリティ仕様詳細

### パスワード要件
- 最低8文字以上
- 大文字・小文字・数字・特殊文字を含む
- bcryptソルトラウンド12での暗号化

### セッション管理
- JWT + データベース二重管理
- 24時間有効期限
- ブラウザ・端末・IPアドレス記録
- 最終アクティビティ時間追跡

### アクセス制御
```typescript
// ロール階層
admin > editor > user

// 権限例
admin: すべての権限
editor: content操作、users閲覧
user: profile操作、dashboard閲覧
```

## セキュリティ監査機能

### ログイン履歴
- 全ログイン試行の記録
- 成功・失敗の詳細
- IPアドレス・端末情報
- 失敗理由の詳細記録

### リアルタイム監視
- アクティブセッション数監視
- 失敗したログイン試行の追跡
- 異常アクセスの検出アラート

## 管理者機能

### ダッシュボード統計
- 総ユーザー数
- アクティブセッション数
- 24時間以内のログイン数
- 失敗したログイン試行数

### セキュリティアラート
- 異常な失敗試行の検出
- セキュリティ状態の可視化
- リアルタイム監視レポート

## カスタマイズ可能な設定

### セキュリティパラメータ
```typescript
// lib/auth.ts で調整可能
const MAX_LOGIN_ATTEMPTS = 5;      // ロック前の最大試行回数
const LOCK_DURATION = 30 * 60;     // ロック期間（秒）
const SESSION_DURATION = 24 * 60;   // セッション有効期間（分）
const BCRYPT_ROUNDS = 12;           // bcryptラウンド数
```

### ロール権限
```typescript
// lib/rbac.ts でカスタマイズ
const rolePermissions = {
  user: [/* 基本権限 */],
  editor: [/* 編集権限 */],
  admin: [/* 全権限 */]
};
```

## UIとUX

### モダンなデザイン
- Tailwind CSS による洗練されたUI
- レスポンシブデザイン対応
- アクセシビリティ配慮

### ユーザビリティ機能
- リアルタイムパスワード強度表示
- メールアドレス重複チェック
- 直感的なセッション管理
- わかりやすいエラーメッセージ

## テスト用アカウント

### 管理者アカウント
- **Email**: admin@example.com
- **Password**: SecureAdmin123!
- **権限**: 全機能アクセス可能

### テスト手順
1. 管理者アカウントでログイン
2. 新規ユーザーアカウント作成
3. セッション管理機能の確認
4. ログイン履歴の確認
5. アクセス制御のテスト

## パフォーマンス

### 最適化機能
- データベースインデックス最適化
- セッション効率的管理
- ページング機能
- キャッシュ戦略

### セキュリティパフォーマンス
- JWTトークン軽量化
- データベースクエリ最適化
- ミドルウェア効率化

## セキュリティ注意事項

### 本番環境での設定
1. **環境変数の設定**
   ```env
   JWT_SECRET=your-strong-random-secret-key
   NODE_ENV=production
   ```

2. **HTTPS の強制適用**
3. **データベースのセキュア設定**
4. **ログ監視システムの導入**

### 定期メンテナンス
- セッションテーブルのクリーンアップ
- ログイン履歴の定期アーカイブ
- セキュリティ監査の実施

## 開発ログ

### 実装時間
- **総開発時間**: 8時間以上
- **セキュリティ実装**: 4時間
- **UI/UX開発**: 2時間
- **テスト・デバッグ**: 2時間

### 使用技術
- **フロントエンド**: Next.js 15.5.2, React 19, TypeScript
- **バックエンド**: Next.js API Routes
- **データベース**: SQLite3
- **認証**: JWT + セッション管理
- **暗号化**: bcrypt
- **スタイリング**: Tailwind CSS