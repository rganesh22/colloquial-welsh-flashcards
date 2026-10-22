require('dotenv').config()

const express = require('express')
const admin = require('firebase-admin')

const PORT = Number(process.env.PORT) || 8080
const PROJECT_ID = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || 'learn-welsh-vocab'

// On Cloud Run, Application Default Credentials are provided automatically.
// Locally, set GOOGLE_APPLICATION_CREDENTIALS to a service-account JSON path,
// or run: gcloud auth application-default login
admin.initializeApp({
  projectId: PROJECT_ID,
})

const db = admin.firestore()
const app = express()

app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true, projectId: PROJECT_ID })
})

/**
 * GET /api/vocab
 * Public vocabulary list from Firestore collection `vocab`.
 * Optional query: ?lessonId=1a&bookId=colloquial
 */
app.get('/api/vocab', async (req, res) => {
  try {
    let query = db.collection('vocab')

    if (typeof req.query.bookId === 'string' && req.query.bookId) {
      query = query.where('bookId', '==', req.query.bookId)
    }
    if (typeof req.query.lessonId === 'string' && req.query.lessonId) {
      query = query.where('lessonId', '==', req.query.lessonId)
    }

    const snap = await query.get()
    const items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json({ items, count: items.length })
  } catch (err) {
    console.error('GET /api/vocab failed', err)
    res.status(500).json({ error: 'Failed to load vocabulary' })
  }
})

/**
 * Middleware: require `Authorization: Bearer <Firebase ID token>`.
 */
async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const match = header.match(/^Bearer\s+(.+)$/i)
  if (!match) {
    return res.status(401).json({ error: 'Missing Authorization Bearer token' })
  }

  try {
    const decoded = await admin.auth().verifyIdToken(match[1])
    req.user = decoded
    return next()
  } catch (err) {
    console.error('Auth verification failed', err.message)
    return res.status(401).json({ error: 'Invalid or expired ID token' })
  }
}

/**
 * POST /api/progress
 * Body: { progress: object, settings?: object }
 * Writes to users/{uid}/data/progress (secured by verified Firebase Auth UID).
 */
app.post('/api/progress', requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid
    const { progress, settings } = req.body || {}

    if (progress === undefined || typeof progress !== 'object' || progress === null) {
      return res.status(400).json({ error: 'Body must include a progress object' })
    }

    const payload = {
      progress,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: uid,
    }
    if (settings !== undefined) {
      payload.settings = settings
    }

    await db.collection('users').doc(uid).collection('data').doc('progress').set(payload, {
      merge: true,
    })

    res.json({ ok: true, uid })
  } catch (err) {
    console.error('POST /api/progress failed', err)
    res.status(500).json({ error: 'Failed to save progress' })
  }
})

/**
 * GET /api/progress — load the signed-in user's saved progress.
 */
app.get('/api/progress', requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid
    const doc = await db.collection('users').doc(uid).collection('data').doc('progress').get()
    if (!doc.exists) {
      return res.json({ progress: {}, settings: null })
    }
    const data = doc.data() || {}
    res.json({
      progress: data.progress || {},
      settings: data.settings ?? null,
      updatedAt: data.updatedAt ?? null,
    })
  } catch (err) {
    console.error('GET /api/progress failed', err)
    res.status(500).json({ error: 'Failed to load progress' })
  }
})

app.listen(PORT, () => {
  console.log(`Learn Welsh Vocab API listening on port ${PORT}`)
})
