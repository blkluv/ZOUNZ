import { useState } from 'react'
import { useAppStore } from '../lib/store'
import { useFarcasterContext } from '../providers/FarcasterProvider'

export default function Create() {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [collectionName, setCollectionName] = useState('')
  const [collectionDescription, setCollectionDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const { user } = useFarcasterContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!collectionName.trim() || !collectionDescription.trim()) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/collections/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: collectionName,
          description: collectionDescription,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
          creator: user?.username || 'anonymous',
          creatorFid: user?.fid || '0',
        }),
      })

      if (!res.ok) throw new Error('Failed to create collection')
      
      setStep('success')
      setTimeout(() => {
        setCollectionName('')
        setCollectionDescription('')
        setImageUrl('')
        setStep('form')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Creation failed')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-3xl">
          ✓
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Collection Created!</h2>
          <p className="text-sm text-white/60 mt-2">"{collectionName}" is ready for NFT minting</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 h-full">
      <div>
        <h1 className="text-lg font-bold text-white">Create Collection</h1>
        <p className="text-sm text-white/60 mt-1">Start a new music NFT collection</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <div>
          <label className="block text-xs font-medium text-white/80 mb-2">Collection Name</label>
          <input
            type="text"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            placeholder="e.g., Summer Beats 2026"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/80 mb-2">Description</label>
          <textarea
            value={collectionDescription}
            onChange={(e) => setCollectionDescription(e.target.value)}
            placeholder="Tell creators about this collection..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/80 mb-2">Cover Image URL (optional)</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10"
          />
        </div>

        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-white/60">Creator</p>
          <p className="text-sm font-medium text-white">@{user?.username || 'anonymous'}</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-xs">
            {error}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !collectionName.trim() || !collectionDescription.trim()}
        className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm hover:from-purple-400 hover:to-pink-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Creating...' : 'Create Collection'}
      </button>
    </form>
  )
}