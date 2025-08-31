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
    if (!hasPermission(user.role as any, 'read', 'logs')) {
      return NextResponse.json(
        { error: 'アクセス権限がありません' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const email = searchParams.get('email');
    const success = searchParams.get('success');
    
    const offset = (page - 1) * limit;

    const db = await openDb();
    
    try {
      let whereClause = '';
      let params: any[] = [];
      
      if (email) {
        whereClause += ' WHERE email LIKE ?';
        params.push(`%${email}%`);
      }
      
      if (success !== null && success !== '') {
        const condition = success === 'true' ? '1' : '0';
        whereClause += whereClause ? ` AND success = ${condition}` : ` WHERE success = ${condition}`;
      }

      // 総件数を取得
      const countResult = await db.get(
        `SELECT COUNT(*) as total FROM login_history${whereClause}`,
        params
      ) as { total: number };

      // ログイン履歴を取得
      const history = await db.all(
        `SELECT 
          login_history.*,
          users.email as user_email,
          users.role as user_role
         FROM login_history 
         LEFT JOIN users ON login_history.user_id = users.id
         ${whereClause}
         ORDER BY attempted_at DESC 
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      return NextResponse.json({
        history,
        pagination: {
          page,
          limit,
          total: countResult.total,
          totalPages: Math.ceil(countResult.total / limit)
        }
      });
    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('Login history fetch error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
