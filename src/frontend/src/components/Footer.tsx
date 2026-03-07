import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { Globe, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div>
      <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
        Newsletter
      </h4>
      <p className="text-xs text-sidebar-foreground/60 mb-3 leading-relaxed">
        Tips on web, security &amp; government services.
      </p>
      {subscribed ? (
        <p
          data-ocid="footer.newsletter.success_state"
          className="text-sm text-emerald-400 font-medium"
        >
          Subscribed! Thank you.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-ocid="footer.newsletter.input"
            className="h-9 text-sm bg-sidebar-foreground/10 border-sidebar-foreground/20 text-white placeholder:text-sidebar-foreground/50 focus-visible:ring-primary"
          />
          <Button
            type="submit"
            size="sm"
            data-ocid="footer.newsletter.submit_button"
            className="h-9 text-xs font-semibold gap-1.5"
          >
            <Send className="w-3 h-3" />
            Subscribe
          </Button>
        </form>
      )}
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-navy-deep text-sidebar-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                My Web Solutions
              </span>
            </div>
            <p className="text-sm text-sidebar-foreground/70 leading-relaxed max-w-xs">
              Professional web development, SaaS solutions, and IT certification
              services tailored for businesses across India.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-sidebar-foreground/70">
              <a
                href="tel:+919901563799"
                className="flex items-center gap-2 hover:text-teal transition-colors"
              >
                <Phone className="w-4 h-4 text-teal" />
                +91 99015 63799
              </a>
              <a
                href="mailto:mywebsoloutions97@gmail.com"
                className="flex items-center gap-2 hover:text-teal transition-colors"
              >
                <Mail className="w-4 h-4 text-teal" />
                mywebsoloutions97@gmail.com
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal flex-shrink-0" />
                Bengaluru, Karnataka, India
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", to: "/" },
                { label: "Services", to: "/services" },
                { label: "Pricing", to: "/pricing" },
                { label: "Blog", to: "/blog" },
                { label: "FAQ", to: "/faq" },
                { label: "Certifications", to: "/certification" },
                { label: "Case Studies", to: "/case-studies" },
                { label: "About", to: "/about" },
                { label: "Contact", to: "/contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sidebar-foreground/70 hover:text-teal transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                "SaaS Solutions",
                "Web Development",
                "Security Certifications",
                "Police Verification",
                "UMANG Guidance",
                "Resume Writing",
              ].map((s) => (
                <li key={s}>
                  <Link
                    to="/services"
                    className="text-sidebar-foreground/70 hover:text-teal transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <FooterNewsletter />
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-sidebar-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-sidebar-foreground/50">
          <p>© {year} My Web Solutions. All rights reserved.</p>
          <p>
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
