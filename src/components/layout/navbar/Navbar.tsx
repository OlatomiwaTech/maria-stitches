import { Container } from "@/components/ui/container";
import { NavActions } from "./NavActions";
import { NavLinks } from "./NavLinks";
import { NavLogo } from "./NavLogo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/60 bg-[#FAF8F5]/90 backdrop-blur-xl transition-colors duration-300 dark:border-stone-700 dark:bg-stone-950/90">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <NavLogo />

          <NavLinks />

          <NavActions />
        </div>
      </Container>
    </header>
  );
}