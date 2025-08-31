import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// データベース接続設定
async function openDb() {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
}

// データベースの初期化
async function initializeDatabase() {
  const db = await openDb();

  // ユーザーテーブル
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      is_locked INTEGER DEFAULT 0,
      failed_login_attempts INTEGER DEFAULT 0,
      locked_until DATETIME NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // セッションテーブル
  await db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_agent TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      is_active INTEGER DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // ログイン履歴テーブル
  await db.exec(`
    CREATE TABLE IF NOT EXISTS login_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      email TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      success INTEGER NOT NULL,
      attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      failure_reason TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
    )
  `);

  // CSRFトークンテーブル
  await db.exec(`
    CREATE TABLE IF NOT EXISTS csrf_tokens (
      token TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
    )
  `);

  // デフォルト管理者ユーザーの作成
  const adminExists = await db.get('SELECT id FROM users WHERE email = ?', ['admin@example.com']);
  if (!adminExists) {
    const adminId = uuidv4();
    const hashedPassword = await bcrypt.hash('SecureAdmin123!', 12);
    await db.run(
      'INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [adminId, 'admin@example.com', hashedPassword, 'admin']
    );
    console.log('Default admin user created: admin@example.com / SecureAdmin123!');
  }

  await db.close();
}

async function main() {
  try {
    console.log('データベースを初期化しています...');
    await initializeDatabase();
    console.log('データベースの初期化が完了しました！');
    console.log('');
    console.log('デフォルト管理者アカウント:');
    console.log('Email: admin@example.com');
    console.log('Password: SecureAdmin123!');
    console.log('');
    console.log('アプリケーションを起動してください: npm run dev');
  } catch (error) {
    console.error('データベース初期化エラー:', error);
    process.exit(1);
  }
}

main();
