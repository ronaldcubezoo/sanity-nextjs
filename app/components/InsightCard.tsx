import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";

interface InsightCardProps {
  article: any;
  index?: number;
}

export default function InsightCard({ article, index = 0 }: InsightCardProps) {
  return (
    <Link
      href={`/insights/${article.id}`}
      className="group block bg-cream border border-graphite/10 rounded-sm overflow-hidden hover:shadow-lg hover:border-copper/30 transition-all duration-300 ease-in-out"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <div className="aspect-[16/10] overflow-hidden relative bg-graphite">
        <Image
          src={article.image}
          alt={article.title}
          fill
          unoptimized
          className="object-cover opacity-90 transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute top-3 left-3 bg-copper text-cream text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-sm">
          {article.category}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1.5 text-graphite/40 text-xs mb-3">
          <Clock size={11} />
          <span>{article.read_time}</span>
          {article.date && (
            <>
              <span className="text-graphite/20">·</span>
              <span>{article.date}</span>
            </>
          )}
        </div>
        <h3 className="text-graphite font-bold text-base leading-snug tracking-tight mb-2 group-hover:text-copper transition-colors duration-200">
          {article.title}
        </h3>
        <p className="text-graphite/50 text-xs leading-relaxed mb-4 line-clamp-2">
          {article.summary}
        </p>
        <div className="flex items-center gap-1.5 text-copper text-xs font-semibold tracking-wide group-hover:gap-2.5 transition-all duration-200">
          Read Article
          <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}