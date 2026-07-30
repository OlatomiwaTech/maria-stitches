import Link from "next/link";
import { navigation } from "@/constants/navigation";

export function NavLinks() {
  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="relative text-sm font-medium text-stone-700 transition-colors duration-300 hover:text-[#8B1E3F] dark:text-stone-200 dark:hover:text-[#F7D98A]"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
