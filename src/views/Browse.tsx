import { useState, useCallback } from 'react'
import { useAppStore } from '../lib/store'
// Removed unused import: useFarcasterContext

const MOCK_COLLECTIONS = [
  {
    id: '1',
    name: 'Lofi Beats',
    description: 'Chill lo-fi hip hop beats for studying',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    creator: 'lofi_master',
    creatorFid: '12345',
    supply: '50',
    mintPrice: '0.001',
    tracks: [
      { id: 't1', title: 'Midnight Study', artist: 'lofi_master', duration: 225, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { id: 't2', title: 'Rainy Night', artist: 'lofi_master', duration: 252, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
      { id: 't3', title: 'Coffee Break', artist: 'lofi_master', duration: 208, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    ]
  },
  {
    id: '2',
    name: 'Ambient Dreams',
    description: 'Ethereal ambient soundscapes',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    creator: 'ambient_vibes',
    creatorFid: '12346',
    supply: '75',
    mintPrice: '0.0008',
    tracks: [
      { id: 't4', title: 'Floating', artist: 'ambient_vibes', duration: 330, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { id: 't5', title: 'Serenity', artist: 'ambient_vibes', duration: 285, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    ]
  },
  {
    id: '3',
    name: 'Synthwave Vibes',
    description: '80s synth nostalgia meets modern production',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    creator: 'synth_lord',
    creatorFid: '12347',
    supply: '100',
    mintPrice: '0.0015',
    tracks: [
      { id: 't6', title: 'Neon Nights', artist: 'synth_lord', duration: 255, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
      { id: 't7', title: 'Retro Future', artist: 'synth_lord', duration: 235, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { id: 't8', title: 'Electric Dreams', artist: 'synth_lord', duration: 270, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    ]
  },
]

type Track = typeof MOCK_COLLECTIONS[0]['tracks'][0]

// Simple helper to display seconds as M:SS for the UI
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function Browse() {
  const [selectedCollection, setSelectedCollection] = useState<typeof MOCK_COLLECTIONS[0] | null>(null)
  const { playerPlay, queueForMint } = useAppStore()
  // Removed unused user variable to satisfy tsc -b

  const handlePlayTrack = useCallback((track: Track) => {
    playerPlay({ 
      id: track.id, 
      title: track.title, 
      artist: track.artist, 
      audioUrl: track.audioUrl,
      duration: track.duration // Now correctly passing a number
    })
  }, [playerPlay])

  const handleMintTrack = useCallback((collection: typeof MOCK_COLLECTIONS[0], track: Track) => {
    queueForMint({
      id: track.id,
      title: track.title,
      artist: track.artist,
      audioUrl: track.audioUrl,
      collectionId: collection.id,
      collectionName: collection.name,
    })
  }, [queueForMint])

  if (selectedCollection) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-4 p-4 border-b border-white/10">
          <button onClick={() => setSelectedCollection(null)} className="text-white/60 hover:text-white text-2xl">←</button>
          <img src={selectedCollection.imageUrl} alt={selectedCollection.name} className="w-12 h-12 rounded-lg object-cover" />
          <div className="flex-1">
            <h2 className="font-bold text-white">{selectedCollection.name}</h2>
            <p className="text-xs text-white/50">by @{selectedCollection.creator}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-white/10">
            {selectedCollection.tracks.map((track) => (
              <div key={track.id} className="flex items-center gap-3 p-3 hover:bg-white/5 transition">
                <button
                  onClick={() => handlePlayTrack(track)}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white text-xs"
                >
                  ▶
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{track.title}</p>
                  <p className="text-xs text-white/40 truncate">{track.artist} • {formatTime(track.duration)}</p>
                </div>
                <button
                  onClick={() => handleMintTrack(selectedCollection, track)}
                  className="flex-shrink-0 px-3 py-1 text-xs font-medium rounded-lg bg-purple-500/20 border border-purple-500/50 text-purple-300 hover:bg-purple-500/30 transition"
                >
                  Mint
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      <div>
        <h1 className="text-xl font-bold text-white mb-2">Music NFT Collections</h1>
        <p className="text-sm text-white/60">Discover and mint music NFTs from creators</p>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto">
        {MOCK_COLLECTIONS.map((collection) => (
          <div
            key={collection.id}
            onClick={() => setSelectedCollection(collection)}
            className="cursor-pointer group"
          >
            <div className="relative mb-2 rounded-lg overflow-hidden aspect-square bg-white/5 hover:opacity-75 transition">
              <img src={collection.imageUrl} alt={collection.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end">
                <button className="w-8 h-8 mx-auto mb-2 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  ▶
                </button>
              </div>
            </div>
            <p className="font-medium text-sm text-white truncate">{collection.name}</p>
            <p className="text-xs text-white/50 truncate">@{collection.creator}</p>
            <p className="text-xs text-purple-400 mt-1">{collection.tracks.length} tracks</p>
          </div>
        ))}
      </div>
    </div>
  )
}
