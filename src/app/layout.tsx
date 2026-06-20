import type { Metadata, Viewport } from "next";
import { Nunito, Playfair_Display } from "next/font/google";

import "./globals.css";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LoadingBarProvider } from "@/components/loading/LoadingBarProvider";
import { NavigationProgress } from "@/components/loading/NavigationProgress";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteShell } from "@/components/layout/SiteShell";
import { Analytics } from "@/components/analytics/Analytics";
import { JsonLd } from "@/components/seo/JsonLd";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf2f6" },
    { media: "(prefers-color-scheme: dark)", color: "#2a1a24" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${nunito.variable} ${playfair.variable}`}>
      <body className="min-h-dvh font-sans">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LoadingBarProvider>
            <NavigationProgress />
            <SiteShell header={<Header />} footer={<Footer />}>
              {children}
            </SiteShell>
          </LoadingBarProvider>
          <Analytics />
        </ThemeProvider>
        {/* Site name for screen readers / fallback */}
        <span className="sr-only">{siteConfig.name}</span>
      </body>
    </html>
  );
}
