import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'nest_admin';

function signature(value: string) {
  const secret = process.env.ADMIN_COOKIE_SECRET || 'change-me';
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

export async function isAdmin() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const [value, sig] = token.split('.');
  if (!value || !sig) return false;
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(signature(value)));
}

export async function setAdminCookie() {
  const store = await cookies();
  const value = Date.now().toString();
  store.set(COOKIE_NAME, `${value}.${signature(value)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 });
}
