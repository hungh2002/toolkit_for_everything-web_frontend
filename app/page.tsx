import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Button asChild>
        <Link href="/miro/item?item-id=1">Click to show my project</Link>
      </Button>
    </div>
  );
}
