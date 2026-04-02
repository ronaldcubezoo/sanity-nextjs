import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const companyLinks = [
    { name: "Profiles", href: "/profiles" },
    { name: "About Us", href: "/#about" }, // Links to the ID on the home page
    { name: "Insights", href: "/insights" },
    { name: "Contact Us", href: "/contact" },
    { name: "The Marque Seal", href: "/#seal" },
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ];

  return (
    <footer className="bg-graphite-dark border-t border-graphite-light/20 pt-16 pb-8">
      <div className="container-wide">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          
          {/* Column 1: Brand */}
          <div>
            <p className="text-copper font-bold text-lg tracking-widest uppercase mb-3">The Marque</p>
            <p className="text-cream/40 text-sm leading-relaxed max-w-xs">
              The world's pre-eminent digital profile management service for executives, leaders, and high-net-worth individuals.
            </p>
            <p className="text-cream/25 text-xs mt-6">© {new Date().getFullYear()} The Marque Digital. All rights reserved.</p>
          </div>

          {/* Column 2: Company links (Wired up) */}
          <div>
            <p className="text-cream/50 text-xs tracking-[0.2em] uppercase mb-5">Company</p>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-cream/60 hover:text-copper text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal + Social */}
          <div>
            <p className="text-cream/50 text-xs tracking-[0.2em] uppercase mb-5">Legal</p>
            <ul className="space-y-3 mb-8">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-cream/60 hover:text-copper text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <p className="text-cream/50 text-xs tracking-[0.2em] uppercase mb-4">Social</p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-graphite-light/50 flex items-center justify-center text-cream/50 hover:text-copper hover:border-copper transition-colors">
                <Instagram size={15} />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full border border-graphite-light/50 flex items-center justify-center text-cream/50 hover:text-copper hover:border-copper transition-colors">
                <Linkedin size={15} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-graphite-light/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-cream/20 text-xs">
            Registered in England & Wales · Company No. 00000000
          </p>
          <p className="text-copper/50 text-xs tracking-widest uppercase">Distinction by Design</p>
        </div>
      </div>
    </footer>
  );
}