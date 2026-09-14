"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  Zap, 
  Lock, 
  Check, 
  Sparkles,
  HelpCircle
} from "lucide-react";
import { loadRazorpayScript } from "@/lib/razorpay";
import { PRICING_PLANS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const planParam = searchParams.get("plan") || "starter";
  const [selectedPlanId, setSelectedPlanId] = useState<string>(planParam);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (planParam) {
      setSelectedPlanId(planParam);
    }
  }, [planParam]);

  // Find selected plan details
  const plan = PRICING_PLANS.find((p) => p.id === selectedPlanId) || PRICING_PLANS[1]; // default to Starter
  const isFreePilot = plan.id === "pilot" || plan.price === "₹0";
  const priceNum = parseInt(plan.price.replace(/[^0-9]/g, ""), 10) || 999;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (isFreePilot) {
      router.push("/auth/signup");
      return;
    }

    if (!name.trim() || !phone.trim()) {
      setErrorMessage("Please enter your name and WhatsApp contact number.");
      return;
    }

    setLoading(true);

    try {
      // 1. Ensure Razorpay SDK is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || typeof window === "undefined" || !(window as any).Razorpay) {
        setLoading(false);
        setErrorMessage("Payment gateway SDK failed to load. Please check your internet connection.");
        return;
      }

      // 2. Create Real Order via POST /api/create-order
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: priceNum * 100, // paise
          currency: "INR",
          receipt: `rcpt_${plan.id}_${Date.now()}`.slice(0, 40),
          notes: {
            planId: plan.id,
            planName: plan.name,
            customerName: name,
            customerPhone: phone,
            customerEmail: email,
            businessName: businessName,
          },
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || "Failed to create payment order");
      }

      // 3. Open Razorpay Standard Checkout
      const options = {
        key: orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Docodo India",
        description: `${plan.name} — ${plan.period}`,
        order_id: orderData.order_id,
        prefill: {
          name: name,
          email: email || undefined,
          contact: phone,
        },
        notes: {
          planId: plan.id,
          businessName: businessName,
        },
        theme: {
          color: "#C8F135",
        },
        modal: {
          escape: true,
          backdropclose: false,
          ondismiss: function () {
            setLoading(false);
          },
        },
        handler: async function (response: any) {
          try {
            // 4. Verify Payment via POST /api/verify-payment
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: plan.id,
                planName: plan.name,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setPaymentSuccess({
                plan: plan.name,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              });
            } else {
              setErrorMessage(verifyData.error || "Payment verification failed. Please contact support.");
            }
          } catch (verifyErr: any) {
            setErrorMessage(verifyErr.message || "Network error verifying payment.");
          } finally {
            setLoading(false);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setLoading(false);
        setErrorMessage(`Payment failed: ${response.error?.description || "Transaction declined"}`);
      });
      rzp.open();
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Success View */}
      {paymentSuccess ? (
        <div className="bg-[var(--bg-surface)] border border-[var(--lime)]/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[var(--lime)]/20 text-[var(--lime)] flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 inline-block mb-2">
              Payment Verified &amp; Active
            </span>
            <h1 className="text-3xl font-display font-black text-white">
              Welcome to {paymentSuccess.plan}! 🎉
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Your payment of <strong className="text-white">₹{priceNum.toLocaleString("en-IN")}</strong> has been verified via Razorpay.
            </p>
          </div>

          <div className="p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] text-left max-w-md mx-auto space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)]">Payment ID</span>
              <span className="font-mono text-white">{paymentSuccess.paymentId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)]">Order ID</span>
              <span className="font-mono text-white">{paymentSuccess.orderId}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[var(--text-secondary)]">Status</span>
              <span className="text-emerald-400 font-bold">PROVISIONED &amp; ACTIVE</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              size="lg"
              className="font-bold shadow-[var(--lime-glow-sm)]"
              onClick={() => router.push("/onboarding")}
            >
              Start 15-Minute Setup <ArrowRight size={16} className="ml-1" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push("/dashboard")}
            >
              Go to Merchant Dashboard
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <Link href="/pricing" className="text-xs text-[var(--text-muted)] hover:text-white inline-flex items-center gap-1 mb-2">
              ← Back to Pricing Plans
            </Link>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-white">
              Secure Checkout &amp; Service Activation
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Official Razorpay payment gateway with instant product provisioning.
            </p>
          </div>

          {/* Plan Selector Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)]">
            {PRICING_PLANS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPlanId(p.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                  selectedPlanId === p.id
                    ? "bg-[var(--lime)] text-black shadow-md"
                    : "text-[var(--text-secondary)] hover:text-white"
                }`}
              >
                <div>{p.name}</div>
                <div className="text-[10px] font-mono opacity-80">{p.price}</div>
              </button>
            ))}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-400">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Checkout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column: Form Details */}
            <div className="md:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-6 sm:p-8 space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck size={20} className="text-[var(--lime)]" /> Business &amp; Contact Details
              </h2>

              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--lime)]/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--lime)]/60 font-mono"
                  />
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">
                    Your receipt, account access, and service onboarding will be sent here.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul@salon.com"
                    className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--lime)]/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">
                    Business Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Sharma Luxury Salon &amp; Spa"
                    className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--lime)]/60"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="w-full font-bold shadow-[var(--lime-glow-md)] text-base py-3.5"
                  >
                    {loading ? (
                      <><Loader2 size={18} className="animate-spin mr-2" /> Initializing Razorpay...</>
                    ) : isFreePilot ? (
                      <>Join Free Pilot Program <ArrowRight size={18} className="ml-1.5" /></>
                    ) : (
                      <>Pay ₹{priceNum.toLocaleString("en-IN")} Securely <ArrowRight size={18} className="ml-1.5" /></>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] text-[var(--text-muted)] pt-2">
                  <Lock size={12} className="text-emerald-400" />
                  <span>256-bit SSL Encrypted • Razorpay Certified • Instant Provisioning</span>
                </div>
              </form>
            </div>

            {/* Right Column: Order Summary & Deliverables */}
            <div className="md:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-6 sm:p-8 space-y-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-2.5 py-0.5 rounded-full border border-[var(--lime)]/30 inline-block mb-3">
                  Selected Package
                </span>
                <h3 className="text-2xl font-black text-white font-display">
                  {plan.name}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {plan.description}
                </p>

                {/* Price Breakdown */}
                <div className="my-5 p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Plan Price</span>
                    <span className="font-bold text-white">{plan.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Billing Period</span>
                    <span className="font-mono text-white capitalize">{plan.period}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Platform Setup</span>
                    <span className="text-emerald-400 font-bold">Included Free</span>
                  </div>
                  <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-between text-sm font-bold">
                    <span className="text-white">Total Amount Due</span>
                    <span className="text-[var(--lime)] font-mono font-black">
                      ₹{priceNum.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* What's Delivered */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
                    What you get:
                  </p>
                  <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check size={14} className="text-[var(--lime)] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] space-y-1">
                <p>📞 Need assistance? WhatsApp our onboarding team:</p>
                <a
                  href="https://wa.me/919284310604?text=Hi%20Docodo,%20I%20have%20a%20question%20about%20the%20plans"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--lime)] hover:underline font-bold"
                >
                  +91 9284310604 (Ameya Kshirsagar)
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-void)] text-white">
      <Suspense fallback={<div className="p-12 text-center text-xs text-[var(--text-muted)]">Loading Checkout...</div>}>
        <CheckoutContent />
      </Suspense>
    </main>
  );
}
