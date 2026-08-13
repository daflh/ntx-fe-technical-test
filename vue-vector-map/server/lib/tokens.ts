import jwt from 'jsonwebtoken'
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_TTL,
} from '../config/env.js'
import type { DemoUser } from '../data/demoUsers.js'

export interface AccessTokenPayload {
  sub: number
  username: string
  role: DemoUser['role']
}

export interface RefreshTokenPayload {
  sub: number
}

export function signAccessToken(user: DemoUser): string {
  const payload: AccessTokenPayload = { sub: user.id, username: user.username, role: user.role }
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL })
}

export function signRefreshToken(user: DemoUser): string {
  const payload: RefreshTokenPayload = { sub: user.id }
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_TTL })
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as unknown as AccessTokenPayload
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as unknown as RefreshTokenPayload
}
