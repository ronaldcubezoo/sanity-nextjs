import Link from "next/link";
import type { Profile } from "@/lib/profile";

type ProfileCardProps = {
  profile: Profile;
};

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <article className="marque-card">
      <div className="marque-meta">
        {(profile.sections?.length ?? 0).toString()} sections
      </div>
      <h2 className="mt-2 text-xl font-semibold">
        {profile.name ?? "Untitled profile"}
      </h2>
      {profile.headline ? <p className="mt-1 text-sm">{profile.headline}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {profile.slug?.current ? (
          <Link
            href={`/profiles/${profile.slug.current}`}
            className="marque-button marque-button-secondary"
          >
            View
          </Link>
        ) : null}
      </div>
    </article>
  );
}
