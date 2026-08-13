import type { CookieOptions, Request, Response } from 'express'
import { ACCESS_TOKEN_TTL_MS, REFRESH_TOKEN_TTL_MS } from '../config/env.js'
import { findUserByCredentials, findUserById } from '../data/demoUsers.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/tokens.js'

const ACCESS_COOKIE = 'access_token'
const REFRESH_COOKIE = 'refresh_token'

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  // secure:false because the local dev server runs over plain http. A real
  // deployment behind https must set secure:true.
  secure: false,
}

function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
  res.cookie(ACCESS_COOKIE, accessToken, {
    ...baseCookieOptions,
    path: '/',
    maxAge: ACCESS_TOKEN_TTL_MS,
  })
  // Refresh cookie is scoped narrowly to the one endpoint that needs it,
  // reducing the surface it's sent on.
  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...baseCookieOptions,
    path: '/api/auth/refresh',
    maxAge: REFRESH_TOKEN_TTL_MS,
  })
}

function clearAuthCookies(res: Response): void {
  res.clearCookie(ACCESS_COOKIE, { ...baseCookieOptions, path: '/' })
  res.clearCookie(REFRESH_COOKIE, { ...baseCookieOptions, path: '/api/auth/refresh' })
}

export function login(req: Request, res: Response): void {
  const { username, password } = req.body ?? {}

  if (typeof username !== 'string' || typeof password !== 'string') {
    res.status(400).json({ message: 'username and password are required.' })
    return
  }

  const user = findUserByCredentials(username, password)
  if (!user) {
    res.status(401).json({ message: 'Invalid username or password.' })
    return
  }

  const accessToken = signAccessToken(user)
  const refreshToken = signRefreshToken(user)
  setAuthCookies(res, accessToken, refreshToken)

  res.status(200).json({ id: user.id, username: user.username, role: user.role })
}

export function refresh(req: Request, res: Response): void {
  const token = req.cookies?.[REFRESH_COOKIE] as string | undefined

  if (!token) {
    clearAuthCookies(res)
    res.status(401).json({ message: 'No refresh token.' })
    return
  }

  try {
    const payload = verifyRefreshToken(token)
    const user = findUserById(payload.sub)
    if (!user) {
      clearAuthCookies(res)
      res.status(401).json({ message: 'User no longer exists.' })
      return
    }

    const accessToken = signAccessToken(user)
    res.cookie(ACCESS_COOKIE, accessToken, {
      ...baseCookieOptions,
      path: '/',
      maxAge: ACCESS_TOKEN_TTL_MS,
    })
    res.status(200).json({ ok: true })
  } catch {
    clearAuthCookies(res)
    res.status(401).json({ message: 'Refresh token invalid or expired.' })
  }
}

export function logout(_req: Request, res: Response): void {
  clearAuthCookies(res)
  res.status(200).json({ ok: true })
}

export function me(req: Request, res: Response): void {
  // requireAuth middleware already validated the access token and attached req.user
  const user = findUserById(req.user!.sub)
  if (!user) {
    res.status(401).json({ message: 'User no longer exists.' })
    return
  }
  res.status(200).json({ id: user.id, username: user.username, role: user.role })
}
