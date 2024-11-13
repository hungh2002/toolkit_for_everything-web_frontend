"use client";

import BrushTools from "@/components/brushTools";
import Canvas from "@/components/canvas";
import { useSearchParams } from "next/navigation";

const Item = () => {
  const searchParams = useSearchParams();
  const itemId = searchParams.get("item-id");
  return (
    <div className=" flex justify-center">
      <BrushTools />
      <Canvas />
    </div>
  );
};
export default Item;
