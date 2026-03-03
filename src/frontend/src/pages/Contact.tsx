import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
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
import { CheckCircle, Clock, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
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

export function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync: submitLead, isPending } = useSubmitLead();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.service || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
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
                          We'll get back to you within 24 hours.
                        </p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
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
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        required
                      />
                    </div>

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
                        onChange={(e) =>
                          setForm((p) => ({ ...p, phone: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">
                        Service Required *
                      </Label>
                      <Select
                        value={form.service}
                        onValueChange={(v) =>
                          setForm((p) => ({ ...p, service: v }))
                        }
                      >
                        <SelectTrigger data-ocid="contact.service_select">
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
                    </div>

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
                        onChange={(e) =>
                          setForm((p) => ({ ...p, message: e.target.value }))
                        }
                        required
                        className="resize-none"
                      />
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
