import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const COOKIE_NAME = 'cc-auth-token';
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_MAX_AGE });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  try {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    return user ?? null;
  } catch {
    return null;
  }
}

// Use for any route that spends the user's money (checkout, spins, etc.) so
// a session alone is never enough — the account must also have a verified,
// reachable email address before it can be charged or credited.
export async function requireVerifiedUser(): Promise<
  { user: AuthUser; error: null } | { user: null; error: Response }
> {
  const user = await getSession();

  if (!user) {
    return { user: null, error: Response.json({ error: 'You must be logged in to continue' }, { status: 401 }) };
  }

  if (!user.emailVerified) {
    return {
      user: null,
      error: Response.json(
        { error: 'Please verify your email address before making a purchase' },
        { status: 403 }
      ),
    };
  }

  return { user, error: null };
}

export function setAuthCookie(token: string): { name: string; value: string; options: Record<string, unknown> } {
  return {
    name: COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: TOKEN_MAX_AGE,
    },
  };
}

export function clearAuthCookie(): { name: string; value: string; options: Record<string, unknown> } {
  return {
    name: COOKIE_NAME,
    value: '',
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    },
  };
}
