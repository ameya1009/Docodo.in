"use client";

import React, { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Sparkles, Shield, Zap, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PRICING_PLANS } from "@/lib/constants";

export const PricingSection = () => {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [paidPlan, setPaidPlan] = useState<string | null>(null);

  const handlePlanCheckout = async (plan: any) => {
    // If pilot/free plan, go directly to signup
    if (plan.id === "starter" || plan.price === "₹0") {
      router.push("/auth/signup");
      return;
    }

    const priceNum = parseInt(plan.price.replace(/[^0-9]/g, ""), 10) || 2499;
    setLoadingPlan(plan.id);

    try {
      // 1. Call Backend Order Creation Endpoint: POST /api/create-order
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: priceNum * 100, // in paise
          currency: "INR",
          receipt: `rcpt_${plan.id}_${Date.now()}`,
          notes: {
            planId: plan.id,
            planName: plan.name,
          },
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // 2. Open Razorpay Standard Checkout Modal
      const options = {
        key: orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: orderData.amount,
        currency: orderData.currency,


        name: "Docodo India",
        description: `${plan.name} Subscription (${plan.period})`,
        order_id: orderData.order_id,
        theme: {
          color: "#C8F135",
        },
        modal: {
          escape: true,
          backdropclose: false,
          ondismiss: function () {
            setLoadingPlan(null);
          },
        },
        handler: async function (response: any) {
          try {
            // 3. Call Backend Verification Endpoint: POST /api/verify-payment
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setPaidPlan(plan.name);
            } else {
              alert(verifyData.error || "Payment verification failed.");
            }
          } catch (err: any) {
            alert(err.message || "Network error verifying payment");
          } finally {
            setLoadingPlan(null);
          }
        },
      };

      if (typeof window === "undefined" || !(window as any).Razorpay) {
        setLoadingPlan(null);
        alert("Razorpay checkout is loading, please try again in a second.");
        return;
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setLoadingPlan(null);
        alert(`Payment failed: ${response.error?.description || "Transaction declined"}`);
      });
      rzp.open();
    } catch (err: any) {
      setLoadingPlan(null);
      alert(err.message || "Failed to initialize payment");
    }
  };

  return (
    <section id="pricing" className="py-24 bg-[var(--bg-elevated)]/30 border-y border-[var(--border-subtle)] relative overflow-hidden">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Success Modal */}
      <AnimatePresence>
        {paidPlan && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[var(--bg-surface)] border border-[var(--lime)] p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--lime)]/20 text-[var(--lime)] flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-black text-white font-display">
                {paidPlan} Activated! 🎉
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Your payment was verified via Razorpay HMAC SHA-256. Welcome to the future of local business operations.
              </p>
              <Button
                variant="primary"
                size="lg"
                className="w-full font-bold"
                onClick={() => {
                  setPaidPlan(null);
                  router.push("/onboarding");
                }}
              >
                Go to 15-Min Onboarding <ArrowRight size={16} className="ml-1" />
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-3 inline-block">
            💎 Simple &amp; Transparent
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-[var(--text-primary)] tracking-tight mb-4">
            Predictable Pricing for Growing Businesses
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)]">
            Start completely free on our Pilot Program, or choose a plan that scales with your appointments.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PRICING_PLANS.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className={`p-6 bg-[var(--bg-surface)] rounded-3xl flex flex-col justify-between relative transition-all ${
                plan.popular
                  ? "border-2 border-[var(--lime)] shadow-[var(--lime-glow-md)]"
                  : "border border-[var(--border-default)] hover:border-[var(--lime)]/40"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--lime)] text-black text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <div className="mb-4">
                  <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                    {plan.badge}
                  </span>
                  <h3 className="font-bold text-xl text-[var(--text-primary)] font-display mt-2">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 min-h-[36px]">
                    {plan.description}
                  </p>
                </div>

                <div className="my-6 pb-6 border-b border-[var(--border-subtle)]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] font-display">
                      {plan.price}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] font-mono">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 mb-8">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                      <Check size={14} className="text-[var(--lime)] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Button
                  variant={plan.popular ? "primary" : "secondary"}
                  size="md"
                  className="w-full font-bold shadow-md"
                  onClick={() => handlePlanCheckout(plan)}
                  disabled={loadingPlan === plan.id}
                >
                  {loadingPlan === plan.id ? (
                    <><Loader2 size={14} className="animate-spin mr-1.5" /> Opening Checkout...</>
                  ) : (
                    <>{plan.cta} <ArrowRight size={14} className="ml-1" /></>
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Note */}
        <div className="text-center text-xs text-[var(--text-muted)] font-mono">
          ✓ No hidden setup fees • ✓ Razorpay UPI, Cards &amp; NetBanking • ✓ Cancel or upgrade anytime
        </div>
      </div>
    </section>
  );
};

