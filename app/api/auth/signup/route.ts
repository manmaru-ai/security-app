import { NextRequest, NextResponse } from 'next/server';
import { openDb, initializeDatabase } from '@/lib/database';
import { validatePasswordStrength } from '@/lib/auth';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const { email, password, confirmPassword } = await request.json();

    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'すべての項目を入力してください' },
        { status: 400 }
      );
    }

    // パスワード確認
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'パスワードが一致しません' },
        { status: 400 }
      );
    }

    // パスワード強度チェック
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'パスワードが弱すぎます',
          details: passwordValidation.feedback
        },
        { status: 400 }
      );
    }

    // メールアドレスの基本的なバリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '有効なメールアドレスを入力してください' },
        { status: 400 }
      );
    }

    const db = await openDb();

    try {
      // メールアドレスの重複チェック
      const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
      if (existingUser) {
        return NextResponse.json(
          { error: 'このメールアドレスは既に使用されています' },
          { status: 409 }
        );
      }

      // パスワードのハッシュ化
      const hashedPassword = await bcrypt.hash(password, 12);

      // ユーザーの作成
      const userId = uuidv4();
      await db.run(
        'INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [userId, email, hashedPassword, 'user']
      );

      return NextResponse.json({
        message: 'ユーザー登録が完了しました',
        user: {
          id: userId,
          email: email,
          role: 'user'
        }
      }, { status: 201 });

    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
