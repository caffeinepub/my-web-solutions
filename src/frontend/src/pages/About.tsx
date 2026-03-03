import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Award, Layers, Star, Target, Users } from "lucide-react";
import { motion } from "motion/react";

const credentials = [
  "Certified Security Professional",
  "Accredited Certification Advisor – Corp International",
  "11+ Years Corporate Experience",
  "Wells Fargo | Samsung Semiconductor",
];

const differentiators = [
  {
    icon: Target,
    title: "Corporate Precision",
    description:
      "Every service is delivered with the discipline and standards of a Fortune 500 environment.",
  },
  {
    icon: Users,
    title: "Founder-Led Service",
    description:
      "You work directly with Mounith — no middlemen, no outsourcing. Personalized attention on every engagement.",
  },
  {
    icon: Layers,
    title: "Multi-Domain Expertise",
    description:
      "From SaaS products to police verification guidance — one trusted partner for digital and security needs.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-16 bg-background hero-grid border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground uppercase tracking-widest mb-5">
              About Us
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-foreground mb-4">
              About My Web Solutions
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Where corporate discipline meets digital innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center max-w-5xl mx-auto">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-start"
            >
              <div className="relative">
                {/* Blue ring border */}
                <div
                  className="w-72 h-72 md:w-80 md:h-80 rounded-full p-1.5"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.42 0.20 255), oklch(0.65 0.15 255))",
                  }}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-accent">
                    <img
                      src="/assets/generated/founder-mounith.dim_400x400.jpg"
                      alt="Mounith H C — Founder & CEO, My Web Solutions"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-3 -right-3 bg-white rounded-2xl shadow-card px-4 py-2.5 border border-border">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">
                      Corp International
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Accredited Advisor
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Founder Info */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground uppercase tracking-widest mb-4">
                Founder & CEO
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-black text-foreground mb-2">
                Mounith H C
              </h2>
              <p className="text-primary font-semibold text-sm mb-5">
                Founder & CEO, My Web Solutions
              </p>

              <p className="text-muted-foreground leading-relaxed mb-6 text-sm md:text-base">
                My Web Solutions was founded with a clear vision — to bring the
                structured discipline of corporate security and operations into
                the world of digital solutions. After 11+ years working with
                global organizations like Wells Fargo and Samsung Semiconductor,
                I saw a gap: small businesses and individuals lacked access to
                structured, professional-grade services. That's why I built
                this.
              </p>

              {/* Credential Badges */}
              <div className="flex flex-wrap gap-2">
                {credentials.map((cred) => (
                  <span
                    key={cred}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-accent border border-border text-accent-foreground"
                  >
                    <Star className="w-3 h-3 text-primary" />
                    {cred}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-secondary/40 border-y border-border">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground uppercase tracking-widest mb-6">
              Our Mission
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-5">
              Our Mission
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              To deliver corporate-grade professionalism to small businesses and
              individuals — through web, SaaS, security, and government services
              that are structured, reliable, and results-focused.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why We're Different */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground uppercase tracking-widest mb-4">
              Differentiation
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why We're Different
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {differentiators.map((item) => (
              <motion.div key={item.title} variants={itemVariants}>
                <Card className="h-full border-border hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-accent/60 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Work With Us?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Get in touch and let's discuss how we can help your business grow.
            </p>
            <Button
              asChild
              size="lg"
              data-ocid="about.cta_button"
              className="font-semibold shadow-md"
            >
              <Link to="/contact">
                Contact Mounith <ArrowRight className="ml-2 w-4 h-4" />
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
