import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, validateSession } from '@/lib/auth';
import { openDb } from '@/lib/database';

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

    // 現在のセッション以外の全てのセッションを無効化
    const db = await openDb();
    
    try {
      await db.run(
        'UPDATE sessions SET is_active = 0 WHERE user_id = ? AND id != ?',
        [user.id, payload.sessionId]
      );

      return NextResponse.json({ message: '他の全てのセッションを終了しました' });
    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('Terminate other sessions error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
