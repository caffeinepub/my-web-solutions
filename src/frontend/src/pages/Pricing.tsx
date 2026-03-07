import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Shield,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

const WA_LINK = "https://wa.me/919901563799";

const websitePlans = [
  {
    name: "Basic Website",
    price: "₹3,999",
    description: "Perfect for individuals and small local businesses.",
    features: [
      "1–5 pages",
      "Mobile responsive design",
      "Contact form integration",
      "WhatsApp button",
      "Basic SEO setup",
      "1 month support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Business Website",
    price: "₹7,999",
    description: "For growing businesses that need a strong digital presence.",
    features: [
      "Up to 10 pages",
      "SEO optimized",
      "Google Business setup",
      "Admin panel included",
      "WhatsApp & social integration",
      "3 months support",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "E-commerce Website",
    price: "₹14,999",
    description: "Full online store with product catalog and payments.",
    features: [
      "Unlimited product catalog",
      "Payment gateway integration",
      "Inventory management",
      "Full admin dashboard",
      "Order tracking system",
      "6 months support",
    ],
    cta: "Get Started",
    popular: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Pricing() {
  useEffect(() => {
    document.title = "Pricing | My Web Solutions";
    const metaDesc = document.querySelector('meta[name="description"]');
    const content =
      "Transparent pricing for websites (₹3,999+), SaaS systems (₹34,999+), and security documentation services.";
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

      {/* Header */}
      <section className="pt-28 pb-14 md:pt-36 md:pb-16 bg-background hero-grid border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground uppercase tracking-widest mb-5">
              Transparent Pricing
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight">
              Simple, Honest <span className="gradient-text">Pricing</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              No hidden fees. No surprises. Every price includes everything
              listed — what you see is what you pay.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Website Development Plans */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground uppercase tracking-widest mb-4">
              Website Development
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Choose Your Website Plan
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              All plans include domain guidance, hosting assistance, and
              WhatsApp integration.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {websitePlans.map((plan) => (
              <motion.div key={plan.name} variants={itemVariants}>
                <Card
                  className={`h-full flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                    plan.popular
                      ? "shadow-card-hover ring-2 ring-primary/40 relative"
                      : "shadow-card hover:shadow-card-hover"
                  }`}
                  data-ocid={`pricing.${plan.name.toLowerCase().replace(/\s+/g, "_")}.card`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground font-semibold px-4 py-1 text-xs shadow-md">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-4 pt-7">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                      {plan.name}
                    </p>
                    <div className="flex items-end gap-1 mb-2">
                      <span className="font-display text-4xl font-black text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground text-sm mb-1">
                        /one-time
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {plan.description}
                    </p>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col pb-6 px-6">
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      asChild
                      className={`w-full font-semibold ${plan.popular ? "" : "variant-outline"}`}
                      variant={plan.popular ? "default" : "outline"}
                      data-ocid={`pricing.website.${plan.popular ? "primary_button" : "secondary_button"}`}
                    >
                      <a
                        href={`${WA_LINK}?text=Hi, I'm interested in the ${plan.name} plan (${plan.price})`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {plan.cta} on WhatsApp
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SaaS Plan */}
      <section className="py-20 bg-secondary/40 border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground uppercase tracking-widest mb-4">
              SaaS Platform
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              SaaS Service Management System
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Enterprise-grade workflow management built for your business.
              Fully custom, cloud-hosted.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <Card
              className="shadow-card-hover border-primary/20 ring-1 ring-primary/10"
              data-ocid="pricing.saas.card"
            >
              <CardContent className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
                        Core Product
                      </Badge>
                    </div>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="font-display text-4xl font-black text-foreground">
                        Starting ₹34,999
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <span className="text-amber-600 font-medium">Note:</span>
                      Hosting & Domain charges are separate and billed annually.
                    </p>
                  </div>

                  <div className="md:text-right shrink-0">
                    <Button
                      asChild
                      size="lg"
                      className="font-semibold shadow-md"
                      data-ocid="pricing.saas.primary_button"
                    >
                      <a
                        href={`${WA_LINK}?text=Hi, I'm interested in the SaaS Service Management System (Starting ₹34,999)`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Discuss on WhatsApp
                      </a>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Free consultation call included
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-sm font-semibold text-foreground mb-4">
                    What's included:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      "Custom business workflow automation",
                      "Multi-user access with role management",
                      "Client & staff portals",
                      "Reports and analytics dashboard",
                      "Cloud hosted & scalable",
                      "WhatsApp notifications integration",
                      "Ongoing support & maintenance",
                      "Requirements consultation included",
                    ].map((f) => (
                      <div key={f} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Documentation & Certification */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground uppercase tracking-widest mb-4">
              Certifications & Documentation
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Documentation & Certification Services
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Professional documentation, corporate security certifications, and
              government service assistance. Pricing depends on scope and
              requirement.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  title: "Security Certification Advisory",
                  desc: "CSA, CSS, CSI, CSM, CSD through Corp International. Individual certification guidance.",
                  tag: "Individual",
                },
                {
                  title: "Corporate Security Documentation",
                  desc: "SOP documentation, risk assessment reports, event security plans for businesses.",
                  tag: "Business",
                },
                {
                  title: "Government Service Assistance",
                  desc: "Police verification, UMANG app guidance, PF & Aadhaar linking support.",
                  tag: "Government",
                },
              ].map((item) => (
                <Card
                  key={item.title}
                  className="shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant="outline"
                        className="text-xs font-semibold border-primary/30 text-primary"
                      >
                        {item.tag}
                      </Badge>
                    </div>
                    <h3 className="font-display font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {item.desc}
                    </p>
                    <div className="pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">
                        Pricing on consultation
                      </p>
                      <a
                        href={`${WA_LINK}?text=Hi, I need help with ${item.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                        data-ocid={`pricing.cert.${item.tag.toLowerCase()}.link`}
                      >
                        Contact on WhatsApp
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-10 text-center"
            >
              <div
                className="rounded-2xl p-8 md:p-10 border border-primary/15"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.93 0.04 255 / 1), oklch(0.97 0.02 255 / 1))",
                }}
              >
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                  Not sure which service you need?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Chat with us on WhatsApp — we'll guide you to the right
                  solution for your exact requirement.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="font-semibold shadow-md"
                    data-ocid="pricing.cta.primary_button"
                  >
                    <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat on WhatsApp
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="font-semibold border-primary/30 text-primary hover:bg-accent"
                    data-ocid="pricing.cta.secondary_button"
                  >
                    <Link to="/contact">
                      Send a Message <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
