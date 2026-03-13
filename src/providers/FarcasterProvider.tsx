import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import sdk from '@farcaster/frame-sdk'

interface FarcasterUser {
  fid: number
  username: string
  displayName: string
  pfpUrl: string
  custody_address: string // ADDED: Required for Minting logic
}

interface FarcasterContextType {
  user: FarcasterUser | null
  isReady: boolean
  isInMiniApp: boolean
  openUrl: (url: string) => void
  composeCast: (params: { text: string; embeds?: string[] }) => void // UPDATED: Matches your Mint.tsx usage
  close: () => void
}

const FarcasterContext = createContext<FarcasterContextType>({
  user: null,
  isReady: false,
  isInMiniApp: false,
  openUrl: () => {},
  composeCast: () => {},
  close: () => {},
})

export function useFarcasterContext() {
  return useContext(FarcasterContext)
}

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FarcasterUser | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isInMiniApp, setIsInMiniApp] = useState(false)

  useEffect(() => {
    async function init() {
      try {
        const context = await sdk.context
        if (context?.user) {
          setUser({
            fid: context.user.fid,
            username: context.user.username ?? '',
            displayName: context.user.displayName ?? '',
            pfpUrl: context.user.pfpUrl ?? '',
            // ADDED: Pulling custody address from SDK context
            custody_address: context.user.custody_address ?? '0x0',
          })
          setIsInMiniApp(true)
        }
      } catch {
        console.log('Not in Farcaster Mini App, running in dev mode')
      }

      sdk.actions.ready()
      setIsReady(true)
    }

    init()
  }, [])

  const openUrl = useCallback((url: string) => {
    if (isInMiniApp) {
      sdk.actions.openUrl(url)
    } else {
      window.open(url, '_blank')
    }
  }, [isInMiniApp])

  // UPDATED: Now accepts an object to match Mint.tsx handleCast usage
  const composeCast = useCallback(({ text, embeds }: { text: string; embeds?: string[] }) => {
    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}${
      embeds?.length ? `&embeds[]=${embeds.map(encodeURIComponent).join('&embeds[]=')}` : ''
    }`

    if (isInMiniApp) {
      sdk.actions.openUrl(url)
    } else {
      window.open(url, '_blank')
    }
  }, [isInMiniApp])

  const close = useCallback(() => {
    if (isInMiniApp) {
      sdk.actions.close()
    }
  }, [isInMiniApp])

  return (
    <FarcasterContext.Provider value={{ user, isReady, isInMiniApp, openUrl, composeCast, close }}>
      {children}
    </FarcasterContext.Provider>
  )
}