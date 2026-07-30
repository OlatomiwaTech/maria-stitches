import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export function Badge({
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-1 text-sm font-medium text-[#8B1E3F] transition-colors duration-300 dark:border-[#D4AF37]/40 dark:bg-[#D4AF37]/20 dark:text-[#F7D98A]",
        className
      )}
    >
      {children}
    </span>
  );
}
