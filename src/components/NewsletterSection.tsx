"use client";

import { useState } from "react";
import { Mail, Send, Heart, Loader2 } from "lucide-react";

import { siteConfig } from "@/config/site";
import { useLoadingBar } from "@/components/loading/LoadingBarProvider";

export function NewsletterSection() {
  const { start, stop } = useLoadingBar();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    // If a provider URL is configured, let the form post to it natively.
    if (siteConfig.newsletterActionUrl) {
      start();
      return;
    }

    e.preventDefault();
    if (!email || submitting) return;

    setSubmitting(true);
    start();
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    setSubmitted(true);
    setSubmitting(false);
    stop();
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 p-8 text-white shadow-cat-lg md:p-12">
      <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-white/10 blur-2xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-12 -left-8 size-48 rounded-full bg-lavender-200/20 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-2xl text-center">
        <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
          <Mail className="size-6" />
        </span>
        <h2 className="font-serif text-2xl font-bold md:text-3xl">Join the clowder</h2>
        <p className="mt-3 text-white/85">
          Get the cutest {siteConfig.shortName} guides and tips delivered to your inbox. No spam, just love for your kitty. 💕
        </p>

        {submitted ? (
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-3 font-medium backdrop-blur-sm">
            <Heart className="size-4 fill-current" />
            Thanks for subscribing!
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            action={siteConfig.newsletterActionUrl || undefined}
            method={siteConfig.newsletterActionUrl ? "post" : undefined}
            className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              name="email"
              required
              disabled={submitting}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-full border border-white/25 bg-white/15 px-5 py-3 text-white placeholder:text-white/60 outline-none backdrop-blur-sm focus:border-white/50 focus:ring-2 focus:ring-white/20 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-brand-600 shadow-cat transition-transform hover:scale-[1.02] hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Subscribing…
                </>
              ) : (
                <>
                  Subscribe
                  <Send className="size-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
