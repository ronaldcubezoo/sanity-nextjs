import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ShareButton from "@/app/components/ShareButton";
import { Metadata } from "next";
import { insights } from "@/data/insights";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const insight = insights.find(i => i.id === resolvedParams.id);

    if (!insight) return { title: "Insight Not Found" };
    return {
        title: `${insight.title} | The Marque`,
        description: insight.summary,
    };
}

export async function generateStaticParams() {
    return insights.map((insight) => ({ id: insight.id }));
}

export default async function InsightPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const insight = insights.find(i => i.id === resolvedParams.id);

    if (!insight) notFound();

    return (
        <>
            <Header />
            <main className="min-h-screen bg-cream pb-24">
                <div className="relative w-full h-[60vh] min-h-[400px] bg-graphite flex items-end">
                    <Image
                        src={insight.image}
                        alt={insight.title}
                        fill
                        priority
                        className="object-cover"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1B1A] via-[#1A1B1A]/60 to-transparent" />

                    <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 w-full pb-16">
                        <Link href="/insights" className="inline-flex items-center gap-2 text-cream/60 hover:text-copper transition-colors text-sm font-medium mb-8">
                            <ArrowLeft size={16} /> Back to Insights
                        </Link>

                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-copper text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-sm">
                                {insight.category}
                            </span>
                            <span className="text-cream/60 text-sm font-medium">{insight.read_time}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-cream leading-[1.1] tracking-tight mb-6">
                            {insight.title}
                        </h1>

                        <p className="text-copper font-medium">By {insight.author}</p>
                    </div>
                </div>

                <article className="max-w-3xl mx-auto px-6 lg:px-10 pt-16">
                    <div className="text-lg text-graphite/80 leading-relaxed font-light">
                        {insight.content.map((block, idx) => {
                            if (block.type === "quote") {
                                return (
                                    <blockquote key={idx} className="border-l-4 border-graphite pl-6 py-2 my-10 bg-white shadow-sm p-6 rounded-r-sm">
                                        <p className="text-2xl font-serif text-graphite italic leading-snug">
                                            {block.text}
                                        </p>
                                    </blockquote>
                                );
                            }
                            return <p key={idx} className="mb-6">{block.text}</p>;
                        })}
                    </div>

                    <div className="mt-16 pt-8 border-t border-graphite/10 flex justify-between items-center">
                        <p className="text-sm text-graphite font-bold tracking-widest uppercase">The Marque Editorial</p>
                        <ShareButton title={insight.title} />
                    </div>
                </article>
            </main>
            <Footer />
        </>
    );
}