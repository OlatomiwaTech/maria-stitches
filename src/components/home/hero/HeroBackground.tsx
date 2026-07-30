export function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0 -z-20 bg-[#FAF8F5] dark:bg-[#171212]" />

      <div className="absolute left-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-[#D4AF37]/10 blur-3xl" />

      <div className="absolute right-0 bottom-0 -z-10 h-[500px] w-[500px] rounded-full bg-[#8B1E3F]/10 blur-3xl" />
    </>
  );
}
