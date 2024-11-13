"use client";

import { Channel } from "@/config/type";
import { PaintAction, usePaintStore } from "@/store/paintStore";
import { useUserStore } from "@/store/userStore";
import { useEffect, useRef, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";

const Canvas = () => {
  const user = useUserStore((state) => state.user);
  const paint = usePaintStore((state) => state.paint);
  const update = usePaintStore((state) => state.update);

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

    if (paint.imageData) {
      context.current?.putImageData(paint.imageData!, 0, 0);
    }
  }, [
    paint.boardSize.width,
    paint.boardSize.height,
    paint.brush.lineWidth,
    paint.brush.lineColor,
    paint.brush.lineCap,
  ]);

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

  const beginPaint = (x: number, y: number, send: boolean) => {
    setIsPaint(true);

    context.current?.beginPath();
    context.current?.moveTo(x, y);

    if (send) {
      sendMessage({
        deviceId: user.deviceId,
        paint: {
          action: PaintAction.START,
          position: { root: { x: x, y: y } },
        },
      });
    }
  };

  const painting = (x: number, y: number, send: boolean) => {
    if (!isPaint) return;

    context.current?.lineTo(x, y);
    context.current?.stroke();

    if (send) {
      sendMessage({
        deviceId: user.deviceId,
        paint: {
          action: PaintAction.MOVE,
          position: { current: { x: x, y: y } },
        },
      });
    }
  };

  const endPaint = (send: boolean) => {
    setIsPaint(false);
    context.current?.closePath();
    context.current?.getImageData(
      0,
      0,
      paint.boardSize.width,
      paint.boardSize.height
    );

    update({
      imageData: context.current?.getImageData(
        0,
        0,
        paint.boardSize.width,
        paint.boardSize.height
      ),
    });

    if (send) {
      sendMessage({
        deviceId: user.deviceId,
        paint: {
          action: PaintAction.END,
        },
      });
    }
  };

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
        beginPaint(
          message.paint.position!.root!.x,
          message.paint.position!.root!.y,
          false
        );
        break;

      case PaintAction.MOVE:
        painting(
          message.paint.position!.current!.x,
          message.paint.position!.current!.y,
          false
        );
        break;

      case PaintAction.END:
        endPaint(false);
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

  return (
    <>
      <canvas
        id="canvas"
        ref={canvas}
        onMouseDown={(e) =>
          beginPaint(e.nativeEvent.offsetX, e.nativeEvent.offsetY, true)
        }
        onMouseMove={(e) =>
          painting(e.nativeEvent.offsetX, e.nativeEvent.offsetY, true)
        }
        onMouseUp={() => endPaint(true)}
        className="border-2 m-10"
      ></canvas>
    </>
  );
};
export default Canvas;
