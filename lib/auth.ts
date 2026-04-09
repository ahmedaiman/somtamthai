import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { JWT_COOKIE_NAME, ADMIN_JWT_COOKIE_NAME } from './constants'

const SECRET = process.env.JWT_SECRET!
const EXPIRY = (process.env.JWT_EXPIRY ?? '7d') as string

export interface CustomerPayload {
  userId: string
  phone: string
}

export interface AdminPayload {
  adminId: string
  email: string
}

// ─── Sign ─────────────────────────────────────────────────────────────────────

export function signCustomerToken(payload: CustomerPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRY })
}

export function signAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRY })
}

// ─── Verify ───────────────────────────────────────────────────────────────────

export function verifyCustomerToken(token: string): CustomerPayload | null {
  try {
    return jwt.verify(token, SECRET) as CustomerPayload
  } catch {
    return null
  }
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, SECRET) as AdminPayload
  } catch {
    return null
  }
}

// ─── Cookie helpers (server components / route handlers) ──────────────────────

export async function getSessionUser(): Promise<CustomerPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(JWT_COOKIE_NAME)?.value
  if (!token) return null
  return verifyCustomerToken(token)
}

export async function getAdminUser(): Promise<AdminPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_JWT_COOKIE_NAME)?.value
  if (!token) return null
  return verifyAdminToken(token)
}

// ─── Cookie options ───────────────────────────────────────────────────────────

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  path: '/',
}
