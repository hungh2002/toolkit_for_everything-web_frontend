import { create } from "zustand";

export enum LineCap {
  BUTT = "butt",
  ROUND = "round",
  SQUARE = "square",
}

interface CanvasState {
  imageData: ImageData | null;
  boardSize: { width: number; height: number };
  brush: {
    lineWidth: number;
    lineColor: string;
    lineCap: LineCap;
  };
  isSendWebSocketMessage: boolean;
  update: {
    imageData: (
      newImageData: ImageData,
      newIsSendWebSocketMessage: boolean
    ) => void;
    boardSize: (
      newBoardSize: { width: number; height: number },
      newIsSendWebSocketMessage: boolean
    ) => void;
    brush: (
      newBrush: Partial<{
        [key: string]: string | number | LineCap;
        lineWidth: number;
        lineColor: string;
        lineCap: LineCap;
      }>,
      newIsSendWebSocketMessage: boolean
    ) => void;
    isSendWebSocketMessage: (newIsSendWebSocketMessage: boolean) => void;
  };
}

export const useCanvasStore = create<CanvasState>()((set) => ({
  imageData: null,
  boardSize: { width: 700, height: 700 },
  brush: { lineWidth: 1, lineColor: "#000000", lineCap: LineCap.ROUND },
  isSendWebSocketMessage: false,
  update: {
    imageData: (newImageData, newIsSendWebSocketMessage) =>
      set({
        imageData: newImageData,
        isSendWebSocketMessage: newIsSendWebSocketMessage,
      }),
    boardSize: (newBoardSize, newIsSendWebSocketMessage) =>
      set({
        boardSize: newBoardSize,
        isSendWebSocketMessage: newIsSendWebSocketMessage,
      }),
    brush: (newBrush, newIsSendWebSocketMessage) => {
      for (const [key, value] of Object.entries(newBrush)) {
        if (!value) {
          delete newBrush[key];
        }
      }

      set((state) => ({
        brush: { ...state.brush, ...newBrush },
        isSendWebSocketMessage: newIsSendWebSocketMessage,
      }));
    },
    isSendWebSocketMessage: (newIsSendWebSocketMessage: boolean) =>
      set({ isSendWebSocketMessage: newIsSendWebSocketMessage }),
  },
}));
