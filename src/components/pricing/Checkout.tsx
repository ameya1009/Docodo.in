'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface CheckoutProps {
    amount: number;
    credits: number;
    packName: string;
    variant?: "primary" | "outline" | "ghost" | "link";
    className?: string;
}

export function Checkout({ amount, credits, packName, variant = "primary", className = "" }: CheckoutProps) {
    const [loading, setLoading] = useState(false);

    const initializeRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);
        const res = await initializeRazorpay();

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        try {
            // Initiate order
            const orderRes = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: amount * 100 }), // convert ₹ to paise
            });

            if(!orderRes.ok) {
                 if (orderRes.status === 401) {
                     alert("Please sign in to purchase credits.");
                     window.location.href = '/api/auth/signin';
                     return;
                 }
                 throw new Error("Failed to create order");
            }

            const orderData = await orderRes.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key',
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Docodo OS',
                description: `Purchase ${packName} (${credits} credits)`,
                order_id: orderData.id,
                theme: { color: '#00F0FF' },
                handler: function (response: any) {
                    alert(`Payment successful! Welcome to the Top 1%. Payment ID: ${response.razorpay_payment_id}`);
                    window.location.reload();
                },
                prefill: {
                    name: 'Premium User',
                    email: 'user@example.com',
                    contact: '9999999999'
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (err: any) {
             console.error("Payment initiation error: ", err);
             alert("Error initiating payment. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button 
            variant={variant} 
            className={className} 
            onClick={handlePayment} 
            disabled={loading}
        >
            {loading ? 'Processing...' : 'Buy Now'}
        </Button>
    );
}
