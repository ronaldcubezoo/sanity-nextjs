import Link from "next/link";
import MediaPlayer from "./MediaPlayer";
import { ArrowRight } from "lucide-react"; // (Removed the Play icon import as we no longer need it here)

export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center bg-[#1A1B1A] overflow-hidden pt-20">
      {/* Subtle geometric background lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 bottom-0 w-[800px] h-[800px] bg-gradient-to-tl from-white/[0.02] to-transparent rounded-full blur-3xl" />
        <div className="absolute right-[10%] top-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-white/[0.05] to-transparent transform rotate-45" />
        <div className="absolute right-[25%] top-[10%] w-[1px] h-full bg-gradient-to-b from-transparent via-white/[0.05] to-transparent transform -rotate-12" />
      </div>

      <div className="relative z-10 container-wide py-16 flex flex-col justify-center">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center mb-24">

          {/* Left Column: Text & CTAs */}
          <div className="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <p className="text-copper text-[11px] font-semibold tracking-[0.2em] uppercase mb-6">
              {`Digital Profile Management`}
            </p>
            <h1 className="text-white text-5xl md:text-6xl lg:text-[68px] font-bold leading-[1.05] tracking-tight mb-6">
              {`Distinguish`}
              <br />
              <span className="text-copper">Yourself</span>
              <br />
              {`Online.`}
            </h1>
            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-[420px] mb-10">
              {`The world's pre-eminent digital profile management service for individuals who want to elevate their online visibility.`}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/profiles"
                className="inline-flex items-center gap-2 bg-copper hover:bg-copper-light text-white text-sm font-semibold tracking-wide px-7 py-3.5 rounded-sm transition-all duration-300"
              >
                {`View Our Profiles`}
                <ArrowRight size={16} />
              </Link>
              <a
                href="#about"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white/90 text-sm font-medium tracking-wide px-7 py-3.5 rounded-sm transition-all duration-300"
              >
                {`Learn More`}
              </a>
            </div>
          </div>

          {/* Right Column: Video Card */}
          <div className="relative lg:ml-auto w-full max-w-[540px] animate-in fade-in zoom-in-95 duration-1000 delay-150 fill-mode-both">
            {/* The offset wireframe border */}
            <div className="absolute top-6 -right-6 w-full h-full border border-white/10 rounded-sm pointer-events-none hidden md:block" />

            {/* Actual Working Video Player */}
            <MediaPlayer
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              poster="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200"
              title="The Marque — Who We Are"
              subtitle="Introduction"
              aspectRatio="aspect-[16/10]"
            />
          </div>
        </div>

        {/* Bottom Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
          {[
            { value: "2,400+", label: "Elite Profiles" },
            { value: "98%", label: "Client Retention" },
            { value: "40+", label: "Industries Served" },
            { value: "Top 3", label: "Google Ranking Avg." },
          ].map((stat, idx) => (
            <div key={idx}>
              <p className="text-copper text-3xl md:text-4xl font-bold tracking-tight mb-2">{stat.value}</p>
              <p className="text-white/50 text-xs md:text-sm font-medium tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}