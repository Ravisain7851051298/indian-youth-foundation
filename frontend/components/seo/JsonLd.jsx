import React from 'react';

/**
 * Reusable JSON-LD schema injector for Next.js App Router
 * @param {{ data: object | object[] }} props
 */
export default function JsonLd({ data }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
