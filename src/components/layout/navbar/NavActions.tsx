import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { whatsappUrl } from "@/constants/navigation";

import { ThemeToggle } from "./ThemeToggle";

export function NavActions() {
  return (
    <div className="hidden items-center gap-3 lg:flex">
      <ThemeToggle />

      <Button
        asChild
        className="rounded-full px-6"
      >
        <Link href={whatsappUrl} target="_blank" rel="noreferrer">
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </Link>
      </Button>
    </div>
  );
}
