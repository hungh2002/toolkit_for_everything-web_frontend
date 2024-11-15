"use client";

import { Channel } from "@/config/type";
import { LineCap, useCanvasStore } from "@/store/canvasStore";
import { PaintAction, usePaintStore } from "@/store/paintStore";
import { useUserStore } from "@/store/userStore";
import { useEffect, useRef } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";

const WebSocket = () => {
  const user = useUserStore((state) => state.user);
  const canvasState = useCanvasStore((state) => state);
  const canvasUpdate = useCanvasStore((state) => state.update);
  const paint = usePaintStore((state) => state);
  const paintUpdate = usePaintStore((state) => state.update);

  const stompClient = useStompClient();
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const canvasContext = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!stompClient) return;

    if (canvasState.isSendWebSocketMessage) {
      canvas.current = document.getElementById("canvas") as HTMLCanvasElement;
      canvasContext.current = canvas.current.getContext("2d");
      const imageData = canvasContext.current?.getImageData(
        0,
        0,
        canvas.current.width,
        canvas.current.height
      );

      stompClient.publish({
        destination: `/${Channel.ROOM}/${user.userId}/${Channel.PAINT_STYLE}`,
        body: JSON.stringify({
          boardSize: canvasState.boardSize,
          brush: { ...canvasState.brush },
        }),
      });

      canvasUpdate.imageData(imageData!, false);
    }

    if (paint.isSendWebSocketMessage && paint.action !== PaintAction.NONE) {
      stompClient.publish({
        destination: `/${Channel.ROOM}/${user.userId}/${Channel.PAINT}`,
        body: JSON.stringify({
          action: paint.action,
          position: paint.position,
        }),
      });
      paintUpdate.isSendWebSocketMessage(false);
    }
  }, [canvasState.boardSize, canvasState.brush, paint.position]);

  useSubscription(
    `/${Channel.TOPIC}/${Channel.ROOM}/${user.userId}/${Channel.PAINT_STYLE}`,
    (message) => {
      const data: {
        deviceId: number;
        boardSize: { width: number; height: number };
        brush: {
          lineWidth: number;
          lineColor: string;
          lineCap: LineCap;
        };
      } = JSON.parse(message.body);

      if (user.deviceId == data.deviceId) return;

      if (data.boardSize) {
        canvasUpdate.boardSize(data.boardSize, false);
      }
      if (data.brush) {
        canvasUpdate.brush(data.brush, false);
      }
    }
  );

  useSubscription(
    `/${Channel.TOPIC}/${Channel.ROOM}/${user.userId}/${Channel.PAINT}`,
    (message) => {
      const data: {
        deviceId: number;
        action: PaintAction;
        position: {
          root: { x: number; y: number };
          current: { x: number; y: number };
        };
      } = JSON.parse(message.body);

      if (user.deviceId == data.deviceId) return;

      paintUpdate.position(data.action, data.position, false);
    }
  );

  return <></>;
};
export default WebSocket;
