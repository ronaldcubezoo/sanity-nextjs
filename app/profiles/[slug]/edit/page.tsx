import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import ProfileBuilderEditor from "@/app/components/profile-builder/ProfileBuilderEditor";
import { getComponentDefinitionsForBuilder, getProfileBySlug } from "@/lib/profile";

export default async function ProfileEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (!profile) {
    notFound();
  }
  const componentDefinitions = await getComponentDefinitionsForBuilder();

  return (
    <>
      <Header />
      <ProfileBuilderEditor
        profile={profile}
        componentDefinitions={componentDefinitions}
        profileSlug={slug}
      />
    </>
  );
}
