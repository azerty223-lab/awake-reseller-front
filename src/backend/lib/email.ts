import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set");
    _resend = new Resend(key);
  }
  return _resend;
}

// FROM must match a domain verified in your Resend dashboard.
// On the free plan with no custom domain, use "onboarding@resend.dev".
const FROM = process.env.EMAIL_FROM ?? "onboarding@resend.dev";
const ADMIN = "awtickets@outlook.com";

interface OrderConfirmationData {
  to: string;
  customerName: string;
  orderNumber: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
  currency: string;
}

interface InquiryConfirmationData {
  to: string;
  name: string;
  subject: string;
  message: string;
}

export async function sendOrderConfirmation(data: OrderConfirmationData) {
  const itemsList = data.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;color:#fff;">${item.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;color:#fff;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;color:#c9a84c;text-align:right;">€${item.unitPrice.toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="background:#0a0a0a;color:#fff;font-family:Arial,sans-serif;padding:40px 20px;margin:0;">
  <div style="max-width:600px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:40px;">
      <h1 style="color:#c9a84c;font-size:28px;margin:0;letter-spacing:.1em;">AW TICKETS</h1>
      <p style="color:#666;margin:8px 0 0;font-size:12px;letter-spacing:.2em;text-transform:uppercase;">Awakenings Festival 2026</p>
    </div>
    <div style="background:#161616;border:1px solid #2a2a2a;border-radius:12px;padding:32px;margin-bottom:24px;">
      <h2 style="color:#fff;margin:0 0 8px;">Order Confirmed</h2>
      <p style="color:#999;margin:0 0 24px;">Thank you, ${data.customerName}. Your order has been confirmed.</p>
      <div style="background:#0a0a0a;border-radius:8px;padding:16px;margin-bottom:24px;">
        <p style="color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin:0 0 4px;">Order Number</p>
        <p style="color:#c9a84c;font-family:monospace;font-size:16px;margin:0;">#${data.orderNumber}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="text-align:left;color:#666;font-size:12px;text-transform:uppercase;padding-bottom:8px;">Ticket</th>
            <th style="text-align:center;color:#666;font-size:12px;text-transform:uppercase;padding-bottom:8px;">Qty</th>
            <th style="text-align:right;color:#666;font-size:12px;text-transform:uppercase;padding-bottom:8px;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsList}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding-top:16px;color:#999;font-weight:bold;">Total</td>
            <td style="padding-top:16px;color:#c9a84c;font-weight:bold;font-size:20px;text-align:right;">€${data.totalAmount.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div style="background:#161616;border:1px solid #2a2a2a;border-radius:12px;padding:24px;margin-bottom:24px;">
      <h3 style="color:#c9a84c;margin:0 0 12px;font-size:16px;">What happens next?</h3>
      <ol style="color:#999;padding-left:20px;margin:0;line-height:1.8;">
        <li>We will initiate the ticket name transfer process within 24 hours.</li>
        <li>You will receive a confirmation email once the transfer is complete.</li>
        <li>Your personalized e-ticket will be sent to this email address.</li>
        <li>Present your e-ticket at the festival entrance.</li>
      </ol>
    </div>
    <div style="text-align:center;color:#444;font-size:12px;margin-top:40px;">
      <p>Awakenings Festival 2026 — July 10–12 • Hilvarenbeek</p>
      <p style="margin-top:8px;">Questions? <a href="mailto:${ADMIN}" style="color:#c9a84c;">${ADMIN}</a></p>
    </div>
  </div>
</body></html>`;

  const { error } = await getResend().emails.send({
    from: FROM,
    replyTo: ADMIN,
    to: data.to,
    subject: `Order Confirmation #${data.orderNumber} — Awakenings Festival 2026`,
    html,
  });

  if (error) throw new Error(error.message);
}

export async function sendInquiryConfirmation(data: InquiryConfirmationData) {
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="background:#0a0a0a;color:#fff;font-family:Arial,sans-serif;padding:40px 20px;margin:0;">
  <div style="max-width:600px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:40px;">
      <h1 style="color:#c9a84c;font-size:28px;margin:0;letter-spacing:.1em;">AW TICKETS</h1>
      <p style="color:#666;margin:8px 0 0;font-size:12px;letter-spacing:.2em;text-transform:uppercase;">Awakenings Festival 2026</p>
    </div>
    <div style="background:#161616;border:1px solid #2a2a2a;border-radius:12px;padding:32px;">
      <h2 style="color:#fff;margin:0 0 8px;">We Got Your Message</h2>
      <p style="color:#999;margin:0 0 24px;">Hi ${data.name}, we've received your inquiry and will respond within 24 hours.</p>
      <div style="background:#0a0a0a;border-radius:8px;padding:16px;margin-bottom:16px;">
        <p style="color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin:0 0 4px;">Subject</p>
        <p style="color:#fff;margin:0;">${data.subject}</p>
      </div>
      <div style="background:#0a0a0a;border-radius:8px;padding:16px;">
        <p style="color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin:0 0 4px;">Your Message</p>
        <p style="color:#999;margin:0;line-height:1.6;">${data.message}</p>
      </div>
    </div>
    <div style="text-align:center;color:#444;font-size:12px;margin-top:40px;">
      <p>Awakenings Festival 2026 — July 10–12 • Hilvarenbeek</p>
      <p style="margin-top:8px;"><a href="mailto:${ADMIN}" style="color:#c9a84c;">${ADMIN}</a></p>
    </div>
  </div>
</body></html>`;

  // Confirmation to the customer
  await getResend().emails.send({
    from: FROM,
    replyTo: ADMIN,
    to: data.to,
    subject: `We received your inquiry — Awakenings Tickets`,
    html,
  });

  // Notification to you with the full message
  await getResend().emails.send({
    from: FROM,
    replyTo: data.to,
    to: ADMIN,
    subject: `New inquiry from ${data.name}: ${data.subject}`,
    html: `<p><b>From:</b> ${data.name} (${data.to})</p>
           <p><b>Subject:</b> ${data.subject}</p>
           <p><b>Message:</b></p>
           <p style="white-space:pre-wrap;">${data.message}</p>`,
  });
}
