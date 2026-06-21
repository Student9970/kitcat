"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";

import { Callout } from "@/components/mdx/Callout";
import {
  calloutPreviewTypes,
  mdxReferenceSections,
  type MdxReferenceSnippet,
} from "@/lib/admin/mdx-reference";

function AddButton({ code, onInsert }: { code: string; onInsert: (code: string) => void }) {
  const [added, setAdded] = useState(false);

  function add() {
    onInsert(code);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={add}
      className="inline-flex items-center gap-1 rounded-md border border-default px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-card hover:text-foreground"
    >
      {added ? (
        <>
          <Check className="size-3.5" /> Added
        </>
      ) : (
        <>
          <Plus className="size-3.5" /> Add
        </>
      )}
    </button>
  );
}

function SnippetBlock({
  snippet,
  onInsert,
}: {
  snippet: MdxReferenceSnippet;
  onInsert: (code: string) => void;
}) {
  return (
    <div className="rounded-lg border border-default bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-default px-3 py-2">
        <span className="text-xs font-semibold">{snippet.label}</span>
        <AddButton code={snippet.code} onInsert={onInsert} />
      </div>
      <pre className="overflow-x-auto p-3 text-xs leading-relaxed text-foreground">
        <code>{snippet.code}</code>
      </pre>
    </div>
  );
}

export function MdxCheatsheet({ onInsert }: { onInsert: (code: string) => void }) {
  return (
    <div className="space-y-8">
      {mdxReferenceSections.map((section) => (
        <section key={section.title}>
          <h3 className="text-base font-bold">{section.title}</h3>
          {section.description && (
            <p className="mt-1 text-sm text-muted">{section.description}</p>
          )}

          {section.snippets.length > 0 && (
            <div className="mt-3 space-y-3">
              {section.snippets.map((snippet) => (
                <SnippetBlock key={snippet.label} snippet={snippet} onInsert={onInsert} />
              ))}
            </div>
          )}

          {section.title === "Callout" && (
            <div className="mt-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Preview
              </p>
              {calloutPreviewTypes.map((type) => (
                <Callout key={type} type={type} title={`${type.charAt(0).toUpperCase()}${type.slice(1)} callout`}>
                  This is how a {type} callout looks on the published post.
                </Callout>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
