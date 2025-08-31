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
    if (!hasPermission(user.role as any, 'delete', 'users')) {
      return NextResponse.json(
        { error: 'アクセス権限がありません' },
        { status: 403 }
      );
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'ユーザーIDは必須です' },
        { status: 400 }
      );
    }

    // 自分自身を削除しようとした場合の防止
    if (user.id === userId) {
      return NextResponse.json(
        { error: '自分自身を削除することはできません' },
        { status: 400 }
      );
    }

    const db = await openDb();
    
    try {
      // 対象ユーザーの存在確認
      const targetUser = await db.get('SELECT id, email, role FROM users WHERE id = ?', [userId]);
      if (!targetUser) {
        return NextResponse.json(
          { error: 'ユーザーが見つかりません' },
          { status: 404 }
        );
      }

      // 関連データの削除（外部キー制約により自動削除されるが、明示的に削除）
      await db.run('DELETE FROM sessions WHERE user_id = ?', [userId]);
      await db.run('DELETE FROM login_history WHERE user_id = ?', [userId]);
      
      // ユーザー削除
      await db.run('DELETE FROM users WHERE id = ?', [userId]);

      return NextResponse.json({ 
        message: `ユーザー「${targetUser.email}」が削除されました` 
      });
    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('User delete error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
