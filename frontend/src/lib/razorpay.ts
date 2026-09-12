import Razorpay from "razorpay";

/**
 * Returns a configured Razorpay client instance.
 * Uses placeholder credentials during build/static analysis if env vars are not set,
 * preventing 'key_id or oauthToken is mandatory' build crashes on CI/CD (Vercel).
 */
export function getRazorpayClient(): Razorpay {
  const key_id =
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    "rzp_test_placeholder";
  const key_secret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";

  return new Razorpay({
    key_id,
    key_secret,
  });
}

/**
 * Resilient Razorpay proxy that dynamically resolves the client at invocation time.
 * Safe for build-time evaluation, SSR, and runtime API calls.
 */
export const razorpay: Razorpay = new Proxy({} as Razorpay, {
  get(_target, prop, receiver) {
    const client = getRazorpayClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

/**
 * Client-side dynamic loader for Razorpay checkout.js script.
 * Ensures the script is fully evaluated in the browser window before opening checkout.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      // In case it already loaded
      if ((window as any).Razorpay) resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

