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
        <HeroSectionHeader />
        {/* <HeroSection /> */}

        <section className="my-12">
          <LatestQuestions />
        </section>

        <section className="my-12">
          <TopContributers />
        </section>
      </main>
      <Footer />
    </div>
  );
}
