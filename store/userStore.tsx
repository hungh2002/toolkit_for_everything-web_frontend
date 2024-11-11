import { create } from "zustand";

export type User = { isActive: boolean; id: number; name: string };

interface UserState {
  user: User;
  signIn: (newUser: { id: number; name: string }) => void;
  signOut: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: { isActive: false, id: 0, name: "" },
  signIn: (newUser) => set({ user: { ...newUser, isActive: true } }),
  signOut: () => set((state) => ({ user: { ...state.user, isActive: false } })),
}));
