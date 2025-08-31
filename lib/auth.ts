import { NextRequest, NextResponse } from 'next/server';
import { openDb, User, Session } from './database';
import { createSessionToken, verifySessionToken } from './jwt';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// Re-export for compatibility
export { createSessionToken, verifySessionToken };

// ユーザーの認証
export async function authenticateUser(email: string, password: string, ipAddress: string, userAgent: string): Promise<{ user: User; sessionId: string } | null> {
  const db = await openDb();
  
  try {
    // ユーザーの取得
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]) as User | undefined;
    
    // ログイン履歴の記録（失敗の場合も含む）
    const logLoginAttempt = async (success: boolean, failureReason?: string, userId?: string) => {
      await db.run(
        'INSERT INTO login_history (user_id, email, ip_address, user_agent, success, failure_reason) VALUES (?, ?, ?, ?, ?, ?)',
        [userId || null, email, ipAddress, userAgent, success ? 1 : 0, failureReason || null]
      );
    };

    if (!user) {
      await logLoginAttempt(false, 'User not found');
      return null;
    }

    // アカウントロックチェック
    if (user.is_locked) {
      const now = new Date();
      const lockedUntil = user.locked_until ? new Date(user.locked_until) : null;
      
      if (lockedUntil && now < lockedUntil) {
        await logLoginAttempt(false, 'Account locked', user.id);
        return null;
      } else if (lockedUntil && now >= lockedUntil) {
        // ロック解除
        await db.run(
          'UPDATE users SET is_locked = 0, failed_login_attempts = 0, locked_until = NULL WHERE id = ?',
          [user.id]
        );
        user.is_locked = false;
        user.failed_login_attempts = 0;
        user.locked_until = null;
      }
    }

    // パスワード検証
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      // 失敗回数の増加
      const newFailedAttempts = user.failed_login_attempts + 1;
      const maxAttempts = 5;
      
      if (newFailedAttempts >= maxAttempts) {
        // アカウントロック（30分間）
        const lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30分後
        await db.run(
          'UPDATE users SET failed_login_attempts = ?, is_locked = 1, locked_until = ? WHERE id = ?',
          [newFailedAttempts, lockUntil.toISOString(), user.id]
        );
        await logLoginAttempt(false, 'Account locked due to multiple failed attempts', user.id);
      } else {
        await db.run(
          'UPDATE users SET failed_login_attempts = ? WHERE id = ?',
          [newFailedAttempts, user.id]
        );
        await logLoginAttempt(false, 'Invalid password', user.id);
      }
      return null;
    }

    // ログイン成功 - 失敗回数リセット
    await db.run(
      'UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = ?',
      [user.id]
    );

    // セッション作成
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24時間後

    await db.run(
      'INSERT INTO sessions (id, user_id, user_agent, ip_address, expires_at) VALUES (?, ?, ?, ?, ?)',
      [sessionId, user.id, userAgent, ipAddress, expiresAt.toISOString()]
    );

    await logLoginAttempt(true, undefined, user.id);

    return { user, sessionId };
  } finally {
    await db.close();
  }
}

// セッションの検証
export async function validateSession(sessionId: string): Promise<{ user: User; session: Session } | null> {
  const db = await openDb();
  
  try {
    const session = await db.get(
      'SELECT * FROM sessions WHERE id = ? AND is_active = 1 AND expires_at > datetime("now")',
      [sessionId]
    ) as Session | undefined;

    if (!session) {
      return null;
    }

    const user = await db.get('SELECT * FROM users WHERE id = ?', [session.user_id]) as User | undefined;
    
    if (!user) {
      // ユーザーが存在しない場合はセッションを無効化
      await db.run('UPDATE sessions SET is_active = 0 WHERE id = ?', [sessionId]);
      return null;
    }

    // 最終アクティビティ時間の更新
    await db.run(
      'UPDATE sessions SET last_activity = datetime("now") WHERE id = ?',
      [sessionId]
    );

    return { user, session };
  } finally {
    await db.close();
  }
}

// セッションの無効化
export async function invalidateSession(sessionId: string): Promise<void> {
  const db = await openDb();
  try {
    await db.run('UPDATE sessions SET is_active = 0 WHERE id = ?', [sessionId]);
  } finally {
    await db.close();
  }
}

// ユーザーの全セッション無効化
export async function invalidateAllUserSessions(userId: string): Promise<void> {
  const db = await openDb();
  try {
    await db.run('UPDATE sessions SET is_active = 0 WHERE user_id = ?', [userId]);
  } finally {
    await db.close();
  }
}

// CSRFトークンの生成
export async function generateCSRFToken(sessionId: string): Promise<string> {
  const db = await openDb();
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1時間後

  try {
    await db.run(
      'INSERT INTO csrf_tokens (token, session_id, expires_at) VALUES (?, ?, ?)',
      [token, sessionId, expiresAt.toISOString()]
    );
    return token;
  } finally {
    await db.close();
  }
}

// CSRFトークンの検証
export async function validateCSRFToken(token: string, sessionId: string): Promise<boolean> {
  const db = await openDb();
  
  try {
    const csrfToken = await db.get(
      'SELECT * FROM csrf_tokens WHERE token = ? AND session_id = ? AND expires_at > datetime("now")',
      [token, sessionId]
    );

    if (csrfToken) {
      // 使用済みトークンは削除
      await db.run('DELETE FROM csrf_tokens WHERE token = ?', [token]);
      return true;
    }
    return false;
  } finally {
    await db.close();
  }
}

// パスワード強度チェック
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('パスワードは8文字以上である必要があります');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('小文字を含める必要があります');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('大文字を含める必要があります');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('数字を含める必要があります');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('特殊文字を含める必要があります');
  }

  return {
    isValid: score >= 5,
    score,
    feedback
  };
}
