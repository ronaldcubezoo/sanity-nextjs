import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ArrowLeft, ArrowRight, Download, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { getProfileBySlug, getProfiles } from "@/lib/profile"; //
import { getProfileImage } from "@/lib/profile-images"; //

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // 1. Fetch current profile AND the full directory list
  const rawProfile = await getProfileBySlug(slug);
  const allProfiles = await getProfiles();
  
  if (!rawProfile) {
    notFound();
  }

  // 2. Map data to UI structure/page.tsx]
  const profile = {
    id: rawProfile.slug?.current || rawProfile._id,
    name: rawProfile.name || "Unknown Name",
    title: rawProfile.headline || "",
    bio: rawProfile.biography || "",
    verified: true,
    sections: (rawProfile.sections || []).map((sec) => ({
      category: sec.title || sec.type || "Section",
      items: (sec.items || []).map((item) => ({
        label: item.organization || item.title || "Organization",
        detail: item.role || item.description || "",
        year: item.date || item.location || "",
      }))
    }))
  };

  const profilePic = getProfileImage(profile.id); //

  // 3. Calculate Previous and Next Profiles
  const currentIndex = allProfiles.findIndex(p => (p.slug?.current || p._id) === profile.id);
  const prevProfile = currentIndex > 0 ? allProfiles[currentIndex - 1] : null;
  const nextProfile = currentIndex < allProfiles.length - 1 ? allProfiles[currentIndex + 1] : null;

  return (
    <>
      <Header />

      {/* ── Desktop Floating Navigation Arrows ── */}
      {prevProfile && (
        <Link 
          href={`/profiles/${prevProfile.slug?.current || prevProfile._id}`}
          className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white border border-graphite/10 rounded-full items-center justify-center text-graphite/30 hover:text-copper hover:border-copper/40 shadow-sm hover:shadow-lg transition-all z-40 group"
          title={`Previous: ${prevProfile.name}`}
        >
          <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
        </Link>
      )}
      
      {nextProfile && (
        <Link 
          href={`/profiles/${nextProfile.slug?.current || nextProfile._id}`}
          className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white border border-graphite/10 rounded-full items-center justify-center text-graphite/30 hover:text-copper hover:border-copper/40 shadow-sm hover:shadow-lg transition-all z-40 group"
          title={`Next: ${nextProfile.name}`}
        >
          <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}

      <main className="relative min-h-screen bg-cream pt-28 pb-20">
        
        {/* Top Action Bar */}
        <div className="max-w-5xl mx-auto px-6 lg:px-10 mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <Link href="/profiles" className="inline-flex items-center gap-2 text-graphite/60 hover:text-copper transition-colors text-sm font-medium group">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> 
            Back to Directory
          </Link>
          
          <button className="inline-flex items-center gap-2 text-graphite hover:text-copper transition-colors text-sm font-medium border border-graphite/20 px-4 py-2 rounded-sm hover:border-copper/50 bg-white">
            <Download size={16} /> Download Profile (PDF)
          </button>
        </div>

        <article className="max-w-5xl mx-auto px-6 lg:px-10">
          
          {/* Hero Section */}
          <div className="bg-white border border-graphite/10 rounded-sm p-8 md:p-12 mb-8 shadow-sm flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
            <div className="relative w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-sm overflow-hidden border border-graphite/10 bg-graphite/5">
              <Image
                src={profilePic}
                alt={`Portrait of ${profile.name}`}
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 768px) 160px, 224px"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-graphite tracking-tight">{profile.name}</h1>
                {profile.verified && <BadgeCheck size={24} className="fill-copper text-white flex-shrink-0" />}
              </div>
              <p className="text-lg md:text-xl text-copper font-medium mb-6">{profile.title}</p>
              <div className="text-graphite/80 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                <p>{profile.bio}</p>
              </div>
            </div>
          </div>

          {/* Modular Sections Grid */}
          {profile.sections && profile.sections.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {profile.sections.map((section: any, idx: number) => (
                <section key={idx} className="bg-white border border-graphite/10 rounded-sm p-8 shadow-sm">
                  <h2 className="text-copper font-bold text-xs tracking-widest uppercase mb-6 border-b border-graphite/10 pb-4">
                    {section.category}
                  </h2>
                  <ul className="space-y-6">
                    {section.items?.map((item: any, i: number) => (
                      <li key={i} className="flex flex-col">
                        <span className="text-graphite font-semibold text-base">{item.label}</span>
                        {item.detail && <span className="text-graphite/60 text-sm mt-1">{item.detail}</span>}
                        {item.year && <span className="text-copper/80 text-xs mt-1.5 font-medium">{item.year}</span>}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}

          {/* ── Bottom Prev/Next Footer (Mobile & Tablet Only) ── */}
          <div className="lg:hidden flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-graphite/15">
            {prevProfile ? (
              <Link 
                href={`/profiles/${prevProfile.slug?.current || prevProfile._id}`}
                className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-3 p-4 bg-white border border-graphite/10 rounded-sm hover:border-copper/40 transition-colors group"
              >
                <ChevronLeft size={18} className="text-graphite/40 group-hover:text-copper transition-colors" />
                <div className="text-left">
                  <p className="text-[10px] font-bold text-graphite/40 tracking-widest uppercase mb-0.5">Previous</p>
                  <p className="text-sm font-semibold text-graphite group-hover:text-copper transition-colors">{prevProfile.name}</p>
                </div>
              </Link>
            ) : <div className="hidden sm:block" />}

            {nextProfile ? (
              <Link 
                href={`/profiles/${nextProfile.slug?.current || nextProfile._id}`}
                className="w-full sm:w-auto flex items-center justify-center sm:justify-end gap-3 p-4 bg-white border border-graphite/10 rounded-sm hover:border-copper/40 transition-colors group text-right"
              >
                <div>
                  <p className="text-[10px] font-bold text-graphite/40 tracking-widest uppercase mb-0.5">Next</p>
                  <p className="text-sm font-semibold text-graphite group-hover:text-copper transition-colors">{nextProfile.name}</p>
                </div>
                <ChevronRight size={18} className="text-graphite/40 group-hover:text-copper transition-colors" />
              </Link>
            ) : <div className="hidden sm:block" />}
          </div>

        </article>
      </main>
      <Footer />
    </>
  );
}