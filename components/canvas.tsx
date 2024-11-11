"use client";

import { Channel } from "@/config/type";
import { PaintAction, usePaintStore } from "@/store/paintStore";
import { useUserStore } from "@/store/userStore";
import { useEffect, useRef, useState } from "react";
import { useStompClient } from "react-stomp-hooks";

const Canvas = () => {
  const paint = usePaintStore((state) => state.paint);
  const paintUpdate = usePaintStore((state) => state.paintUpdate);
  const user = useUserStore((state) => state.user);

  let stompClient = user.isActive ? useStompClient() : undefined;

  const canvas = useRef<HTMLCanvasElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!canvas.current) return;
    canvas.current.width = paint.boardSize.width;
    canvas.current.height = paint.boardSize.height;

    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;
    context.current = ctx;
    context.current.lineWidth = paint.brush.lineWidth;
    context.current.strokeStyle = paint.brush.lineColor;
    context.current.lineCap = paint.brush.lineCap;
  }, [
    paint.boardSize.width,
    paint.boardSize.height,
    paint.brush.lineWidth,
    paint.brush.lineColor,
    paint.brush.lineCap,
  ]);

  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();

    paintUpdate({ action: PaintAction.START });
    context.current?.beginPath();
    context.current?.moveTo(e.offsetX, e.offsetY);

    if (stompClient) {
      stompClient.publish({
        destination: `$${Channel.ROOM}/${user.id}/${Channel.PAINT}`,
        body: JSON.stringify({
          action: PaintAction.START,
          position: { root: { x: e.offsetX, y: e.offsetY } },
        }),
      });
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    e.preventDefault();

    if (!context.current) return;
    if (paint.action == PaintAction.NONE) return;

    context.current.lineTo(e.offsetX, e.offsetY);
    context.current.stroke();

    if (stompClient) {
      stompClient.publish({
        destination: `${Channel.ROOM}/${user.id}/${Channel.PAINT}`,
        body: JSON.stringify({
          action: PaintAction.MOVE,
          position: { current: { x: e.offsetX, y: e.offsetY } },
        }),
      });
    }
  };

  const onMouseUp = () => {
    context.current?.closePath();
    paintUpdate({ action: PaintAction.NONE });

    if (stompClient) {
      stompClient.publish({
        destination: `${Channel.ROOM}/${user.id}/${Channel.PAINT}`,
        body: JSON.stringify({
          action: PaintAction.NONE,
        }),
      });
    }
  };

  return (
    <canvas
      ref={canvas}
      onMouseDown={(e) => onMouseDown(e.nativeEvent)}
      onMouseMove={(e) => onMouseMove(e.nativeEvent)}
      onMouseUp={onMouseUp}
    ></canvas>
  );
};
export default Canvas;
