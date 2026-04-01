import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfileBySlug } from "@/lib/profile";
import { ProfileSectionBlock } from "@/app/components/profile/ProfileSectionBlock";

type ProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  return (
    <div className="marque-shell">
      <main className="marque-container">
        <header className="marque-header">
          <div className="marque-logo">The Marque</div>
          <nav className="marque-nav" aria-label="Profile actions">
            <Link href="/">Profiles</Link>
          </nav>
        </header>

        <section className="marque-hero" style={{ paddingTop: "1.75rem" }}>
          <div className="marque-kicker">Profile</div>
          <h1 className="marque-title" style={{ maxWidth: "26ch" }}>
            {profile.name ?? "Untitled profile"}
          </h1>
          {profile.headline ? (
            <p className="marque-copy" style={{ maxWidth: "70ch" }}>
              {profile.headline}
            </p>
          ) : null}
          {profile.biography ? (
            <p className="marque-copy" style={{ marginTop: "1.25rem" }}>
              {profile.biography}
            </p>
          ) : null}
        </section>

        <div className="space-y-6">
          {(profile.sections ?? []).map((section) => (
            <ProfileSectionBlock
              key={section._key ?? section.title}
              section={section}
            />
          ))}
        </div>

        <footer className="marque-footer">© {new Date().getFullYear()} The Marque</footer>
      </main>
    </div>
  );
}
