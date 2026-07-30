import Image from "next/image";

export function HeroImage() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-4 rounded-[40px] bg-[#D4AF37]/15 blur-3xl" />

      <div className="relative overflow-hidden rounded-[40px] border border-stone-200 bg-white shadow-2xl">
        <Image
          src="/images/hero/hero-model.jpg"
          alt="Maria Stitches Fashion"
          width={900}
          height={1100}
          priority
          className="h-auto w-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>
    </div>
  );
}