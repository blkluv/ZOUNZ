import { createContext, useContext } from 'react'

export type MintableTrack = {
  id: string | number; // Changed to allow both to fix Discover.tsx error
  title: string;
  artist: string;
  audioUrl: string;
  artworkUrl?: string; // Added for MiniPlayer
  source?: string;     // Added for MiniPlayer
  collectionId?: string;
  collectionName?: string;
  duration?: number;   // Changed to number for math operations
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
