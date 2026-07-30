import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export function NavActions() {
  return (
    <div className="hidden lg:block">
      <Button
        asChild
        className="rounded-full px-6"
      >
        <Link href="https://wa.me/2348000000000">
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </Link>
      </Button>
    </div>
  );
}