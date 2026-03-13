import { useState } from 'react'
import { useAudiusTrending, useAudiusUnderground, useAudiusSearch, getStreamUrl, formatDuration, type AudiusTrack } from '../hooks/useAudius'
import { useAppStore } from '../lib/store'
import { useFarcasterContext } from '../providers/FarcasterProvider'

const GENRES = ['All', 'Electronic', 'Hip-Hop/Rap', 'Lo-fi', 'Pop', 'Rock', 'R&B/Soul', 'Ambient', 'House', 'Drum & Bass']

type Feed = 'underground' | 'trending' | 'search'

export default function Discover() {
  const [feed, setFeed] = useState<Feed>('underground')
  const [genre, setGenre] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const { player, playerPlay, playerPause, queueForMint } = useAppStore()

  const underground = useAudiusUnderground()
  const trending = useAudiusTrending(genre)
  const searchHook = useAudiusSearch()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setFeed('search')
      searchHook.search(searchQuery)
    }
  }

  const activeTracks: AudiusTrack[] =
    feed === 'underground' ? underground.tracks :
    feed === 'trending' ? trending.tracks :
    searchHook.results

  const isLoading =
    feed === 'underground' ? underground.loading :
    feed === 'trending' ? trending.loading :
    searchHook.loading

  const handleTogglePlay = (track: AudiusTrack) => {
    // Explicitly stringify the ID to match MintableTrack type
    const trackId = track.id.toString()
    
    if (player.isPlaying && player.track?.id === trackId) {
      playerPause()
    } else {
      const artwork = track.artwork?.['480x480'] ?? track.artwork?.['150x150']
      playerPlay({
        id: trackId,
        title: track.title,
        artist: track.user.name,
        audioUrl: getStreamUrl(track.id), // API helper usually handles number/string
        artworkUrl: artwork,
        source: 'audius',
        genre: track.genre,
        duration: track.duration,
        audiusTrackId: trackId,
      })
    }
  }

  const handleMint = (track: AudiusTrack) => {
    const artwork = track.artwork?.['480x480'] ?? track.artwork?.['150x150']
    queueForMint({
      id: track.id.toString(),
      title: track.title,
      artist: track.user.name,
      audioUrl: getStreamUrl(track.id),
      artworkUrl: artwork,
      source: 'audius',
      genre: track.genre,
      duration: track.duration,
      audiusTrackId: track.id.toString(),
    })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 pb-0">
        <h2 className="text-xl font-bold">Discover</h2>
        <p className="text-sm text-white/50 mt-1">Hidden gems from Audius</p>
      </div>

      <form onSubmit={handleSearch} className="px-4 mt-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks, artists..."
            className="flex-1 bg-[var(--zaounz-card)] border border-[var(--zaounz-border)] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-purple-500 rounded-xl text-sm font-medium active:scale-95 transition-transform"
          >
            Go
          </button>
        </div>
      </form>

      <div className="flex gap-1.5 px-4 mt-3">
        {(['underground', 'trending'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFeed(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              feed === f
                ? 'bg-purple-500 text-white'
                : 'bg-[var(--zaounz-card)] text-white/40 hover:text-white/60'
            }`}
          >
            {f === 'underground' ? '💎 Hidden Gems' : '🔥 Trending'}
          </button>
        ))}
        {feed === 'search' && (
          <span className="px-3 py-1.5 rounded-xl text-xs font-medium bg-purple-500 text-white">
            🔍 Results
          </span>
        )}
      </div>

      {feed === 'trending' && (
        <div className="flex gap-1.5 px-4 mt-2 overflow-x-auto pb-1">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-all ${
                genre === g
                  ? 'bg-pink-500 text-white'
                  : 'bg-[var(--zaounz-card)] text-white/35 border border-[var(--zaounz-border)]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 mt-3 pb-4 space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[var(--zaounz-card)] rounded-xl p-3 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white/5" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-white/5 rounded w-3/4" />
                    <div className="h-2.5 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activeTracks.length === 0 ? (
          <div className="text-center py-16 text-white/25 text-sm">No tracks found</div>
        ) : (
          activeTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              isPlaying={player.isPlaying && player.track?.id === track.id.toString()}
              onTogglePlay={() => handleTogglePlay(track)}
              onMint={() => handleMint(track)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function TrackCard({
  track,
  isPlaying,
  onTogglePlay,
  onMint,
}: {
  track: AudiusTrack
  isPlaying: boolean
  onTogglePlay: () => void
  onMint: () => void
}) {
  const artwork = track.artwork?.['150x150'] ?? track.artwork?.['480x480']
  const { composeCast } = useFarcasterContext()

  return (
    <div className={`bg-[var(--zaounz-card)] border rounded-xl p-3 transition-all ${
      isPlaying ? 'border-purple-500/40' : 'border-[var(--zaounz-border)]'
    }`}>
      <div className="flex gap-3">
        <button
          onClick={onTogglePlay}
          className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 active:scale-95 transition-transform"
        >
          {artwork ? (
            <img src={artwork} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-lg">~</div>
          )}
          <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
            isPlaying ? 'opacity-100' : 'opacity-0 hover:opacity-100'
          }`}>
            <span className="text-white text-sm font-bold">{isPlaying ? '⏸' : '▶'}</span>
          </div>
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{track.title}</p>
          <p className="text-xs text-white/40 truncate">{track.user.name}</p>
          <div className="flex items-center gap-2.5 mt-1 text-[10px] text-white/25">
            <span>▶ {track.play_count.toLocaleString()}</span>
            <span>♥ {track.favorite_count.toLocaleString()}</span>
            <span>{formatDuration(track.duration)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 mt-2.5">
        <button
          onClick={onMint}
          className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/15 to-pink-500/15 text-purple-300 text-[10px] font-semibold hover:from-purple-500/25 hover:to-pink-500/25 transition-all active:scale-[0.98]"
        >
          Mint NFT
        </button>
        <button
          onClick={() => composeCast({
            text: `Check out "${track.title}" by ${track.user.name} on @zaounz 🎵`,
            embeds: [`https://audius.co${track.permalink}`]
          })}
          className="flex-1 py-1.5 rounded-lg bg-white/5 text-white/40 text-[10px] font-medium hover:bg-white/10 transition-all active:scale-[0.98]"
        >
          Share
        </button>
        <a
          href={`https://audius.co${track.permalink}`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-1.5 px-2.5 rounded-lg bg-white/5 text-white/30 text-[10px] font-medium hover:bg-white/10 transition-all"
        >
          ↗
        </a>
      </div>
    </div>
  )
}
