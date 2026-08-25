"use client";

import React, { useEffect, useState } from "react";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function OfflineDetector() {
  const [isOffline, setIsOffline] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setJustReconnected(true);
      setTimeout(() => setJustReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setJustReconnected(false);
    };

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-3 inset-x-4 max-w-md mx-auto z-[9999] bg-amber-500/90 backdrop-blur-md text-black font-bold text-xs p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border border-amber-400"
        >
          <div className="flex items-center gap-2">
            <WifiOff size={18} className="shrink-0 animate-pulse" />
            <span>You&apos;re offline! Appointments will sync when reconnected.</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-2.5 py-1 bg-black text-white rounded-lg text-[10px] font-mono shrink-0 flex items-center gap-1"
          >
            <RefreshCw size={11} /> Retry
          </button>
        </motion.div>
      )}

      {justReconnected && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-3 inset-x-4 max-w-md mx-auto z-[9999] bg-[var(--lime)] text-[var(--bg-void)] font-black text-xs p-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-white/20"
        >
          <Wifi size={16} /> Connection restored! You are back online.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
