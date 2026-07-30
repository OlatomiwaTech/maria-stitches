import Image from "next/image";

export function HeroImage() {
  return (
    <div className="relative mx-auto w-full max-w-[32rem] lg:mr-0">
      <div className="absolute -inset-6 rounded-[40px] bg-[#d4af37]/20 blur-3xl" />
      <div className="absolute -left-5 bottom-10 z-10 hidden w-40 rounded-2xl border border-white/50 bg-white/75 p-4 shadow-xl backdrop-blur sm:block dark:border-stone-600 dark:bg-stone-900/75">
        <p className="font-serif text-lg text-primary">The Signature</p>
        <p className="mt-1 text-xs leading-5 text-stone-600 dark:text-stone-300">Couture details. A perfect fit.</p>
      </div>

      <div className="relative overflow-hidden rounded-[40px] border border-stone-200 bg-white shadow-2xl transition-colors duration-300 dark:border-stone-700 dark:bg-stone-900">
        <Image
          src="/images/hero/hero-model.jpg"
          alt="Maria Stitches Fashion"
          width={900}
          height={1100}
          priority
          className="aspect-[4/5] w-full object-cover object-center transition-transform duration-1000 hover:scale-[1.03]"
        />
      </div>
    </div>
  );
}
