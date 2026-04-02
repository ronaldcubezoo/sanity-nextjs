"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export interface TestimonialProps {
  quote: string;
  authorName: string;
  authorTitle: string;
  imageUrl: string;
  href?: string; // Optional: Makes the entire card a clickable link
}

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
import Link from "next/link";


export default function TestimonialCard({ quote, authorName, authorTitle, imageUrl, href }: TestimonialProps) {
  const CardContent = (
    <div className="bg-[#2C323A] rounded-sm overflow-hidden flex flex-col md:flex-row items-center relative shadow-xl hover:shadow-2xl hover:shadow-copper/10 transition-all duration-300 group w-full">
      {/* Text Side */}
      <div className="py-10 md:p-16 flex-1 z-10">
        <div className="text-[#4A5562] text-6xl lg:text-7xl font-serif leading-none mb-2 select-none group-hover:text-copper transition-colors duration-500">“</div>
        <p className="text-cream/90 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-lg -mt-4">
          {quote}
        </p>
        <div>
          <p className="text-cream font-bold tracking-wide text-sm mb-1">{authorName}</p>
          <p className="text-cream/60 text-xs tracking-wide">{authorTitle}</p>
        </div>
      </div>
      
      {/* Image Side */}
      <div className="w-full md:w-2/5 h-72 md:h-full relative min-h-[350px]">
        <Image 
          src={imageUrl} 
          alt={authorName} 
          fill 
          unoptimized
          className="object-cover object-top md:object-right-top opacity-90 group-hover:scale-100 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C323A] via-transparent to-transparent md:bg-gradient-to-l md:from-transparent md:via-[#2C323A]/50 md:to-[#2C323A]" />
      </div>
    </div>
  );

  // If an href is provided, wrap the content in a Next.js Link
  if (href) {
    return (
      <Link href={href} className="block w-full">
        {CardContent}
      </Link>
    );
  }

  // Otherwise, return just the static card
  return CardContent;
}
