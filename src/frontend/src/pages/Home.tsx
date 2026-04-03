import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SEOHead } from "@/components/SEOHead";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Briefcase,
  CalendarClock,
  CheckCircle,
  ExternalLink,
  Heart,
  Home as HomeIcon,
  Mail,
  MessageSquareText,
  Quote,
  Scale,
  Send,
  Shield,
  ShieldCheck,
  Star,
  TrendingUp,
  Trophy,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const serviceCategories = [
  {
    id: 1,
    title: "Web & SaaS Solutions",
    badge: "Core Offering",
    badgeVariant: "default" as const,
    description:
      "Custom websites, SaaS Service Management Systems, Google Business Profile setup, and WhatsApp Business integration — your complete digital infrastructure.",
    image: "/assets/generated/service-banner-web-saas.dim_800x400.jpg",
    serviceCount: 4,
    accent: "#1d4ed8",
  },
  {
    id: 2,
    title: "Security & Compliance",
    badge: null,
    badgeVariant: "secondary" as const,
    description:
      "Corporate security SOP documentation, risk assessment, event security planning, and individual security certification advisory through Corp International.",
    image: "/assets/generated/service-banner-security.dim_800x400.jpg",
    serviceCount: 4,
    accent: "#0f172a",
  },
  {
    id: 3,
    title: "Government & Document Services",
    badge: null,
    badgeVariant: "secondary" as const,
    description:
      "Police verification assistance (character, address, tenant) and UMANG app government services guidance for PF, Aadhaar, DigiLocker, and pension.",
    image: "/assets/generated/service-banner-government.dim_800x400.jpg",
    serviceCount: 2,
    accent: "#065f46",
  },
  {
    id: 4,
    title: "Career & Creative",
    badge: null,
    badgeVariant: "secondary" as const,
    description:
      "Resume writing, job interview preparation, and AI movie & digital content creation — helping you stand out professionally and creatively.",
    image: "/assets/generated/service-banner-career.dim_800x400.jpg",
    serviceCount: 2,
    accent: "#7c3aed",
  },
];

const stats = [
  { value: "11+", label: "Years Experience", icon: TrendingUp },
  { value: "150+", label: "Projects Delivered", icon: CheckCircle },
  { value: "80+", label: "Happy Clients", icon: Users },
  { value: "24/7", label: "Support Available", icon: Zap },
];

const trustPoints = [
  {
    icon: Award,
    title: "11+ Years Corporate Experience",
    description:
      "Backed by senior roles at Wells Fargo and Samsung Semiconductor — bringing Fortune 500 discipline to every engagement.",
  },
  {
    icon: CheckCircle,
    title: "Structured, Process-Driven Delivery",
    description:
      "Every project follows a documented process with clear milestones, timelines, and accountability built in from day one.",
  },
  {
    icon: Star,
    title: "Founder-Led Personalized Service",
    description:
      "You work directly with Mounith — no middlemen, no outsourcing. Every client gets dedicated, personal attention.",
  },
  {
    icon: Shield,
    title: "Security-Trained Discipline",
    description:
      "Every project is managed with the same rigor as Fortune 500 corporate security operations. Zero compromises on quality.",
  },
  {
    icon: CheckCircle,
    title: "Transparent Pricing, No Hidden Costs",
    description:
      "What you see on our pricing page is what you pay. No surprises, no add-ons. Honest pricing from day one.",
  },
];

const industries = [
  { icon: HomeIcon, label: "Real Estate", color: "text-blue-600 bg-blue-50" },
  {
    icon: Scale,
    label: "Legal Services",
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    icon: Wrench,
    label: "Home Services",
    color: "text-orange-600 bg-orange-50",
  },
  {
    icon: Shield,
    label: "Government & Compliance",
    color: "text-green-600 bg-green-50",
  },
  { icon: Heart, label: "Healthcare", color: "text-rose-600 bg-rose-50" },
  {
    icon: Briefcase,
    label: "Small Business",
    color: "text-purple-600 bg-purple-50",
  },
];

