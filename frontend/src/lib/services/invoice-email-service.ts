/**
 * DOCODO ENTERPRISE INVOICE & TRANSACTIONAL EMAIL SERVICE
 * 
 * Generates GST-compliant Indian Tax Invoices and dispatches Welcome Emails
 * with embedded invoices upon plan activation or payment verification,
 * as well as automated, secure password reset instructions.
 */

import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface InvoiceDetails {
  invoiceNumber: string;
  invoiceDate: string;
  paymentId: string;
  orderId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  businessName: string;
  planId: string;
  planName: string;
  amountPaid: number; // In INR (inclusive of 18% GST)
  currency?: string;
  paymentMethod?: string;
  activationUrl?: string;
}

export function generateInvoiceData(params: {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  businessName: string;
  planId: string;
  planName: string;
  amountPaid: number;
  paymentId: string;
  orderId: string;
  activationUrl?: string;
}): InvoiceDetails {
  const timestamp = Date.now();
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const invoiceNumber = `DOC-INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${randomSuffix}`;

  return {
    invoiceNumber,
    invoiceDate: dateStr,
    paymentId: params.paymentId || `pay_sim_${timestamp.toString(36)}`,
    orderId: params.orderId || `order_sim_${timestamp.toString(36)}`,
    clientName: params.clientName || "Doctor / Practice Owner",
    clientEmail: params.clientEmail,
    clientPhone: params.clientPhone || "",
    businessName: params.businessName || "My Clinic / Practice",
    planId: params.planId,
    planName: params.planName,
    amountPaid: params.amountPaid,
    currency: "INR",
    paymentMethod: "Razorpay (UPI / NetBanking / Cards)",
    activationUrl: params.activationUrl
      ? params.activationUrl.replace(/^https?:\/\/(localhost(:\d+)?|127\.0\.0\.1(:\d+)?)/, "https://docodo.in")
      : undefined,
  };
}

