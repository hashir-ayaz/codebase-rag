import Hero from "@/components/hero";
import Features from "@/components/features";
import Footer from "@/components/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen text-textLight bg-gradient-to-r from-black via-gray-900 to-primary font-custom">
      <div className="container mx-auto px-4">
        <Hero />
        <Features />
        <Footer />
      </div>
    </div>
  );
}
