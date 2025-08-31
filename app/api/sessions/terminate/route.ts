import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, validateSession, invalidateSession } from '@/lib/auth';

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

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'セッションIDが必要です' },
        { status: 400 }
      );
    }

    // セッションを終了
    await invalidateSession(sessionId);

    const response = NextResponse.json({ message: 'セッションを終了しました' });

    // 現在のセッションを終了した場合はクッキーも削除
    if (sessionId === payload.sessionId) {
      response.cookies.delete('session');
    }

    return response;
  } catch (error) {
    console.error('Session terminate error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
