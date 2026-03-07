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
  Mail,
  MessageSquare,
  MessageSquareText,
  Shield,
  UserCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

const WHATSAPP_NUMBER = "919901563799";
const MAIL_ADDRESS = "mywebsoloutions97@gmail.com";

const categories = [
  {
    id: "web-saas",
    label: "Web & SaaS Solutions",
    badge: "Core Offering",
    primary: true,
    description:
      "Our flagship digital products — the primary focus of My Web Solutions.",
    bannerImage: "/assets/generated/service-banner-web-saas.dim_800x400.jpg",
    services: [
      {
        icon: Cloud,
        title: "SaaS Service Management System",
        image: "/assets/generated/service-saas-management.dim_600x360.jpg",
        description:
          "Our core product. A complete cloud-based service management platform designed for small businesses. Manage clients, services, and operations in one place.",
        tags: ["Core Product", "Cloud", "Small Business"],
      },
      {
        icon: Code2,
        title: "Small Business Website Development",
        image: "/assets/generated/service-website-dev.dim_600x360.jpg",
        description:
          "Professional websites built for small businesses. Fast, mobile-ready, and built to generate leads.",
        tags: ["Website", "Mobile-Ready", "Lead Gen"],
      },
      {
        icon: MessageSquare,
        title: "WhatsApp Business Integration",
        image: "/assets/generated/service-whatsapp-integration.dim_600x360.jpg",
        description:
          "Set up and integrate WhatsApp Business API into your operations. Automate responses, manage customer chats professionally.",
        tags: ["WhatsApp", "Automation", "Customer Service"],
      },
      {
        icon: Globe,
        title: "Google Business Profile Setup",
        image: "/assets/generated/service-google-business.dim_600x360.jpg",
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
    bannerImage: "/assets/generated/service-banner-security.dim_800x400.jpg",
    services: [
      {
        icon: Shield,
        title: "Security Certification Advisory",
        image:
          "/assets/generated/service-security-certification.dim_600x360.jpg",
        description:
          "Individual security certifications: CSA, CSS (Specialist), CSI (Investigator), CSM, CSD through Corp International. Guidance from an accredited advisor.",
        tags: ["CSA", "CSS", "Corp International"],
      },
      {
        icon: FileText,
        title: "Corporate Security SOP Documentation",
        image: "/assets/generated/service-sop-documentation.dim_600x360.jpg",
        description:
          "Professional standard operating procedures for corporate security teams. Structured, compliant, and audit-ready documentation.",
        tags: ["SOP", "Compliance", "Documentation"],
      },
      {
        icon: Building,
        title: "Risk Assessment Consultation",
        image: "/assets/generated/service-risk-assessment.dim_600x360.jpg",
        description:
          "Structured risk assessment for businesses and events. Identify vulnerabilities and build mitigation strategies.",
        tags: ["Risk", "Assessment", "Strategy"],
      },
      {
        icon: CalendarClock,
        title: "Event Security Planning",
        image: "/assets/generated/service-event-security.dim_600x360.jpg",
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
    bannerImage: "/assets/generated/service-banner-government.dim_800x400.jpg",
    services: [
      {
        icon: UserCheck,
        title: "Police Verification Assistance",
        image: "/assets/generated/service-police-verification.dim_600x360.jpg",
        description:
          "Assistance with Character, Address, and Tenant police verification processes. Guidance on documentation and submission.",
        tags: ["Character", "Address", "Tenant"],
      },
      {
        icon: Briefcase,
        title: "UMANG App Government Services",
        image: "/assets/generated/service-umang-app.dim_600x360.jpg",
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
    bannerImage: "/assets/generated/service-banner-career.dim_800x400.jpg",
    services: [
      {
        icon: BookOpen,
        title: "Resume Writing & Job Interview Prep",
        image: "/assets/generated/service-resume-interview.dim_600x360.jpg",
        description:
          "Professional resume writing and mock interview preparation. Tailored for corporate security and IT sector roles.",
        tags: ["Resume", "Interview", "Career"],
      },
      {
        icon: Clapperboard,
        title: "AI Movie & Digital Content Creation",
        image: "/assets/generated/service-ai-content.dim_600x360.jpg",
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

function ServiceActionButtons({ serviceTitle }: { serviceTitle: string }) {
  const waMessage = encodeURIComponent(
    `Hi! I'm interested in your service: "${serviceTitle}". Please let me know more details.`,
  );
  const mailSubject = encodeURIComponent(`Inquiry: ${serviceTitle}`);
  const mailBody = encodeURIComponent(
    `Hello,\n\nI'm interested in your service: "${serviceTitle}".\n\nPlease share more details.\n\nThank you.`,
  );

  return (
    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        data-ocid="services.whatsapp_button"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] text-white text-xs font-semibold hover:bg-[#1ebe5d] transition-colors shadow-sm"
      >
        <MessageSquareText className="w-3.5 h-3.5" />
        WhatsApp
      </a>
      <a
        href={`mailto:${MAIL_ADDRESS}?subject=${mailSubject}&body=${mailBody}`}
        data-ocid="services.mail_button"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent border border-border text-foreground text-xs font-semibold hover:bg-secondary transition-colors"
      >
        <Mail className="w-3.5 h-3.5 text-primary" />
        Email
      </a>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I'd like to book your service: "${serviceTitle}". Please share available slots.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        data-ocid="services.book_now_button"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm"
      >
        <CalendarClock className="w-3.5 h-3.5" />
        Book Now
      </a>
    </div>
  );
}

export function Services() {
  useEffect(() => {
    document.title = "Services | My Web Solutions";
    const metaDesc = document.querySelector('meta[name="description"]');
    const content =
      "Explore our 12 services: website development, SaaS systems, security certifications, police verification, UMANG guidance, resume writing, and more.";
    if (metaDesc) metaDesc.setAttribute("content", content);
    else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = content;
      document.head.appendChild(meta);
    }
  }, []);

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
        <div className="container mx-auto px-4 space-y-20">
          {categories.map((cat, catIndex) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIndex * 0.05 }}
            >
              {/* Category Banner Image */}
              <div className="rounded-2xl overflow-hidden mb-6 shadow-sm border border-border">
                <div className="relative h-48 md:h-56">
                  <img
                    src={cat.bannerImage}
                    alt={cat.label}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay with category info */}
                  <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent flex flex-col justify-end p-6">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
                        {cat.label}
                      </h2>
                      {cat.badge && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground uppercase tracking-wide">
                          {cat.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground max-w-lg">
                      {cat.description}
                    </p>
                  </div>
                </div>
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
                      className={`h-full transition-all duration-300 hover:-translate-y-1 border-border flex flex-col overflow-hidden ${
                        cat.primary
                          ? "hover:shadow-card hover:border-primary/20"
                          : "hover:shadow-xs"
                      }`}
                    >
                      {/* Service Image */}
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20" />
                        <div className="absolute top-3 left-3">
                          <div className="w-9 h-9 rounded-lg bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                            <service.icon className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-5 flex flex-col flex-1">
                        <h3 className="font-display text-sm font-bold text-foreground mb-2 leading-snug">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground text-xs leading-relaxed mb-3 flex-1">
                          {service.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-1">
                          {service.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        {/* Action Buttons */}
                        <ServiceActionButtons serviceTitle={service.title} />
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
