import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";

import { HeroActions } from "./HeroActions";
import { HeroStats } from "./HeroStats";

export function HeroContent() {
  return (
    <div className="max-w-2xl text-foreground">
      <Badge>Maria Stitches · Sango Ota, Nigeria</Badge>

      <div className="mt-6">
        <Heading
          title="Made for the moment you will always remember."
          subtitle="An intimate tailoring house creating refined custom pieces and ready-to-wear silhouettes for women and girls who dress with intention."
        />
      </div>

      <div className="mt-10">
        <HeroActions />
      </div>

      <HeroStats />
    </div>
  );
}
