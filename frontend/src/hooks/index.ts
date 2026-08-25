"use client";

import { useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Optimized useLenis hook with touch detection and single-ticker binding
export const useLenis = () => {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Only enable smooth scrolling on non-touch desktop devices for optimal mobile performance
    const isTouchDevice =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    if (isTouchDevice) {
      return;
    }

    const lenisInstance = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    setLenis(lenisInstance);

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenisInstance.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenisInstance.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenisInstance.destroy();
      setLenis(null);
    };
  }, []);

  return lenis;
};

// Optimized useInView hook with threshold support
export const useInView = (options: IntersectionObserverInit = {}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, {
      threshold: 0.1,
      ...options,
    });

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return [ref, isInView] as const;
};

// Throttled useMouseParallax hook preventing state thrashing
export const useMouseParallax = (strength = 0.05) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Disable on touch devices
    if (typeof window !== "undefined" && "ontouchstart" in window) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId.current !== null) return;

      rafId.current = requestAnimationFrame(() => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * strength;
        const y = (clientY / innerHeight - 0.5) * strength;
        setMousePos({ x, y });
        rafId.current = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [strength]);

  return mousePos;
};

// useScrollReveal hook with clean unmount and mobile responsiveness
export const useScrollReveal = () => {
  useEffect(() => {
    const revealElements = document.querySelectorAll("[data-reveal]");
    if (!revealElements.length) return;

    const ctx = gsap.context(() => {
      revealElements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);
};
