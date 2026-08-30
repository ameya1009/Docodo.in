"use client";

import React, { useState } from "react";
import Script from "next/script";
import { CheckCircle2, AlertCircle, Loader2, CreditCard, ShieldCheck, ArrowRight } from "lucide-react";

export default function RazorpayTestCheckoutPage() {
  const [amount, setAmount] = useState<number>(500); // ₹500
  const [name, setName] = useState<string>("Test Customer");
  const [email, setEmail] = useState<string>("customer@example.com");
  const [phone, setPhone] = useState<string>("+919876543210");
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handlePayment = async () => {
    setLoading(true);
    setPaymentStatus(null);
    setErrorMessage("");

    try {
      // 1. Call Backend Order Creation Endpoint: POST /api/create-order
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount * 100, // Convert INR to paise
          currency: "INR",
          receipt: `test_rcpt_${Date.now()}`,
          notes: {
            test: "true",
            customerName: name,
          },
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || "Failed to create Razorpay order");
      }

      // 2. Open Razorpay Standard Checkout Modal
      const options = {
        key: orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TTbtYssAaEGkng",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Docodo Test Merchant",
        description: `Test Payment of ₹${amount}`,
        order_id: orderData.order_id,
        prefill: {
          name: name,
          email: email,
          contact: phone,
        },
        notes: {
          source: "docodo-test-checkout",
        },
        theme: {
          color: "#C8F135",
        },
        modal: {
          escape: true,
          backdropclose: false,
          ondismiss: function () {
            setLoading(false);
            console.log("Customer closed the checkout modal.");
          },
        },
        // 3. Handle Payment Success Callback
        handler: async function (response: any) {
          try {
            // 4. Call Backend Verification Endpoint: POST /api/verify-payment
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
              setPaymentStatus({
                success: true,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              });
            } else {
              setErrorMessage(verifyData.error || "Payment signature verification failed!");
            }
          } catch (err: any) {
            setErrorMessage(err.message || "Verification network request failed");
          } finally {
            setLoading(false);
          }
        },
      };

      if (typeof window === "undefined" || !(window as any).Razorpay) {
        setLoading(false);
        setErrorMessage("Razorpay SDK failed to load. Please check your internet connection or reload the page.");
        return;
      }

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        setLoading(false);
        setErrorMessage(`Payment Failed: ${response.error?.description || "Transaction declined"}`);
      });

      rzp.open();
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || "Failed to initialize payment.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col items-center justify-center p-4">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="w-full max-w-md bg-[#121722] border border-[#232D42] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#C8F135]/10 text-[#C8F135] rounded-2xl border border-[#C8F135]/30">
            <CreditCard size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black font-display text-white">Razorpay Standard Checkout</h1>
            <p className="text-xs text-gray-400">Live Test Mode Verification</p>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Payment Amount (INR)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-3 bg-[#0A0D14] border border-[#232D42] rounded-xl text-white font-bold text-lg focus:outline-none focus:border-[#C8F135]"
            />
          </div>
          <p className="text-[11px] text-gray-400">Equivalent to {amount * 100} paise (Minimum 100 paise)</p>
        </div>

        {/* Customer Details */}
        <div className="space-y-3 pt-2">
          <div>
            <label className="text-xs text-gray-400">Customer Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#0A0D14] border border-[#232D42] rounded-lg text-xs text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#0A0D14] border border-[#232D42] rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#0A0D14] border border-[#232D42] rounded-lg text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={loading || amount < 1}
          className="w-full py-4 bg-[#C8F135] text-black font-black text-sm rounded-2xl hover:bg-[#b8e325] transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(200,241,53,0.3)] disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Processing Payment...</>
          ) : (
            <>Pay ₹{amount} with Razorpay <ArrowRight size={18} /></>
          )}
        </button>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Feedback */}
        {paymentStatus?.success && (
          <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 size={18} />
              <span>Payment Verified Successfully!</span>
            </div>
            <div className="text-[11px] font-mono text-gray-300 space-y-1 pt-1 break-all">
              <p><strong className="text-white">Payment ID:</strong> {paymentStatus.paymentId}</p>
              <p><strong className="text-white">Order ID:</strong> {paymentStatus.orderId}</p>
              <p><strong className="text-white">HMAC SHA256 Signature:</strong> Verified ✓</p>
            </div>
          </div>
        )}

        {/* Test Cards Reference */}
        <div className="pt-4 border-t border-[#232D42] text-[11px] text-gray-400 space-y-1">
          <p className="font-bold text-gray-300 flex items-center gap-1">
            <ShieldCheck size={14} className="text-[#C8F135]" /> Test Credentials & Cards:
          </p>
          <p>• <strong>UPI:</strong> <code className="text-[#C8F135]">success@razorpay</code> or <code className="text-red-400">failure@razorpay</code></p>
          <p>• <strong>Cards:</strong> <code className="text-[#C8F135]">4100 2800 0000 1007</code> (Any future date & CVV)</p>
        </div>
      </div>
    </div>
  );
}
