"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LineCap, useCanvasStore } from "@/store/canvasStore";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";

const BrushTools = () => {
  const user = useUserStore((state) => state.user);
  const paint = useCanvasStore((state) => state);
  const paintUpdate = useCanvasStore((state) => state.update);

  const [webSocketConnect, setWebSocketConnect] = useState(false);

  useEffect(() => {
    if (user.isActive) {
      setWebSocketConnect(true);
    }
  }, [user.isActive]);

  const onChangeLineColor = (newLineColor: string) => {
    paintUpdate.brush({ lineColor: newLineColor }, webSocketConnect);
  };

  const onChangeLineWidth = (newLineWidth: string) => {
    paintUpdate.brush(
      { lineWidth: Number.parseInt(newLineWidth) },
      webSocketConnect
    );
  };

  const onChangeLineCap = (newLineCap: string) => {
    switch (newLineCap) {
      case LineCap.BUTT.toString():
        paintUpdate.brush({ lineCap: LineCap.BUTT }, webSocketConnect);
        break;

      case LineCap.SQUARE.toString():
        paintUpdate.brush({ lineCap: LineCap.SQUARE }, webSocketConnect);
        break;

      default:
        paintUpdate.brush({ lineCap: LineCap.ROUND }, webSocketConnect);
        break;
    }
  };

  return (
    <ToggleGroup
      type="single"
      className="fixed right-0 inset-y-1/4 flex flex-col"
    >
      <ToggleGroupItem value={paint.brush.lineColor} asChild>
        <Input
          type="color"
          value={paint.brush.lineColor}
          onChange={(e) => onChangeLineColor(e.target.value)}
        />
      </ToggleGroupItem>
      <ToggleGroupItem value={paint.brush.lineWidth.toString()} asChild>
        <Input
          type="range"
          min="1"
          max="10"
          value={paint.brush.lineWidth.toString()}
          onChange={(e) => onChangeLineWidth(e.target.value)}
        />
      </ToggleGroupItem>
      <ToggleGroupItem value={paint.brush.lineCap} asChild>
        <Select
          value={paint.brush.lineCap}
          onValueChange={(e) => onChangeLineCap(e)}
        >
          <SelectTrigger>
            <SelectValue placeholder={paint.brush.lineCap} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="butt">butt</SelectItem>
            <SelectItem value="round">round</SelectItem>
            <SelectItem value="square">square</SelectItem>
          </SelectContent>
        </Select>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
export default BrushTools;
