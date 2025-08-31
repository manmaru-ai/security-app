import { JWTPayload, SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

// セッショントークンの作成
export async function createSessionToken(user: { id: string; email: string; role: string }, sessionId: string): Promise<string> {
  return await new SignJWT({ 
    userId: user.id, 
    email: user.email, 
    role: user.role,
    sessionId 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

// セッショントークンの検証
export async function verifySessionToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}
