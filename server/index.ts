import express from 'express'
import cors from 'cors'
import collectionRouter from './routes/collections.js'
import mintRouter from './routes/mint.js'
import ogRouter from './routes/og.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '50mb' }))

// Routes
app.use('/api/collections', collectionRouter)
app.use('/api/mint', mintRouter)
app.use('/api/og', ogRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'zaounz-api' })
})

app.listen(PORT, () => {
  console.log(`ZAOUNZ API running on port ${PORT}`)
})