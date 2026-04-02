/** Domain shape used by the app UI (decoupled from Sanity document JSON). */

export type SectionItem = {
  _key?: string;
  title?: string;
  type?: string;
  role?: string;
  date?: string;
  description?: string;
  organization?: string;
  location?: string;
  displayOrder?: number;
};

export type ProfileSection = {
  _key?: string;
  title?: string;
  displayOrder?: number;
  gridColumns?: number;
  type?: string;
  items?: SectionItem[];
};

export type Profile = {
  _id: string;
  name?: string;
  slug?: { current?: string };
  headline?: string;
  biography?: string;
  sections?: ProfileSection[];
};
