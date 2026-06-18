"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";

import { siteConfig } from "@/config/site";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent) {
    // If a provider URL is configured, let the form post to it natively.
    if (siteConfig.newsletterActionUrl) return;
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white md:p-12">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-white/15">
          <Mail className="size-6" />
        </span>
        <h2 className="text-2xl font-extrabold md:text-3xl">Join our newsletter</h2>
        <p className="mt-3 text-white/80">
          Get the best {siteConfig.shortName} guides and tips delivered to your inbox. No spam, unsubscribe anytime.
        </p>

        {submitted ? (
          <p className="mt-6 rounded-xl bg-white/15 px-4 py-3 font-medium">
            Thanks for subscribing! 🎉
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-white placeholder:text-white/60 outline-none focus:border-white/60"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-brand-700 transition-transform hover:scale-[1.02]"
            >
              Subscribe
              <Send className="size-4" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
