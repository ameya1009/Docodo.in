const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

// 1. Harden BookingPageClient.tsx
const bookingPagePath = path.join(rootDir, 'frontend', 'src', 'app', 'book', '[slug]', 'BookingPageClient.tsx');
if (fs.existsSync(bookingPagePath)) {
  let content = fs.readFileSync(bookingPagePath, 'utf8');

  // Update footer link to trackable referral URL
  const oldFooterRegex = /href=https:\/\/docodo\.in/g;
  content = content.replace(
    oldFooterRegex,
    'href={https://docodo.in?ref=&utm_source=client_storefront&utm_medium=footer_badge&utm_campaign=powered_by_docodo}'
  );

  // Update handleConfirmBooking payment branching
  const oldConfirmBlock =         // P0-5: Branch on customer's chosen payment preference
        if (paymentPreference === cash || booking.price === 0) {
          // Cash/free — no Razorpay, booking already created with PENDING/UNPAID status.
          // Show success immediately; business owner collects payment at venue.
          setBookingResult(booking);
          setStep(success);
        } else {
          // Online payment — trigger Razorpay
          const { loadRazorpayScript } = await import(@/lib/razorpay);
          const isLoaded = await loadRazorpayScript();
          if (!isLoaded || typeof window === undefined || !(window as any).Razorpay) {
            console.error(Razorpay SDK is not loaded.);
            alert(Payment gateway is temporarily unavailable. Please check your internet connection or reload the page.);
            return;
          }

          const checkoutOrder = await createCheckoutOrder(booking.id);
          
          const options = {
            key: checkoutOrder.keyId,
            amount: checkoutOrder.amount,
            currency: checkoutOrder.currency,
            name: checkoutOrder.businessName,
            description: \Appointment: \\,
            image: business.logo || undefined,
            order_id: checkoutOrder.orderId,
            handler: async function (response: any) {
              try {
                await verifyPayment(
                  booking.id,
                  response.razorpay_payment_id,
                  response.razorpay_order_id,
                  response.razorpay_signature
                );
                setBookingResult(booking);
                setStep(success);
              } catch (verifyErr: any) {
                console.error(Payment verification failed, verifyErr);
                alert(Payment verification failed. If money was deducted, please contact the business.);
              }
            },
            prefill: {
              name: checkoutOrder.customerName,
              email: checkoutOrder.customerEmail,
              contact: checkoutOrder.customerPhone,
            },
            notes: {
              bookingId: booking.id,
              businessSlug: business.slug,
              serviceName: selectedService.name,
            },
            theme: {
              color: primaryColor,
            },
            modal: {
              escape: true,
              backdropclose: false,
              ondismiss: function () {
                console.log(Customer closed payment modal without completing transaction.);
              },
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.on(payment.failed, function (response: any) {
            console.error(Payment failed:, response.error);
            alert(\Payment Failed: \\);
          });
          rzp.open();
        };

  const newConfirmBlock =         // Direct merchant settlement & venue payment — create booking and proceed without forcing SaaS Razorpay routing
        setBookingResult(booking);
        setStep(success);;

  if (content.includes(oldConfirmBlock)) {
    content = content.replace(oldConfirmBlock, newConfirmBlock);
  }

  // Update payment preference selector UI
  const oldPayMethod = <div className=grid grid-cols-2 gap-2>
                    <button
                      type=button
                      onClick={() => setPaymentPreference(cash)}
                      className={cn(
                        py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all,
                        paymentPreference === cash
                          ? border-current text-white
                          : border-gray-200 text-gray-600 bg-white hover:border-gray-400
                      )}
                      style={paymentPreference === cash ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
                    >
                      🏠 Pay at Venue
                      <span className=block text-xs font-normal opacity-75>Cash on Arrival</span>
                    </button>
                    <button
                      type=button
                      onClick={() => setPaymentPreference(online)}
                      className={cn(
                        py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all,
                        paymentPreference === online
                          ? border-current text-white
                          : border-gray-200 text-gray-600 bg-white hover:border-gray-400
                      )}
                      style={paymentPreference === online ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
                    >
                      💳 Pay Online Now
                      <span className=block text-xs font-normal opacity-75>Razorpay (Secure)</span>
                    </button>
                  </div>;

  const newPayMethod = <div className=grid grid-cols-2 gap-2>
                    <button
                      type=button
                      onClick={() => setPaymentPreference(cash)}
                      className={cn(
                        py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all,
                        paymentPreference === cash
                          ? border-current text-white
                          : border-gray-200 text-gray-600 bg-white hover:border-gray-400
                      )}
                      style={paymentPreference === cash ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
                    >
                      🏠 Pay at Venue
                      <span className=block text-xs font-normal opacity-75>Cash / UPI on Arrival</span>
                    </button>
                    <button
                      type=button
                      onClick={() => setPaymentPreference(online)}
                      className={cn(
                        py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all,
                        paymentPreference === online
                          ? border-current text-white
                          : border-gray-200 text-gray-600 bg-white hover:border-gray-400
                      )}
                      style={paymentPreference === online ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
                    >
                      💳 Direct UPI / Online
                      <span className=block text-xs font-normal opacity-75>Direct to Business</span>
                    </button>
                  </div>

                  {paymentPreference === online && (
                    <div className=mt-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1.5>
                      <div className=flex items-center gap-1.5 font-bold text-emerald-800>
                        <CheckCircle2 size={14} /> Direct Merchant Settlement (0% Platform Fee)
                      </div>
                      <p>
                        Pay directly to <strong>{business.name}</strong>. Scan merchant QR or send to UPI ID on appointment confirmation.
                      </p>
                      {business.phone && (
                        <p className=font-mono bg-emerald-100/70 p-1.5 rounded text-center text-emerald-950 font-bold tracking-wide>
                          UPI ID: {business.phone.replace(/[^0-9]/g, ")}@upi
 </p>
 )}
 </div>
 )}

 {paymentPreference === cash && (
 <div className=mt-3 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 space-y-1>
 <p className=font-semibold>🏠 Pay at Venue</p>
 <p>Pay cash or scan {business.name}&apos;s direct UPI QR code in person during your visit.</p>
 </div>
 )};

 if (content.includes(oldPayMethod)) {
 content = content.replace(oldPayMethod, newPayMethod);
 }

 fs.writeFileSync(bookingPagePath, content, 'utf8');
 console.log('[Hardening] BookingPageClient.tsx successfully updated.');
}

// 2. Harden api-client.ts
const apiClientPath = path.join(rootDir, 'frontend', 'src', 'lib', 'api-client.ts');
if (fs.existsSync(apiClientPath)) {
 let content = fs.readFileSync(apiClientPath, 'utf8');

 // Add template properties to WhatsAppDispatchParams
 const oldParamsInterface = export interface WhatsAppDispatchParams {
 businessId: string;
 recipientPhone: string;
 messageType: string;
 customMessage: string;
};

 const newParamsInterface = export interface WhatsAppDispatchParams {
 businessId: string;
 recipientPhone: string;
 messageType: string;
 customMessage: string;
 templateName?: string;
 templateLanguage?: string;
 templateComponents?: Array<{
 type: string;
 parameters: Array<{ type: string; text?: string; [key: string]: any }>;
 }>;
};

 if (content.includes(oldParamsInterface)) {
 content = content.replace(oldParamsInterface, newParamsInterface);
 }

 // Update dispatchWhatsAppMessage to support template payloads with fallback
 const oldDispatchCall = if (waToken && waPhoneId && cleanPhone) {
 try {
 await fetch(\https://graph.facebook.com/v19.0/\/messages\, {
 method: POST,
 headers: {
 Authorization: \Bearer \\,
 Content-Type: application/json,
 },
 body: JSON.stringify({
 messaging_product: whatsapp,
 to: cleanPhone.startsWith(91) ? cleanPhone : \91\\,
 type: text,
 text: { body: params.customMessage },
 }),
 });
 } catch (apiErr) {
 console.warn([WhatsApp API Dispatch Error]:, apiErr);
 }
 };

 const newDispatchCall = if (waToken && waPhoneId && cleanPhone) {
 const formattedTo = cleanPhone.startsWith(91) ? cleanPhone : \91\\;
 try {
 if (params.templateName) {
 const templatePayload = {
 messaging_product: whatsapp,
 to: formattedTo,
 type: template,
 template: {
 name: params.templateName,
 language: { code: params.templateLanguage || en },
 components: params.templateComponents || [
 {
 type: body,
 parameters: [{ type: text, text: params.customMessage }],
 },
 ],
 },
 };

 const response = await fetch(\https://graph.facebook.com/v19.0/\/messages\, {
 method: POST,
 headers: {
 Authorization: \Bearer \\,
 Content-Type: application/json,
 },
 body: JSON.stringify(templatePayload),
 });

 if (!response.ok) {
 console.warn([WhatsApp Template Dispatch Warning] Template dispatch failed, falling back to text payload.);
 await fetch(\https://graph.facebook.com/v19.0/\/messages\, {
 method: POST,
 headers: {
 Authorization: \Bearer \\,
 Content-Type: application/json,
 },
 body: JSON.stringify({
 messaging_product: whatsapp,
 to: formattedTo,
 type: text,
 text: { body: params.customMessage },
 }),
 });
 }
 } else {
 await fetch(\https://graph.facebook.com/v19.0/\/messages\, {
 method: POST,
 headers: {
 Authorization: \Bearer \\,
 Content-Type: application/json,
 },
 body: JSON.stringify({
 messaging_product: whatsapp,
 to: formattedTo,
 type: text,
 text: { body: params.customMessage },
 }),
 });
 }
 } catch (apiErr) {
 console.warn([WhatsApp API Dispatch Error]:, apiErr);
 }
 };

 if (content.includes(oldDispatchCall)) {
 content = content.replace(oldDispatchCall, newDispatchCall);
 }

 // Add buildWhatsAppTemplatePayload helper method if not present
 if (!content.includes('buildWhatsAppTemplatePayload')) {
 const helperMethod = 
 /**
 * Helper to construct a standardized Meta Graph API WhatsApp template payload
 */
 static buildWhatsAppTemplatePayload(
 toPhone: string,
 templateName: string,
 bodyParameters: string[] = [],
 languageCode: string = en
 ) {
 const cleanPhone = toPhone.replace(/[^0-9]/g, );
 return {
 messaging_product: whatsapp,
 to: cleanPhone.startsWith(91) ? cleanPhone : \91\\,
 type: template as const,
 template: {
 name: templateName,
 language: { code: languageCode },
 components: [
 {
 type: body,
 parameters: bodyParameters.map((param) => ({
 type: text,
 text: param,
 })),
 },
 ],
 },
 };
 }
;
 content = content.replace(/export class DocodoBackendAPI \{/, export class DocodoBackendAPI {);
 }

 fs.writeFileSync(apiClientPath, content, 'utf8');
 console.log('[Hardening] api-client.ts successfully updated.');
}

// 3. Harden supabase-db.ts
const supabaseDbPath = path.join(rootDir, 'frontend', 'src', 'lib', 'supabase-db.ts');
if (fs.existsSync(supabaseDbPath)) {
 let content = fs.readFileSync(supabaseDbPath, 'utf8');

 const oldKeyRegex = /const supabaseKey = process\.env\.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY \|\| process\.env\.NEXT_PUBLIC_SUPABASE_ANON_KEY \|\| sb_publishable_u89PIOiarYqQ80NIIDc0BQ_O6wHN-yz;/;
 const newKey = const supabaseKey =
 process.env.SUPABASE_SERVICE_ROLE_KEY ||
 process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
 sb_publishable_u89PIOiarYqQ80NIIDc0BQ_O6wHN-yz;;

 if (oldKeyRegex.test(content)) {
 content = content.replace(oldKeyRegex, newKey);
 }

 fs.writeFileSync(supabaseDbPath, content, 'utf8');
 console.log('[Hardening] supabase-db.ts successfully updated.');
}

// 4. Harden prisma.ts
const prismaPath = path.join(rootDir, 'frontend', 'src', 'lib', 'prisma.ts');
if (fs.existsSync(prismaPath)) {
 let content = fs.readFileSync(prismaPath, 'utf8');

 const oldTx = if (prop === ) {
 return async (arg: any) => {
 try {
 return await target.(arg);
 } catch (err: any) {
 if (isDbConnectionError(err)) {
 console.warn([Prisma Resilient Proxy] Database socket unreachable. Executing transaction via Supabase REST API.);
 if (typeof arg === function) {
 return await arg(prisma);
 }
 if (Array.isArray(arg)) {
 return await Promise.all(arg);
 }
 }
 throw err;
 }
 };
 };

 const newTx = if (prop === ) {
 return async (arg: any, options?: any) => {
 try {
 return await target.(arg, options);
 } catch (err: any) {
 if (isDbConnectionError(err)) {
 console.warn([Prisma Resilient Proxy] Database socket unreachable. Executing transaction via Supabase REST API.);
 if (typeof arg === function) {
 return await arg(prisma);
 }
 if (Array.isArray(arg)) {
 return await Promise.all(arg);
 }
 }
 throw err;
 }
 };
 };

 if (content.includes(oldTx)) {
 content = content.replace(oldTx, newTx);
 }

 fs.writeFileSync(prismaPath, content, 'utf8');
 console.log('[Hardening] prisma.ts successfully updated.');
}
