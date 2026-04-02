"use client";
import { useState } from "react";
import { Mail } from "lucide-react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="bg-graphite border-t border-graphite-light/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-copper/30 mb-6">
            <Mail size={16} className="text-copper" />
          </div>
          <h2 className="text-cream text-2xl lg:text-3xl font-bold tracking-tight mb-3">
            Join The Marque
          </h2>
          <p className="text-cream/50 text-sm leading-relaxed mb-8">
            Exclusive professional insights on digital reputation, executive visibility, and the future of personal branding.
          </p>
          {subscribed ? (
            <div className="inline-flex items-center gap-2 text-copper text-sm font-semibold tracking-wide">
              <span className="w-4 h-4 rounded-full bg-copper/20 flex items-center justify-center text-[10px]">✓</span>
              You're on the list. Welcome to The Marque.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Your professional email"
                className="flex-1 bg-graphite-light/40 border border-cream/15 focus:border-copper text-cream placeholder-cream/30 text-sm px-4 py-3 rounded-sm outline-none transition-colors duration-200"
              />
              <button
                type="submit"
                className="bg-copper hover:bg-copper-light text-cream text-sm font-semibold tracking-wide px-6 py-3 rounded-sm transition-colors duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}