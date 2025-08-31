import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, validateSession } from '@/lib/auth';
import { openDb } from '@/lib/database';
import { hasPermission } from '@/lib/rbac';

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

    // 管理者権限チェック
    if (!hasPermission(user.role as any, 'update', 'users')) {
      return NextResponse.json(
        { error: 'アクセス権限がありません' },
        { status: 403 }
      );
    }

    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'ユーザーIDとロールは必須です' },
        { status: 400 }
      );
    }

    // 有効なロールかチェック
    const validRoles = ['user', 'editor', 'admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: '無効なロールです' },
        { status: 400 }
      );
    }

    const db = await openDb();
    
    try {
      // 対象ユーザーの存在確認
      const targetUser = await db.get('SELECT id, role FROM users WHERE id = ?', [userId]);
      if (!targetUser) {
        return NextResponse.json(
          { error: 'ユーザーが見つかりません' },
          { status: 404 }
        );
      }

      // 自分自身の管理者権限を削除しようとした場合の防止
      if (user.id === userId && user.role === 'admin' && role !== 'admin') {
        return NextResponse.json(
          { error: '自分自身の管理者権限を削除することはできません' },
          { status: 400 }
        );
      }

      // ロール更新
      await db.run(
        'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [role, userId]
      );

      // 対象ユーザーの全セッション無効化（権限変更のため）
      await db.run('UPDATE sessions SET is_active = 0 WHERE user_id = ?', [userId]);

      return NextResponse.json({ message: 'ユーザーロールが更新されました' });
    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('Role update error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
