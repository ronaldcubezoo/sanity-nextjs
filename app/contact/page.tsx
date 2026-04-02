"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MapPin, Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

// --- Shadcn UI Imports ---
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Checkbox } from "@/app/components/ui/checkbox";

/* ── Data ──────────────────────────────────────────────── */
const office = {
  name: "London Headquarters",
  address_line_1: "The Marque",
  address_line_2: "1st Floor, 32-33 St James's Place",
  city: "London",
  postcode: "SW1A 1NR",
  country: "United Kingdom",
  email: "enquiries@themarque.com",
};

const formOptions = [
  { value: "profile", label: "Profile Enquiry" },
  { value: "corporate", label: "Corporate Enquiry" },
  { value: "media", label: "Media & Press" },
  { value: "general", label: "General Enquiry" },
];

/* ── Validation schema ─────────────────────────────────── */
const enquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .max(30, "Phone number must be less than 30 characters")
    .regex(/^[+\d\s\-().]*$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  enquiryType: z.string().min(1, "Please select an enquiry type"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the Privacy Policy to proceed" }),
  }),
});

type EnquiryForm = z.infer<typeof enquirySchema>;

/* ── Page ──────────────────────────────────────────────── */
export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 1. Initialize React Hook Form with Zod Resolver
  const form = useForm<EnquiryForm>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      enquiryType: "",
      message: "",
      privacyConsent: undefined, // undefined prevents initial validation errors on checkboxes
    },
  });

  // 2. Handle the validated submission
  const onSubmit = async (data: EnquiryForm) => {
    setSubmitting(true);
    // Simulate async submission (replace with real API call in Phase 2)
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      {/* ── Hero strip ───────────────────────────────────── */}
      <section className="bg-graphite-dark border-b border-graphite-light/20 pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-copper text-xs tracking-[0.2em] uppercase mb-3">The Marque</p>
          <h1 className="text-cream text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            Get in Touch
          </h1>
        </div>
      </section>

      {/* ── Two-column body ───────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-20">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-start">

          {/* ── LEFT: Info column (2/5) ─────────────────── */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <p className="text-graphite/65 text-sm leading-relaxed max-w-sm">
                Whether you are interested in establishing a Marque Profile or have a general
                enquiry, our team is ready to assist you. All enquiries are handled with complete
                discretion.
              </p>
            </div>

            {/* Office details */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 flex-shrink-0 rounded-sm bg-copper/10 flex items-center justify-center mt-0.5">
                  <MapPin size={14} className="text-copper" />
                </div>
                <div>
                  <p className="text-graphite text-xs font-bold tracking-[0.15em] uppercase mb-2">
                    {office.name}
                  </p>
                  <p className="text-graphite/55 text-sm leading-6">
                    {office.address_line_1}
                    <br />
                    {office.address_line_2}
                    <br />
                    {office.city}, {office.postcode}
                    <br />
                    {office.country}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 flex-shrink-0 rounded-sm bg-copper/10 flex items-center justify-center mt-0.5">
                  <Mail size={14} className="text-copper" />
                </div>
                <div>
                  <p className="text-graphite text-xs font-bold tracking-[0.15em] uppercase mb-2">
                    Email
                  </p>
                  <a
                    href={`mailto:${office.email}`}
                    className="text-graphite/60 text-sm hover:text-copper transition-colors duration-200"
                  >
                    {office.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Discretion note */}
            <div className="border-l-2 border-copper/40 pl-5 py-1">
              <p className="text-graphite/50 text-xs leading-relaxed italic">
                "All enquiries are handled with complete confidentiality by our senior team."
              </p>
            </div>
          </div>

          {/* ── RIGHT: Form column (3/5) ─────────────────── */}
          <div className="lg:col-span-3">
            {submitted ? (
              <SuccessState onReset={() => { form.reset(); setSubmitted(false); }} />
            ) : (
              <div className="bg-cream border border-graphite/10 rounded-sm p-8 lg:p-10 shadow-sm">
                <h2 className="text-graphite text-lg font-bold tracking-tight mb-1">
                  Send an Enquiry
                </h2>
                <p className="text-graphite/45 text-xs mb-8 tracking-wide">
                  All fields marked * are required.
                </p>

                {/* Shadcn Form Wrapper */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Row: Name + Email */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-graphite/60 text-xs tracking-wide">Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Jonathan Wilkinson" className="border-graphite/15 focus-visible:ring-copper bg-white" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs text-destructive" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-graphite/60 text-xs tracking-wide">Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" className="border-graphite/15 focus-visible:ring-copper bg-white" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs text-destructive" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row: Phone + Type */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center">
                              <FormLabel className="text-graphite/60 text-xs tracking-wide">Phone Number</FormLabel>
                              <span className="text-graphite/35 text-[10px] tracking-wide">Optional</span>
                            </div>
                            <FormControl>
                              <Input type="tel" placeholder="+44 20 0000 0000" className="border-graphite/15 focus-visible:ring-copper bg-white" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs text-destructive" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="enquiryType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-graphite/60 text-xs tracking-wide">Enquiry Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-graphite/15 focus:ring-copper bg-white text-graphite">
                                  <SelectValue placeholder="Select enquiry type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {formOptions.map((o) => (
                                  <SelectItem key={o.value} value={o.value}>
                                    {o.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs text-destructive" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Message */}
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-graphite/60 text-xs tracking-wide">Message *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please describe your enquiry in as much detail as you wish..." 
                              className="resize-none border-graphite/15 focus-visible:ring-copper bg-white" 
                              rows={5} 
                              {...field} 
                            />
                          </FormControl>
                          <div className="flex justify-between items-start">
                            <FormMessage className="text-xs text-destructive" />
                            <p className="text-graphite/30 text-[10px] ml-auto">
                              {field.value.length}/1000
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Privacy Consent Checkbox */}
                    <FormField
                      control={form.control}
                      name="privacyConsent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-copper data-[state=checked]:border-copper mt-0.5"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-graphite/55 text-xs leading-relaxed font-normal cursor-pointer">
                              I agree to The Marque's{" "}
                              <Link href="/privacy" className="text-copper hover:underline underline-offset-2">
                                Privacy Policy
                              </Link>{" "}
                              and consent to my personal data being processed for the purpose of responding to this enquiry. *
                            </FormLabel>
                            <FormMessage className="text-xs text-destructive mt-2" />
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* CAPTCHA placeholder */}
                    <div className="border border-graphite/10 rounded-sm p-4 bg-graphite/5 flex items-center gap-4 mt-6">
                      <div className="w-6 h-6 rounded-sm border-2 border-graphite/20 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-graphite/40 text-xs">I'm not a robot</p>
                      </div>
                      <div className="text-right">
                        <p className="text-graphite/25 text-[9px] leading-tight tracking-wide">
                          reCAPTCHA<br />Privacy · Terms
                        </p>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 bg-copper hover:bg-copper-light disabled:opacity-60 disabled:cursor-not-allowed text-cream text-sm font-bold tracking-widest uppercase px-6 py-4 rounded-sm transition-all duration-200 hover:shadow-lg hover:shadow-copper/20 group"
                    >
                      {submitting ? (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-cream/30 border-t-cream animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Enquiry
                          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>

                  </form>
                </Form>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ── Sub-components ────────────────────────────────────── */
function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="bg-cream border border-graphite/10 rounded-sm p-10 lg:p-14 text-center shadow-sm">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-copper/30 bg-copper/10 mb-6">
        <CheckCircle2 size={26} className="text-copper" />
      </div>
      <h3 className="text-graphite text-xl font-bold tracking-tight mb-3">
        Enquiry Received
      </h3>
      <p className="text-graphite/55 text-sm leading-relaxed max-w-sm mx-auto mb-8">
        Thank you for reaching out. A member of our senior team will be in touch within one business day.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 text-copper text-xs font-semibold tracking-wide hover:gap-3 transition-all duration-200"
      >
        Submit another enquiry
        <ArrowRight size={12} />
      </button>
    </div>
  );
}