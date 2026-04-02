"use client";
import { useEffect, useRef, useState } from "react";
import { TrendingUp, ShieldCheck, BadgeCheck } from "lucide-react";
import TestimonialCard from "./TestimonialSection";

const values = [
  {
    icon: TrendingUp,
    title: "Optimisation",
    desc: "Your profile is continuously refined to dominate search rankings. We leverage AI-driven SEO strategies to ensure your name surfaces first — in the right context, for the right audience.",
    detail: "Keyword architecture · AI prominence scoring · Continuous iteration",
  },
  {
    icon: ShieldCheck,
    title: "Credibility",
    desc: "Every claim on your profile is substantiated and verified. We curate and authenticate your career achievements, affiliations, and accolades to build an unassailable digital identity.",
    detail: "Verified content · Source attribution · Reputation safeguarding",
  },
  {
    icon: BadgeCheck,
    title: "Independently Approved",
    desc: "The Marque Seal is awarded to profiles that meet our rigorous editorial standards. It signals authenticity and distinction to boards, investors, and media worldwide.",
    detail: "Editorial review · Third-party validation · The Marque Seal",
  },
];

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    // 1. Capture the current ref to avoid React cleanup errors
    const currentRef = ref.current;
    if (!currentRef) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect(); // CRITICAL: Stop observing once it appears so it never glitches out
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px" // CRITICAL: Triggers the animation 50px *before* it enters the screen so it doesn't get stuck
      }
    );

    obs.observe(currentRef);

    // 2. Clean up properly when navigating away
    return () => {
      if (currentRef) obs.unobserve(currentRef);
      obs.disconnect();
    };
  }, []);

  return { ref, inView };
}

export default function ValuePropsSection() {
  const { ref, inView } = useInView();

  return (
    <section id="why-the-marque" className="bg-white py-20 lg:py-28 px-6 lg:px-10" ref={ref}>
      <div className="container-wide">
        <div className={`mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-copper text-xs tracking-[0.25em] uppercase mb-4">Why The Marque</p>
          <h2 className="text-graphite text-4xl lg:text-5xl font-bold leading-tight max-w-xl">
            The Standard for Elite Digital Presence
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-7">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className={`group border border-graphite/10 rounded-sm p-8 bg-cream hover:bg-graphite transition-all duration-500 cursor-default ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                style={{ transitionDelay: inView ? `${i * 0.12}s` : "0s" }}
              >
                <div className="mb-6 w-10 h-10 rounded-full border border-copper/30 flex items-center justify-center group-hover:bg-copper/10 transition-colors">
                  <Icon size={18} className="text-copper" />
                </div>
                <h3 className="text-graphite group-hover:text-cream text-xl font-bold tracking-tight mb-3 transition-colors">
                  {v.title}
                </h3>
                <p className="text-graphite/60 group-hover:text-cream/55 text-sm leading-relaxed mb-6 transition-colors">
                  {v.desc}
                </p>
                <p className="text-copper text-xs tracking-widest uppercase border-t border-copper/20 pt-4">
                  {v.detail}
                </p>
              </div>
            );
          })}
        </div>

      </div>
      <div className={`mt-16 container-wide transition-all duration-1000 delay-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}> 
        <TestimonialCard
          quote="In an increasingly digital business enviroment, it is essential to have a curated digital profile - The Marque does just that. Consider your Marque profile as your digital business card."
          authorName="Ronan Dunne"
          authorTitle="Chairman, Six Nations Rugby"
          imageUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800"
          href="/profiles/rattan-chadha"
        />
      </div>
    </section>
  );
}
