import { Container } from "@/components/ui/container";

import { HeroBackground } from "./HeroBackground";
import { HeroContent } from "./HeroContent";
import { HeroImage } from "./HeroImage";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-background pb-20 pt-16 text-foreground transition-colors duration-300 sm:pt-24 lg:min-h-[calc(100svh-5rem)] lg:py-20">
      <HeroBackground />

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_.98fr] lg:gap-20">
          <HeroContent />
          <HeroImage />
        </div>
      </Container>
    </section>
  );
}
