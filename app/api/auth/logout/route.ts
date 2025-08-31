import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, invalidateSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');
    
    if (sessionCookie) {
      const payload = await verifySessionToken(sessionCookie.value);
      
      if (payload && payload.sessionId) {
        await invalidateSession(payload.sessionId as string);
      }
    }

    const response = NextResponse.json({ message: 'ログアウトしました' });
    
    // セッションクッキーの削除
    response.cookies.delete('session');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    const response = NextResponse.json({ message: 'ログアウトしました' });
    response.cookies.delete('session');
    return response;
  }
}
