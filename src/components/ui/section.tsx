import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export function Section({
  children,
  className,
}: SectionProps) {
  return (
    <section className={cn("py-20 lg:py-28", className)}>
      {children}
    </section>
  );
}
