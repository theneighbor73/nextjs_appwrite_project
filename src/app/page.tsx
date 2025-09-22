import Header from "@/app/components/Header";
import HeroSectionHeader from "@/app/components/HeroSectionHeader";
import HeroSection from "@/app/components/HeroSection";
import LatestQuestions from "@/app/components/LatestQuestions";
import TopContributers from "@/app/components/TopContributers";
import Footer from "@/app/components/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />

        <section className="ml-12 my-12">
          <div className="flex space-x-6">
            <LatestQuestions />
            <TopContributers />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
