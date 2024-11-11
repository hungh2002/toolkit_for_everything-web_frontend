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

const BrushTools = () => {
  const paint = usePaintStore((state) => state.paint);
  const update = usePaintStore((state) => state.update);

  const updateLineCap = (e: string) => {
    if (Object.values(LineCap).includes("butt" as LineCap)) {
      if (e != "butt") return;
      update({ brush: { lineCap: LineCap.BUTT } });
      return;
    }
    if (e == LineCap.ROUND) {
      update({ brush: { lineCap: LineCap.ROUND } });
    }
    if (e == LineCap.SQUARE) {
      update({ brush: { lineCap: LineCap.SQUARE } });
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
          onChange={(e) => update({ brush: { lineColor: e.target.value } })}
        />
      </ToggleGroupItem>
      <ToggleGroupItem value={paint.brush.lineWidth.toString()} asChild>
        <Input
          type="range"
          value={paint.brush.lineWidth.toString()}
          onChange={(e) =>
            update({ brush: { lineWidth: Number.parseInt(e.target.value) } })
          }
        />
      </ToggleGroupItem>
      <ToggleGroupItem value={paint.brush.lineCap} asChild>
        <Select
          value={paint.brush.lineCap}
          onValueChange={(e) => updateLineCap(e)}
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
