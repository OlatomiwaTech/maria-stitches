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
      <h2 className="font-serif text-4xl font-semibold tracking-tight text-stone-900 md:text-5xl">
        {title}
      </h2>

      {subtitle && (
        <p className="max-w-2xl text-lg leading-relaxed text-stone-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}
