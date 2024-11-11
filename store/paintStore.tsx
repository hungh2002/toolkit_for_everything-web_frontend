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
    boardSize: { width: 700, height: 700 },
    brush: { lineWidth: 1, lineColor: "#000000", lineCap: LineCap.ROUND },
  },
  update: (newData) =>
    set((state) => ({
      paint: {
        boardSize: (Object.hasOwn(newData, "boardSize")
          ? { ...newData.boardSize }
          : { ...state.paint.boardSize }) as { width: number; height: number },
        brush: (Object.hasOwn(newData, "brush")
          ? {
              lineWidth: Object.hasOwn(newData, "lineWidth")
                ? newData.brush?.lineWidth
                : state.paint.brush.lineWidth,
              lineColor: Object.hasOwn(newData, "lineColor")
                ? newData.brush?.lineColor
                : state.paint.brush.lineColor,
              lineCap: Object.hasOwn(newData, "lineCap")
                ? newData.brush?.lineCap
                : state.paint.brush.lineCap,
            }
          : { ...state.paint.brush }) as {
          lineWidth: number;
          lineColor: string;
          lineCap: LineCap;
        },
      },
    })),
}));
