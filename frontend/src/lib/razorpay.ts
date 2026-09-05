import Razorpay from "razorpay";

const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_TYMe9ixNLSC05R";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "fLRJem6YlTmWJyjim2ZyFLLa";

export const razorpay = new Razorpay({
  key_id,
  key_secret,
});

