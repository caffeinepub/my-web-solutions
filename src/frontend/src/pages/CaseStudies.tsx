import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Code2,
  ExternalLink,
  FolderOpen,
  Mail,
  MessageSquareText,
  Scale,
  Tag,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type Project = {
  id: number;
  title: string;
  category: string;
  categoryId: string;
  description: string;
  detail: string;
  image: string;
  tech: string[];
  timeline: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: "Indu Home Estate Services",
    category: "Web Development",
    categoryId: "web",
    description:
      "Full-service real estate web platform with property listings and enquiry management",
    detail:
      "A comprehensive real estate services platform built for Indu Home Estate Services. Features include property listing management, client enquiry capture, mobile-responsive design, and an integrated contact system. Built with a clean, professional layout that instills trust in property seekers.",
    image:
      "https://i.postimg.cc/qqF9H4JW/Screenshot_4_3_2026_31339_indu_home_estate_services_v3p_caffeine_xyz.jpg",
    tech: ["React", "TypeScript", "Responsive Design", "Contact Management"],
    timeline: "3 weeks",
  },
  {
    id: 2,
    title: "TrustFix",
    category: "SaaS Solutions",
    categoryId: "saas",
    description:
      "Service management SaaS system with client portal and request tracking",
    detail:
      "TrustFix is a full SaaS service management platform for home repair and maintenance services. The system includes a client portal for booking requests, a staff dashboard for assignment and tracking, admin analytics, and a status-based workflow. Built on our proprietary SaaS architecture.",
    image:
      "https://i.postimg.cc/SRPwbkS5/Screenshot_4_3_2026_31458_trustfix_7n5_caffeine_xyz.jpg",
    tech: [
      "SaaS Platform",
      "Multi-Role Auth",
      "Service Tracking",
      "Admin Dashboard",
    ],
    timeline: "4 weeks",
  },
  {
    id: 3,
    title: "Nishanth H C Advocate Website",
    category: "Legal/Advocacy",
    categoryId: "legal",
    description:
      "Professional advocate portfolio with case categories and contact forms",
    detail:
      "A professional digital presence for Nishanth H C, a practicing advocate. Features a clean overview of legal services, practice area categories, professional bio, and a contact form for case inquiries. Designed to establish trust and professionalism with prospective clients.",
    image:
      "https://i.postimg.cc/6qPDxtW1/Screenshot_4_3_2026_31523_nishanth_hc_advocate_website_4qh_caffeine_xyz.jpg",
    tech: ["Professional Website", "Practice Areas", "Contact System", "SEO"],
    timeline: "2 weeks",
  },
  {
    id: 4,
    title: "Advocate Portfolio — Practice Areas",
    category: "Legal/Advocacy",
    categoryId: "legal",
    description:
      "Detailed practice areas page with professional legal service listings",
    detail:
      "A dedicated practice areas detail page for the Nishanth H C Advocate website. Each practice area is presented with clear descriptions, relevant case types, and professional formatting. The page improves SEO visibility for specific legal service queries and helps potential clients identify the right service.",
    image:
      "https://i.postimg.cc/kGGkHBmC/Screenshot_4_3_2026_3172_nishanth_hc_advocate_website_4qh_caffeine_xyz.jpg",
    tech: ["Content Architecture", "Service Listings", "Structured Layout"],
    timeline: "1 week",
  },
  {
    id: 5,
    title: "Legal Services Overview",
    category: "Legal/Advocacy",
    categoryId: "legal",
    description:
      "Clean legal services overview page with structured service categories",
    detail:
      "The legal services overview page provides a structured, scannable summary of all available legal services offered by the advocate. Clean typographic hierarchy, category grouping, and clear CTAs make it easy for visitors to identify the service they need and take action.",
    image:
      "https://i.postimg.cc/90kvHCmq/Screenshot_4_3_2026_31722_nishanth_hc_advocate_website_4qh_caffeine_xyz.jpg",
    tech: ["Information Architecture", "UX Design", "Service Overview"],
    timeline: "1 week",
  },
];

const categoryTabs = [
  { id: "all", label: "All Projects", icon: FolderOpen },
  { id: "web", label: "Web Development", icon: Code2 },
  { id: "saas", label: "SaaS Solutions", icon: Zap },
  { id: "legal", label: "Legal/Advocacy", icon: Scale },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48 } },
};

