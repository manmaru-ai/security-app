import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createSessionToken, generateCSRFToken } from '@/lib/auth';
import { initializeDatabase } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const { email, password, csrfToken } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードは必須です' },
        { status: 400 }
      );
    }

    // IPアドレスとUser-Agentの取得
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // ユーザー認証
    const authResult = await authenticateUser(email, password, ipAddress, userAgent);

    if (!authResult) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    const { user, sessionId } = authResult;

    // セッショントークンの作成
    const sessionToken = await createSessionToken(user, sessionId);

    // CSRFトークンの生成
    const newCSRFToken = await generateCSRFToken(sessionId);

    // レスポンスの作成
    const response = NextResponse.json({
      message: 'ログインに成功しました',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      csrfToken: newCSRFToken
    });

    // セキュアなクッキーの設定
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24時間
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
