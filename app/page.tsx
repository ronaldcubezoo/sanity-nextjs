import { getProfiles, type Profile } from "@/lib/profile";
import { ProfileDirectory } from "@/app/components/ProfileDirectory";

export default async function Home() {
  let profiles: Profile[] = [];
  let loadError: string | null = null;

  try {
    profiles = await getProfiles();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Unable to load profiles";
  }

  return (
    <div className="marque-shell">
      <main className="marque-container">
        <header className="marque-header">
          <div className="marque-logo">The Marque</div>
        </header>

        <section className="marque-hero">
          <div className="marque-kicker">Distinguish yourself online</div>
          <h1 className="marque-title">The Marque Profiles</h1>
          <p className="marque-copy">
            Profiles are published from Sanity and read on this site. Use search to
            filter the list.
          </p>
        </section>

        <div className="marque-divider" />

        {loadError ? (
          <p className="marque-card" role="alert">
            Failed to load data: {loadError}
          </p>
        ) : null}

        {!loadError && profiles.length === 0 ? (
          <p className="marque-card">No profiles found.</p>
        ) : null}

        {profiles.length ? <ProfileDirectory profiles={profiles} /> : null}

        <footer className="marque-footer">© {new Date().getFullYear()} The Marque</footer>
      </main>
    </div>
  );
}
