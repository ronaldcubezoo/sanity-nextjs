import Link from "next/link";
import Image from "next/image";
import type { Profile } from "@/lib/profile";
import { getProfileImage } from "@/lib/profile-images";

type ProfileCardProps = {
  profile: Profile;
};

export function ProfileCard({ profile }: ProfileCardProps) {
  const profilePic = getProfileImage(profile._id);

  return (
    <article className="marque-card flex flex-col h-full">
      <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-sm border border-surface-border bg-surface">
        <Image 
          src={profilePic}
          alt={profile.name ?? "Profile"}
          fill
          className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
        />
      </div>
      <div className="marque-meta uppercase tracking-widest text-[10px]">
        {(profile.sections?.length ?? 0).toString()} sections
      </div>
      <h2 className="mt-2 text-xl font-semibold font-serif">
        {profile.name ?? "Untitled profile"}
      </h2>
      {profile.headline ? (
        <p className="mt-1 text-sm text-muted line-clamp-2 italic">
          {profile.headline}
        </p>
      ) : null}
      <div className="mt-auto pt-4">
        {profile.slug?.current ? (
          <Link
            href={`/profiles/${profile.slug.current}`}
            className="marque-button w-full text-center"
          >
            View Profile
          </Link>
        ) : null}
      </div>
    </article>
  );
}