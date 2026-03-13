import { createContext, useContext } from 'react'

export type MintableTrack = {
  id: string | number; // Fixes 'string not assignable to number' error
  title: string;
  artist: string;
  audioUrl: string;
  artworkUrl?: string;
  source?: string;
  genre?: string;
  audiusTrackId?: string | number; // ADDED: Fixes Discover.tsx error
  collectionId?: string;
  collectionName?: string;
  duration?: number;
}

export type PlayerState = {
  track: MintableTrack | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
}

export interface AppContextType {
  mintQueue: MintableTrack | null;
  player: PlayerState;
  setTab: (tab: string) => void;
  queueForMint: (track: MintableTrack) => void;
  clearMintQueue: () => void;
  playerPlay: (track: MintableTrack) => void;
  playerPause: () => void;
  playerStop: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within AppContext.Provider');
  }
  return context;
}
