import type { Metadata } from "next";

import { MdxCheatsheet } from "@/components/admin/MdxCheatsheet";

export const metadata: Metadata = {
  title: "MDX Writing Guide",
  robots: { index: false, follow: false },
};

export default function MdxFieldGuidePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold">MDX Writing Guide</h1>
      <MdxCheatsheet />
    </main>
  );
}