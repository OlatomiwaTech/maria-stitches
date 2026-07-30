export function HeroStats() {
  const stats = [
    {
      value: "Since 2022",
      label: "Sango Ota atelier",
    },
    {
      value: "Bespoke & RTW",
      label: "Made with intention",
    },
  ];

  return (
    <div className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t border-stone-300/70 pt-6 dark:border-stone-700">
      {stats.map((stat) => (
        <div key={stat.value}>
          <p className="text-base font-semibold tracking-wide text-stone-900 transition-colors duration-300 dark:text-stone-100">
            {stat.value}
          </p>

          <p className="text-sm text-stone-600 transition-colors duration-300 dark:text-stone-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
