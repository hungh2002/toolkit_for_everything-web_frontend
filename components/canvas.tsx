"use client";
import { useCanvasStore } from "@/store/canvasStore";
import { PaintAction, usePaintStore } from "@/store/paintStore";
import { useUserStore } from "@/store/userStore";
import { useEffect, useRef, useState } from "react";

const Canvas = () => {
  const user = useUserStore((state) => state.user);
  const canvasState = useCanvasStore((state) => state);
  const paint = usePaintStore((state) => state);
  const paintUpdate = usePaintStore((state) => state.update);

  const [isPaint, setIsPaint] = useState(false);
  const [webSocketConnect, setWebSocketConnect] = useState(false);

  const canvas = useRef<HTMLCanvasElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (user.isActive) {
      setWebSocketConnect(true);
    }

    if (!canvas.current) return;
    canvas.current.width = canvasState.boardSize.width;
    canvas.current.height = canvasState.boardSize.height;

    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;
    context.current = ctx;
    context.current.lineWidth = canvasState.brush.lineWidth;
    context.current.strokeStyle = canvasState.brush.lineColor;
    context.current.lineCap = canvasState.brush.lineCap;

    if (canvasState.imageData) {
      context.current.putImageData(canvasState.imageData, 0, 0);
    }
  }, [
    user.isActive,
    canvasState.boardSize.width,
    canvasState.boardSize.height,
    canvasState.brush.lineWidth,
    canvasState.brush.lineColor,
    canvasState.brush.lineCap,
    canvasState.imageData,
  ]);

  const beginPaint = (x: number, y: number) => {
    setIsPaint(true);

    context.current?.beginPath();
    context.current?.moveTo(x, y);

    paintUpdate.position(
      PaintAction.START,
      { root: { x: x, y: y } },
      webSocketConnect
    );
  };

  const painting = (x: number, y: number) => {
    if (!isPaint) return;

    context.current?.lineTo(x, y);
    context.current?.stroke();

    paintUpdate.position(
      PaintAction.MOVE,
      { current: { x: x, y: y } },
      webSocketConnect
    );
  };

  const endPaint = () => {
    setIsPaint(false);
    context.current?.closePath();

    paintUpdate.position(
      PaintAction.END,
      { root: { x: 0, y: 0 } },
      webSocketConnect
    );
  };

  useEffect(() => {
    switch (paint.action) {
      case PaintAction.START:
        context.current?.beginPath();
        context.current?.moveTo(paint.position.root.x, paint.position.root.y);
        break;

      case PaintAction.MOVE:
        context.current?.lineTo(
          paint.position.current.x,
          paint.position.current.y
        );
        context.current?.stroke();
        break;

      case PaintAction.END:
        setIsPaint(false);
        context.current?.closePath();

        paintUpdate.position(
          PaintAction.NONE,
          { root: { x: 0, y: 0 } },
          webSocketConnect
        );
        break;

      default:
        break;
    }
  }, [paint.position]);

  return (
    <>
      <canvas
        id="canvas"
        ref={canvas}
        onMouseDown={(e) =>
          beginPaint(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        }
        onMouseMove={(e) =>
          painting(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        }
        onMouseUp={endPaint}
        className="border-2 m-10"
      ></canvas>
    </>
  );
};
export default Canvas;
