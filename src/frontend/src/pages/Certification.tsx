import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SEOHead } from "@/components/SEOHead";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  CalendarClock,
  CheckCircle,
  ChevronRight,
  ClipboardCheck,
  Mail,
  MessageSquareText,
  Shield,
  Star,
  UserCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

const certifications = [
  {
    code: "CSA",
    name: "Certified Security Associate",
    level: "Entry Level",
    levelColor: "bg-emerald-100 text-emerald-700",
    forWho: "Individuals seeking entry into corporate security roles",
    description:
      "The foundational credential for aspiring security professionals. Establishes core knowledge in corporate security principles, risk awareness, and professional conduct.",
    benefits: [
      "Recognized entry qualification in corporate security",
      "Covers fundamental security protocols and procedures",
      "Ideal for career transition into the security sector",
    ],
    icon: Shield,
    accentClass: "border-emerald-200 bg-emerald-50/50",
    badgeClass: "bg-emerald-500",
  },
  {
    code: "CSS",
    name: "Certified Security Specialist",
    level: "Specialist",
    levelColor: "bg-blue-100 text-blue-700",
    forWho: "Security professionals seeking specialist-level credentials",
    description:
      "Designed for security professionals who have developed specialized expertise in a specific domain of corporate security. Validates deep functional knowledge and professional competency.",
    benefits: [
      "Validates specialist-level security expertise",
      "Recognized credential for domain-specific security roles",
      "Preferred by organizations seeking certified specialists",
    ],
    icon: UserCheck,
    accentClass: "border-blue-200 bg-blue-50/50",
    badgeClass: "bg-blue-500",
  },
  {
    code: "CSI",
    name: "Certified Security Investigator",
    level: "Investigation",
    levelColor: "bg-violet-100 text-violet-700",
    forWho: "Professionals engaged in security investigations and inquiries",
    description:
      "Specialized certification for professionals conducting security investigations, including incident inquiries, internal investigations, loss prevention, and evidence management.",
    benefits: [
      "Expert credential for security investigation roles",
      "Covers investigation methodologies and evidence handling",
      "Recognized by corporate security and loss prevention teams",
    ],
    icon: ClipboardCheck,
    accentClass: "border-violet-200 bg-violet-50/50",
    badgeClass: "bg-violet-500",
  },
  {
    code: "CSM",
    name: "Certified Security Manager",
    level: "Mid-Senior Management",
    levelColor: "bg-amber-100 text-amber-700",
    forWho: "Mid to senior level security management professionals",
    description:
      "A prestigious certification for security managers overseeing operations, budgets, vendor management, and policy implementation at the organizational level.",
    benefits: [
      "Validates strategic security management capabilities",
      "Covers budget planning and vendor oversight",
      "Recognized by Fortune 500 security departments",
    ],
    icon: Award,
    accentClass: "border-amber-200 bg-amber-50/50",
    badgeClass: "bg-amber-500",
  },
  {
    code: "CSD",
    name: "Certified Security Director",
    level: "Executive",
    levelColor: "bg-rose-100 text-rose-700",
    forWho: "Top-tier executive-level security leaders",
    description:
      "The highest-tier Corp International certification. Reserved for senior security executives responsible for enterprise-wide security strategy, policy, and governance.",
    benefits: [
      "Top executive credential in corporate security",
      "Demonstrates enterprise-level security leadership",
      "Opens doors to Director and VP-level roles",
    ],
    icon: Star,
    accentClass: "border-rose-200 bg-rose-50/50",
    badgeClass: "bg-rose-500",
  },
];