function getCategoryCount(categoryId: string) {
  if (categoryId === "all") return projects.length;
  return projects.filter((p) => p.categoryId === categoryId).length;
}

function ProjectCard({
  project,
  index,
  onOpen,
  onImageClick,
}: {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
  onImageClick: (p: Project) => void;
}) {
  const requestUrl = `https://wa.me/919901563799?text=Hi%2C%20I%20want%20a%20similar%20project%20to%20${encodeURIComponent(project.title)}.%20Please%20share%20details.`;

  return (
    <motion.div
      variants={cardVariants}
      data-ocid={`casestudies.item.${index + 1}`}
      className="group"
    >
      <Card
        className="h-full overflow-hidden border border-border/70 bg-white shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 flex flex-col group-hover:border-primary/40 group-hover:ring-2 group-hover:ring-primary/15"
        style={{ borderTop: "3px solid hsl(var(--primary))" }}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ paddingTop: "58%" }}>
          <button
            type="button"
            aria-label={`View full image for ${project.title}`}
            data-ocid={`casestudies.image_button.${index + 1}`}
            className="absolute inset-0 w-full h-full cursor-zoom-in bg-transparent border-0 p-0"
            onClick={() => onImageClick(project)}
          >
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/95 text-primary text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <ExternalLink className="w-3.5 h-3.5" />
                Click to Enlarge
              </div>
            </div>
          </button>
        </div>

        <CardContent className="p-5 flex flex-col flex-1">
          {/* Category badge */}
          <Badge
            variant="secondary"
            className="self-start text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 mb-3 bg-primary/10 text-primary hover:bg-primary/15"
          >
            {project.category}
          </Badge>

          {/* Title */}
          <h3 className="font-display text-base font-bold text-foreground mb-2 leading-snug">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md font-medium"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpen(project)}
              data-ocid={`casestudies.view_button.${index + 1}`}
              className="flex-1 text-xs font-semibold border-primary/25 text-primary hover:bg-accent h-8 gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Details
            </Button>
            <Button
              asChild
              size="sm"
              data-ocid={`casestudies.request_button.${index + 1}`}
              className="flex-1 text-xs font-semibold text-white h-8 gap-1 border-0"
              style={{ backgroundColor: "#25D366" }}
            >
              <a href={requestUrl} target="_blank" rel="noopener noreferrer">
                <MessageSquareText className="w-3.5 h-3.5" />
                Request Similar
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function CaseStudies() {
  useEffect(() => {
    document.title = "Case Studies | My Web Solutions";
    const metaDesc = document.querySelector('meta[name="description"]');
    const content =
      "Real project case studies — Indu Home Estate, TrustFix, Nishanth HC Advocate — built with precision and delivered on time.";
    if (metaDesc) metaDesc.setAttribute("content", content);
    else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = content;
      document.head.appendChild(meta);
    }
  }, []);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const filteredProjects =
    activeTab === "all"
      ? projects
      : projects.filter((p) => p.categoryId === activeTab);

  const requestUrl = selectedProject
    ? `https://wa.me/919901563799?text=Hi%2C%20I%20want%20a%20similar%20project%20to%20${encodeURIComponent(selectedProject.title)}.%20Please%20share%20details.`
    : "";

  // ESC key closes lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxProject(null);
    };
    if (lightboxProject) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxProject]);

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      data-ocid="casestudies.page"
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
              <FolderOpen className="w-3.5 h-3.5" />
              Portfolio
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
              Our <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Real-world solutions we've built for real clients — from property
              platforms to SaaS systems and legal portals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-7 bg-accent/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-14">
            {[
              { val: "5+", label: "Live Projects" },
              { val: "3", label: "Industries Served" },
              { val: "150+", label: "Total Deliveries" },
              { val: "24h", label: "Average Response" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-2xl font-black text-foreground">
                  {s.val}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter + Cards */}
      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-10"
            >
              <TabsList className="flex flex-wrap h-auto gap-1 bg-accent/50 p-1.5 rounded-xl">
                {categoryTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    data-ocid="casestudies.filter.tab"
                    className="flex items-center gap-1.5 text-sm rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary"
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                    <span className="ml-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
                      {getCategoryCount(tab.id)}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </motion.div>

            {categoryTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab.id}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
                  >
                    {filteredProjects.map((project, index) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        onOpen={setSelectedProject}
                        onImageClick={setLightboxProject}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Mid-page CTA Strip */}
      <section
        className="py-14 border-y border-border"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary) / 0.07) 0%, hsl(var(--accent)) 100%)",
        }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto"
          >
            <div className="text-center md:text-left">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                Have a project in mind?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We build websites, SaaS systems, and digital solutions. Let's
                talk.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Button
                asChild
                size="lg"
                data-ocid="casestudies.midpage_cta.button"
                className="font-semibold gap-2 h-12 px-7 text-white border-0 shadow-lg hover:shadow-xl transition-shadow"
                style={{ backgroundColor: "#25D366" }}
              >
                <a
                  href="https://wa.me/919901563799?text=Hi%2C%20I%20have%20a%20project%20in%20mind.%20Can%20we%20discuss%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquareText className="w-5 h-5" />
                  WhatsApp Us
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                data-ocid="casestudies.midpage_email.button"
                className="font-semibold gap-2 h-12 px-7 border-primary/40 text-primary hover:bg-primary/5"
              >
                <a href="mailto:mywebsoloutions97@gmail.com?subject=Project%20Inquiry&body=Hi%2C%20I'd%20like%20to%20discuss%20a%20project.">
                  <Mail className="w-5 h-5" />
                  Send Email
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-accent/30 border-t border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-xl mx-auto"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              Ready to build your project?
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Get in touch and we'll turn your idea into a polished, functional
              product — fast.
            </p>
            <Button
              asChild
              size="lg"
              className="font-semibold gap-2 h-12 px-8 text-white border-0"
              style={{ backgroundColor: "#25D366" }}
            >
              <a
                href="https://wa.me/919901563799?text=Hi%2C%20I%20want%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquareText className="w-5 h-5" />
                Start Your Project
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Project Detail Dialog */}
      <Dialog
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      >
        <DialogContent
          data-ocid="casestudies.dialog"
          className="max-w-2xl max-h-[90vh] overflow-y-auto p-0"
        >
          {selectedProject && (
            <>
              {/* Image */}
              <div className="relative w-full overflow-hidden rounded-t-lg">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full object-cover"
                  style={{ maxHeight: "340px" }}
                />
              </div>

              <div className="p-6">
                <DialogHeader className="mb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-bold uppercase tracking-wider mb-2 bg-primary/10 text-primary"
                      >
                        {selectedProject.category}
                      </Badge>
                      <DialogTitle className="font-display text-xl font-bold text-foreground">
                        {selectedProject.title}
                      </DialogTitle>
                    </div>
                  </div>
                </DialogHeader>

                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  {selectedProject.detail}
                </p>

                {/* Per-project stats row */}
                <div className="flex flex-wrap gap-4 mb-5 p-4 rounded-xl bg-accent/40 border border-border/60">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Timeline
                      </p>
                      <p className="font-semibold text-foreground">
                        {selectedProject.timeline}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-green-500/30" />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Status
                      </p>
                      <p className="font-semibold text-green-600">Live</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="w-4 h-4 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Category
                      </p>
                      <p className="font-semibold text-foreground">
                        {selectedProject.category}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tech stack */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2">
                    Technologies & Features
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-md font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    className="flex-1 font-semibold gap-2 text-white border-0"
                    style={{ backgroundColor: "#25D366" }}
                  >
                    <a
                      href={requestUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageSquareText className="w-4 h-4" />
                      Request Similar Project
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    data-ocid="casestudies.close_button"
                    onClick={() => setSelectedProject(null)}
                    className="flex-1 font-semibold gap-2 border-border hover:bg-accent"
                  >
                    <X className="w-4 h-4" />
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxProject && (
          <motion.div
            data-ocid="casestudies.lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxProject(null)}
          >
            {/* Close button */}
            <button
              type="button"
              data-ocid="casestudies.lightbox.close_button"
              aria-label="Close lightbox"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxProject(null);
              }}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors border border-white/20 backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxProject.image}
                alt={lightboxProject.title}
                className="w-full rounded-xl shadow-2xl object-contain max-h-[85vh]"
              />
              <p className="text-white/80 text-center text-sm mt-3 font-medium">
                {lightboxProject.title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
