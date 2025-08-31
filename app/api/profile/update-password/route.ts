import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, validateSession, validatePasswordStrength } from '@/lib/auth';
import { openDb } from '@/lib/database';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const payload = await verifySessionToken(sessionCookie.value);
    
    if (!payload || !payload.sessionId) {
      return NextResponse.json(
        { error: '無効なセッションです' },
        { status: 401 }
      );
    }

    const sessionData = await validateSession(payload.sessionId as string);
    
    if (!sessionData) {
      return NextResponse.json(
        { error: 'セッションが見つかりません' },
        { status: 401 }
      );
    }

    const { user } = sessionData;
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: '現在のパスワードと新しいパスワードは必須です' },
        { status: 400 }
      );
    }

    // パスワード強度チェック
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'パスワードが弱すぎます',
          details: passwordValidation.feedback
        },
        { status: 400 }
      );
    }

    const db = await openDb();

    try {
      // 現在のパスワード検証
      const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: '現在のパスワードが正しくありません' },
          { status: 400 }
        );
      }

      // 新しいパスワードのハッシュ化
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // パスワード更新
      await db.run(
        'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [hashedPassword, user.id]
      );

      // 全セッション無効化（セキュリティのため）
      await db.run('UPDATE sessions SET is_active = 0 WHERE user_id = ?', [user.id]);

      return NextResponse.json({ message: 'パスワードが更新されました' });
    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
