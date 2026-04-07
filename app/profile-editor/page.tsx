import { redirect } from "next/navigation";

/** Legacy URL — custom page builder lives under `/profiles/[slug]/edit`. */
export default function ProfileEditorRedirect() {
  redirect("/profiles");
}
