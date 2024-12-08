import { Button } from "@/components/ui/button";
import { AppBaseURL } from "@/config/type";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Button asChild>
        <Link href={AppBaseURL.Note}>Click to show my project</Link>
      </Button>
    </div>
  );
}
