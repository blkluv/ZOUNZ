import { useState } from 'react'
// To be added: import { useCoins } from '@zoralabs/coins-sdk'
// To be added: import { useWallet } from '@solana/wallet-adapter-react'

interface TrendMarket {
  id: string
  name: string
  category: string
  price: number
  change24h: number
  volume: number
  holders: number
  address?: string // Added for live contract interaction
}

const MOCK_MARKETS: TrendMarket[] = [
  { id: '1', name: 'Lo-fi Revival', category: 'Genre', price: 0.42, change24h: 12.5, volume: 15200, holders: 89 },
  { id: '2', name: 'AI Music Wave', category: 'Trend', price: 1.24, change24h: -3.2, volume: 8900, holders: 156 },
  { id: '3', name: 'Onchain Beats', category: 'Movement', price: 0.18, change24h: 45.0, volume: 3200, holders: 42 },
  { id: '4', name: 'Farcaster Music', category: 'Community', price: 0.73, change24h: 8.1, volume: 6700, holders: 201 },
]

export default function Trade() {
  const [selectedMarket, setSelectedMarket] = useState<TrendMarket | null>(null)
  const [tradeAmount, setTradeAmount] = useState('')
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [isProcessing, setIsProcessing] = useState(false)

  // const { buyCoin, sellCoin } = useCoins()
  // const { connected, publicKey } = useWallet()

  const handleTrade = async () => {
    if (!selectedMarket || !tradeAmount) return
    
    setIsProcessing(true)
    try {
      // PROD LOGIC:
      // if (!connected) throw new Error("Connect Solana wallet first")
      // const tx = tradeType === 'buy' 
      //   ? await buyCoin(selectedMarket.address, tradeAmount)
      //   : await sellCoin(selectedMarket.address, tradeAmount)
      
      console.log(`${tradeType === 'buy' ? 'Buying' : 'Selling'} ${tradeAmount} SOL of "${selectedMarket.name}"`)
      
      // Simulate success
      setTimeout(() => {
        setIsProcessing(false)
        setSelectedMarket(null)
        setTradeAmount('')
        alert("Trade Successful!")
      }, 1500)
      
    } catch (err) {
      console.error(err)
      setIsProcessing(false)
    }
  }

  if (selectedMarket) {
    return (
      <div className="p-4 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedMarket(null)}
            className="w-8 h-8 rounded-lg bg-[var(--zaounz-card)] flex items-center justify-center text-white/50 hover:bg-white/10"
          >
            ←
          </button>
          <div>
            <h2 className="text-lg font-bold text-white">{selectedMarket.name}</h2>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono uppercase tracking-wider">
              {selectedMarket.category}
            </span>
          </div>
        </div>

        <div className="bg-[var(--zaounz-card)] border border-[var(--zaounz-border)] rounded-2xl p-5 shadow-xl">
          <p className="text-3xl font-bold text-white mb-1">{selectedMarket.price.toFixed(2)} SOL</p>
          <p className={`text-sm font-semibold ${selectedMarket.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {selectedMarket.change24h >= 0 ? '↗' : '↘'} {Math.abs(selectedMarket.change24h).toFixed(1)}% (24h)
          </p>
          <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-white/5 text-[10px] uppercase tracking-widest text-white/40">
            <div>
              <p>24h Volume</p>
              <p className="text-white mt-0.5">{selectedMarket.volume.toLocaleString()} SOL</p>
            </div>
            <div className="text-right">
              <p>Total Holders</p>
              <p className="text-white mt-0.5">{selectedMarket.holders}</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--zaounz-card)] border border-[var(--zaounz-border)] rounded-2xl p-4 space-y-4">
          <div className="flex rounded-xl bg-black/40 p-1">
            <button
              onClick={() => setTradeType('buy')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase transition-all ${
                tradeType === 'buy' ? 'bg-green-500 text-white shadow-lg' : 'text-white/30'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setTradeType('sell')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase transition-all ${
                tradeType === 'sell' ? 'bg-red-500 text-white shadow-lg' : 'text-white/30'
              }`}
            >
              Sell
            </button>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 px-1">
              <label className="text-[10px] uppercase font-bold text-white/40">Amount</label>
              <span className="text-[10px] text-purple-400 font-mono">Max: 1.5 SOL</span>
            </div>
            <div className="relative">
              <input
                value={tradeAmount}
                onChange={(e) => setTradeAmount(e.target.value)}
                type="number"
                placeholder="0.00"
                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 text-lg font-mono text-white focus:outline-none focus:border-purple-500/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-white/20">SOL</span>
            </div>
          </div>

          <button
            onClick={handleTrade}
            disabled={!tradeAmount || isProcessing}
            className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm text-white shadow-2xl transition-all active:scale-95 disabled:opacity-30 ${
              tradeType === 'buy' ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500 hover:bg-red-400'
            }`}
          >
            {isProcessing ? 'Processing...' : `${tradeType} ${selectedMarket.name}`}
          </button>
        </div>

        <p className="text-[9px] text-white/20 text-center uppercase tracking-tighter leading-relaxed">
          Attention Markets use a bonding curve.<br/>Early adopters benefit from trend discovery.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col gap-5 h-full overflow-y-auto">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white">Attention</h2>
          <p className="text-sm text-white/40 mt-0.5">Bet on music trends & genres</p>
        </div>
        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <span className="text-[10px] font-bold text-purple-400">SOLANA LIVE</span>
        </div>
      </div>

      <button className="w-full py-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white text-xs font-bold uppercase tracking-widest shadow-lg hover:shadow-purple-500/20 transition-all">
        + Create Trend Market (1 SOL)
      </button>

      <div className="space-y-3">
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">Top Movers</p>
        {MOCK_MARKETS.map((market) => (
          <button
            key={market.id}
            onClick={() => setSelectedMarket(market)}
            className="w-full bg-[var(--zaounz-card)] border border-white/5 rounded-2xl p-4 text-left hover:border-purple-500/30 hover:bg-white/[0.02] transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center text-lg">
                  {market.category === 'Genre' ? '🎵' : market.category === 'Trend' ? '📈' : '🌐'}
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{market.name}</p>
                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-tighter">
                    {market.holders} collectors
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono font-bold text-white">{market.price.toFixed(2)}</p>
                <p className={`text-[10px] font-bold ${market.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(1)}%
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
