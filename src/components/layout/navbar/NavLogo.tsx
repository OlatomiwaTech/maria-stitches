import Link from "next/link";

export function NavLogo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-3"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#8B1E3F] text-lg font-bold text-white transition-transform duration-300 group-hover:scale-105">
        M
      </div>

      <div>
        <p className="font-serif text-xl font-semibold tracking-wide text-stone-900">
          Maria Stitches
        </p>

        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
          Since 2022
        </p>
      </div>
    </Link>
  );
}
