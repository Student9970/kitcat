/**
 * Renders a JSON-LD <script> tag for structured data.
 * Accepts one schema object or an array of them.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <>
      {json.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Structured data is trusted, server-generated content.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
