"use client";

import React, { useEffect, useState } from "react";
import { 
  WifiOff, 
  Wifi, 
  RefreshCw, 
  AlertTriangle, 
  ShieldCheck, 
  X, 
  Database,
  Activity
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ClinicalWebsiteSkeleton } from "./Skeletons";

export function OfflineDetector() {
  const [isOffline, setIsOffline] = useState(false);
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);
  const [showSkeletonModal, setShowSkeletonModal] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setJustReconnected(true);
      setTimeout(() => setJustReconnected(false), 3500);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setJustReconnected(false);
      setShowSkeletonModal(true);
    };

    const checkConnectionSpeed = () => {
      if (typeof navigator !== "undefined" && "connection" in navigator) {
        const conn = (navigator as unknown as { connection?: { effectiveType?: string; downlink?: number } }).connection;
        if (conn) {
          const isSlow = conn.effectiveType === "2g" || conn.effectiveType === "slow-2g" || (conn.downlink !== undefined && conn.downlink < 0.5);
          setIsSlowNetwork(isSlow);
        }
      }
    };

    let conn: EventTarget | undefined;

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      checkConnectionSpeed();

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      if ("connection" in navigator) {
        conn = (navigator as unknown as { connection?: EventTarget }).connection;
        conn?.addEventListener("change", checkConnectionSpeed);
      }
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      conn?.removeEventListener("change", checkConnectionSpeed);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {/* Top Sticky Notification for Offline or Degraded 2G Network */}
        {(isOffline || isSlowNetwork) && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-3 inset-x-4 max-w-xl mx-auto z-[9999] bg-black/95 backdrop-blur-xl text-white font-bold text-xs p-3.5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] flex items-center justify-between gap-3 border border-white/25"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </div>
              <span className="text-zinc-200 text-xs">
                {isOffline 
                  ? "Network Offline · Docodo Local Clinical Mode Active." 
                  : "Slow 2G Network Detected · Rendering skeleton data."}
              </span>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowSkeletonModal(true)}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-mono border border-white/20 transition-colors"
              >
                View Skeleton
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-2.5 py-1 bg-white text-black font-black rounded-lg text-[10px] font-mono shrink-0 flex items-center gap-1 hover:brightness-110 shadow-[0_0_10px_rgba(255,255,255,0.4)]"
              >
                <RefreshCw size={11} /> Retry
              </button>
            </div>
          </motion.div>
        )}

        {/* Back Online Reconnect Toast */}
        {justReconnected && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-3 inset-x-4 max-w-md mx-auto z-[9999] bg-white text-black font-black text-xs p-3.5 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.6)] flex items-center justify-between gap-2 border border-zinc-200"
          >
            <div className="flex items-center gap-2">
              <Wifi size={16} className="text-black" />
              <span>Connection restored! Syncing queued records...</span>
            </div>
            <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5 rounded-full">
              SYNCED
            </span>
          </motion.div>
        )}

        {/* Full-Screen Clinical Skeleton & Local-First Resilience Modal */}
        {showSkeletonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-2xl overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-start"
          >
            <div className="w-full max-w-5xl bg-[#09090B] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              {/* Close / Dismiss */}
              <button
                onClick={() => setShowSkeletonModal(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close offline modal"
              >
                <X size={18} />
              </button>

              {/* Status Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  {/* Glowing Bulb Icon */}
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_20px_#ffffff]">
                    <Activity size={22} className="text-black" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                      Docodo Clinical OS · Offline Resilience Engine
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Local-first IndexedDB buffer active · Zero consultation or patient data loss
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-mono text-white">
                  <Database size={13} className="text-white" />
                  <span>Local Sync: Active</span>
                </div>
              </div>

              {/* Clinical Resilience Banner */}
              <div className="my-6 p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-zinc-300 space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-white" /> Practice Continuity Guarantee:
                </p>
                <p className="text-zinc-400 leading-relaxed">
                  Indian clinics and OPDs cannot afford reception downtime. During network fluctuations, Docodo automatically buffers patient registrations, consultation slots, and OPD slips in browser memory. Queued entries will automatically broadcast to the server upon reconnection.
                </p>
              </div>

              {/* Skeleton Clinical Dashboard Animation */}
              <div className="bg-black/80 rounded-2xl border border-white/10 p-4">
                <p className="text-[11px] font-mono text-zinc-400 mb-2 uppercase tracking-wider">
                  Live Skeleton Dashboard Simulation
                </p>
                <ClinicalWebsiteSkeleton />
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-zinc-500 font-mono">
                  Status: {isOffline ? "Offline Mode (Cached)" : "Slow 2G Network (Adaptive)"}
                </p>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowSkeletonModal(false)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-colors"
                  >
                    Return to Application
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-white text-black font-black text-xs hover:brightness-110 shadow-[0_0_15px_rgba(255,255,255,0.7)] transition-all flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw size={13} /> Check Connection
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
