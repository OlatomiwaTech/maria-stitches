import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

import { CollectionCard } from "./CollectionCard";
import { collections } from "./collection-data";

export function FeaturedCollection() {
  return (
    <section id="collections" className="bg-background py-24 text-foreground transition-colors duration-300 lg:py-32">
      <Container>
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Heading title="The season, considered." subtitle="A considered wardrobe for celebrations, milestone moments and beautiful everyday dressing." />
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Collection 01 — 2026</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, index) => <CollectionCard key={collection.title} {...collection} index={index} />)}
        </div>
      </Container>
    </section>
  );
}
