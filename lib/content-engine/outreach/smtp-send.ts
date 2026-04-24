import type { OutreachMessage } from "./types";

export type SendResult = { ok: true } | { ok: false; error: string };

/**
 * Sends one approved message via SMTP. Requires env:
 * OUTREACH_SMTP_HOST, OUTREACH_SMTP_PORT, OUTREACH_SMTP_USER, OUTREACH_SMTP_PASS, OUTREACH_FROM_EMAIL
 * Optional: OUTREACH_SMTP_SECURE=1 for TLS on port 465
 */
export async function sendOutreachViaSmtp(msg: OutreachMessage): Promise<SendResult> {
  const host = process.env.OUTREACH_SMTP_HOST?.trim();
  const port = Number(process.env.OUTREACH_SMTP_PORT ?? "587");
  const user = process.env.OUTREACH_SMTP_USER?.trim();
  const pass = process.env.OUTREACH_SMTP_PASS?.trim();
  const from = process.env.OUTREACH_FROM_EMAIL?.trim();
  if (!host || !from) {
    return { ok: false, error: "SMTP not configured (OUTREACH_SMTP_HOST / OUTREACH_FROM_EMAIL)." };
  }

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: process.env.OUTREACH_SMTP_SECURE === "1" || port === 465,
      auth: user && pass ? { user, pass } : undefined,
    });
    await transporter.sendMail({
      from,
      to: msg.to,
      subject: msg.subject,
      text: msg.body,
    });
    return { ok: true };
  } catch (e) {
    const err = e instanceof Error ? e.message : "send_failed";
    return { ok: false, error: err };
  }
}