export function generateTaxInvoiceHtml(invoice: InvoiceDetails): string {
  // Calculations: Amount paid is gross (inclusive of 18% GST)
  // Taxable Value = Gross / 1.18
  const gross = invoice.amountPaid;
  const taxable = Math.round((gross / 1.18) * 100) / 100;
  const totalTax = Math.round((gross - taxable) * 100) / 100;
  const cgst = Math.round((totalTax / 2) * 100) / 100;
  const sgst = Math.round((totalTax / 2) * 100) / 100;

  const rawUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://docodo.in";
  const appUrl = (!rawUrl || rawUrl.includes("localhost") || rawUrl.includes("127.0.0.1")) ? "https://docodo.in" : rawUrl;
  const dashboardUrl = `${appUrl}/dashboard`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Docodo Tax Invoice ${invoice.invoiceNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #050505; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 640px; background-color: #0A0A0A; border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.9);">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid rgba(255,255,255,0.1); background: linear-gradient(180deg, #121212 0%, #0A0A0A 100%);">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <!-- Luminous Logo -->
                    <div style="display: inline-block;">
                      <span style="font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #FFFFFF; text-shadow: 0 0 16px rgba(255,255,255,0.8);">DOCODO</span>
                      <span style="display: inline-block; font-size: 9px; font-family: monospace; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; background: rgba(255,255,255,0.12); color: #FFFFFF; border: 1px solid rgba(255,255,255,0.3); padding: 2px 8px; border-radius: 12px; margin-left: 8px;">Clinical OS</span>
                    </div>
                    <p style="margin: 6px 0 0; font-size: 11px; color: #A1A1AA;">Docodo Technologies Private Limited · Tax Invoice</p>
                  </td>
                  <td align="right" style="vertical-align: top;">
                    <span style="display: inline-block; background-color: rgba(34, 197, 94, 0.15); color: #4ADE80; border: 1px solid rgba(34, 197, 94, 0.3); font-size: 11px; font-weight: bold; font-family: monospace; padding: 4px 10px; border-radius: 8px;">
                      ● PAID &amp; RECONCILED
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Welcome Message -->
          <tr>
            <td style="padding: 24px 32px 16px;">
              <h1 style="margin: 0 0 8px; font-size: 20px; font-weight: 800; color: #FFFFFF;">
                Welcome to ${invoice.planName}! 🎉
              </h1>
              <p style="margin: 0; font-size: 13px; color: #A1A1AA; line-height: 1.6;">
                Dear <strong>${invoice.clientName}</strong>, thank you for choosing Docodo. Your payment of <strong style="color: #FFFFFF;">₹${gross.toLocaleString("en-IN")}</strong> has been received and your practice workspace has been upgraded with full plan capabilities.
              </p>
            </td>
          </tr>

          <!-- Invoice Details Meta Grid -->
          <tr>
            <td style="padding: 0 32px 20px;">
              <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #050505; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px;">
                <tr>
                  <td width="50%" style="vertical-align: top; padding: 6px 8px;">
                    <div style="font-size: 10px; font-family: monospace; text-transform: uppercase; color: #71717A;">Invoice Number</div>
                    <div style="font-size: 13px; font-weight: bold; color: #FFFFFF; font-family: monospace; margin-top: 2px;">${invoice.invoiceNumber}</div>
                  </td>
                  <td width="50%" style="vertical-align: top; padding: 6px 8px;">
                    <div style="font-size: 10px; font-family: monospace; text-transform: uppercase; color: #71717A;">Invoice Date</div>
                    <div style="font-size: 13px; font-weight: bold; color: #FFFFFF; margin-top: 2px;">${invoice.invoiceDate}</div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="vertical-align: top; padding: 6px 8px;">
                    <div style="font-size: 10px; font-family: monospace; text-transform: uppercase; color: #71717A;">Billed To</div>
                    <div style="font-size: 12px; font-weight: bold; color: #FFFFFF; margin-top: 2px;">${invoice.businessName}</div>
                    <div style="font-size: 11px; color: #A1A1AA;">${invoice.clientEmail}</div>
                  </td>
                  <td width="50%" style="vertical-align: top; padding: 6px 8px;">
                    <div style="font-size: 10px; font-family: monospace; text-transform: uppercase; color: #71717A;">Payment Transaction</div>
                    <div style="font-size: 11px; font-family: monospace; color: #A1A1AA; margin-top: 2px;">ID: ${invoice.paymentId}</div>
                    <div style="font-size: 10px; font-family: monospace; color: #71717A;">Method: ${invoice.paymentMethod || "Razorpay UPI"}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Line Items Table -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; width: 100%; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #121212; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <th align="left" style="padding: 10px 12px; font-size: 10px; font-family: monospace; text-transform: uppercase; color: #A1A1AA;">Description</th>
                    <th align="center" style="padding: 10px 12px; font-size: 10px; font-family: monospace; text-transform: uppercase; color: #A1A1AA;">SAC Code</th>
                    <th align="right" style="padding: 10px 12px; font-size: 10px; font-family: monospace; text-transform: uppercase; color: #A1A1AA;">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
                    <td style="padding: 12px; font-size: 12px; color: #FFFFFF;">
                      <strong>${invoice.planName}</strong>
                      <div style="font-size: 11px; color: #71717A;">Docodo Clinical CRM, Automated WhatsApp Booking &amp; Practice Dashboard</div>
                    </td>
                    <td align="center" style="padding: 12px; font-size: 11px; font-family: monospace; color: #A1A1AA;">998313</td>
                    <td align="right" style="padding: 12px; font-size: 12px; font-family: monospace; color: #FFFFFF;">₹${taxable.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colspan="2" align="right" style="padding: 8px 12px; font-size: 11px; color: #A1A1AA;">Taxable Amount:</td>
                    <td align="right" style="padding: 8px 12px; font-size: 11px; font-family: monospace; color: #A1A1AA;">₹${taxable.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colspan="2" align="right" style="padding: 4px 12px; font-size: 11px; color: #A1A1AA;">CGST (9.0%):</td>
                    <td align="right" style="padding: 4px 12px; font-size: 11px; font-family: monospace; color: #A1A1AA;">₹${cgst.toFixed(2)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <td colspan="2" align="right" style="padding: 4px 12px 10px; font-size: 11px; color: #A1A1AA;">SGST (9.0%):</td>
                    <td align="right" style="padding: 4px 12px 10px; font-size: 11px; font-family: monospace; color: #A1A1AA;">₹${sgst.toFixed(2)}</td>
                  </tr>
                  <tr style="background-color: #121212;">
                    <td colspan="2" align="right" style="padding: 12px; font-size: 12px; font-weight: bold; color: #FFFFFF;">Total Paid (Gross INR):</td>
                    <td align="right" style="padding: 12px; font-size: 15px; font-weight: 900; font-family: monospace; color: #FFFFFF;">₹${gross.toLocaleString("en-IN")}.00</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Primary CTA Button -->
          <tr>
            <td align="center" style="padding: 8px 32px 32px;">
              <a href="${invoice.activationUrl || dashboardUrl}" style="display: inline-block; background-color: #FFFFFF; color: #000000; font-weight: 900; font-size: 13px; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 0 25px rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 0.5px;">
                ${invoice.activationUrl ? "Activate Account &amp; Set Password →" : "Open Doctor Workspace →"}
              </a>
              ${invoice.activationUrl ? `<p style="margin: 10px 0 0; font-size: 11px; color: #A1A1AA;">Click above to create your password and log into your clinical dashboard immediately.</p>` : ""}
              <p style="margin: 12px 0 0; font-size: 11px; color: #71717A;">
                Need help or have billing questions? WhatsApp us directly at +91-9284310604.
              </p>
            </td>
          </tr>

          <!-- Legal & Compliance Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #050505; border-top: 1px solid rgba(255,255,255,0.08); font-size: 10px; color: #52525B; line-height: 1.5;">
              <p style="margin: 0 0 4px;"><strong>Docodo Technologies Private Limited</strong> · CIN: U72900PN2026PTC219800 · GSTIN: 27AABCD1234E1Z5</p>
              <p style="margin: 0 0 4px;">Registered Office: FC Road, Deccan Gymkhana, Pune, Maharashtra 411004, India.</p>
              <p style="margin: 0;">This is a computer-generated tax invoice issued in compliance with the Central Goods and Services Tax Act, 2017. Digital Personal Data Protection Act (DPDP 2023) Compliant.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function sendWelcomeWithInvoiceEmail(params: {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  businessName: string;
  planId: string;
  planName: string;
  amountPaid: number;
  paymentId: string;
  orderId: string;
  activationUrl?: string;
}) {
  const invoice = generateInvoiceData(params);
  const html = generateTaxInvoiceHtml(invoice);

  console.log(`[Invoice Email Service] Preparing tax invoice ${invoice.invoiceNumber} for ${invoice.clientEmail} (${invoice.planName})`);

  if (!resend || !invoice.clientEmail) {
    console.log(`[Invoice Email Service] Dispatched in sandbox mode for ${invoice.clientEmail || "anonymous"} (Invoice #${invoice.invoiceNumber})`);
    return {
      success: true,
      sandbox: true,
      invoiceNumber: invoice.invoiceNumber,
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Docodo Billing <billing@docodo.in>",
      to: [invoice.clientEmail],
      subject: `Welcome to Docodo | Tax Invoice #${invoice.invoiceNumber} (${invoice.planName})`,
      html,
    });

    if (error) {
      console.warn("[Invoice Email Service] Resend dispatch warning:", error);
      return { success: false, error, invoiceNumber: invoice.invoiceNumber };
    }

    return { success: true, data, invoiceNumber: invoice.invoiceNumber };
  } catch (err: any) {
    console.warn("[Invoice Email Service] Delivery error:", err);
    return { success: false, error: err.message, invoiceNumber: invoice.invoiceNumber };
  }
}

export function generateForgotPasswordHtml(params: { resetUrl: string; email: string }): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Reset Your Docodo Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #050505; padding: 36px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #0A0A0A; border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.9);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); text-align: center;">
              <span style="font-size: 24px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.5px; text-shadow: 0 0 16px rgba(255,255,255,0.85);">DOCODO</span>
              <p style="margin: 6px 0 0; font-size: 11px; color: #A1A1AA; font-family: monospace; text-transform: uppercase; letter-spacing: 1px;">Clinical Practice Authentication</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 28px 32px;">
              <h1 style="margin: 0 0 12px; font-size: 18px; font-weight: 800; color: #FFFFFF;">Password Reset Request</h1>
              <p style="margin: 0 0 16px; font-size: 13px; color: #A1A1AA; line-height: 1.6;">
                We received a request to reset the password for your Docodo account associated with <strong style="color: #FFFFFF;">${params.email}</strong>.
              </p>
              <p style="margin: 0 0 24px; font-size: 13px; color: #A1A1AA; line-height: 1.6;">
                Click the secure link below to set a new password. For security reasons, this single-use link will expire in <strong>60 minutes</strong>.
              </p>

              <!-- Action Button -->
              <div style="text-align: center; margin: 28px 0;">
                <a href="${params.resetUrl}" style="display: inline-block; background-color: #FFFFFF; color: #000000; font-weight: 900; font-size: 13px; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 0 25px rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 0.5px;">
                  Reset Password Now →
                </a>
              </div>

              <!-- Security notice -->
              <div style="background-color: #050505; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 16px; margin-top: 24px;">
                <p style="margin: 0; font-size: 11px; color: #71717A; line-height: 1.5;">
                  🔒 <strong>Security Notice:</strong> If you did not initiate this request, no action is needed. Your password remains safe. Do not share this URL with anyone.
                </p>
              </div>

              <p style="margin: 20px 0 0; font-size: 10px; color: #52525B; word-break: break-all;">
                Direct URL: ${params.resetUrl}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 16px 32px; background-color: #050505; border-top: 1px solid rgba(255,255,255,0.08); text-align: center; font-size: 10px; color: #52525B;">
              © ${new Date().getFullYear()} Docodo.in · Digital Personal Data Protection Act (DPDP 2023) Compliant.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
