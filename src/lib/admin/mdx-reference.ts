export interface MdxReferenceSnippet {
  label: string;
  code: string;
}

export interface MdxReferenceSection {
  title: string;
  description?: string;
  snippets: MdxReferenceSnippet[];
}

/** Copy-paste snippets for the in-editor MDX writing guide. */
export const mdxReferenceSections: MdxReferenceSection[] = [
  {
    title: "Getting started",
    description:
      "Post metadata (title, slug, tags, featured image, etc.) is set in the editor sidebar — not in the MDX body.",
    snippets: [],
  },
  {
    title: "Headings & text",
    description: "Use ATX-style headings. H2–H4 appear in the table of contents.",
    snippets: [
      {
        label: "Headings",
        code: `## Section heading
### Subsection
#### Smaller heading`,
      },
      {
        label: "Bold, italic, and inline code",
        code: `**bold text**
*italic text*
\`inline code\``,
      },
      {
        label: "Blockquote",
        code: `> A quoted passage or pull quote.`,
      },
      {
        label: "Horizontal rule",
        code: `---

Content below the divider.`,
      },
    ],
  },
  {
    title: "Lists",
    snippets: [
      {
        label: "Unordered list",
        code: `- First item
- Second item
- Third item`,
      },
      {
        label: "Ordered list",
        code: `1. Step one
2. Step two
3. Step three`,
      },
      {
        label: "Task list (GFM)",
        code: `- [x] Completed task
- [ ] Pending task`,
      },
    ],
  },
  {
    title: "Links & images",
    snippets: [
      {
        label: "Internal link",
        code: `[Read our litter training guide](/blog/how-to-litter-train-a-kitten/)`,
      },
      {
        label: "External link",
        code: `[American Association of Feline Practitioners](https://catvets.com/)`,
      },
      {
        label: "Image from uploads",
        code: `![Photo description](/uploads/your-image.jpg)`,
      },
      {
        label: "Image from static assets",
        code: `![Photo description](/images/posts/example.jpg)`,
      },
    ],
  },
  {
    title: "Tables (GFM)",
    snippets: [
      {
        label: "Simple table",
        code: `| Feature | Wet food | Dry food |
| ------- | -------- | -------- |
| Hydration | High | Low |
| Convenience | Moderate | High |`,
      },
    ],
  },
  {
    title: "Code blocks",
    description: "Fenced blocks with a language tag get syntax highlighting.",
    snippets: [
      {
        label: "JavaScript",
        code: `\`\`\`javascript
const greeting = "Hello, cat lovers!";
console.log(greeting);
\`\`\``,
      },
      {
        label: "Plain text / shell",
        code: `\`\`\`bash
npm run dev
\`\`\``,
      },
    ],
  },
  {
    title: "Callout",
    description: 'Types: info, tip, warning, success. Optional title prop.',
    snippets: [
      {
        label: "Tip callout",
        code: `<Callout type="tip" title="Pro tip">
Helpful advice for your readers goes here.
</Callout>`,
      },
      {
        label: "Info callout",
        code: `<Callout type="info" title="Good to know">
Background context or an explanation.
</Callout>`,
      },
      {
        label: "Warning callout",
        code: `<Callout type="warning" title="Watch out">
Something readers should be careful about.
</Callout>`,
      },
      {
        label: "Success callout",
        code: `<Callout type="success" title="You're on track">
Positive reinforcement or confirmation.
</Callout>`,
      },
    ],
  },
  {
    title: "AffiliateProduct",
    description:
      "Product review box with image, pros/cons, rating, and CTA. Required: title, image, ctaHref.",
    snippets: [
      {
        label: "Full example",
        code: `<AffiliateProduct
  title="PurrFect Balance Grain-Free Chicken Recipe"
  image="/images/posts/best-cat-foods.jpg"
  description="A high-protein, grain-free recipe cats devour."
  rating={4.8}
  price="$$"
  badge="Editor's Choice"
  pros={["Real chicken is the #1 ingredient", "Grain-free and low carb"]}
  cons={["Only available in larger bags"]}
  ctaText="Check Price"
  ctaHref="https://example.com/product"
/>`,
      },
      {
        label: "Minimal example",
        code: `<AffiliateProduct
  title="Product name"
  image="/uploads/product-photo.jpg"
  ctaHref="https://example.com/product"
/>`,
      },
    ],
  },
  {
    title: "InContentAd",
    description: "Inserts an in-content ad slot (disabled by default in site config).",
    snippets: [
      {
        label: "Ad slot",
        code: `<InContentAd />`,
      },
    ],
  },
  {
    title: "FAQ section (SEO)",
    description:
      'Use an H2 heading containing "FAQ". Each H3 becomes a question; the text below is the answer. Automatically generates FAQPage structured data.',
    snippets: [
      {
        label: "FAQ block",
        code: `## Frequently Asked Questions

### How often should I feed my cat?

Most adult cats do well with two measured meals per day.

### Is grain-free food necessary?

Not for every cat. Focus on overall protein quality.`,
      },
    ],
  },
];

export const calloutPreviewTypes = ["info", "tip", "warning", "success"] as const;
