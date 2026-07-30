import { Quote, Star } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

const stories = [
  { name: "Amaka E.", occasion: "Wedding guest", quote: "The fit was beautiful from every angle. I felt completely like myself, only more polished." },
  { name: "Teni A.", occasion: "Corporate wardrobe", quote: "Maria understood the brief immediately. Every piece feels professional, feminine and incredibly comfortable." },
  { name: "Opeyemi K.", occasion: "Celebration dressing", quote: "Thoughtful service, exquisite finishing and a dress that made the day feel even more special." },
];

export function Testimonials() {
  return (
    <section className="bg-background py-24 lg:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><Heading title="Worn with confidence." subtitle="Notes from women who invited Maria Stitches into their moments." /><div className="flex gap-1 text-[#d4af37]">{Array.from({ length: 5 }, (_, index) => <Star key={index} className="size-4 fill-current" />)}</div></div>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {stories.map((story) => (
            <figure key={story.name} className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_12px_34px_rgba(28,25,23,.05)] dark:border-stone-700 dark:bg-stone-900">
              <Quote className="size-7 text-primary/65" strokeWidth={1.2} />
              <blockquote className="mt-10 font-serif text-2xl leading-8 text-stone-800 dark:text-stone-100">“{story.quote}”</blockquote>
              <figcaption className="mt-10 border-t border-stone-200 pt-5 text-sm dark:border-stone-700"><span className="font-semibold text-stone-900 dark:text-stone-100">{story.name}</span><span className="ml-2 text-stone-500 dark:text-stone-400">· {story.occasion}</span></figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