const credentials = [
  {
    icon: Award,
    title: "Corp International Accredited Advisor",
    subtitle: "Security Certifications",
    accent: "from-amber-50 to-yellow-50 border-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    icon: Trophy,
    title: "11+ Years Corporate Experience",
    subtitle: "Wells Fargo & Samsung Alumni",
    accent: "from-blue-50 to-sky-50 border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: ShieldCheck,
    title: "Certified Security Professional",
    subtitle: "CSA, CSS (Specialist), CSI (Investigator), CSM, CSD",
    accent: "from-emerald-50 to-green-50 border-emerald-200",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    icon: Star,
    title: "Founder-Led Personalized Service",
    subtitle: "Direct engagement, no outsourcing",
    accent: "from-purple-50 to-violet-50 border-purple-200",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    initials: "RK",
    designation: "Small Business Owner",
    company: "Bangalore",
    review:
      "My Web Solutions transformed our online presence. The SaaS platform they built increased our customer inquiries by 300% in just 2 months. Highly professional team!",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    initials: "PS",
    designation: "HR Manager",
    company: "Tech Startup",
    review:
      "The background verification service was thorough and fast. Mounith's team handled everything with great attention to detail. Will definitely use again.",
    rating: 5,
  },
  {
    name: "Anand Naik",
    initials: "AN",
    designation: "Government Employee",
    company: "Bengaluru",
    review:
      "Got help with UMANG app setup and police verification. The process was smooth and they were available on WhatsApp for every question. Very reliable service.",
    rating: 5,
  },
];

const projects = [
  {
    id: 1,
    title: "Indu Home Estate Services",
    description:
      "Real estate service platform with property listings and client management.",
    tag: "Real Estate",
    image:
      "https://i.postimg.cc/qqF9H4JW/Screenshot_4_3_2026_31339_indu_home_estate_services_v3p_caffeine_xyz.jpg",
  },
  {
    id: 2,
    title: "TrustFix",
    description:
      "Home repair and maintenance booking platform connecting customers with trusted technicians.",
    tag: "Service Marketplace",
    image:
      "https://i.postimg.cc/SRPwbkS5/Screenshot_4_3_2026_31458_trustfix_7n5_caffeine_xyz.jpg",
  },
  {
    id: 3,
    title: "Nishanth HC Advocate",
    description:
      "Professional legal services website for an advocate with case inquiry and contact features.",
    tag: "Legal / Professional",
    image:
      "https://i.postimg.cc/6qPDxtW1/Screenshot_4_3_2026_31523_nishanth_hc_advocate_website_4qh_caffeine_xyz.jpg",
  },
  {
    id: 4,
    title: "Nishanth HC – Practice Areas",
    description:
      "Dedicated practice areas and case types page for a professional advocate website.",
    tag: "Legal / Professional",
    image:
      "https://i.postimg.cc/kGGkHBmC/Screenshot_4_3_2026_3172_nishanth_hc_advocate_website_4qh_caffeine_xyz.jpg",
  },
  {
    id: 5,
    title: "Nishanth HC – Client Portal",
    description:
      "Client-facing portal for legal consultation booking and document submission.",
    tag: "Legal / Professional",
    image:
      "https://i.postimg.cc/90kvHCmq/Screenshot_4_3_2026_31722_nishanth_hc_advocate_website_4qh_caffeine_xyz.jpg",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.13 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.52 } },
};

