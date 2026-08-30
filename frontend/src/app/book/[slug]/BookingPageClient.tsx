"use client";

import React, { useState, useTransition } from "react";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Phone, Clock, Star, CheckCircle2, ArrowRight, ArrowLeft, Loader2,
  Calendar, User, Mail, MessageSquare, ChevronLeft, ChevronRight
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { generateAvailableTimeSlots } from "@/lib/engines/booking-engine";
import { createPublicEnquiry } from "@/lib/actions/enquiry";

interface BookingPageClientProps {
  business: any;
  bookedSlots: Array<{ date: string; startTime: string; endTime: string; staffId: string | null; status?: string }>;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_MAP: Record<string, number> = { SUN:0, MON:1, TUE:2, WED:3, THU:4, FRI:5, SAT:6 };

type Step = "service" | "datetime" | "details" | "confirm" | "success";

export default function BookingPageClient({ business, bookedSlots }: BookingPageClientProps) {
  const [activeTab, setActiveTab] = useState<"book" | "enquire">("book");
  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  // Enquiry Form State
  const [enquiryForm, setEnquiryForm] = useState({ name: "", phone: "", serviceName: "", message: "" });
  const [enquirySent, setEnquirySent] = useState(false);
  const [enquiryError, setEnquiryError] = useState("");

  const [searchQuery, setSearchQuery] = useState<string>("");

  const primaryColor = business.primaryColor ?? "#2563EB";

  const activeServices = (business.services ?? []).filter(
    (s: any) => s.isActive !== false && s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calendar: show 14 days starting from today + offset
  const calendarDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + calendarOffset * 14 + i);
    return d;
  });

  const isDayOpen = (date: Date) => {
    const dayKey = Object.keys(DAY_MAP).find(k => DAY_MAP[k] === date.getDay());
    const wh = business.workingHours?.find((h: any) => h.day === dayKey);
    return wh?.isOpen ?? true;
  };

  const getAvailableSlots = (dateStr: string) => {
    if (!selectedService) return [];
    const d = new Date(dateStr + "T00:00:00");
    const dayKey = Object.keys(DAY_MAP).find(k => DAY_MAP[k] === d.getDay());
    const wh = business.workingHours?.find((h: any) => h.day === dayKey);
    if (!wh?.isOpen) return [];

    const existingOnDate = bookedSlots
      .filter((b) => b.date === dateStr)
      .map((b) => ({ startTime: b.startTime, endTime: b.endTime, status: b.status || "CONFIRMED" }));

    return generateAvailableTimeSlots(
      wh.openTime,
      wh.closeTime,
      selectedService.duration,
      30,
      existingOnDate
    );
  };

  const validateDetails = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.phone.trim() || form.phone.length < 10) errors.phone = "Enter a valid phone number";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errors.email = "Enter a valid email";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmBooking = () => {
    startTransition(async () => {
      try {
        const { createPublicBooking } = await import("@/lib/actions/booking");
        const { createCheckoutOrder, verifyPayment } = await import("@/lib/actions/checkout");
        
        const booking = await createPublicBooking({
          businessId: business.id,
          serviceId: selectedService?.id,
          staffId: selectedStaff?.id,
          customerName: form.name,
          customerPhone: form.phone,
          customerEmail: form.email || undefined,
          date: selectedDate,
          startTime: selectedTime,
          notes: form.notes || undefined,
        });

        if (booking.price > 0) {
          // Trigger Razorpay
          const checkoutOrder = await createCheckoutOrder(booking.id);
          
          const options = {
            key: checkoutOrder.keyId,
            amount: checkoutOrder.amount,
            currency: checkoutOrder.currency,
            name: checkoutOrder.businessName,
            description: `Appointment: ${selectedService.name}`,
            image: business.logo || undefined,
            order_id: checkoutOrder.orderId,
            handler: async function (response: any) {
              try {
                await verifyPayment(
                  booking.id,
                  response.razorpay_payment_id,
                  response.razorpay_order_id,
                  response.razorpay_signature
                );
                setBookingResult(booking);
                setStep("success");
              } catch (verifyErr: any) {
                console.error("Payment verification failed", verifyErr);
                alert("Payment verification failed. If money was deducted, please contact the business.");
              }
            },
            prefill: {
              name: checkoutOrder.customerName,
              email: checkoutOrder.customerEmail,
              contact: checkoutOrder.customerPhone,
            },
            notes: {
              bookingId: booking.id,
              businessSlug: business.slug,
              serviceName: selectedService.name,
            },
            theme: {
              color: primaryColor,
            },
            modal: {
              escape: true,
              backdropclose: false,
              ondismiss: function () {
                console.log("Customer closed payment modal without completing transaction.");
              },
            },
          };

          if (typeof window === "undefined" || !(window as any).Razorpay) {
            console.error("Razorpay SDK is not loaded.");
            alert("Payment gateway is temporarily unavailable. Please check your internet connection or reload the page.");
            return;
          }

          const rzp = new (window as any).Razorpay(options);
          rzp.on("payment.failed", function (response: any) {
            console.error("Payment failed:", response.error);
            alert(`Payment Failed: ${response.error.description || "Transaction could not be completed."}`);
          });
          rzp.open();
        } else {
          // Free booking
          setBookingResult(booking);
          setStep("success");
        }
      } catch (err: any) {
        console.error("Booking verification failed:", err);
        alert(err.message || "We could not process your booking at this time. Please try another slot or refresh.");
      }
    });
  };

  const stepProgress = { service: 1, datetime: 2, details: 3, confirm: 4, success: 4 }[step];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F8FAFC", fontFamily: business.fontBody ?? "Inter, sans-serif" }}
    >
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      {/* Business Header */}
      <div className="shadow-sm" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-2xl mx-auto px-4 py-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black text-xl">
              {business.name?.[0] ?? "B"}
            </div>
            <div>
              <h1 className="text-xl font-black">{business.name}</h1>
              <p className="text-white/80 text-sm capitalize">{business.industry}</p>
              {business.address && (
                <div className="flex items-center gap-1 text-white/70 text-xs mt-0.5">
                  <MapPin size={11} /> {business.city ?? business.address}
                </div>
              )}
            </div>

            {/* Direct WhatsApp CTA Button */}
            <div className="ml-auto">
              <a
                href={`https://wa.me/${(business.whatsapp || business.phone || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${business.name}, I have an enquiry regarding your services.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <MessageSquare size={14} /> Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          {step !== "success" && (
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setActiveTab("book")}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  activeTab === "book"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "bg-white/20 text-white hover:bg-white/30"
                )}
              >
                📅 Book Appointment
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("enquire")}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  activeTab === "enquire"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "bg-white/20 text-white hover:bg-white/30"
                )}
              >
                💬 Have a Question / Enquire
              </button>
            </div>
          )}
        </div>

        {/* Progress Steps for Booking */}
        {activeTab === "book" && step !== "success" && (
          <div className="max-w-2xl mx-auto px-4 pb-4">
            <div className="flex items-center gap-2">
              {["Select Service", "Date & Time", "Your Details", "Confirm"].map((label, i) => (
                <React.Fragment key={label}>
                  <div className={cn("flex items-center gap-1.5", stepProgress > i + 1 ? "opacity-60" : "")}>
                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                      stepProgress === i + 1 ? "bg-white text-gray-900" : stepProgress > i + 1 ? "bg-white/40 text-white" : "bg-white/20 text-white/50"
                    )}>
                      {stepProgress > i + 1 ? "✓" : i + 1}
                    </div>
                    <span className={cn("text-[10px] font-medium hidden sm:block", stepProgress >= i + 1 ? "text-white" : "text-white/40")}>
                      {label}
                    </span>
                  </div>
                  {i < 3 && <div className={cn("flex-1 h-px", stepProgress > i + 1 ? "bg-white/50" : "bg-white/20")} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {activeTab === "enquire" ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-1">Send an Enquiry 💬</h2>
            <p className="text-sm text-gray-500 mb-6">
              Have questions about pricing, availability, or custom packages? Leave a message and {business.name} will get back to you immediately.
            </p>

            {enquirySent ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Enquiry Received!</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  Thank you! {business.name} has received your enquiry and will contact you via WhatsApp/Phone shortly.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <a
                    href={`https://wa.me/${(business.whatsapp || business.phone || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${business.name}, I just submitted an enquiry: ${enquiryForm.message || "regarding appointments"}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <MessageSquare size={16} /> Chat on WhatsApp Now
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setEnquirySent(false);
                      setEnquiryForm({ name: "", phone: "", serviceName: "", message: "" });
                    }}
                    className="px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50"
                  >
                    Send Another
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!enquiryForm.name.trim() || !enquiryForm.phone.trim()) {
                    setEnquiryError("Please provide your Name and Phone number.");
                  }
                  setEnquiryError("");
                  startTransition(async () => {
                    try {
                      await createPublicEnquiry({
                        businessId: business.id,
                        name: enquiryForm.name,
                        phone: enquiryForm.phone,
                        serviceName: enquiryForm.serviceName || undefined,
                        message: enquiryForm.message || undefined,
                      });
                      setEnquirySent(true);
                    } catch (err: any) {
                      setEnquiryError(err.message || "Failed to submit enquiry.");
                    }
                  });
                }}
                className="space-y-4"
              >
                {enquiryError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
                    {enquiryError}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={enquiryForm.name}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={enquiryForm.phone}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Service Interested In (Optional)
                  </label>
                  <select
                    value={enquiryForm.serviceName}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, serviceName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="">Select a service...</option>
                    {activeServices.map((s: any) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({formatCurrency(s.price)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Your Message / Question
                  </label>
                  <textarea
                    rows={3}
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    placeholder="e.g. Do you have slots available this Saturday afternoon?"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isPending ? <Loader2 size={18} className="animate-spin" /> : "Send Enquiry to Business"}
                </button>
              </form>
            )}
          </div>
        ) : (
        <AnimatePresence mode="wait">
          {/* Step 1: Select Service */}
          {step === "service" && (
            <motion.div key="service" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900">Choose a Service</h2>
                  <p className="text-sm text-gray-500">Select what you'd like to book</p>
                </div>
                {business.services?.length > 3 && (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-52 px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {activeServices.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100 p-6">
                    <p className="text-sm font-medium">No matching services found.</p>
                  </div>
                ) : (
                  activeServices.map((service: any) => (
                    <button
                      key={service.id}
                      onClick={() => { setSelectedService(service); setStep("datetime"); }}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border transition-all hover:shadow-md active:scale-[0.99]",
                        selectedService?.id === service.id ? "border-2 bg-white" : "border-gray-200 bg-white hover:border-gray-300"
                      )}
                      style={selectedService?.id === service.id ? { borderColor: primaryColor, backgroundColor: `${primaryColor}08` } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-900">{service.name}</p>
                          {service.description && <p className="text-sm text-gray-500 mt-0.5">{service.description}</p>}
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock size={12} /> {service.duration} min
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4 shrink-0">
                          <p className="font-black text-lg" style={{ color: primaryColor }}>
                            {service.price > 0 ? formatCurrency(service.price) : "Free"}
                          </p>
                          <ArrowRight size={18} className="ml-auto mt-1 text-gray-400" />
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {business.staff?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Select Staff (Optional)</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedStaff(null)}
                      className={cn("px-4 py-2 rounded-xl text-sm font-semibold border transition-all", !selectedStaff ? "text-white" : "border-gray-200 text-gray-600")}
                      style={!selectedStaff ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
                    >
                      Any Staff
                    </button>
                    {business.staff.map((s: any) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedStaff(s)}
                        className={cn("px-4 py-2 rounded-xl text-sm font-semibold border transition-all", selectedStaff?.id === s.id ? "text-white" : "border-gray-200 text-gray-600")}
                        style={selectedStaff?.id === s.id ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Date & Time */}
          {step === "datetime" && (
            <motion.div key="datetime" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <button onClick={() => setStep("service")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
                <ArrowLeft size={16} /> Back
              </button>
              <h2 className="text-xl font-black text-gray-900 mb-1">Select Date &amp; Time</h2>
              <p className="text-sm text-gray-500 mb-5">
                {selectedService?.name} · {selectedService?.duration} min
              </p>

              {/* Calendar strip */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <button onClick={() => setCalendarOffset(Math.max(0, calendarOffset - 1))} disabled={calendarOffset === 0} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40">
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-sm font-bold text-gray-700">
                    {MONTHS[calendarDays[0].getMonth()]} {calendarDays[0].getFullYear()}
                  </span>
                  <button onClick={() => setCalendarOffset(calendarOffset + 1)} className="p-1.5 rounded-lg hover:bg-gray-100">
                    <ChevronRight size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((d) => {
                    const dateStr = d.toISOString().split("T")[0];
                    const isOpen = isDayOpen(d);
                    const isSelected = selectedDate === dateStr;
                    const isPast = d < new Date(new Date().toDateString());
                    const slots = getAvailableSlots(dateStr);
                    return (
                      <button
                        key={dateStr}
                        disabled={!isOpen || isPast}
                        onClick={() => { setSelectedDate(dateStr); setSelectedTime(""); }}
                        className={cn(
                          "flex flex-col items-center py-2 px-1 rounded-xl text-xs font-semibold transition-all",
                          isSelected ? "text-white" : isOpen && !isPast ? "text-gray-700 hover:bg-gray-100" : "text-gray-300 cursor-not-allowed"
                        )}
                        style={isSelected ? { backgroundColor: primaryColor } : {}}
                      >
                        <span className="text-[10px] mb-1">{DAYS[d.getDay()]}</span>
                        <span>{d.getDate()}</span>
                        {isOpen && !isPast && (
                          <span className="w-1 h-1 rounded-full mt-1" style={{ backgroundColor: isSelected ? "white" : slots.length > 0 ? primaryColor : "#D1D5DB" }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slots */}
              {selectedDate && (
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">
                    Available Times — {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                  </h3>
                  {getAvailableSlots(selectedDate).length === 0 ? (
                    <p className="text-sm text-gray-400 py-4 text-center">No available slots for this day</p>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {getAvailableSlots(selectedDate).map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={cn("py-2 rounded-xl text-sm font-semibold border transition-all",
                            selectedTime === slot ? "text-white" : "border-gray-200 text-gray-700 hover:border-gray-400"
                          )}
                          style={selectedTime === slot ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedDate && selectedTime && (
                <button
                  onClick={() => setStep("details")}
                  className="w-full mt-4 py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: primaryColor }}
                >
                  Continue <ArrowRight size={18} />
                </button>
              )}
            </motion.div>
          )}

          {/* Step 3: Customer Details */}
          {step === "details" && (
            <motion.div key="details" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <button onClick={() => setStep("datetime")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
                <ArrowLeft size={16} /> Back
              </button>
              <h2 className="text-xl font-black text-gray-900 mb-1">Your Details</h2>
              <p className="text-sm text-gray-500 mb-5">We&apos;ll send your confirmation to these details</p>

              <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Full Name *</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-blue-400 transition-colors" />
                  </div>
                  {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Phone Number *</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 98765 43210" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-blue-400 transition-colors" />
                  </div>
                  {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Email (Optional)</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-blue-400 transition-colors" />
                  </div>
                  {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Notes (Optional)</label>
                  <div className="relative">
                    <MessageSquare size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <textarea rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Any special requests or notes..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-blue-400 transition-colors resize-none" />
                  </div>
                </div>

                <button
                  onClick={() => { if (validateDetails()) setStep("confirm"); }}
                  className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: primaryColor }}
                >
                  Review Booking <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Confirm */}
          {step === "confirm" && (
            <motion.div key="confirm" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <button onClick={() => setStep("details")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
                <ArrowLeft size={16} /> Back
              </button>
              <h2 className="text-xl font-black text-gray-900 mb-1">Confirm Booking</h2>
              <p className="text-sm text-gray-500 mb-5">Review your booking details before confirming</p>

              <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 mb-4">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                    <Calendar size={20} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{selectedService?.name}</p>
                    <p className="text-sm text-gray-500">{selectedService?.duration} minutes</p>
                  </div>
                  <p className="ml-auto font-black text-lg" style={{ color: primaryColor }}>
                    {selectedService?.price > 0 ? formatCurrency(selectedService.price) : "Free"}
                  </p>
                </div>

                {[
                  { label: "Date", value: new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
                  { label: "Time", value: selectedTime },
                  { label: "Staff", value: selectedStaff?.name ?? "Any available" },
                  { label: "Name", value: form.name },
                  { label: "Phone", value: form.phone },
                  form.email ? { label: "Email", value: form.email } : null,
                  form.notes ? { label: "Notes", value: form.notes } : null,
                ].filter(Boolean).map((item: any) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-semibold text-gray-900 text-right max-w-[60%]">{item.value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleConfirmBooking}
                disabled={isPending}
                className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
                style={{ backgroundColor: primaryColor }}
              >
                {isPending ? (<><Loader2 size={18} className="animate-spin" /> Confirming...</>) : (<>Confirm Booking <CheckCircle2 size={18} /></>)}
              </button>
            </motion.div>
          )}

          {/* Step 5: Success */}
          {step === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <CheckCircle2 size={40} style={{ color: primaryColor }} />
              </motion.div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Booking Confirmed! 🎉</h2>
              <p className="text-gray-500 mb-6">Your appointment at {business.name} is confirmed.</p>

              <div className="bg-white rounded-2xl border border-gray-200 p-5 text-left space-y-3 max-w-sm mx-auto shadow-sm">
                <p className="font-bold text-center text-gray-700 mb-2 text-sm uppercase tracking-wider">Booking Details</p>
                {[
                  { label: "Service", value: selectedService?.name },
                  { label: "Date", value: selectedDate ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }) : "" },
                  { label: "Time", value: selectedTime },
                  { label: "Location", value: business.address ?? business.city ?? "Business address" },
                  { label: "Phone", value: business.phone },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 max-w-sm mx-auto mt-5">
                <div className="flex gap-2.5">
                  <a
                    href={`https://wa.me/${(business.whatsapp || business.phone || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${business.name}, I just booked ${selectedService?.name} for ${selectedDate} at ${selectedTime}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <MessageSquare size={16} /> WhatsApp Us
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${business.city || ""}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-white border border-gray-200 text-gray-800 font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <MapPin size={16} className="text-red-500" /> View on Maps
                  </a>
                </div>

                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${business.name} — ${selectedService?.name || "Appointment"}`)}&details=${encodeURIComponent(`Appointment with ${business.name}. Contact: ${business.phone}`)}&location=${encodeURIComponent(business.address ?? business.city ?? "")}${(() => {
                    if (!selectedDate || !selectedTime) return "";
                    try {
                      const start = new Date(`${selectedDate}T${selectedTime}:00`);
                      const durationMins = selectedService?.duration || 60;
                      const end = new Date(start.getTime() + durationMins * 60 * 1000);
                      const startStr = start.toISOString().replace(/-|:|\.\d\d\d/g, "");
                      const endStr = end.toISOString().replace(/-|:|\.\d\d\d/g, "");
                      return `&dates=${startStr}/${endStr}`;
                    } catch {
                      return "";
                    }
                  })()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
                >
                  <Calendar size={15} /> Add to Google Calendar
                </a>
              </div>

              <p className="text-xs text-gray-400 mt-6">
                Please save this confirmation. For changes or queries, contact {business.name} directly at{" "}
                <a href={`tel:${business.phone}`} className="font-semibold" style={{ color: primaryColor }}>{business.phone}</a>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-6 mt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Powered by{" "}
          <a href="https://docodo.in" className="font-bold" style={{ color: primaryColor }}>Docodo</a>
          {" "}· AI-powered business platform
        </p>
      </div>
    </div>
  );
}
