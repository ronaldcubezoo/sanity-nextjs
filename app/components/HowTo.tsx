"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TestimonialCard from "./TestimonialSection";

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect(); 
        }
      },
      { threshold: 0.1, rootMargin: "50px" } 
    );
    obs.observe(currentRef);
    return () => {
      if (currentRef) obs.unobserve(currentRef);
      obs.disconnect();
    };
  }, []);

  return { ref, inView };
}

export default function ApplicationSection() {
  const { ref, inView } = useInView();

  return (
    <section className="bg-white py-20 lg:py-28 px-6 lg:px-10" ref={ref}>
      <div className="container-wide mx-auto">
        
        {/* Top: How to have a Marque Profile */}
        <div className={`flex flex-col md:flex-row gap-12 lg:gap-20 items-center mb-24 transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-graphite mb-6 tracking-tight leading-tight">
              How to have a Marque Profile
            </h2>
            <p className="text-graphite/80 text-sm md:text-base leading-relaxed font-light mb-8 max-w-md">
              You can sign up for a Marque Profile via a referral from an existing client or by applying directly. We only approve individuals who meet our criteria and successfully undergo our thorough vetting process. Contact us to speak to a team member for more information.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-copper hover:bg-copper-light text-cream text-sm font-bold tracking-widest uppercase px-7 py-4 rounded-sm transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Enquire <ArrowRight size={16} />
            </Link>
          </div>

          {/* Image Side */}
          <div className="w-full md:flex-1 relative aspect-square md:aspect-[4/3] rounded-sm overflow-hidden shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800"
              alt="Professional reviewing documents"
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-graphite/5 mix-blend-multiply" />
          </div>
        </div>

        {/* Bottom: Dynamic Testimonial Card */}
        <div className={`container-wide transition-all duration-1000 delay-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <TestimonialCard 
            quote="As I have a variety of business interests and I don’t use any of the mass market networks, my Marque Profile is unique and enables me to show what I do in a definitive way. It also ranks brilliantly on Google and AI platforms, which has made it even more valuable."
            authorName="Rattan Chadha"
            authorTitle="Founder and Executive Chairman, citizenM"
            imageUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800"
            href="/profiles/rattan-chadha" 
          />
        </div>

      </div>
    </section>
  );
}