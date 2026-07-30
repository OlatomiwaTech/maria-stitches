import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { whatsappUrl } from "@/constants/navigation";
import { Container } from "@/components/ui/container";

export function AtelierCta() {
  return (
    <section id="contact" className="bg-background pb-24 lg:pb-32">
      <Container>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-7 py-16 text-white sm:px-12 lg:px-20 lg:py-20">
          <div className="absolute -right-20 -top-28 size-96 rounded-full border border-white/15" /><div className="absolute -bottom-40 left-1/3 size-96 rounded-full bg-[#d4af37]/20 blur-3xl" />
          <div className="relative max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f2d88a]">Your next fitting</p><h2 className="mt-5 font-serif text-4xl font-medium tracking-[-0.035em] md:text-5xl lg:text-6xl">Let’s make something unforgettable.</h2><p className="mt-6 max-w-xl text-lg leading-8 text-white/75">Tell us about the moment, your style and the piece you have in mind. We’ll take care of the rest.</p><Link href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-10 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5">Start on WhatsApp <ArrowUpRight className="size-4" /></Link></div>
        </div>
      </Container>
    </section>
  );
}
