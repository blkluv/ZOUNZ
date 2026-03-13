import { useState, useEffect } from 'react'
import { useAppStore, type MintableTrack } from '../lib/store'
import { useFarcasterContext } from '../providers/FarcasterProvider'

export default function Mint() {
  const { mintQueue, clearMintQueue } = useAppStore()
  const { user, composeCast } = useFarcasterContext()
  const [step, setStep] = useState<'select' | 'configure' | 'minting' | 'success'>('select')
  const [track, setTrack] = useState<MintableTrack | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mintTx, setMintTx] = useState<{
    collectionId: string
    tokenId: string
    txHash: string
    baseUrl: string
  } | null>(null)
  const [config, setConfig] = useState({
    supply: '100',
    royaltyPercent: '10',
  })

  useEffect(() => {
    if (mintQueue) {
      setTrack(mintQueue)
      setStep('configure')
      clearMintQueue()
    }
  }, [mintQueue, clearMintQueue])

  const handleMint = async () => {
    if (!track) return
    setStep('minting')
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionId: track.collectionId,
          title: track.title,
          artist: track.artist,
          audioUrl: track.audioUrl,
          supply: config.supply,
          royaltyPercent: config.royaltyPercent,
          // FIX: Use custody_address for Farcaster users
          creatorAddress: user?.custody_address || '0x0',
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Minting failed')
      }

      const data = await res.json()
      setMintTx({
        collectionId: data.collectionId,
        tokenId: data.tokenId,
        txHash: data.txHash,
        baseUrl: data.baseUrl,
      })
      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Minting failed')
      setStep('configure')
    } finally {
      setLoading(false)
    }
  }

  const handleCast = async () => {
    if (!mintTx || !track) return
    try {
      // FIX: Ensure the object structure matches the Farcaster SDK expected type
      await composeCast({
        text: `Just minted "${track.title}" by ${track.artist} on ZAOUNZ! 🎵\n\nMint your own: ${mintTx.baseUrl}/collect/${mintTx.collectionId}/${mintTx.tokenId}`,
        embeds: [`${mintTx.baseUrl}/collect/${mintTx.collectionId}/${mintTx.tokenId}`],
      })
    } catch (err) {
      console.error('Failed to cast:', err)
    }
  }

  if (!track && step === 'select') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-4 text-center">
        <div className="text-4xl">🎵</div>
        <h2 className="text-lg font-bold text-white">No Track Selected</h2>
        <p className="text-sm text-white/60">Go to Browse or Create a collection,<br/>then select a track to mint</p>
      </div>
    )
  }

  if (step === 'success' && mintTx && track) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-3xl animate-bounce">
          ✓
        </div>
        <div className="text-center max-w-sm">
          <h2 className="text-xl font-bold text-white mb-1">NFT Minted!</h2>
          <p className="text-sm text-white/60 mb-4">"{track.title}" is now an NFT on Base</p>
          <a
            href={`https://basescan.org/tx/${mintTx.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-purple-400 hover:text-purple-300 break-all"
          >
            View on Basescan →
          </a>
        </div>

        <div className="w-full space-y-2">
          <button
            onClick={handleCast}
            className="w-full py-2 rounded-lg bg-[#5865F2] text-white font-medium text-sm hover:bg-[#4752C4] transition"
          >
            Share to Farcaster
          </button>
          <button
            onClick={() => {
              setMintTx(null)
              setTrack(null)
              setStep('select')
            }}
            className="w-full py-2 rounded-lg bg-white/5 border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition"
          >
            Mint Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleMint()
      }}
      className="flex flex-col gap-4 p-4 h-full"
    >
      <div>
        <h1 className="text-lg font-bold text-white">Mint NFT</h1>
        <p className="text-sm text-white/60 mt-1">Configure and mint your track as an NFT on Base</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {track && (
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-white/60 mb-2">Track</p>
            <p className="text-sm font-medium text-white">{track.title}</p>
            <p className="text-xs text-white/50">{track.artist}</p>
            {track.collectionName && (
               <p className="text-xs text-purple-400 mt-1">Collection: {track.collectionName}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-white/80 mb-2">Supply (Number of NFTs)</label>
          <input
            type="number"
            value={config.supply}
            onChange={(e) => setConfig({ ...config, supply: e.target.value })}
            min="1"
            max="10000"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/80 mb-2">Royalty %</label>
          <input
            type="number"
            value={config.royaltyPercent}
            onChange={(e) => setConfig({ ...config, royaltyPercent: e.target.value })}
            min="0"
            max="50"
            step="0.5"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10"
          />
          <p className="text-xs text-white/40 mt-1">You'll earn {config.royaltyPercent}% on secondary sales</p>
        </div>

        <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-300 text-xs">
          ℹ️ Minting on <strong>Base</strong> network. Gas fees are minimal (~$0.01-$0.10)
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-xs">
            {error}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!track || loading}
        className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm hover:from-purple-400 hover:to-pink-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Minting...' : step === 'minting' ? 'Processing...' : 'Mint NFT'}
      </button>
    </form>
  )
}
