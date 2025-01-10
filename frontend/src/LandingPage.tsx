import Hero from "@/components/hero";
import Features from "@/components/features";
import QASection from "@/components/qa-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen text-black bg-white">
      <Hero />
      <Features />
      <QASection />
      <Footer />
    </div>
  );
}
