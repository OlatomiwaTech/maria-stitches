import Image from "next/image";

export function HeroImage() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-4 rounded-[2rem] bg-[#D4AF37]/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-2xl">
        <Image
          src="/images/hero/hero-model.jpg"
          alt="Maria Stitches premium fashion"
          width={800}
          height={1000}
          priority
          className="h-auto w-full object-cover"
        />
      </div>
    </div>
  );
}