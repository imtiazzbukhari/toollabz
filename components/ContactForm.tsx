"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { toolGlassPanel, toolInputClass } from "@/lib/tool-ui";

const CONTACT_EMAIL = "contact@toolabz.com";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    const subject = encodeURIComponent(`Toollabz  -  message from ${name.trim()}`);
    const body = encodeURIComponent(
      `${message.trim()}\n\n -  ${name.trim()}\n${email.trim()}`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className={`p-6 sm:p-8 ${toolGlassPanel}`}>
        <p className="text-sm font-semibold text-violet-800">Thanks for reaching out</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Your email app should open with your message ready to send. If it didn’t, email us directly at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-violet-700 underline-offset-2 hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`space-y-5 p-6 sm:p-8 ${toolGlassPanel}`}>
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-800">Name</span>
        <input
          type="text"
          name="name"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={toolInputClass}
          placeholder="Your name"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-800">Email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={toolInputClass}
          placeholder="you@example.com"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-800">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${toolInputClass} resize-y`}
          placeholder="How can we help?"
        />
      </label>
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-violet-600 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(91,33,182,0.35)] transition hover:brightness-110 active:translate-y-px"
      >
        <Send className="h-4 w-4" aria-hidden />
        Send message
      </button>
      <p className="text-center text-xs text-slate-500">
        By sending, you agree we may reply to the email address you provide.
      </p>
    </form>
  );
}
