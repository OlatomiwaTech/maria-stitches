import Image from "next/image";

import { FadeIn } from "@/components/shared/FadeIn";
import { Container } from "@/components/ui/container";

export function Maison() {
  return (
    <section id="maison" className="bg-[#f0ebe3] py-24 dark:bg-[#211a1a] lg:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[.86fr_1.14fr] lg:items-center lg:gap-24">
          <FadeIn>
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -left-5 -top-5 size-24 rounded-full border border-primary/20" />
              <Image src="/images/hero/hero-model.jpg" alt="A Maria Stitches design in the atelier" width={900} height={1100} className="relative aspect-[4/5] rounded-[2rem] object-cover grayscale-[15%]" />
            </div>
          </FadeIn>
          <FadeIn>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">The Maria Stitches Maison</p>
              <h2 className="mt-5 font-serif text-4xl font-medium tracking-[-0.035em] text-stone-900 md:text-5xl lg:text-6xl dark:text-stone-100">A softer kind of luxury.</h2>
              <p className="mt-7 text-lg leading-8 text-stone-600 dark:text-stone-300">At Maria Stitches, every detail begins with listening. We balance your individual style with enduring construction to create pieces that feel effortless, personal and distinctly yours.</p>
              <div className="mt-10 grid gap-7 border-t border-stone-300 pt-7 sm:grid-cols-2 dark:border-stone-700">
                <div><p className="font-serif text-2xl text-primary">01</p><p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300">A personal consultation that starts with your life, not a trend.</p></div>
                <div><p className="font-serif text-2xl text-primary">02</p><p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300">Thoughtful finishing that makes every silhouette feel considered.</p></div>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
