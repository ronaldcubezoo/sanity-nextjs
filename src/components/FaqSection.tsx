"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Minus } from "lucide-react";
import { faqs } from "../data/profiles";

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

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  const { ref, inView } = useInView();

  return (
    <section id="contact" className="bg-cream py-20 lg:py-28 px-6 lg:px-10" ref={ref}>
      <div className="container-wide mx-auto">
        <div className={`mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-copper text-xs tracking-[0.25em] uppercase mb-4">Questions & Answers</p>
          <h2 className="text-graphite text-4xl lg:text-5xl font-bold leading-tight">
            Frequently Asked
          </h2>
        </div>

        <div
          className={`space-y-0 transition-all duration-700 delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-graphite/10 last:border-0">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-6 text-left group"
              >
                <span className={`text-base font-medium tracking-tight transition-colors duration-200 ${open === i ? "text-copper" : "text-graphite group-hover:text-copper"}`}>
                  {faq.question}
                </span>
                <span className="flex-shrink-0 ml-4 w-6 h-6 rounded-full border border-graphite/20 flex items-center justify-center group-hover:border-copper transition-colors">
                  {open === i
                    ? <Minus size={13} className="text-copper" />
                    : <Plus size={13} className="text-graphite/60 group-hover:text-copper transition-colors" />
                  }
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${open === i ? "max-h-96 pb-6" : "max-h-0"}`}
              >
                <p className="text-graphite/60 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-14 p-8 bg-graphite rounded-sm transition-all duration-700 delay-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-cream/70 text-sm mb-1">Ready to distinguish yourself?</p>
          <h3 className="text-cream text-2xl font-bold mb-5">Begin Your Consultation</h3>
          <a
            href="mailto:enquiries@themarque.com"
            className="inline-flex items-center gap-2 bg-copper hover:bg-copper-light text-cream text-sm font-semibold tracking-wide px-6 py-3 rounded-sm transition-colors duration-200"
          >
            Enquire Now
          </a>
        </div>
      </div>
     


    </section>
  );
}
