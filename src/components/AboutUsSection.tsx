"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

export default function AboutUsSection() {
    const { ref, inView } = useInView();

    return (
        // The id="about" is what allows the header link to scroll here!
        <section id="about" className="bg-cream py-20 lg:py-28" ref={ref}>
            <div className="container-wide mx-auto">

                {/* Top: Founder Story */}
                <div
                    className={`flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start mb-10 transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    {/* Image */}
                    <div className="w-56 h-56 md:w-64 md:h-64 flex-shrink-0 relative rounded-sm overflow-hidden border border-graphite/10 shadow-sm">
                        <Image
                            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400"
                            alt="Andrew Wessels"
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="(max-width: 768px) 224px, 256px"
                        />
                    </div>

                    {/* Text */}
                    <div className="flex-1 pt-2">
                        <h2 className="text-4xl lg:text-5xl font-serif text-graphite mb-6 tracking-tight">About Us</h2>
                        <p className="text-graphite/80 text-sm md:text-base leading-relaxed font-light mb-8 max-w-xl">
                            The Marque was founded in 2017 by entrepreneur Andrew Wessels. With reputations increasingly being shaped online, he recognised the need for individuals to influence their digital presence. Today, The Marque successfully manages the digital profiles of many prominent people around the world.
                        </p>

                        {/* Custom Marque Profile Link */}
                        <Link href="/profiles" className="inline-flex items-center gap-3 group">
                            <div className="w-9 h-9 bg-[#2C323A] text-cream flex items-center justify-center font-serif text-lg rounded-sm group-hover:bg-copper transition-colors shadow-sm">
                                M
                            </div>
                            <span className="text-xs text-graphite/70 group-hover:text-copper transition-colors tracking-wide">
                                View {`Andrew's`} <span className="font-bold text-graphite group-hover:text-copper transition-colors">Marque Profile</span>
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={`mt-16 px-6 lg:px-18 container-wide transition-all duration-1000 delay-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>            
                <TestimonialCard
                quote="The Marque is a super-efficient platform for managing one's digital profile. The one thing that would really save me time would be if every person I was going to meet in my professional life had a Marque Profile. "
                authorName="Sally Tennant OBE"
                authorTitle="Founder, Acorn Capital Advisers"
                imageUrl="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600"
            />
            </div>
        </section>
    );
}