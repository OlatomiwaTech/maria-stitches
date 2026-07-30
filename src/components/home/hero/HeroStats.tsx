export function HeroStats() {
  const stats = [
    {
      value: "Since 2022",
      label: "Crafting elegant fashion",
    },
    {
      value: "Ready-to-Wear",
      label: "Premium collections",
    },
  ];

  return (
    <div className="flex flex-wrap gap-10 pt-8">
      {stats.map((stat) => (
        <div key={stat.value}>
          <p className="text-xl font-semibold text-stone-900">
            {stat.value}
          </p>

          <p className="text-sm text-stone-600">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
