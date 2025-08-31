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
    if (!hasPermission(user.role as any, 'read', 'analytics')) {
      return NextResponse.json(
        { error: 'アクセス権限がありません' },
        { status: 403 }
      );
    }

    const db = await openDb();
    
    try {
      // 総ユーザー数
      const totalUsersResult = await db.get('SELECT COUNT(*) as count FROM users') as { count: number };
      
      // アクティブセッション数
      const activeSessionsResult = await db.get(
        'SELECT COUNT(*) as count FROM sessions WHERE is_active = 1 AND expires_at > datetime("now")'
      ) as { count: number };
      
      // 24時間以内のログイン数
      const recentLoginsResult = await db.get(
        'SELECT COUNT(*) as count FROM login_history WHERE success = 1 AND attempted_at > datetime("now", "-1 day")'
      ) as { count: number };
      
      // 24時間以内の失敗したログイン試行数
      const failedAttemptsResult = await db.get(
        'SELECT COUNT(*) as count FROM login_history WHERE success = 0 AND attempted_at > datetime("now", "-1 day")'
      ) as { count: number };

      return NextResponse.json({
        totalUsers: totalUsersResult.count,
        activeSessions: activeSessionsResult.count,
        recentLogins: recentLoginsResult.count,
        failedAttempts: failedAttemptsResult.count
      });
    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
