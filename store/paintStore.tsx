import { create } from "zustand";

export enum PaintAction {
  NONE = "NONE",
  START = "START",
  MOVE = "MOVE",
}

export type Paint = {
  action: PaintAction;
  boardSize: { width: number; height: number };
  brush: {
    lineWidth: number;
    lineColor: string;
    lineCap: "butt" | "round" | "square";
  };
  position: {
    root: { x: number; y: number };
    current: { x: number; y: number };
  };
};

interface PaintState {
  paint: Paint;
  update: (newData: {
    boardSize?: { width: number; height: number };
    brush?: {
      lineWidth: number;
      lineColor: string;
      lineCap: "butt" | "round" | "square";
    };
  }) => void;
  paintUpdate: (newData: {
    action: PaintAction;
    position?: {
      root?: { x: number; y: number };
      current?: { x: number; y: number };
    };
  }) => void;
}

export const usePaintStore = create<PaintState>()((set) => ({
  paint: {
    isPaint: false,
    action: PaintAction.NONE,
    boardSize: { width: 700, height: 700 },
    brush: { lineWidth: 1, lineColor: "#000000", lineCap: "round" },
    position: {
      root: { x: 0, y: 0 },
      current: { x: 0, y: 0 },
    },
  },
  update: (newData) =>
    set((state) => ({ paint: { ...state.paint, ...newData } })),
  paintUpdate: (newData) =>
    set((state) => ({
      paint: {
        ...state.paint,
        action: newData.action,
        position: { ...state.paint.position, ...newData.position },
      },
    })),
}));
