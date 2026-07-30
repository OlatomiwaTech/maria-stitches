import { Gem, Ruler, Scissors, Sparkles } from "lucide-react";

import { Container } from "@/components/ui/container";

const pillars = [
  { icon: Ruler, title: "The right fit", copy: "Measured and shaped for the way you move, celebrate and live." },
  { icon: Scissors, title: "An expert hand", copy: "Purposeful cutting, clean finishing and care in every seam." },
  { icon: Gem, title: "Lasting beauty", copy: "Pieces designed to be reached for long after the occasion." },
  { icon: Sparkles, title: "Your point of view", copy: "A signature look that never overwhelms the woman wearing it." },
];

export function Craft() {
  return (
    <section id="craft" className="bg-stone-900 py-24 text-stone-50 lg:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
          <div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d4af37]">The Maria standard</p><h2 className="mt-5 font-serif text-4xl font-medium tracking-[-0.035em] md:text-5xl">Craft is our signature.</h2></div>
          <p className="max-w-xl self-end text-lg leading-8 text-stone-300">There is luxury in what you notice up close: the fall of a fabric, the confidence of a clean line, the comfort of a garment that belongs to you.</p>
        </div>
        <div className="mt-16 grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="border-b border-white/15 p-7 sm:border-r lg:border-b-0 lg:p-8 last:border-r-0">
              <Icon className="size-5 text-[#d4af37]" strokeWidth={1.5} />
              <h3 className="mt-12 font-serif text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-400">{copy}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
