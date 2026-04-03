import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SEOHead } from "@/components/SEOHead";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitLead } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  CalendarCheck,
  CheckCircle,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    url: "https://www.facebook.com/share/1FyGPWtDUs/",
    icon: Facebook,
    description: "Facebook Profile",
  },
  {
    label: "Facebook Page",
    url: "https://www.facebook.com/share/1CVDLuBb8i/",
    icon: Facebook,
    description: "Facebook Page",
  },
  {
    label: "YouTube",
    url: "https://youtube.com/@aichef_mouni",
    icon: Youtube,
    description: "Part-time Youtuber",
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/aichef_mouni",
    icon: Instagram,
    description: "Instagram",
  },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/mounith-hc-cpe%C2%AE-csa%C2%AE-aca%E2%84%A2-409b8123b",
    icon: Linkedin,
    description: "LinkedIn",
  },
];
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const services = [
  "SaaS Service Management System",
  "Small Business Website Development",
  "WhatsApp Business Integration",
  "Google Business Profile Setup",
  "Security Certification Advisory",
  "Corporate Security SOP Documentation",
  "Risk Assessment Consultation",
  "Event Security Planning",
  "Police Verification Assistance",
  "UMANG App Government Services",
  "Resume Writing & Interview Prep",
  "AI Movie & Digital Content Creation",
  "Other",
];

function validatePhone(phone: string) {
  const cleaned = phone.replace(/[\s\-().+]/g, "");
  return /^\d{7,15}$/.test(cleaned);
}

export function Contact() {
  useEffect(() => {
    document.title = "Contact Us | My Web Solutions";
    const metaDesc = document.querySelector('meta[name="description"]');
    const content =
      "Get in touch with My Web Solutions for web development, SaaS, certifications, and government services. WhatsApp: +91 9901563799";
    if (metaDesc) metaDesc.setAttribute("content", content);
    else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = content;
      document.head.appendChild(meta);
    }
  }, []);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    service?: string;
    message?: string;
  }>({});
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync: submitLead, isPending } = useSubmitLead();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required.";
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = "Please enter a valid phone number.";
    }
    if (!form.service) newErrors.service = "Please select a service.";
    if (!form.message.trim()) newErrors.message = "Message is required.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    try {
      await submitLead(form);
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you shortly.");
      setForm({ name: "", phone: "", service: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Contact Us - My Web Solutions"
        description="Get in touch with My Web Solutions. Contact us for website development, SaaS, WhatsApp integration, and other digital services."
        keywords="contact My Web Solutions, web development consultation, digital services India"
        ogImage="/assets/image.png"
      />
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-14 bg-background hero-grid border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground uppercase tracking-widest mb-5">
              Contact Us
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-foreground mb-3">
              Get in Touch
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Ready to start your project? Send us a message and we'll respond
              within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Book Appointment Banner */}
      <section className="py-10 bg-accent/30 border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Card className="max-w-5xl mx-auto bg-primary border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 shrink-0">
                    <CalendarCheck className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-display text-xl font-bold text-white mb-1">
                      Book an Appointment
                    </h3>
                    <p className="text-primary-foreground/80 text-sm max-w-lg">
                      Schedule a consultation directly — choose your service,
                      preferred date and time. We'll confirm within 2–4 hours.
                    </p>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="shrink-0 font-semibold bg-white text-primary hover:bg-white/90 border-0 shadow-sm"
                    data-ocid="contact.book_appointment_button"
                  >
                    <Link to="/booking">Book Now →</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3"
            >
              <Card className="shadow-card">
                <CardContent className="p-6 md:p-8">
                  {submitted && (
                    <div
                      data-ocid="contact.success_state"
                      className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 mb-6"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Message Sent!</p>
                        <p className="text-xs mt-0.5 text-green-700">
                          Thank you! We'll get back to you within 24 hours.
                        </p>
                      </div>
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    noValidate
                  >
                    {/* Name */}
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium mb-1.5 block"
                      >
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        data-ocid="contact.name_input"
                        placeholder="Rajesh Kumar"
                        value={form.name}
                        onChange={(e) => {
                          setForm((p) => ({ ...p, name: e.target.value }));
                          if (errors.name)
                            setErrors((p) => ({ ...p, name: undefined }));
                        }}
                        className={
                          errors.name
                            ? "border-red-400 focus-visible:ring-red-400"
                            : ""
                        }
                      />
                      {errors.name && (
                        <p
                          data-ocid="contact.name_error"
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-sm font-medium mb-1.5 block"
                      >
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        data-ocid="contact.phone_input"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) => {
                          setForm((p) => ({ ...p, phone: e.target.value }));
                          if (errors.phone)
                            setErrors((p) => ({ ...p, phone: undefined }));
                        }}
                        className={
                          errors.phone
                            ? "border-red-400 focus-visible:ring-red-400"
                            : ""
                        }
                      />
                      {errors.phone && (
                        <p
                          data-ocid="contact.phone_error"
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Service */}
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">
                        Service Required *
                      </Label>
                      <Select
                        value={form.service}
                        onValueChange={(v) => {
                          setForm((p) => ({ ...p, service: v }));
                          if (errors.service)
                            setErrors((p) => ({ ...p, service: undefined }));
                        }}
                      >
                        <SelectTrigger
                          data-ocid="contact.service_select"
                          className={
                            errors.service
                              ? "border-red-400 focus-visible:ring-red-400"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.service && (
                        <p
                          data-ocid="contact.service_error"
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors.service}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <Label
                        htmlFor="message"
                        className="text-sm font-medium mb-1.5 block"
                      >
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        data-ocid="contact.message_textarea"
                        placeholder="Tell us about your project..."
                        rows={5}
                        value={form.message}
                        onChange={(e) => {
                          setForm((p) => ({ ...p, message: e.target.value }));
                          if (errors.message)
                            setErrors((p) => ({ ...p, message: undefined }));
                        }}
                        className={`resize-none ${errors.message ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                      />
                      {errors.message && (
                        <p
                          data-ocid="contact.message_error"
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      data-ocid="contact.submit_button"
                      className="w-full font-semibold h-11"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-4">
                    Get in Touch
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Our team of experts is ready to help you bring your digital
                    vision to life. Reach out through any channel.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Phone
                      </p>
                      <a
                        href="tel:+919901563799"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        +91 99015 63799
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Email
                      </p>
                      <a
                        href="mailto:mywebsoloutions97@gmail.com"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        mywebsoloutions97@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Address
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Koramangala, Bengaluru
                        <br />
                        Karnataka 560034, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Business Hours
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Monday – Saturday
                        <br />
                        9:00 AM – 7:00 PM IST
                      </p>
                    </div>
                  </div>
                </div>

                <Card className="bg-accent border-0">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-accent-foreground mb-1">
                      Prefer WhatsApp?
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Chat with us directly for a faster response.
                    </p>
                    <a
                      href="https://wa.me/919901563799"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                    >
                      Open WhatsApp Chat →
                    </a>
                  </CardContent>
                </Card>

                {/* Follow Us */}
                <div>
                  <h4 className="font-display font-semibold text-foreground text-sm mb-3 uppercase tracking-wider">
                    Follow Us
                  </h4>
                  <div className="space-y-2">
                    {SOCIAL_LINKS.map((social) => (
                      <a
                        key={social.description}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={social.description}
                        data-ocid="contact.social.link"
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-accent border border-border flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:border-primary transition-all duration-200">
                          <social.icon className="w-4 h-4 text-primary group-hover:text-white transition-colors duration-200" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-none">
                            {social.label}
                          </p>
                          {social.description !== social.label && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {social.description}
                            </p>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
