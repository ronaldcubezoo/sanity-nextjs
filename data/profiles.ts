export type Profile = {
  id: string;
  name: string;
  title: string;
  subtitle?: string;
  category: string[];
  image: string;
  heroImage?: string;
  bio: string;
  bioExtended?: string;
  verified: boolean;
  marqueApproved?: boolean;
  location?: string;
  nationality?: string;
  sections: ProfileSection[];
  externalLinks?: ExternalLink[];
  gallery?: GalleryItem[];
  featuredQuote?: string;
};

export type ProfileSection = {
  category: string;
  icon?: string;
  verified?: boolean;
  items: { label: string; detail?: string; source?: string; year?: string }[];
};

export type ExternalLink = {
  type: "website" | "linkedin" | "twitter" | "instagram" | "company";
  label: string;
  url: string;
};

export type GalleryItem = {
  url: string;
  caption: string;
};

export type FAQ = {
  question: string;
  answer: string;
};


export const faqs: FAQ[] = [
  {
    question: "What can I include on my Marque Profile?",
    answer: "There are over 30 section categories including charitable interests, board positions, awards, education, and a gallery. Your profile can also link to external sources like corporate websites or media articles.",
  },
  {
    question: "How is my profile managed?",
    answer: "You are assigned a dedicated Profile Manager who checks in regularly to review content and monitor performance on search engines and AI platforms.",
  },
  {
    question: "How much does it cost?",
    answer: "We offer a 12-month subscription-based service with a one-time setup fee, tailored to your specific professional needs.",
  },
];
