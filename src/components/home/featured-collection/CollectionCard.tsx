import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface CollectionCardProps {
  title: string;
  description: string;
  badge: string;
  accent: string;
  index: number;
}

export function CollectionCard({ title, description, badge, accent, index }: CollectionCardProps) {
  return (
    <article className="group relative min-h-[27rem] overflow-hidden rounded-[2rem] bg-stone-900 p-7 text-white shadow-[0_18px_50px_rgba(28,25,23,0.12)] md:min-h-[31rem]">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} transition-transform duration-700 group-hover:scale-105`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,.18),transparent_28%),linear-gradient(180deg,transparent_25%,rgba(28,25,23,.78)_100%)]" />
      <span className="relative inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.17em] backdrop-blur-sm">{badge}</span>
      <div className="relative mt-48 md:mt-56">
        <p className="mb-3 text-sm text-white/70">0{index + 1}</p>
        <h3 className="font-serif text-3xl font-medium tracking-tight">{title}</h3>
        <p className="mt-3 max-w-xs text-sm leading-6 text-white/75">{description}</p>
        <Link href="#contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-transform duration-300 group-hover:translate-x-1">View the edit <ArrowUpRight className="size-4" /></Link>
      </div>
    </article>
  );
}
