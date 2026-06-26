import nodemailer from "nodemailer";

const ADMIN = process.env.ADMIN_EMAIL ?? "awtickets@outlook.com";

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) throw new Error("SMTP_USER and SMTP_PASS must be set");

  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST ?? "smtp.gmail.com",
    port:   parseInt(process.env.SMTP_PORT ?? "587"),
    secure: false,
    auth:   { user, pass },
  });
}

const FROM = () =>
  `AW Tickets <${process.env.EMAIL_FROM ?? process.env.SMTP_USER ?? ADMIN}>`;

/* ── Security helpers ───────────────────────────────────────────────
   escapeHtml: prevents XSS when user-controlled strings are embedded
               in HTML email bodies.
   safeHeader: strips CR/LF characters from strings used in email
               headers (Subject, From, To) to prevent header injection
               attacks (adding BCC/CC lines via newline smuggling).   */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeHeader(s: string, maxLen = 998): string {
  return s.replace(/[\r\n\t]/g, " ").slice(0, maxLen);
}

// ─────────────────────────────────────────────────────────────────────────────

interface OrderConfirmationData {
  to:           string;
  customerName: string;
  orderNumber:  string;
  items:        { name: string; quantity: number; unitPrice: number }[];
  totalAmount:  number;
  currency:     string;
}

export async function sendOrderConfirmation(data: OrderConfirmationData) {
  const safeCustomerName = safeHeader(data.customerName);

  const itemsList = data.items
    .map(
      item => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;color:#fff;">${escapeHtml(item.name)}</td>
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
      <p style="color:#999;margin:0 0 24px;">Thank you, ${escapeHtml(safeCustomerName)}. Your order has been confirmed.</p>
      <div style="background:#0a0a0a;border-radius:8px;padding:16px;margin-bottom:24px;">
        <p style="color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin:0 0 4px;">Order Number</p>
        <p style="color:#c9a84c;font-family:monospace;font-size:16px;margin:0;">#${escapeHtml(data.orderNumber)}</p>
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

  await getTransporter().sendMail({
    from:    FROM(),
    replyTo: ADMIN,
    to:      data.to,
    subject: `Order Confirmation #${data.orderNumber} — Awakenings Festival 2026`,
    html,
  });
}

// ─────────────────────────────────────────────────────────────────────────────

interface InquiryConfirmationData {
  to:      string;
  name:    string;
  subject: string;
  message: string;
}

export async function sendInquiryConfirmation(data: InquiryConfirmationData) {
  /* Strip CRLF from any field used in email headers.
     Without this an attacker can inject "Subject: x\r\nBcc: evil@..." */
  const safeName    = safeHeader(data.name);
  const safeSubject = safeHeader(data.subject);

  /* Escape user content that lands inside HTML to prevent XSS reaching
     the admin's email client. */
  const escapedName    = escapeHtml(safeName);
  const escapedSubject = escapeHtml(safeSubject);
  const escapedMessage = escapeHtml(data.message);

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="background:#0a0a0a;color:#fff;font-family:Arial,sans-serif;padding:40px 20px;margin:0;">
  <div style="max-width:600px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:40px;">
      <h1 style="color:#c9a84c;font-size:28px;margin:0;letter-spacing:.1em;">AW TICKETS</h1>
    </div>
    <div style="background:#161616;border:1px solid #2a2a2a;border-radius:12px;padding:32px;">
      <h2 style="color:#fff;margin:0 0 8px;">We Got Your Message</h2>
      <p style="color:#999;margin:0 0 24px;">Hi ${escapedName}, we&#39;ve received your inquiry and will respond within 24 hours.</p>
      <div style="background:#0a0a0a;border-radius:8px;padding:16px;margin-bottom:16px;">
        <p style="color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin:0 0 4px;">Subject</p>
        <p style="color:#fff;margin:0;">${escapedSubject}</p>
      </div>
      <div style="background:#0a0a0a;border-radius:8px;padding:16px;">
        <p style="color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin:0 0 4px;">Your Message</p>
        <p style="color:#999;margin:0;line-height:1.6;white-space:pre-wrap;">${escapedMessage}</p>
      </div>
    </div>
  </div>
</body></html>`;

  const transporter = getTransporter();

  // Confirmation to the user
  await transporter.sendMail({
    from:    FROM(),
    replyTo: ADMIN,
    to:      data.to,
    subject: `We received your inquiry — Awakenings Tickets`,
    html,
  });

  // Notification to admin — all user content escaped
  await transporter.sendMail({
    from:    FROM(),
    replyTo: data.to,
    to:      ADMIN,
    subject: `New inquiry from ${safeName}: ${safeSubject}`,
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:Arial,sans-serif;">
      <p><b>From:</b> ${escapedName} (${escapeHtml(data.to)})</p>
      <p><b>Subject:</b> ${escapedSubject}</p>
      <p><b>Message:</b></p>
      <pre style="white-space:pre-wrap;background:#f5f5f5;padding:12px;border-radius:4px;">${escapedMessage}</pre>
    </body></html>`,
  });
}

