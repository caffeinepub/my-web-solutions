import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SEOHead } from "@/components/SEOHead";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Cloud,
  RefreshCw,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

const features = [
  {
    icon: Cloud,
    title: "Cloud-Native Architecture",
    description:
      "We design SaaS platforms built for the cloud from day one — leveraging microservices, containerization, and auto-scaling to handle any workload. Whether you're serving 100 users or 100,000, our architecture grows with you seamlessly.",
    points: [
      "Multi-cloud deployment (AWS, Azure, GCP)",
      "Container orchestration with Kubernetes",
      "Auto-scaling and load balancing",
    ],
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description:
      "Enterprise-grade security baked into every layer. We implement robust authentication, encryption, and compliance measures so your SaaS platform meets the highest industry standards.",
    points: [
      "SOC 2 compliant infrastructure",
      "Data encryption at rest and in transit",
      "Multi-factor authentication",
    ],
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description:
      "Built-in analytics dashboards give you and your customers real-time visibility into usage, performance, and business metrics. Make data-driven decisions from day one.",
    points: [
      "Real-time usage dashboards",
      "Customer success metrics",
      "Custom reporting and exports",
    ],
  },
];

export function SaaS() {
  useEffect(() => {
    document.title = "SaaS Service Management | My Web Solutions";
    const metaDesc = document.querySelector('meta[name="description"]');
    const content =
      "Custom SaaS Service Management Systems for small businesses starting at ₹34,999. Manage clients, services, and operations in one platform.";
    if (metaDesc) metaDesc.setAttribute("content", content);
    else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = content;
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="SaaS Solutions - My Web Solutions"
        description="Professional SaaS management and web application development services. We build scalable, reliable software solutions for your business."
        keywords="SaaS solutions, software development, web applications, scalable software"
        ogImage="/assets/image.png"
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-background hero-grid border-b border-border relative overflow-hidden">
        <div
          className="absolute top-[-80px] right-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.42 0.20 255 / 0.08) 0%, transparent 65%)",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent border border-border text-xs font-semibold text-accent-foreground uppercase tracking-widest mb-6">
              <RefreshCw className="w-3.5 h-3.5 text-primary" />
              Software-as-a-Service
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-6">
              SaaS Solutions
              <br />
              <span className="gradient-text">Built to Scale</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl">
              From ideation to production, we build SaaS service management
              platforms tailored for small businesses. Cloud-native, structured,
              and ready to grow with you.
            </p>
            <Button
              asChild
              size="lg"
              className="font-semibold h-12 px-8 shadow-md"
            >
              <Link to="/contact">
                Start Your SaaS Project <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why Choose Our SaaS Development?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Building a SaaS product is more than writing code. It requires
              deep understanding of multi-tenancy, billing systems, user
              management, and the unique challenges of serving many customers
              from a single platform. We've done it before — and we'll do it
              right for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full shadow-card hover:shadow-card-hover transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Our SaaS Process
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A proven methodology that takes your idea from concept to
              production efficiently.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                label: "Discovery",
                desc: "Define requirements, architecture, and roadmap",
              },
              {
                step: "02",
                label: "Design",
                desc: "UI/UX design, database schema, API contracts",
              },
              {
                step: "03",
                label: "Build",
                desc: "Agile sprints, code reviews, CI/CD pipeline",
              },
              {
                step: "04",
                label: "Launch",
                desc: "Production deployment, monitoring, support",
              },
            ].map((phase, index) => (
              <motion.div
                key={phase.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
                  <span className="font-display font-black text-primary-foreground text-lg">
                    {phase.step}
                  </span>
                </div>
                <h4 className="font-display font-bold text-foreground mb-1">
                  {phase.label}
                </h4>
                <p className="text-sm text-muted-foreground">{phase.desc}</p>
              </motion.div>
            ))}
          </div>
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
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Have a SaaS Idea?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Let's turn your concept into a scalable product. Book a free
              consultation call.
            </p>
            <Button asChild size="lg" className="font-semibold shadow-md">
              <Link to="/contact">
                Book Free Consultation <ArrowRight className="ml-2 w-4 h-4" />
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
