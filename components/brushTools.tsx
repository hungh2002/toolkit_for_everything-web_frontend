import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LineCap, usePaintStore } from "@/store/paintStore";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserStore } from "@/store/userStore";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { Channel } from "@/config/type";

const BrushTools = () => {
  const paint = usePaintStore((state) => state.paint);
  const update = usePaintStore((state) => state.update);
  const user = useUserStore((state) => state.user);

  let stompClient = user.isActive ? useStompClient() : undefined;

  const sendMessage = (message: {
    lineWidth?: number;
    lineColor?: string;
    lineCap?: string;
  }) => {
    if (stompClient) {
      stompClient.publish({
        destination: `/${Channel.ROOM}/${user.userId}/${Channel.PAINT_STYLE}`,
        body: JSON.stringify({ brush: message }),
      });
    }
  };

  const onChangeLineColor = (newLineColor: string, send: boolean) => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas?.getContext("2d");

    update({
      imageData: context?.getImageData(
        0,
        0,
        paint.boardSize.width,
        paint.boardSize.height
      ),
      brush: { lineColor: newLineColor },
    });

    if (send) {
      sendMessage({ lineColor: newLineColor });
    }
  };

  const onChangeLineWidth = (newLineWidth: string, send: boolean) => {
    update({ brush: { lineWidth: Number.parseInt(newLineWidth) } });

    if (send) {
      sendMessage({ lineWidth: Number.parseInt(newLineWidth) });
    }
  };

  const onChangeLineCap = (newLineCap: string, send: boolean) => {
    if (send) {
      sendMessage({ lineCap: newLineCap });
    }

    switch (newLineCap) {
      case LineCap.BUTT.toString():
        update({ brush: { lineCap: LineCap.BUTT } });
        break;

      case LineCap.SQUARE.toString():
        update({ brush: { lineCap: LineCap.SQUARE } });
        break;

      default:
        update({ brush: { lineCap: LineCap.ROUND } });
        break;
    }
  };

  if (user.isActive) {
    useSubscription(
      `/${Channel.TOPIC}/${Channel.ROOM}/${user.userId}/${Channel.PAINT_STYLE}`,
      (message) => {
        const data: {
          deviceId: number;
          boardSize?: { width: number; height: number };
          brush?: {
            lineWidth?: number;
            lineColor?: string;
            lineCap?: LineCap;
          };
        } = JSON.parse(message.body);

        if (user.deviceId == data.deviceId) return;

        update({ brush: { ...data.brush } });
      }
    );
  }

  return (
    <ToggleGroup
      type="single"
      className="fixed right-0 inset-y-1/4 flex flex-col"
    >
      <ToggleGroupItem value={paint.brush.lineColor} asChild>
        <Input
          type="color"
          value={paint.brush.lineColor}
          onChange={(e) => onChangeLineColor(e.target.value, true)}
        />
      </ToggleGroupItem>
      <ToggleGroupItem value={paint.brush.lineWidth.toString()} asChild>
        <Input
          type="range"
          min="1"
          max="10"
          value={paint.brush.lineWidth.toString()}
          onChange={(e) => onChangeLineWidth(e.target.value, true)}
        />
      </ToggleGroupItem>
      <ToggleGroupItem value={paint.brush.lineCap} asChild>
        <Select
          value={paint.brush.lineCap}
          onValueChange={(e) => onChangeLineCap(e, true)}
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
