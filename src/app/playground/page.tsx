import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] py-20">
      <Container>
        <div className="space-y-8">
          <Badge>Since 2022</Badge>

          <Heading
            title="Elegance, Tailored Just for You."
            subtitle="Premium tailoring and ready-to-wear fashion for women and girls."
          />

          <div className="flex gap-4">
            <Button>Book Appointment</Button>

            <Button variant="outline">View Collection</Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
