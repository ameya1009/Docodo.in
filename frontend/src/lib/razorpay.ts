import Razorpay from "razorpay";

const key_id = process.env.RAZORPAY_KEY_ID || "rzp_live_TYNYidAYRzZg9P";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "BjOjAciqPWOekfU0rZtE4jbW";

export const razorpay = new Razorpay({
  key_id,
  key_secret,
});


