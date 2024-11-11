"use client";

import Canvas from "@/components/canvas";
import { useSearchParams } from "next/navigation";

const Item = () => {
  const searchParams = useSearchParams();
  const itemId = searchParams.get("item-id");
  return <Canvas />;
};
export default Item;
