import Header from "@/src/components/Header";
import HeroSection from "@/src/components/HeroSection";
import AboutUsSection from "@/src/components/AboutUsSection";
import ValuePropsSection from "@/src/components/ValuePropsSection";
import FaqSection from "@/src/components/FaqSection";
import Footer from "@/src/components/Footer";
import ApplicationSection from "@/src/components/HowTo";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col w-full">
        <HeroSection />
        <ValuePropsSection />
        <AboutUsSection />
        <ApplicationSection />
        <FaqSection />

      </main>
      <Footer />
    </>
  );
}