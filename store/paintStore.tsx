import { create } from "zustand";

export enum PaintAction {
  START = "START",
  MOVE = "MOVE",
  END = "END",
}

export enum LineCap {
  BUTT = "butt",
  ROUND = "round",
  SQUARE = "square",
}

export type Paint = {
  imageData: ImageData | null;
  boardSize: { width: number; height: number };
  brush: {
    lineWidth: number;
    lineColor: string;
    lineCap: LineCap;
  };
};

interface PaintState {
  paint: Paint;
  update: (newData: {
    imageData?: ImageData;
    boardSize?: { width: number; height: number };
    brush?: {
      lineWidth?: number;
      lineColor?: string;
      lineCap?: LineCap;
    };
  }) => void;
}

export const usePaintStore = create<PaintState>()((set) => ({
  paint: {
    imageData: null,
    boardSize: { width: 700, height: 700 },
    brush: { lineWidth: 1, lineColor: "#000000", lineCap: LineCap.ROUND },
  },
  update: (newData) => {
    const currentPaintStatus = usePaintStore.getState().paint;

    if (newData.imageData) {
      currentPaintStatus.imageData = newData.imageData!;
    }

    if (newData.boardSize) {
      currentPaintStatus.boardSize = newData.boardSize!;
    }

    if (newData.brush) {
      if (newData.brush?.lineColor) {
        currentPaintStatus.brush.lineColor = newData.brush.lineColor!;
      }

      if (newData.brush?.lineWidth) {
        currentPaintStatus.brush.lineWidth = newData.brush.lineWidth!;
      }

      if (newData.brush?.lineCap) {
        currentPaintStatus.brush.lineCap = newData.brush.lineCap!;
      }
    }

    set({ paint: { ...currentPaintStatus } });
  },
}));
