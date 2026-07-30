"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const iconMap = {
  system: Monitor,
  light: Sun,
  dark: Moon,
} as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const resolvedTheme = (theme ?? "system") as keyof typeof iconMap;
  const Icon = iconMap[resolvedTheme] ?? Monitor;
  const nextTheme = resolvedTheme === "system" ? "light" : resolvedTheme === "light" ? "dark" : "system";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(nextTheme)}
      className="h-10 w-10 rounded-full border border-stone-200/80 bg-white/80 text-stone-700 shadow-sm backdrop-blur transition-all hover:border-stone-300 hover:bg-white dark:border-stone-700 dark:bg-stone-900/80 dark:text-stone-200 dark:hover:bg-stone-800"
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Current theme: ${resolvedTheme}`}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
