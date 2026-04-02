import { ArrowRight, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { Profile } from "../../data/profiles";
import Image from "next/image";

interface ProfileCardProps {
  profile: Profile;
  index?: number;
}

export default function ProfileCard({ profile, index = 0 }: ProfileCardProps) {
  return (
    <Link
      href={`/profiles/${profile.id}`}
      className="group block bg-cream border border-graphite/10 rounded-sm overflow-hidden hover:shadow-lg hover:border-copper/30 transition-all duration-300"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Headshot */}
      <div className="aspect-[4/3] overflow-hidden bg-graphite/5 relative">
        <Image
          src={profile.image}
          alt={profile.name}
          loading="lazy"
          width={400}
          height={300}
          unoptimized
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        {profile.marqueApproved && (
          <div className="absolute top-3 right-3 bg-graphite/90 backdrop-blur-sm text-copper text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-sm flex items-center gap-1.5">
            <BadgeCheck size={10} className="fill-copper text-graphite" />
            Marque Approved
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="text-graphite font-bold text-base leading-snug tracking-tight group-hover:text-copper transition-colors">
            {profile.name}
          </h3>
          {profile.verified && (
            <BadgeCheck size={16} className="flex-shrink-0 fill-copper text-cream mt-0.5" />
          )}
        </div>
        <p className="text-graphite/55 text-xs leading-relaxed mb-4 line-clamp-2">{profile.title}</p>

        {/* Category tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {profile.category.slice(0, 2).map((cat) => (
            <span key={cat} className="text-[10px] text-copper/80 border border-copper/25 px-2 py-0.5 rounded-sm tracking-wide">
              {cat}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-copper text-xs font-semibold tracking-wide group-hover:gap-2.5 transition-all duration-200">
          View Profile
          <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  );
}
