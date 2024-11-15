import { create } from "zustand";

export enum PaintAction {
  NONE = "NONE",
  START = "START",
  MOVE = "MOVE",
  END = "END",
}

interface PaintState {
  action: PaintAction;
  position: {
    root: { x: number; y: number };
    current: { x: number; y: number };
  };
  isSendWebSocketMessage: boolean;
  update: {
    position: (
      newAction: PaintAction,
      newPosition: Partial<{
        [key: string]: { x: number; y: number };
        root: { x: number; y: number };
        current: { x: number; y: number };
      }>,
      newIsSendWebSocketMessage: boolean
    ) => void;
    isSendWebSocketMessage: (newIsSendWebSocketMessage: boolean) => void;
  };
}

export const usePaintStore = create<PaintState>()((set) => ({
  action: PaintAction.NONE,
  position: {
    root: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
  },
  isSendWebSocketMessage: false,
  update: {
    position: (newAction, newPosition, newIsSendWebSocketMessage) => {
      if (newPosition) {
        for (const [key, value] of Object.entries(newPosition)) {
          if (!value) {
            delete newPosition[key];
          }
        }
      }

      set((state) => ({
        action: newAction,
        position: { ...state.position, ...newPosition },
        isSendWebSocketMessage: newIsSendWebSocketMessage,
      }));
    },
    isSendWebSocketMessage: (newIsSendWebSocketMessage: boolean) =>
      set({ isSendWebSocketMessage: newIsSendWebSocketMessage }),
  },
}));
