import { cn } from "@/lib/utils";

type HeadingProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function Heading({
  title,
  subtitle,
  className,
}: HeadingProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="font-serif text-4xl font-medium tracking-[-0.035em] text-stone-900 md:text-5xl lg:text-6xl dark:text-stone-100">
        {title}
      </h2>

      {subtitle && (
        <p className="max-w-2xl text-base leading-7 text-stone-600 md:text-lg dark:text-stone-300">
          {subtitle}
        </p>
      )}
    </div>
  );
}
