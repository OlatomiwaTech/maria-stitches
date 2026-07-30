import { Camera, MapPin, MessageCircle } from "lucide-react";
import Link from "next/link";

import { whatsappUrl } from "@/constants/navigation";
import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-[#f0ebe3] py-12 text-stone-700 dark:border-stone-800 dark:bg-[#161111] dark:text-stone-300">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.3fr_.7fr_.7fr]">
          <div><Link href="/" className="font-serif text-3xl tracking-tight text-stone-900 dark:text-stone-100">Maria Stitches<span className="text-primary">.</span></Link><p className="mt-4 max-w-xs text-sm leading-6">Luxury tailoring and occasionwear, made with care in Sango Ota, Ogun State.</p></div>
          <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Visit</p><p className="mt-4 flex gap-2 text-sm leading-6"><MapPin className="mt-0.5 size-4 shrink-0" />Sango Ota,<br />Ogun State, Nigeria</p></div>
          <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Follow</p><div className="mt-4 flex gap-4"><Link href={whatsappUrl} target="_blank" aria-label="WhatsApp"><MessageCircle className="size-5" /></Link><Link href="#" aria-label="Instagram"><Camera className="size-5" /></Link></div></div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-stone-300 pt-5 text-xs text-stone-500 dark:border-stone-700 sm:flex-row"><p>© {new Date().getFullYear()} Maria Stitches. All rights reserved.</p><p>Made with intention.</p></div>
      </Container>
    </footer>
  );
}
