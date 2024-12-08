import { create } from "zustand";

export interface UserState {
  userTableIsOpen: boolean;
  isActive: boolean;
  userId: number;
  userName: string;
  update: {
    userTableIsOpen: (isOpen: boolean) => void;
    signIn: (newUser: { userId: number; userName: string }) => void;
    signOut: () => void;
  };
}

export const useUserStore = create<UserState>()((set) => ({
  userTableIsOpen: false,
  isActive: false,
  userId: -1,
  userName: "",
  update: {
    userTableIsOpen: (isOpen: boolean) => set({ userTableIsOpen: isOpen }),
    signIn: (newUser) => {
      localStorage.setItem("user", JSON.stringify(newUser));

      set({
        userId: newUser.userId,
        userName: newUser.userName,
        isActive: true,
      });
    },
    signOut: () => {
      localStorage.removeItem("user");
      set({ isActive: false });
    },
  },
}));