function ServiceCategoryCard({
  category,
  index,
}: {
  category: (typeof serviceCategories)[0];
  index: number;
}) {
  const bookUrl = `https://wa.me/919901563799?text=${encodeURIComponent(`Hi! I'd like to book a service in ${category.title}. Please share available slots.`)}`;
  const whatsappUrl = `https://wa.me/919901563799?text=${encodeURIComponent(`Hi! I'm interested in ${category.title} services. Please share more details.`)}`;
  const mailUrl = `mailto:mywebsoloutions97@gmail.com?subject=${encodeURIComponent(`Inquiry: ${category.title}`)}&body=${encodeURIComponent(`Hello, I'm interested in your ${category.title} services. Please share more details.`)}`;

  return (
    <motion.div
      variants={itemVariants}
      data-ocid={`home.services_preview.item.${index + 1}`}
      className="group"
    >
      <Card className="h-full overflow-hidden border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col">
        {/* Banner image with overlay */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={category.image}
            alt={category.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.30) 55%, rgba(0,0,0,0.08) 100%)",
            }}
          />
          {/* Category title + badge over image */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-end justify-between gap-2">
              <h3 className="font-display text-white text-lg font-bold leading-tight drop-shadow-sm">
                {category.title}
              </h3>
              {category.badge && (
                <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary text-primary-foreground shadow-sm">
                  {category.badge}
                </span>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-5 flex flex-col flex-1">
          {/* Service count pill */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              {category.serviceCount} Services
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-5">
            {category.description}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-auto">
            <Button
              asChild
              size="sm"
              data-ocid={`home.services_preview.book_button.${index + 1}`}
              className="flex-1 font-semibold text-xs h-9 gap-1.5"
            >
              <a href={bookUrl} target="_blank" rel="noopener noreferrer">
                <CalendarClock className="w-3.5 h-3.5" />
                Book Now
              </a>
            </Button>

            <Button
              asChild
              size="sm"
              data-ocid={`home.services_preview.whatsapp_button.${index + 1}`}
              className="flex-1 font-semibold text-xs h-9 gap-1.5 text-white border-0"
              style={{ backgroundColor: "#25D366" }}
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageSquareText className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              data-ocid={`home.services_preview.mail_button.${index + 1}`}
              className="flex-1 font-semibold text-xs h-9 gap-1.5 border-border hover:bg-accent"
            >
              <a href={mailUrl}>
                <Mail className="w-3.5 h-3.5" />
                Email
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    setEmail("");
    toast.success("Thank you for subscribing!");
  };

  if (subscribed && compact) {
    return (
      <p
        data-ocid="newsletter.success_state"
        className="text-sm text-emerald-400 font-medium"
      >
        Subscribed!
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        compact
          ? "flex gap-2"
          : "flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      }
    >
      <Input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        data-ocid="newsletter.input"
        className={
          compact
            ? "h-9 text-sm bg-sidebar-foreground/10 border-sidebar-foreground/20 text-white placeholder:text-sidebar-foreground/50 focus-visible:ring-primary"
            : "h-11 flex-1 border-border"
        }
      />
      <Button
        type="submit"
        size={compact ? "sm" : "default"}
        data-ocid="newsletter.submit_button"
        className={
          compact
            ? "h-9 px-4 text-xs font-semibold shrink-0"
            : "h-11 px-6 font-semibold shrink-0 gap-2"
        }
      >
        {!compact && <Send className="w-4 h-4" />}
        Subscribe
      </Button>
    </form>
  );
}

export function Home() {
  useEffect(() => {
    document.title =
      "My Web Solutions | Web, SaaS & Security Services – Bengaluru";
    const metaDesc = document.querySelector('meta[name="description"]');
    const content =
      "Professional web development, SaaS systems, security certifications, police verification and government services in Bengaluru. 11+ years corporate experience.";
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
      <SEOHead
        title="My Web Solutions - Professional SaaS & Web Development Services"
        description="My Web Solutions offers professional website development, SaaS management, WhatsApp integration, and digital business services for small businesses in India."
        keywords="web development, SaaS, WhatsApp integration, digital services, India"
        ogImage="/assets/image.png"
      />
      <Navbar />

      {/* Hero — Full-Width Banner */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://i.postimg.cc/NjXwY9rC/Whats-App-Image-2026-03-04-at-3-12-23-AM.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "560px",
        }}
      >
        {/* Soft dark overlay for text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(0,0,0,0.45)" }}
        />

        {/* Subtle top-to-bottom gradient for extra polish */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.20) 100%)",
          }}
        />

        <div className="container mx-auto px-4 relative z-10 py-36 md:py-48">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="max-w-2xl"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-xs font-semibold text-white mb-6 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              Structured · Professional · Digital
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-5 drop-shadow-lg">
              My Web <span className="gradient-text">Solutions</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 leading-relaxed mb-8 max-w-xl drop-shadow">
              Combining 11+ years of corporate discipline with digital
              innovation — web, SaaS, and security services for small businesses
              and individuals.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                data-ocid="home.primary_button"
                className="font-semibold text-base h-12 px-8 shadow-lg"
              >
                <Link to="/contact">
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                data-ocid="home.secondary_button"
                className="font-semibold text-base h-12 px-8 bg-white/15 backdrop-blur-sm border border-white/40 text-white hover:bg-white/25 hover:text-white"
                variant="outline"
              >
                <Link to="/services">View Services</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats — light blue accent bg */}
      <section className="py-12 bg-accent border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="font-display text-3xl font-black text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground uppercase tracking-widest mb-4">
              Our Services
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              What We Do
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From SaaS platforms to security certifications — structured,
              professional solutions delivered with corporate discipline.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-7"
          >
            {serviceCategories.map((category, index) => (
              <ServiceCategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="text-center mt-10"
          >
            <Button
              asChild
              variant="outline"
              data-ocid="home.services_link"
              className="font-semibold border-primary/30 text-primary hover:bg-accent"
            >
              <Link to="/services">
                View All 12 Services <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Our Projects */}
      <section
        data-ocid="projects.section"
        className="py-20 bg-slate-50 border-y border-border"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-xs font-semibold text-primary uppercase tracking-widest mb-4">
              Portfolio
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Projects
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Real work delivered for real clients — from property platforms to
              legal portals, each built with precision.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                data-ocid={`projects.item.${index + 1}`}
                className="group"
              >
                <Card className="h-full overflow-hidden border border-border/70 bg-white shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 flex flex-col">
                  {/* Screenshot image with shimmer gradient + title overlay */}
                  <div
                    className="relative overflow-hidden"
                    style={{ paddingTop: "56.25%" }}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Shimmer gradient overlay with title */}
                    <div
                      className="absolute inset-0 transition-opacity duration-300"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.0) 100%)",
                      }}
                    />
                    {/* Project title overlaid at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/80 text-white mb-1.5 backdrop-blur-sm">
                        {project.tag}
                      </span>
                      <h3 className="font-display text-white text-sm font-bold leading-snug drop-shadow-sm line-clamp-2">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  <CardContent className="p-5 flex flex-col flex-1">
                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                      {project.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12"
          >
            <Button
              asChild
              size="lg"
              data-ocid="projects.primary_button"
              className="font-semibold h-12 px-8 gap-2 shadow-md hover:shadow-lg transition-shadow"
            >
              <Link to="/case-studies">
                View All Projects <ArrowRight className="ml-1 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Trusted Across Industries */}
      <section
        data-ocid="home.industries.section"
        className="py-20 bg-background border-b border-border"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground uppercase tracking-widest mb-4">
              Industries
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted Across Industries
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From real estate to legal services — building digital solutions
              for businesses that matter.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {industries.map((industry) => (
              <motion.div
                key={industry.label}
                variants={itemVariants}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-border bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-250 cursor-default"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${industry.color.split(" ")[1]}`}
                >
                  <industry.icon
                    className={`w-5 h-5 ${industry.color.split(" ")[0]}`}
                  />
                </div>
                <span className="text-xs font-semibold text-foreground text-center leading-tight">
                  {industry.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-secondary/40 border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground uppercase tracking-widest mb-4">
              Why Us
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose My Web Solutions
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Corporate precision, personal service — a combination you rarely
              find in the market.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {trustPoints.slice(0, 3).map((point) => (
              <motion.div
                key={point.title}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <point.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {point.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 md:max-w-2xl md:mx-auto"
          >
            {trustPoints.slice(3).map((point) => (
              <motion.div
                key={point.title}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <point.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {point.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Credentials & Recognition */}
      <section
        data-ocid="home.credentials.section"
        className="py-20 bg-background"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground uppercase tracking-widest mb-4">
              Credentials
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Credentials &amp; Recognition
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Backed by real experience and accredited expertise.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto"
          >
            {credentials.map((cred) => (
              <motion.div key={cred.title} variants={itemVariants}>
                <div
                  className={`flex items-start gap-4 p-6 rounded-2xl border bg-gradient-to-br ${cred.accent} hover:shadow-md transition-shadow duration-300`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${cred.iconBg}`}
                  >
                    <cred.icon className={`w-6 h-6 ${cred.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-foreground leading-snug mb-1">
                      {cred.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {cred.subtitle}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground uppercase tracking-widest mb-4">
              Client Reviews
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Real feedback from real clients — we let our work speak for
              itself.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={itemVariants}>
                <Card className="h-full shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border-border border-l-4 border-l-primary">
                  <CardContent className="p-6 flex flex-col h-full">
                    {/* Quote icon */}
                    <div className="mb-4">
                      <Quote className="w-8 h-8 text-primary/30" />
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from(
                        { length: t.rating },
                        (__, si) => `${t.name}-star-${si}`,
                      ).map((key) => (
                        <Star
                          key={key}
                          className="w-4 h-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>

                    {/* Review text */}
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1 italic mb-5">
                      "{t.review}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-primary-foreground font-bold text-sm">
                          {t.initials}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {t.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.designation} · {t.company}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Banner — light blue gradient */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="rounded-2xl p-10 md:p-14 text-center border border-primary/15"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.93 0.04 255 / 1), oklch(0.97 0.02 255 / 1))",
              }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Grow Your Business?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Let's discuss how structured, professional digital solutions can
                take your business to the next level.
              </p>
              <Button
                asChild
                size="lg"
                data-ocid="home.cta_button"
                className="font-semibold text-base h-12 px-8 shadow-md"
              >
                <Link to="/contact">
                  Get in Touch <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section data-ocid="newsletter.section" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="rounded-2xl p-10 md:p-14 text-center border border-primary/15 max-w-2xl mx-auto"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.93 0.04 255 / 1), oklch(0.97 0.02 255 / 1))",
              }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-xs font-semibold text-primary uppercase tracking-widest mb-5">
                <Send className="w-3 h-3" />
                Newsletter
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                Stay Updated
              </h2>
              <p className="text-muted-foreground text-base mb-8 max-w-sm mx-auto">
                Get tips on web development, security certifications, and
                government services — straight to your inbox.
              </p>
              <NewsletterForm />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
