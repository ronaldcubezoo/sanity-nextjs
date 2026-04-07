/** Image / video / audio classification for Marque profile Gallery and Media blocks. */

export const MARQUE_PROFILE_MEDIA_KINDS = ["image", "video", "audio"] as const;
export type MarqueProfileMediaKind = (typeof MARQUE_PROFILE_MEDIA_KINDS)[number];

export function normalizeMarqueProfileMediaKind(v: unknown): MarqueProfileMediaKind {
  const s = String(v ?? "").toLowerCase().trim();
  if (s === "image" || s === "video" || s === "audio") return s;
  return "image";
}

export function labelForMarqueProfileMediaKind(k: MarqueProfileMediaKind): string {
  if (k === "image") return "Image";
  if (k === "video") return "Video";
  return "Audio";
}
