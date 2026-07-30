import { Hero } from "@/components/home/hero";
import { AtelierCta } from "@/components/home/atelier-cta/AtelierCta";
import { Craft } from "@/components/home/craft/Craft";
import { FeaturedCollection } from "@/components/home/featured-collection";
import { Maison } from "@/components/home/maison/Maison";
import { Testimonials } from "@/components/home/testimonials/Testimonials";
import { Footer } from "@/components/layout/footer/Footer";
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main>
        <Hero />
        <Maison />
        <FeaturedCollection />
        <Craft />
        <Testimonials />
        <AtelierCta />
      </main>
      <Footer />
    </div>
  );
}
