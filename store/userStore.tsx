import { create } from "zustand";

export type User = {
  isActive: boolean;
  deviceId: number;
  userId: number;
  userName: string;
};

interface UserState {
  user: User;
  signIn: (newUser: { userId: number; userName: string }) => void;
  signOut: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: {
    isActive: false,
    deviceId: 0,
    userId: 0,
    userName: "",
  },
  signIn: (newUser) =>
    set({
      user: {
        ...newUser,
        deviceId: Date.now(),
        isActive: true,
      },
    }),
  signOut: () => {
    localStorage.removeItem("user");
    set((state) => ({ user: { ...state.user, isActive: false } }));
  },
}));
