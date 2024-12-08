import { create } from "zustand";

export interface NoteCommandState {
  save: boolean;
  update: {
    save: (run: boolean) => void;
  };
}

export const useNoteCommandStore = create<NoteCommandState>()((set) => ({
  save: false,
  update: {
    save: (run) => set({ save: run }),
  },
}));
