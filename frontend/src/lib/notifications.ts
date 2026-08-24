import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface BookingConfirmationEmailParams {
  toEmail: string;
  customerName: string;
  businessName: string;
  serviceName: string;
  date: string;
  startTime: string;
  price: number;
  paymentMethod?: string;
}

export async function sendBookingConfirmationEmail(params: BookingConfirmationEmailParams) {
  if (!resend || !params.toEmail) {
    console.log(`[Notification Engine] Email notification skipped (RESEND_API_KEY not configured or no email provided) for ${params.toEmail || "anonymous"}`);
    return { success: false, reason: "No API key or recipient email" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Docodo Bookings <notifications@docodo.in>",
      to: [params.toEmail],
      subject: `Appointment Confirmed: ${params.serviceName} at ${params.businessName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; rounded: 12px;">
          <h2 style="color: #0f172a; margin-bottom: 8px;">Your Booking is Confirmed!</h2>
          <p style="color: #475569; font-size: 15px;">Hi ${params.customerName},</p>
          <p style="color: #475569; font-size: 15px;">Your appointment at <strong>${params.businessName}</strong> has been successfully booked.</p>
          
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 6px 0; color: #334155;"><strong>Service:</strong> ${params.serviceName}</p>
            <p style="margin: 6px 0; color: #334155;"><strong>Date:</strong> ${params.date}</p>
            <p style="margin: 6px 0; color: #334155;"><strong>Time:</strong> ${params.startTime}</p>
            <p style="margin: 6px 0; color: #334155;"><strong>Amount:</strong> ₹${params.price}</p>
            <p style="margin: 6px 0; color: #334155;"><strong>Payment Method:</strong> ${params.paymentMethod || "UPI"}</p>
          </div>
          
          <p style="color: #64748b; font-size: 13px;">If you need to reschedule or cancel, please contact the business directly.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 11px;">Powered by Docodo — Automated Growth & Booking Platform for Indian SMBs.</p>
        </div>
      `,
    });

    if (error) {
      console.warn("[Notification Engine] Resend email send error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: any) {
    console.warn("[Notification Engine] Failed to dispatch confirmation email:", err);
    return { success: false, error: err.message };
  }
}
