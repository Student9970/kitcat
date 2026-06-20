"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

import { useLoadingBar } from "@/components/loading/LoadingBarProvider";

/**
 * Static-export friendly contact form.
 * Set `endpoint` to a form backend (e.g. Formspree, Web3Forms) to receive
 * submissions. With no endpoint, it falls back to opening the user's email app.
 */
export function ContactForm({ endpoint }: { endpoint?: string }) {
  const { start, stop } = useLoadingBar();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    start();

    if (endpoint) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name, email, message }),
        });
        if (res.ok) setSent(true);
      } catch {
        /* fall through */
      } finally {
        setSubmitting(false);
        stop();
      }
      return;
    }

    // Fallback: compose an email.
    const subject = encodeURIComponent(`Website contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`);
    window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
    setSent(true);
    setSubmitting(false);
    stop();
  }

  if (sent) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-green-800 dark:text-green-300">
        <CheckCircle2 className="size-6 shrink-0" />
        <p>Thanks for reaching out! We&apos;ll get back to you as soon as we can.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Name</span>
          <input
            required
            disabled={submitting}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-brand-200/80 bg-card px-4 py-2.5 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-200 disabled:opacity-60 dark:border-brand-800/60 dark:focus:ring-brand-800/40"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Email</span>
          <input
            required
            type="email"
            disabled={submitting}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-brand-200/80 bg-card px-4 py-2.5 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-200 disabled:opacity-60 dark:border-brand-800/60 dark:focus:ring-brand-800/40"
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Message</span>
        <textarea
          required
          rows={6}
          disabled={submitting}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-2xl border border-brand-200/80 bg-card px-4 py-2.5 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-200 disabled:opacity-60 dark:border-brand-800/60 dark:focus:ring-brand-800/40"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-semibold text-white shadow-cat transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-cat-lg disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send message
            <Send className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}
