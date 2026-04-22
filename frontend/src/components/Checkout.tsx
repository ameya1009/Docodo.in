"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/core';

interface CheckoutProps {
  planId: string;
  planName: string;
  price: number;
}

export const Checkout: React.FC<CheckoutProps> = ({ planId, planName, price }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Dynamically load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // 1. Call Backend to create subscription
      const res = await fetch('http://localhost:3001/api/v1/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, customerEmail: 'test@docodo.in' }),
      });
      const data = await res.json();

      if (!data.subscriptionId) {
        alert("Failed to create subscription order.");
        setLoading(false);
        return;
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_dummy', // Set in env
        subscription_id: data.subscriptionId,
        name: 'Docodo.in',
        description: `Subscription for ${planName}`,
        handler: function (response: any) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
          // Redirect or update UI
        },
        prefill: {
          name: 'Test User',
          email: 'test@docodo.in',
          contact: '9999999999',
        },
        theme: {
          color: '#00FF41',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert('Error initiating checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="primary" 
      className="w-full mt-6" 
      onClick={handleSubscribe} 
      isLoading={loading}
    >
      Subscribe to {planName}
    </Button>
  );
};
