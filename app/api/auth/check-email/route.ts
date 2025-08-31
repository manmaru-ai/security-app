import { NextRequest, NextResponse } from 'next/server';
import { openDb, initializeDatabase } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'メールアドレスが必要です' },
        { status: 400 }
      );
    }

    const db = await openDb();

    try {
      const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
      
      return NextResponse.json({
        exists: !!existingUser
      });
    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('Check email error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
