"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { createProfileDocument } from "@/app/actions/create-profile-action";

export default function NewProfilePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const result = await createProfileDocument(fd);
    setPending(false);
    if (result.ok) {
      router.push(`/profiles/${result.slug}/edit`);
      return;
    }
    setError(result.error);
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="max-w-lg mx-auto px-6 lg:px-10 pt-28 pb-16">
        <p className="text-copper text-xs tracking-[0.25em] uppercase mb-3">Profiles</p>
        <h1 className="text-graphite text-3xl font-bold tracking-tight mb-2">
          New profile
        </h1>
        <p className="text-graphite/60 text-sm mb-8">
          Creates a published profile in Sanity, then opens the page builder. You can
          also create profiles in{" "}
          <Link href="/studio" className="text-copper hover:underline">
            Sanity Studio
          </Link>
          .
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Profile name</Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="e.g. Jane Doe"
              className="bg-cream border-graphite/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">URL slug (optional)</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="Leave blank to derive from name"
              className="bg-cream border-graphite/20"
            />
            <p className="text-graphite/45 text-xs">
              Lowercase letters, numbers, and hyphens. Must be unique.
            </p>
          </div>

          {error ? (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={pending} className="bg-copper hover:bg-copper/90">
              {pending ? "Creating…" : "Create & open page builder"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/profiles">Cancel</Link>
            </Button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
