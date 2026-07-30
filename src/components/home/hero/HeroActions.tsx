import Link from "next/link";

import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/constants/navigation";

export function HeroActions() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button asChild size="lg" className="h-12 rounded-full px-7">
        <Link href={whatsappUrl} target="_blank" rel="noreferrer">Begin your fitting</Link>
      </Button>

      <Button
        asChild
        variant="outline"
        size="lg"
        className="h-12 rounded-full px-7"
      >
        <Link href="#collections">Explore the collection</Link>
      </Button>
    </div>
  );
}
