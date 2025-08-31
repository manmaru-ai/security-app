import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, validateSession } from '@/lib/auth';
import { openDb } from '@/lib/database';
import { hasPermission } from '@/lib/rbac';

export async function GET(request: NextRequest) {
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
    if (!hasPermission(user.role as any, 'read', 'users')) {
      return NextResponse.json(
        { error: 'アクセス権限がありません' },
        { status: 403 }
      );
    }

    const db = await openDb();
    
    try {
      // ユーザー一覧を取得（パスワードハッシュは除外）
      const users = await db.all(
        'SELECT id, email, role, is_locked, failed_login_attempts, created_at, updated_at FROM users ORDER BY created_at DESC'
      );

      return NextResponse.json({ users });
    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
