import { type StateCreator } from "zustand";

export interface RemixEntry {
  id: string; // DB row ID (from server)
  name: string;
  prompt?: string;
  remoteId: string; // World Labs world ID
  thumbnail?: string; // fetched client-side from metadata API
}

export interface RemixTransitionState {
  isActive: boolean;
  progress: number;
  origin: [number, number, number];
  currentSplatUrl: string | null;
  nextSplatUrl: string | null;
}

export interface RemixSlice {
  // State
  remixes: RemixEntry[];
  remixTransition: RemixTransitionState;
  remixPreviewImage: string | null;
  skipNextReveal: boolean;

  // Actions
  setRemixes: (remixes: RemixEntry[]) => void;
  addRemix: (remix: RemixEntry) => void;
  removeRemix: (id: string) => void;
  setRemixThumbnail: (remixId: string, thumbnailUrl: string) => void;
  setRemixTransition: (partial: Partial<RemixTransitionState>) => void;
  finalizeRemixTransition: () => void;
  setRemixPreviewImage: (image: string | null) => void;
  setSkipNextReveal: (flag: boolean) => void;
}

export const createRemixSlice: StateCreator<RemixSlice, [], [], RemixSlice> = (
  set,
) => ({
  remixes: [],
  remixTransition: {
    isActive: false,
    progress: 0,
    origin: [0, 0, 0],
    currentSplatUrl: null,
    nextSplatUrl: null,
  },
  remixPreviewImage: null,
  skipNextReveal: false,

  setRemixes: (remixes) => set({ remixes }),

  addRemix: (remix) =>
    set((state) => {
      if (state.remixes.some((r) => r.id === remix.id)) return state;
      return { remixes: [...state.remixes, remix] };
    }),

  removeRemix: (id) =>
    set((state) => ({
      remixes: state.remixes.filter((r) => r.id !== id),
    })),

  setRemixThumbnail: (remixId, thumbnailUrl) =>
    set((state) => ({
      remixes: state.remixes.map((r) =>
        r.id === remixId ? { ...r, thumbnail: thumbnailUrl } : r,
      ),
    })),

  setRemixTransition: (partial) =>
    set((state) => ({
      remixTransition: { ...state.remixTransition, ...partial },
    })),

  finalizeRemixTransition: () =>
    set({
      remixTransition: {
        isActive: false,
        progress: 0,
        origin: [0, 0, 0],
        currentSplatUrl: null,
        nextSplatUrl: null,
      },
    }),

  setRemixPreviewImage: (image) => set({ remixPreviewImage: image }),

  setSkipNextReveal: (flag) => set({ skipNextReveal: flag }),
});
