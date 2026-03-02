import { Router } from 'express'
import axios from 'axios'

const router = Router()
const MINT_CLUB_API = 'https://api.mint.club/v1'
const MINT_CLUB_API_KEY = process.env.MINT_CLUB_API_KEY

// Mock collections store (in production, use database)
const collections: Map<string, any> = new Map()

// Create collection
router.post('/create', async (req, res) => {
  try {
    const { name, description, imageUrl, creator, creatorFid } = req.body

    if (!name || !description) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // In MVP: just store in memory (no mint.club integration yet)
    const collectionId = Math.random().toString(36).substr(2, 9)
    collections.set(collectionId, {
      id: collectionId,
      name,
      description,
      imageUrl,
      creator,
      creatorFid,
      createdAt: new Date(),
      tracks: [],
    })

    res.json({ id: collectionId, success: true })
  } catch (error) {
    console.error('Collection creation error:', error)
    res.status(500).json({ error: 'Creation failed' })
  }
})

// Get all collections
router.get('/', (_req, res) => {
  const cols = Array.from(collections.values())
  res.json({ collections: cols })
})

// Get single collection
router.get('/:id', (req, res) => {
  const collection = collections.get(req.params.id)
  if (!collection) {
    return res.status(404).json({ error: 'Collection not found' })
  }
  res.json(collection)
})

export default router