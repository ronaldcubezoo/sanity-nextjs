"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
  const handleShare = async () => {
    // Grab the current URL from the browser
    const url = window.location.href;

    // 1. Try to use the native mobile share sheet (iOS/Android)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} | The Marque`,
          url: url,
        });
      } catch (error) {
        console.log("Sharing cancelled or failed", error);
      }
    } else {
      // 2. Fallback for desktop browsers: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!", {
          description: "You can now paste the link anywhere.",
        });
      } catch (error) {
        toast.error("Failed to copy link.");
      }
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="flex items-center gap-2 text-copper text-sm font-semibold hover:text-copper-light transition-colors group"
      aria-label="Share this article"
    >
      <Share2 size={16} className="transition-transform group-hover:scale-110" />
      Share Article
    </button>
  );
}