import { Button } from "@/components/ui/button";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/", ocid: "nav.home_link" },
  { label: "Services", href: "/services", ocid: "nav.services_link" },
  { label: "Pricing", href: "/pricing", ocid: "nav.pricing_link" },
  { label: "Blog", href: "/blog", ocid: "nav.blog_link" },
  { label: "FAQ", href: "/faq", ocid: "nav.faq_link" },
  {
    label: "Certifications",
    href: "/certification",
    ocid: "nav.certification_link",
  },
  {
    label: "Case Studies",
    href: "/case-studies",
    ocid: "nav.casestudies_link",
  },
  { label: "About", href: "/about", ocid: "nav.about_link" },
  { label: "Contact", href: "/contact", ocid: "nav.contact_link" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 nav-blur border-b border-border shadow-nav">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/assets/generated/logo-mws.dim_200x200.jpg"
            alt="My Web Solutions Logo"
            className="w-10 h-10 rounded-xl object-cover shadow-sm border border-border"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                data-ocid={link.ocid}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button asChild size="sm" className="font-medium">
            <Link to="/contact">Get Started</Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  data-ocid={link.ocid}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 pb-1">
              <Button asChild size="sm" className="w-full font-medium">
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
