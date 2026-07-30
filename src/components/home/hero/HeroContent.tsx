import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";

import { HeroActions } from "./HeroActions";
import { HeroStats } from "./HeroStats";

export function HeroContent() {
  return (
    <div className="max-w-xl">
      <Badge>Premium Tailoring • Since 2022</Badge>

      <div className="mt-6">
        <Heading
          title="Elegance, Tailored Just for You."
          subtitle="Maria Stitches creates premium custom outfits and ready-to-wear fashion for women and girls with craftsmanship, attention to detail, and timeless style."
        />
      </div>

      <div className="mt-10">
        <HeroActions />
      </div>

      <HeroStats />
    </div>
  );
}
