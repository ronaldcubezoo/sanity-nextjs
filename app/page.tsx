import Header from "@/app/components/Header";
import HeroSection from "@/app/components/HeroSection";
import AboutUsSection from "@/app/components/AboutUsSection";
import ValuePropsSection from "@/app/components/ValuePropsSection";
import FaqSection from "@/app/components/FaqSection";
import Footer from "@/app/components/Footer";
import ApplicationSection from "@/app/components/HowTo";

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