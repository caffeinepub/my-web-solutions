import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  FileText,
  Globe,
  HelpCircle,
  MessageCircle,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

const faqCategories = [
  {
    id: "general",
    label: "General",
    icon: HelpCircle,
    questions: [
      {
        q: "What is My Web Solutions?",
        a: "My Web Solutions is a professional digital services firm founded by Mounith H C, a certified security professional with 11+ years of corporate experience at organizations like Wells Fargo and Samsung Semiconductor. We specialize in web development, SaaS solutions, security certifications, government document services, and career support for individuals and small businesses.",
      },
      {
        q: "What areas do you serve?",
        a: "We serve clients across India, primarily from our base in Bengaluru, Karnataka. Our digital services (website development, SaaS systems, online consultations) are available nationwide. Security certification advisory and government document assistance can be provided remotely or in-person across major cities.",
      },
      {
        q: "How can I get started?",
        a: "Getting started is easy! You can reach us via WhatsApp at +91 99015 63799, send an email to mywebsoloutions97@gmail.com, or use the Contact form on our website. We'll understand your requirements and suggest the best solution for your needs within 24 hours.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major payment methods including UPI (GPay, PhonePe, Paytm), bank transfers (NEFT/RTGS/IMPS), and cash payments for in-person consultations. Milestone-based payment plans are available for large projects. All transactions are documented and receipts are provided.",
      },
    ],
  },
  {
    id: "web-saas",
    label: "Web & SaaS",
    icon: Globe,
    questions: [
      {
        q: "What is included in a Basic Website package?",
        a: "The Basic Website package (₹3,999) includes: a professional 5-page responsive website (Home, About, Services, Contact, and one additional page), mobile-optimized layout, basic SEO setup, contact form, Google Maps integration, and 30 days of post-launch support. Content and domain/hosting are provided by the client.",
      },
      {
        q: "How long does it take to build a website?",
        a: "Basic websites are typically delivered in 5–7 business days. Business websites (₹7,999) take 10–14 days. E-commerce websites (₹14,999) take 21–30 days depending on the number of products and custom features. Timeline starts after content and requirements are finalized.",
      },
      {
        q: "What is the SaaS Service Management System?",
        a: "Our SaaS Service Management System is our flagship product — a cloud-based platform designed for small businesses to manage clients, service requests, staff, invoices, and operations in one place. Starting at ₹34,999, it includes role-based access (Admin, Staff, Client portals), lead management, and WhatsApp integration. Hosting and domain are separate.",
      },
      {
        q: "Do you provide hosting and domain registration?",
        a: "We do not include hosting and domain in our standard packages, as clients often have preferences for specific providers. However, we can guide you through purchasing and configuring hosting (recommended: Hostinger, GoDaddy, or Google Cloud) and domain registration. We will connect everything and ensure your site is live. Alternatively, we can manage this on your behalf for a small additional fee.",
      },
    ],
  },
  {
    id: "certification",
    label: "Certifications",
    icon: Shield,
    questions: [
      {
        q: "What is Corp International?",
        a: "Corp International is a recognized professional certification body offering industry-standard credentials in the security and corporate management domain. Their certifications are respected across corporate, security, and compliance sectors. My Web Solutions founder Mounith H C is an Accredited Certification Advisor for Corp International.",
      },
      {
        q: "What certifications do you offer guidance for?",
        a: "We provide advisory and support for five Corp International certifications: CSA (Certified Security Advisor), CSS (Certified Security Supervisor), CSI (Certified Security Inspector), CSM (Certified Security Manager), and CSD (Certified Security Director). Each targets a different career level — from entry level to executive.",
      },
      {
        q: "What are CSA, CSS, CSI, CSM, and CSD certifications?",
        a: "CSA (Certified Security Advisor) is for individuals entering corporate security roles. CSS (Certified Security Supervisor) is for supervisory-level professionals. CSI (Certified Security Inspector) focuses on compliance and inspection. CSM (Certified Security Manager) is for mid to senior management. CSD (Certified Security Director) is the top-tier executive certification for security directors.",
      },
      {
        q: "How do I apply for a certification?",
        a: "Contact us via WhatsApp or email to express your interest. We will conduct an initial eligibility assessment based on your experience and background. We'll then guide you through the application process, required documentation, training materials, and examination. We handle the entire process on your behalf.",
      },
      {
        q: "How long does the certification process take?",
        a: "The certification timeline varies by level. Entry-level certifications (CSA) typically take 4–6 weeks. Mid-level certifications (CSS, CSI) take 6–10 weeks. Senior certifications (CSM, CSD) may take 10–16 weeks depending on eligibility verification and examination scheduling. We will provide a detailed timeline after your initial assessment.",
      },
    ],
  },
  {
    id: "government",
    label: "Government Services",
    icon: FileText,
    questions: [
      {
        q: "What is Police Verification assistance?",
        a: "Police Verification assistance is our service to help individuals apply for and obtain police verification certificates. We guide you through the process for character verification, address verification, and tenant verification — all commonly required by employers, landlords, and government agencies. We handle documentation, form filling, and follow-up.",
      },
      {
        q: "What documents do I need for police verification?",
        a: "Typically required documents include: Aadhaar card (mandatory), PAN card, address proof (utility bill or rental agreement), passport-size photographs, and a filled application form. For tenant verification, the landlord's details are also required. We provide a complete checklist specific to your verification type during our initial consultation.",
      },
      {
        q: "What is UMANG?",
        a: "UMANG (Unified Mobile Application for New-age Governance) is the Government of India's unified platform providing access to over 1,200 government services through a single app. Services include EPF/PF management, Aadhaar services, DigiLocker, Pension management, CBSE results, Passport Seva, and many more.",
      },
      {
        q: "What UMANG-related services can you help with?",
        a: "We provide step-by-step guidance for: linking Aadhaar with PF/EPF account, withdrawing PF through UMANG, setting up DigiLocker for digital documents, accessing pension services (EPFO), using the National Scholarship Portal, and understanding other government scheme benefits available through UMANG. We specialize in helping senior citizens and first-time users navigate the platform.",
      },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export function FAQ() {
  useEffect(() => {
    document.title = "FAQ | My Web Solutions";
    const metaDesc = document.querySelector('meta[name="description"]');
    const content =
      "Frequently asked questions about My Web Solutions services, pricing, timelines, and support.";
    if (metaDesc) metaDesc.setAttribute("content", content);
    else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = content;
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      data-ocid="faq.page"
    >
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-accent/60 to-background border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-xs font-semibold text-primary uppercase tracking-widest mb-5">
              <HelpCircle className="w-3.5 h-3.5" />
              Help Center
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Everything you need to know about our services. Can't find an
              answer? Reach us directly on WhatsApp.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-3xl">
          <Tabs defaultValue="general">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TabsList className="flex flex-wrap h-auto gap-1 mb-10 bg-accent/50 p-1.5 rounded-xl w-full justify-start">
                {faqCategories.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    data-ocid="faq.tab"
                    className="flex items-center gap-1.5 text-sm rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary"
                  >
                    <cat.icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </motion.div>

            {faqCategories.map((cat) => (
              <TabsContent key={cat.id} value={cat.id}>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <cat.icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground">
                        {cat.label}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {cat.questions.length} questions
                      </p>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="space-y-2">
                    {cat.questions.map((item, qIndex) => (
                      <motion.div key={item.q} variants={itemVariants}>
                        <AccordionItem
                          value={item.q}
                          data-ocid={`faq.item.${qIndex + 1}`}
                          className="border border-border rounded-xl px-5 bg-card shadow-xs hover:shadow-card transition-shadow duration-200 data-[state=open]:shadow-card"
                        >
                          <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-4 text-sm leading-snug gap-3">
                            {item.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                            {item.a}
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    ))}
                  </Accordion>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent/40 border-t border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-xl mx-auto"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <MessageCircle className="w-7 h-7 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Our team is ready to help. Get instant answers on WhatsApp — we
              typically respond within minutes during business hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                data-ocid="faq.whatsapp_button"
                className="font-semibold gap-2 h-12 px-7 text-white border-0"
                style={{ backgroundColor: "#25D366" }}
              >
                <a
                  href="https://wa.me/919901563799"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-semibold gap-2 h-12 px-7 border-primary/30 text-primary hover:bg-accent"
              >
                <a href="mailto:mywebsoloutions97@gmail.com">
                  <BookOpen className="w-5 h-5" />
                  Email Us
                </a>
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