const applicationSteps = [
  {
    step: 1,
    title: "Enquire",
    description:
      "Contact us via WhatsApp or email. Share your background and which certification interests you.",
    icon: MessageSquareText,
  },
  {
    step: 2,
    title: "Eligibility Check",
    description:
      "We review your experience, qualifications, and suitability for the certification level.",
    icon: ClipboardCheck,
  },
  {
    step: 3,
    title: "Training & Exam",
    description:
      "We guide you through study materials, preparation, and the examination process.",
    icon: CheckCircle,
  },
  {
    step: 4,
    title: "Certification Issued",
    description:
      "Upon passing, your Corp International certificate is issued and officially recognized.",
    icon: Award,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Certification() {
  useEffect(() => {
    document.title = "Security Certifications | My Web Solutions";
    const metaDesc = document.querySelector('meta[name="description"]');
    const content =
      "Corp International accredited certification advisory for CSA (Associate), CSS (Specialist), CSI (Investigator), CSM, CSD. Individual security certification support in Bengaluru.";
    if (metaDesc) metaDesc.setAttribute("content", content);
    else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = content;
      document.head.appendChild(meta);
    }
  }, []);

  const whatsappUrl =
    "https://wa.me/919901563799?text=Hi%2C%20I%27m%20interested%20in%20Corp%20International%20Security%20Certification%20advisory.%20Please%20share%20more%20details.";
  const emailUrl =
    "mailto:mywebsoloutions97@gmail.com?subject=Security%20Certification%20Inquiry&body=Hello%2C%20I%20am%20interested%20in%20Corp%20International%20certifications.%20Please%20provide%20more%20details.";

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      data-ocid="certification.page"
    >
      <SEOHead
        title="Certifications - My Web Solutions"
        description="My Web Solutions holds professional certifications including CSA, CSS, CSI, and more. Learn about our credentials and expertise."
        keywords="security certifications, CSA, CSS, CSI, professional certifications India"
        ogImage="/assets/image.png"
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-accent/60 to-background border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-xs font-semibold text-primary uppercase tracking-widest mb-5">
              <Shield className="w-3.5 h-3.5" />
              Corp International Accredited
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
              Security Certification{" "}
              <span className="gradient-text">Advisory</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Your trusted partner for Corp International certifications. Guided
              by Mounith H C — Accredited Certification Advisor with 11+ years
              of corporate security experience at Wells Fargo and Samsung
              Semiconductor.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                data-ocid="certification.book_button"
                className="font-semibold gap-2 h-12 px-8 text-white border-0"
                style={{ backgroundColor: "#25D366" }}
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <CalendarClock className="w-5 h-5" />
                  Book Consultation
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                data-ocid="certification.email_button"
                className="font-semibold gap-2 h-12 px-8 border-primary/30 text-primary hover:bg-accent"
              >
                <a href={emailUrl}>
                  <Mail className="w-5 h-5" />
                  Send Enquiry
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-8 bg-primary/5 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {[
              "Corp International Accredited Advisor",
              "11+ Years Corporate Security Experience",
              "Wells Fargo & Samsung Alumni",
              "End-to-End Application Support",
            ].map((point) => (
              <div
                key={point}
                className="flex items-center gap-2 text-sm font-medium text-foreground/80"
              >
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Cards */}
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
              Certification Pathways
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Corp International Certifications
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Five professional certifications across career levels — from entry
              roles to executive leadership.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.code}
                variants={itemVariants}
                data-ocid={`certification.item.${index + 1}`}
                className="group"
              >
                <Card
                  className={`h-full border-2 ${cert.accentClass} hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5 flex flex-col`}
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${cert.accentClass} border`}
                      >
                        <cert.icon className="w-6 h-6 text-foreground/70" />
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full text-white ${cert.badgeClass}`}
                        >
                          {cert.code}
                        </span>
                      </div>
                    </div>

                    {/* Title + Level */}
                    <h3 className="font-display text-lg font-bold text-foreground mb-1 leading-snug">
                      {cert.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className={`self-start text-[10px] font-semibold mb-3 ${cert.levelColor} border-0`}
                    >
                      {cert.level}
                    </Badge>

                    {/* Who it's for */}
                    <p className="text-xs text-muted-foreground italic mb-3">
                      For: {cert.forWho}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {cert.description}
                    </p>

                    {/* Benefits */}
                    <ul className="space-y-1.5 mt-auto">
                      {cert.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-start gap-2 text-xs text-foreground/75"
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-20 bg-accent/30 border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-xs font-semibold text-primary uppercase tracking-widest mb-4">
              The Process
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How to Apply
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A guided, end-to-end process. We handle the complexity so you can
              focus on preparation.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {applicationSteps.map((step, index) => (
              <motion.div
                key={step.step}
                variants={itemVariants}
                className="relative"
              >
                <div className="text-center group">
                  {/* Step number line connector */}
                  <div className="relative mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-black flex items-center justify-center">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {/* Arrow connector (not on last item) */}
                {index < applicationSteps.length - 1 && (
                  <div className="hidden lg:flex absolute top-7 left-[calc(50%+2.5rem)] items-center">
                    <ChevronRight className="w-5 h-5 text-border" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground uppercase tracking-widest mb-4">
              Investment
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Certification Pricing
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-accent/40 to-background shadow-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Contact for Pricing
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-md mx-auto">
                  Certification fees vary based on your selected certification
                  level and eligibility assessment. We provide a transparent,
                  all-inclusive fee structure after your initial consultation —
                  no hidden charges.
                </p>
                <ul className="text-sm text-left space-y-2 mb-8 max-w-xs mx-auto">
                  {[
                    "Eligibility assessment included",
                    "Training material guidance",
                    "Application processing support",
                    "Exam preparation mentoring",
                    "Post-certification support",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-foreground/80">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    asChild
                    size="lg"
                    data-ocid="certification.book_button"
                    className="font-semibold gap-2 text-white border-0"
                    style={{ backgroundColor: "#25D366" }}
                  >
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageSquareText className="w-4 h-4" />
                      Get Pricing on WhatsApp
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    data-ocid="certification.email_button"
                    className="font-semibold gap-2 border-primary/30 text-primary hover:bg-accent"
                  >
                    <a href={emailUrl}>
                      <Mail className="w-4 h-4" />
                      Email Enquiry
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
