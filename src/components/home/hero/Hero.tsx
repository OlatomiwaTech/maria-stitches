import { Container } from "@/components/ui/container";

import { HeroContent } from "./HeroContent";
import { HeroImage } from "./HeroImage";

export function Hero() {
  return (
    <section className="bg-[#FAF8F5] py-20 lg:py-28">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <HeroContent />
          <HeroImage />
        </div>
      </Container>
    </section>
  );
}