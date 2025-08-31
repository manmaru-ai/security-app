import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from './lib/jwt';

// 認証が不要なパス
const publicPaths = ['/login', '/signup', '/api/auth/login', '/api/auth/signup', '/api/auth/check-email'];

// 管理者専用パス
const adminPaths = ['/admin'];

// エディター以上のアクセスが必要なパス
const editorPaths = ['/editor'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 静的ファイルとAPI ルートをスキップ
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // セキュリティヘッダーの設定
  const response = NextResponse.next();
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob:;
      font-src 'self';
      connect-src 'self';
      frame-ancestors 'none';
    `.replace(/\s+/g, ' ').trim()
  );

  // その他のセキュリティヘッダー
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // 認証が不要なパスの場合はそのまま通す
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return response;
  }

  // セッショントークンの取得
  const sessionCookie = request.cookies.get('session');
  
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // JWTトークンの検証のみ（ミドルウェアではデータベースアクセス不可）
    const payload = await verifySessionToken(sessionCookie.value);
    
    if (!payload || !payload.sessionId || !payload.userId) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('session');
      return response;
    }

    const userRole = payload.role as string;

    // ロールベースアクセス制御（JWTペイロードベース）
    if (adminPaths.some(path => pathname.startsWith(path))) {
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    if (editorPaths.some(path => pathname.startsWith(path))) {
      if (userRole !== 'admin' && userRole !== 'editor') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    // ユーザー情報をヘッダーに追加（ページで使用可能）
    response.headers.set('x-user-id', payload.userId as string);
    response.headers.set('x-user-email', payload.email as string);
    response.headers.set('x-user-role', userRole);
    response.headers.set('x-session-id', payload.sessionId as string);

    return response;
  } catch (error) {
    console.error('Authentication middleware error:', error);
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
