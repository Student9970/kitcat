import type { Metadata } from "next";

import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

/**
 * Local, development-only admin dashboard.
 *
 * This file uses the `.dev.tsx` extension, which is ONLY registered as a route
 * during `next dev` (see next.config.ts -> pageExtensions). Production builds
 * never include this route, so /admin returns a 404 on the deployed site.
 */
export default function AdminPage() {
  return <AdminDashboard />;
}
