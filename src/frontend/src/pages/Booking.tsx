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
import { useCreateBooking } from "@/hooks/useQueries";
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  MessageCircle,
  Phone,
  Star,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SERVICES = [
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
  "Other / General Inquiry",
];

const TIME_SLOTS = [
  {
    value: "Morning (9:00 AM – 12:00 PM)",
    label: "Morning — 9:00 AM to 12:00 PM",
  },
  {
    value: "Afternoon (12:00 PM – 5:00 PM)",
    label: "Afternoon — 12:00 PM to 5:00 PM",
  },
  {
    value: "Evening (5:00 PM – 8:00 PM)",
    label: "Evening — 5:00 PM to 8:00 PM",
  },
];

interface BookingConfirmation {
  name: string;
  service: string;
  date: string;
  time: string;
  phone: string;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string) {
  const cleaned = phone.replace(/[\s\-().+]/g, "");
  return /^\d{7,15}$/.test(cleaned);
}

function SuccessCard({ booking }: { booking: BookingConfirmation }) {
  const waText = encodeURIComponent(
    `Hi, I just booked an appointment for ${booking.service} on ${booking.date}. Booking confirmed!`,
  );
  const waUrl = `https://wa.me/919901563799?text=${waText}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      data-ocid="booking.success_state"
      className="max-w-lg mx-auto"
    >
      <Card className="shadow-card border-green-200 bg-green-50/60">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Appointment Booked!
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Thank you! We've received your booking and will confirm within a few
            hours.
          </p>

          <div className="bg-white rounded-xl border border-green-200 p-4 text-left space-y-3 mb-6">
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Service</p>
                <p className="text-sm font-medium text-foreground">
                  {booking.service}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <CalendarDays className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Preferred Date</p>
                <p className="text-sm font-medium text-foreground">
                  {booking.date}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Preferred Time</p>
                <p className="text-sm font-medium text-foreground">
                  {booking.time}
                </p>
              </div>
            </div>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="booking.whatsapp_button"
            className="inline-flex items-center gap-2.5 w-full justify-center px-6 py-3 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1ebe5d] transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Confirm via WhatsApp
          </a>

          <p className="text-xs text-muted-foreground mt-4">
            For faster confirmation, send us a WhatsApp message.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function Booking() {
  useEffect(() => {
    document.title = "Book an Appointment | My Web Solutions";
    const metaDesc = document.querySelector('meta[name="description"]');
    const content =
      "Schedule a consultation or service appointment with My Web Solutions. Choose your service, date, and time. We'll confirm within hours.";
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
    email: "",
    service: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    service?: string;
    preferredDate?: string;
    preferredTime?: string;
  }>({});
  const [confirmed, setConfirmed] = useState<BookingConfirmation | null>(null);
  const { mutateAsync: createBooking, isPending } = useCreateBooking();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required.";
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = "Please enter a valid phone number.";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.service) newErrors.service = "Please select a service.";
    if (!form.preferredDate) newErrors.preferredDate = "Please choose a date.";
    if (!form.preferredTime)
      newErrors.preferredTime = "Please select a time slot.";
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
      await createBooking(form);
      setConfirmed({
        name: form.name,
        service: form.service,
        date: form.preferredDate,
        time: form.preferredTime,
        phone: form.phone,
      });
      toast.success("Appointment booked successfully!");
    } catch {
      toast.error("Failed to submit booking. Please try again.");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Book an Appointment - My Web Solutions"
        description="Schedule a consultation or appointment with My Web Solutions. Book your slot for web development, SaaS, and digital services."
        keywords="book appointment, web development consultation, SaaS services booking"
        ogImage="/assets/image.png"
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-14 bg-background hero-grid border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground uppercase tracking-widest mb-5">
              <CalendarCheck className="w-3.5 h-3.5" />
              Book Appointment
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-foreground mb-3">
              Schedule a Consultation
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Choose your preferred service, date, and time. We'll confirm your
              appointment within a few hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            {confirmed ? (
              <SuccessCard key="success" booking={confirmed} />
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto"
              >
                {/* Form */}
                <div className="lg:col-span-3">
                  <Card className="shadow-card">
                    <CardContent className="p-6 md:p-8">
                      <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                        data-ocid="booking.form"
                        noValidate
                      >
                        {/* Name */}
                        <div>
                          <Label
                            htmlFor="bk-name"
                            className="text-sm font-medium mb-1.5 block"
                          >
                            Full Name{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="bk-name"
                            data-ocid="booking.name_input"
                            placeholder="Rajesh Kumar"
                            value={form.name}
                            onChange={(e) => {
                              setForm((p) => ({ ...p, name: e.target.value }));
                              if (errors.name)
                                setErrors((p) => ({ ...p, name: undefined }));
                            }}
                            autoComplete="name"
                            className={
                              errors.name
                                ? "border-red-400 focus-visible:ring-red-400"
                                : ""
                            }
                          />
                          {errors.name && (
                            <p
                              data-ocid="booking.name_error"
                              className="text-red-500 text-sm mt-1"
                            >
                              {errors.name}
                            </p>
                          )}
                        </div>

                        {/* Phone + Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="bk-phone"
                              className="text-sm font-medium mb-1.5 block"
                            >
                              Phone Number{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="bk-phone"
                              data-ocid="booking.phone_input"
                              type="tel"
                              placeholder="+91 98765 43210"
                              value={form.phone}
                              onChange={(e) => {
                                setForm((p) => ({
                                  ...p,
                                  phone: e.target.value,
                                }));
                                if (errors.phone)
                                  setErrors((p) => ({
                                    ...p,
                                    phone: undefined,
                                  }));
                              }}
                              autoComplete="tel"
                              className={
                                errors.phone
                                  ? "border-red-400 focus-visible:ring-red-400"
                                  : ""
                              }
                            />
                            {errors.phone && (
                              <p
                                data-ocid="booking.phone_error"
                                className="text-red-500 text-sm mt-1"
                              >
                                {errors.phone}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label
                              htmlFor="bk-email"
                              className="text-sm font-medium mb-1.5 block"
                            >
                              Email <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="bk-email"
                              data-ocid="booking.email_input"
                              type="email"
                              placeholder="you@example.com"
                              value={form.email}
                              onChange={(e) => {
                                setForm((p) => ({
                                  ...p,
                                  email: e.target.value,
                                }));
                                if (errors.email)
                                  setErrors((p) => ({
                                    ...p,
                                    email: undefined,
                                  }));
                              }}
                              autoComplete="email"
                              className={
                                errors.email
                                  ? "border-red-400 focus-visible:ring-red-400"
                                  : ""
                              }
                            />
                            {errors.email && (
                              <p
                                data-ocid="booking.email_error"
                                className="text-red-500 text-sm mt-1"
                              >
                                {errors.email}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Service */}
                        <div>
                          <Label className="text-sm font-medium mb-1.5 block">
                            Service Required{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={form.service}
                            onValueChange={(v) => {
                              setForm((p) => ({ ...p, service: v }));
                              if (errors.service)
                                setErrors((p) => ({
                                  ...p,
                                  service: undefined,
                                }));
                            }}
                          >
                            <SelectTrigger
                              data-ocid="booking.service_select"
                              className={
                                errors.service
                                  ? "border-red-400 focus-visible:ring-red-400"
                                  : ""
                              }
                            >
                              <SelectValue placeholder="Choose a service..." />
                            </SelectTrigger>
                            <SelectContent>
                              {SERVICES.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.service && (
                            <p
                              data-ocid="booking.service_error"
                              className="text-red-500 text-sm mt-1"
                            >
                              {errors.service}
                            </p>
                          )}
                        </div>

                        {/* Date + Time */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="bk-date"
                              className="text-sm font-medium mb-1.5 block"
                            >
                              Preferred Date{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="bk-date"
                              data-ocid="booking.date_input"
                              type="date"
                              min={today}
                              value={form.preferredDate}
                              onChange={(e) => {
                                setForm((p) => ({
                                  ...p,
                                  preferredDate: e.target.value,
                                }));
                                if (errors.preferredDate)
                                  setErrors((p) => ({
                                    ...p,
                                    preferredDate: undefined,
                                  }));
                              }}
                              className={
                                errors.preferredDate
                                  ? "border-red-400 focus-visible:ring-red-400"
                                  : ""
                              }
                            />
                            {errors.preferredDate && (
                              <p
                                data-ocid="booking.date_error"
                                className="text-red-500 text-sm mt-1"
                              >
                                {errors.preferredDate}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label className="text-sm font-medium mb-1.5 block">
                              Preferred Time{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Select
                              value={form.preferredTime}
                              onValueChange={(v) => {
                                setForm((p) => ({ ...p, preferredTime: v }));
                                if (errors.preferredTime)
                                  setErrors((p) => ({
                                    ...p,
                                    preferredTime: undefined,
                                  }));
                              }}
                            >
                              <SelectTrigger
                                data-ocid="booking.time_select"
                                className={
                                  errors.preferredTime
                                    ? "border-red-400 focus-visible:ring-red-400"
                                    : ""
                                }
                              >
                                <SelectValue placeholder="Select time slot" />
                              </SelectTrigger>
                              <SelectContent>
                                {TIME_SLOTS.map((slot) => (
                                  <SelectItem
                                    key={slot.value}
                                    value={slot.value}
                                  >
                                    {slot.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.preferredTime && (
                              <p
                                data-ocid="booking.time_error"
                                className="text-red-500 text-sm mt-1"
                              >
                                {errors.preferredTime}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Message */}
                        <div>
                          <Label
                            htmlFor="bk-message"
                            className="text-sm font-medium mb-1.5 block"
                          >
                            Notes / Message{" "}
                            <span className="text-muted-foreground font-normal">
                              (optional)
                            </span>
                          </Label>
                          <Textarea
                            id="bk-message"
                            data-ocid="booking.message_textarea"
                            placeholder="Any specific requirements, questions, or context..."
                            rows={4}
                            value={form.message}
                            onChange={(e) =>
                              setForm((p) => ({
                                ...p,
                                message: e.target.value,
                              }))
                            }
                            className="resize-none"
                          />
                        </div>

                        <Button
                          type="submit"
                          data-ocid="booking.submit_button"
                          className="w-full font-semibold h-11 text-base"
                          disabled={isPending}
                        >
                          {isPending ? (
                            <>
                              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                              Booking...
                            </>
                          ) : (
                            <>
                              <CalendarCheck className="mr-2 w-4 h-4" />
                              Book Appointment
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar info */}
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="space-y-5"
                  >
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground mb-3">
                        How It Works
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            step: "1",
                            title: "Submit Your Request",
                            desc: "Fill in the form with your preferred date and service.",
                          },
                          {
                            step: "2",
                            title: "We Confirm",
                            desc: "We'll reach out via WhatsApp or phone within 2–4 hours.",
                          },
                          {
                            step: "3",
                            title: "Get Started",
                            desc: "Attend the consultation and move forward with your project.",
                          },
                        ].map((item) => (
                          <div
                            key={item.step}
                            className="flex items-start gap-3"
                          >
                            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                              {item.step}
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-foreground">
                                {item.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Card className="bg-accent border-0">
                      <CardContent className="p-4">
                        <p className="text-sm font-semibold text-accent-foreground mb-1">
                          Prefer WhatsApp?
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          Chat directly for a faster response — no forms needed.
                        </p>
                        <a
                          href="https://wa.me/919901563799?text=Hi%2C%20I'd%20like%20to%20book%20an%20appointment."
                          target="_blank"
                          rel="noopener noreferrer"
                          data-ocid="booking.sidebar_whatsapp_button"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Chat on WhatsApp →
                        </a>
                      </CardContent>
                    </Card>

                    <Card className="border-border">
                      <CardContent className="p-4 space-y-2">
                        <p className="text-sm font-semibold text-foreground">
                          Business Hours
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Monday – Saturday
                          <br />
                          9:00 AM – 7:00 PM IST
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Appointments confirmed within 2–4 hours during
                          business hours.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
