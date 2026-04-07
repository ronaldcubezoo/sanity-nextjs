"use client"; // CRITICAL: This must be at the very top for any component using React hooks like useState or Next.js client routers

import { useState, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import Link from "next/link"; // Replaced react-router-dom Link
import { useRouter } from "next/navigation"; // Replaced react-router-dom useNavigate

const navLinks = [
  { label: "About Us", href: "/#about" },
  { label: "Profiles", href: "/profiles" },
  { label: "Page builder", href: "/profiles" },
  { label: "Insights", href: "/insights" },
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [headerQuery, setHeaderQuery] = useState("");
  const router = useRouter(); // Next.js specific routing hook

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup function just in case the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const handleHeaderSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && headerQuery.trim()) {
      router.push(`/profiles?q=${encodeURIComponent(headerQuery.trim())}`); // Next.js push method
      setHeaderQuery("");
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-graphite border-b border-graphite-light/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 mr-4">
            <span className="text-copper font-bold text-xl tracking-widest uppercase">The Marque</span>
          </Link>

          {/* Search Bar */}
          <div
            className={`hidden md:flex flex-1 max-w-xs items-center gap-2 border rounded-sm px-3 py-1.5 transition-colors duration-200 ${searchFocused ? "border-copper" : "border-graphite-light"
              }`}
          >
            <Search size={14} className="text-cream/40 flex-shrink-0" />
            <input
              type="text"
              value={headerQuery}
              onChange={(e) => setHeaderQuery(e.target.value)}
              onKeyDown={handleHeaderSearch}
              placeholder="Search for a profile"
              className="bg-transparent text-sm text-cream placeholder-cream/35 outline-none w-full"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 ml-auto">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-cream/70 hover:text-copper transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-3 ml-auto">
            <button
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="text-cream/70 hover:text-copper transition-colors"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-graphite-dark flex flex-col pt-20 px-6 transition-all duration-300 md:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Mobile search */}
        <div className="flex items-center gap-2 border border-graphite-light rounded-sm px-4 py-2.5 mb-8">
          <Search size={15} className="text-cream/40" />
          <input
            type="text"
            placeholder="Search for a profile"
            className="bg-transparent text-sm text-cream placeholder-cream/35 outline-none w-full"
            value={headerQuery}
            onChange={(e) => setHeaderQuery(e.target.value)}
            onKeyDown={(e) => {
              handleHeaderSearch(e);
              if (e.key === "Enter") setMenuOpen(false); // Close menu on search
            }}
          />
        </div>
        <nav className="flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-lg text-cream/80 hover:text-copper transition-colors tracking-wide border-b border-graphite-light/30 pb-4"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}