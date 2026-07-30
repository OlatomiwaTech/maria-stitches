import Link from "next/link";

import { Button } from "@/components/ui/button";

export function HeroActions() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button asChild size="lg" className="rounded-full px-8">
        <Link href="/contact">Book Appointment</Link>
      </Button>

      <Button
        asChild
        variant="outline"
        size="lg"
        className="rounded-full px-8"
      >
        <Link href="/collection">Explore Collection</Link>
      </Button>
    </div>
  );
}
