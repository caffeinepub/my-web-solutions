import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  CalendarClock,
  CheckCircle,
  Cloud,
  Mail,
  MessageSquareText,
  Quote,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

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
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    designation: "Business Owner, Bengaluru",
    review:
      "Professional and structured approach. My business automation is running smoothly now. Highly recommend for any business looking to upgrade their systems.",
    rating: 5,
  },
  {
    name: "Anitha Sharma",
    designation: "HR Manager, Mysuru",
    review:
      "Very helpful in certification and documentation support. The entire process was smooth, transparent, and professionally handled. Made everything easy.",
    rating: 5,
  },
  {
    name: "Suresh Nair",
    designation: "Startup Founder, Bengaluru",
    review:
      "Website delivery was fast and clean. Great support throughout the project. The team understood our requirements and delivered beyond expectations.",
    rating: 5,
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

export function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden hero-grid bg-background">
        {/* Subtle background accents */}
        <div
          className="absolute top-[-80px] right-[-100px] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.42 0.20 255 / 0.07) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-0 left-[-60px] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.58 0.16 240 / 0.05) 0%, transparent 65%)",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: text content */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent border border-border text-xs font-semibold text-accent-foreground mb-5 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Structured · Professional · Digital
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-[1.05] tracking-tight mb-5">
                My Web <span className="gradient-text">Solutions</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
                Combining 11+ years of corporate discipline with digital
                innovation — web, SaaS, and security services for small
                businesses and individuals.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  data-ocid="home.primary_button"
                  className="font-semibold text-base h-12 px-8 shadow-md"
                >
                  <Link to="/contact">
                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  data-ocid="home.secondary_button"
                  className="font-semibold text-base h-12 px-8 border-border hover:bg-accent"
                >
                  <Link to="/services">View Services</Link>
                </Button>
              </div>
            </motion.div>

            {/* Right: featured service visual card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-full max-w-md">
                {/* Main image card */}
                <div className="rounded-2xl overflow-hidden shadow-xl border border-border/60">
                  <div className="relative">
                    <img
                      src="/assets/generated/service-banner-web-saas.dim_800x400.jpg"
                      alt="Web & SaaS Solutions"
                      className="w-full h-56 object-cover"
                    />
                    {/* Gradient overlay on image */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)",
                      }}
                    />
                    {/* Core Product badge overlaid */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 shadow-md">
                        Core Product
                      </Badge>
                    </div>
                    {/* Title inside image */}
                    <div className="absolute bottom-3 left-4">
                      <p className="text-white font-display text-base font-bold drop-shadow-sm">
                        Web & SaaS Solutions
                      </p>
                      <p className="text-white/80 text-xs mt-0.5">
                        4 services available
                      </p>
                    </div>
                  </div>
                  {/* Card footer */}
                  <div className="bg-white px-4 py-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      Starting ₹3,999
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      Available Now
                    </span>
                  </div>
                </div>

                {/* Floating chips */}
                <div className="absolute -top-4 left-6 bg-white rounded-xl shadow-card px-3 py-2 border border-border flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">
                    SaaS Platform
                  </span>
                </div>
                <div className="absolute -bottom-4 right-6 bg-white rounded-xl shadow-card px-3 py-2 border border-border flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">
                    Security Certified
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
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
            {trustPoints.map((point) => (
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
                <Card className="h-full shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border-border">
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
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">
                          {t.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {t.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.designation}
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

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
