import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Building,
  CalendarClock,
  CheckCircle,
  Clapperboard,
  Cloud,
  Code2,
  FileText,
  Globe,
  MessageSquare,
  Shield,
  UserCheck,
} from "lucide-react";
import { motion } from "motion/react";

const categories = [
  {
    id: "web-saas",
    label: "Web & SaaS Solutions",
    badge: "Core Offering",
    primary: true,
    description:
      "Our flagship digital products — the primary focus of My Web Solutions.",
    services: [
      {
        icon: Cloud,
        title: "SaaS Service Management System",
        description:
          "Our core product. A complete cloud-based service management platform designed for small businesses. Manage clients, services, and operations in one place.",
        tags: ["Core Product", "Cloud", "Small Business"],
      },
      {
        icon: Code2,
        title: "Small Business Website Development",
        description:
          "Professional websites built for small businesses. Fast, mobile-ready, and built to generate leads.",
        tags: ["Website", "Mobile-Ready", "Lead Gen"],
      },
      {
        icon: MessageSquare,
        title: "WhatsApp Business Integration",
        description:
          "Set up and integrate WhatsApp Business API into your operations. Automate responses, manage customer chats professionally.",
        tags: ["WhatsApp", "Automation", "Customer Service"],
      },
      {
        icon: Globe,
        title: "Google Business Profile Setup",
        description:
          "Get your business found on Google Maps and Search. Complete Google Business Profile setup and optimization.",
        tags: ["Google", "Local SEO", "Visibility"],
      },
    ],
  },
  {
    id: "security",
    label: "Security & Compliance",
    badge: null,
    primary: false,
    description:
      "Corporate-grade security services backed by 11+ years of field experience.",
    services: [
      {
        icon: Shield,
        title: "Security Certification Advisory",
        description:
          "Individual security certifications: CSA, CSS, CSI, CSM, CSD through Corp International. Guidance from an accredited advisor.",
        tags: ["CSA", "CSS", "Corp International"],
      },
      {
        icon: FileText,
        title: "Corporate Security SOP Documentation",
        description:
          "Professional standard operating procedures for corporate security teams. Structured, compliant, and audit-ready documentation.",
        tags: ["SOP", "Compliance", "Documentation"],
      },
      {
        icon: Building,
        title: "Risk Assessment Consultation",
        description:
          "Structured risk assessment for businesses and events. Identify vulnerabilities and build mitigation strategies.",
        tags: ["Risk", "Assessment", "Strategy"],
      },
      {
        icon: CalendarClock,
        title: "Event Security Planning",
        description:
          "End-to-end security planning for corporate events, conferences, and gatherings. From threat assessment to on-ground coordination.",
        tags: ["Events", "Security", "Planning"],
      },
    ],
  },
  {
    id: "government",
    label: "Government & Document Services",
    badge: null,
    primary: false,
    description:
      "Helping individuals and businesses navigate government processes with ease.",
    services: [
      {
        icon: UserCheck,
        title: "Police Verification Assistance",
        description:
          "Assistance with Character, Address, and Tenant police verification processes. Guidance on documentation and submission.",
        tags: ["Character", "Address", "Tenant"],
      },
      {
        icon: Briefcase,
        title: "UMANG App Government Services",
        description:
          "Step-by-step guidance for using the UMANG government app. PF withdrawal, Aadhaar linking, DigiLocker, Pension, and more.",
        tags: ["PF", "Aadhaar", "DigiLocker"],
      },
    ],
  },
  {
    id: "career",
    label: "Career & Creative",
    badge: null,
    primary: false,
    description:
      "Professional development and creative services for individuals and brands.",
    services: [
      {
        icon: BookOpen,
        title: "Resume Writing & Job Interview Prep",
        description:
          "Professional resume writing and mock interview preparation. Tailored for corporate security and IT sector roles.",
        tags: ["Resume", "Interview", "Career"],
      },
      {
        icon: Clapperboard,
        title: "AI Movie & Digital Content Creation",
        description:
          "AI-assisted movie scripts, digital content, and creative media production for brands and individuals.",
        tags: ["AI", "Content", "Creative"],
      },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Services() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header — light */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-16 bg-background hero-grid border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground uppercase tracking-widest mb-5">
              All Services
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-foreground mb-4">
              Our Services
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              12 professional services across web, SaaS, security, government,
              and career — structured, reliable, and results-focused.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4 space-y-16">
          {categories.map((cat, catIndex) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIndex * 0.05 }}
            >
              {/* Category Header */}
              <div
                className={`rounded-xl p-5 mb-6 border ${
                  cat.primary
                    ? "bg-primary/5 border-primary/20"
                    : "bg-secondary/50 border-border"
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
                    {cat.label}
                  </h2>
                  {cat.badge && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground uppercase tracking-wide">
                      {cat.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {cat.description}
                </p>
              </div>

              {/* Service Cards */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`grid grid-cols-1 md:grid-cols-2 ${
                  cat.services.length === 4
                    ? "lg:grid-cols-4"
                    : "lg:grid-cols-2"
                } gap-5`}
              >
                {cat.services.map((service) => (
                  <motion.div key={service.title} variants={itemVariants}>
                    <Card
                      className={`h-full transition-all duration-300 hover:-translate-y-1 border-border ${
                        cat.primary
                          ? "hover:shadow-card hover:border-primary/20"
                          : "hover:shadow-xs"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center mb-4">
                          <service.icon className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-display text-base font-bold text-foreground mb-2 leading-snug">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          {service.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {service.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-accent/60 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <CheckCircle className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Every business is different. Let's talk about what you need.
            </p>
            <Button
              asChild
              size="lg"
              data-ocid="services.cta_button"
              className="font-semibold shadow-md"
            >
              <Link to="/contact">
                Contact Us <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