// ─────────────────────────────────────────────────────────────────────────────

interface TicketEmailData {
  to:           string;
  customerName: string;
  orderNumber:  string;
  ticketTypes:  string;
  ticketUrl:    string;
  qrDataUri:    string;
}

export async function sendTicketEmail(data: TicketEmailData) {
  const safeCustomerName = safeHeader(data.customerName);
  const escapedName      = escapeHtml(safeCustomerName);
  const escapedTypes     = escapeHtml(data.ticketTypes);
  const escapedOrder     = escapeHtml(data.orderNumber);

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:40px 16px;background:#f0f0f0;font-family:Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;">
    <div style="background:#0a0a0a;border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
      <p style="color:#c9a84c;font-size:11px;letter-spacing:.2em;text-transform:uppercase;margin:0 0 6px;">Ticket Resale</p>
      <h1 style="color:#c9a84c;font-size:26px;margin:0;letter-spacing:.08em;font-weight:900;">AW TICKETS</h1>
    </div>
    <div style="background:#fff;padding:32px;">
      <p style="color:#888;font-size:13px;margin:0 0 6px;">Your personal ticket for</p>
      <h2 style="color:#0a0a0a;font-size:20px;font-weight:800;margin:0 0 24px;line-height:1.3;">Awakenings Festival 2026</h2>
      <hr style="border:none;border-top:1px solid #eee;margin:0 0 24px;">
      <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
        <tr>
          <td style="vertical-align:middle;padding-right:16px;">
            <div style="background:#0a0a0a;border-radius:10px;padding:8px 14px;text-align:center;">
              <div style="font-size:9px;color:#c9a84c;text-transform:uppercase;letter-spacing:.1em;">Jul</div>
              <div style="font-size:22px;font-weight:900;color:#fff;line-height:1.1;">10</div>
            </div>
          </td>
          <td style="vertical-align:middle;">
            <div style="font-size:14px;font-weight:700;color:#0a0a0a;">July 10–12, 2026</div>
            <div style="font-size:12px;color:#888;margin-top:2px;">12:00 → Jul 12 · 23:59</div>
          </td>
        </tr>
      </table>
      <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="vertical-align:middle;padding-right:16px;width:44px;text-align:center;font-size:22px;">📍</td>
          <td style="vertical-align:middle;">
            <div style="font-size:14px;font-weight:700;color:#c9a84c;">Hilvarenbeek</div>
            <div style="font-size:12px;color:#888;margin-top:2px;">Hilvarenbeek Recreation Area, Netherlands</div>
          </td>
        </tr>
      </table>
      <div style="background:#f8f8f8;border-radius:10px;padding:14px 16px;margin-bottom:24px;">
        <div style="font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:.12em;margin-bottom:4px;">Attendee</div>
        <div style="font-size:15px;font-weight:700;color:#0a0a0a;">${escapedName}</div>
        <div style="font-size:12px;color:#888;margin-top:3px;">${escapedTypes}</div>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td style="padding-right:6px;">
            <a href="${escapeHtml(data.ticketUrl)}" style="display:block;background:#c9a84c;color:#000;text-align:center;padding:13px 8px;border-radius:10px;text-decoration:none;font-weight:800;font-size:13px;">Access my ticket →</a>
          </td>
          <td style="padding-left:6px;">
            <a href="https://www.awakenings.com/en/events/2026/07/awakenings-festival/378057/" style="display:block;background:#0a0a0a;color:#fff;text-align:center;padding:13px 8px;border-radius:10px;text-decoration:none;font-weight:700;font-size:13px;">Event Page</a>
          </td>
        </tr>
      </table>
      <div style="border:1.5px solid #eee;border-radius:14px;padding:24px;text-align:center;">
        <img src="${escapeHtml(data.qrDataUri)}" width="190" height="190" alt="Entry QR Code" style="display:block;margin:0 auto 14px;">
        <div style="font-family:monospace;font-size:13px;color:#555;letter-spacing:.08em;">${escapedOrder}</div>
        <p style="font-size:11px;color:#aaa;margin:10px 0 0;line-height:1.5;">This QR code is your entry pass.<br>Have it ready and accessible on your mobile device.</p>
      </div>
    </div>
    <div style="background:#0a0a0a;border-radius:0 0 16px 16px;padding:16px 32px;text-align:center;">
      <p style="color:#555;font-size:11px;margin:0;">Awakenings Festival 2026 · July 10–12 · Hilvarenbeek</p>
      <p style="margin:6px 0 0;"><a href="mailto:${ADMIN}" style="color:#c9a84c;font-size:11px;text-decoration:none;">${ADMIN}</a></p>
    </div>
  </div>
</body></html>`;

  await getTransporter().sendMail({
    from:    FROM(),
    replyTo: ADMIN,
    to:      data.to,
    subject: `Ticket of "${safeCustomerName}" for Awakenings 2026`,
    html,
  });
}
