"use client";

import { Channel } from "@/config/type";
import { PaintAction, usePaintStore } from "@/store/paintStore";
import { useUserStore } from "@/store/userStore";
import { useEffect, useRef, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";

const Canvas = () => {
  const user = useUserStore((state) => state.user);
  const paint = usePaintStore((state) => state.paint);
  const [isPaint, setIsPaint] = useState(false);

  const canvas = useRef<HTMLCanvasElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);

  let stompClient = user.isActive ? useStompClient() : undefined;

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
    paint.brush.lineWidth,
    paint.boardSize.height,
    paint.brush.lineWidth,
    paint.brush.lineColor,
    paint.brush.lineCap,
  ]);

  const paintExcute = (message: {
    deviceId: number;
    paint: {
      action: PaintAction;
      position?: {
        root?: { x: number; y: number };
        current?: { x: number; y: number };
      };
    };
  }) => {
    if (user.deviceId == message.deviceId) return;

    switch (message.paint.action) {
      case PaintAction.START:
        context.current?.beginPath();
        context.current?.moveTo(
          message.paint.position!.root!.x,
          message.paint.position!.root!.y
        );
        break;

      case PaintAction.MOVE:
        context.current?.lineTo(
          message.paint.position!.current!.x,
          message.paint.position!.current!.y
        );
        context.current?.stroke();
        break;

      case PaintAction.END:
        context.current?.closePath();
        break;

      default:
        break;
    }
  };

  if (user.isActive) {
    useSubscription(
      `/${Channel.TOPIC}/${Channel.ROOM}/${user.userId}/${Channel.PAINT}`,
      (message) => paintExcute(JSON.parse(message.body))
    );
  }

  const sendMessage = (message: {
    deviceId: number;
    paint: {
      action: PaintAction;
      position?: {
        root?: { x: number; y: number };
        current?: { x: number; y: number };
      };
    };
  }) => {
    if (!stompClient) return;

    stompClient.publish({
      destination: `/${Channel.ROOM}/${user.userId}/${Channel.PAINT}`,
      body: JSON.stringify(message),
    });
  };

  const onMouseDown = (e: MouseEvent) => {
    setIsPaint(true);

    context.current?.beginPath();
    context.current?.moveTo(e.offsetX, e.offsetY);

    sendMessage({
      deviceId: user.deviceId,
      paint: {
        action: PaintAction.START,
        position: { root: { x: e.offsetX, y: e.offsetY } },
      },
    });
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isPaint) return;

    context.current?.lineTo(e.offsetX, e.offsetY);
    context.current?.stroke();

    sendMessage({
      deviceId: user.deviceId,
      paint: {
        action: PaintAction.MOVE,
        position: { current: { x: e.offsetX, y: e.offsetY } },
      },
    });
  };

  const onMouseUp = () => {
    context.current?.closePath();
    setIsPaint(false);

    sendMessage({
      deviceId: user.deviceId,
      paint: {
        action: PaintAction.END,
      },
    });
  };

  return (
    <>
      <canvas
        ref={canvas}
        onMouseDown={(e) => onMouseDown(e.nativeEvent)}
        onMouseMove={(e) => onMouseMove(e.nativeEvent)}
        onMouseUp={onMouseUp}
        className="border-2"
      ></canvas>
    </>
  );
};
export default Canvas;
