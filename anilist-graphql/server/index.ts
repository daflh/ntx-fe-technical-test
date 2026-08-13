import cookieParser from 'cookie-parser'
import express from 'express'
import { PORT } from './config/env.js'
import { adminRouter } from './routes/admin.routes.js'
import { authRouter } from './routes/auth.routes.js'
import { favoritesRouter } from './routes/favorites.routes.js'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use('/api/favorites', favoritesRouter)

app.get('/api/health', (_req, res) => {
  res.status(200).json({ ok: true })
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] mock auth server listening on http://localhost:${PORT}`)
})
