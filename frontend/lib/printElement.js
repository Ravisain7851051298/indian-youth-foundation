'use client';

/**
 * Cleanly prints an HTML element or custom HTML string in an isolated hidden iframe.
 * Prevents navigation, headers, sidebars, buttons, and website wrapper from printing.
 *
 * @param {HTMLElement|string} target - The DOM element or HTML string to print.
 * @param {Object} options - Print configuration options.
 * @param {string} [options.title] - Document title for the print job.
 * @param {string} [options.pageStyle] - Custom @page CSS (e.g. '@page { size: A4 portrait; margin: 8mm; }').
 * @param {boolean} [options.landscape] - Whether to force landscape orientation.
 */
export function printElement(target, options = {}) {
  if (typeof window === 'undefined') return;

  const {
    title = 'Official Document',
    pageStyle = '@page { size: A4 portrait; margin: 6mm 8mm; }',
    landscape = false,
  } = options;

  let contentHtml = '';
  if (typeof target === 'string') {
    contentHtml = target;
  } else if (target && target.outerHTML) {
    contentHtml = target.outerHTML;
  } else {
    // Fallback if target ref is missing
    window.print();
    return;
  }

  // Collect all stylesheets from parent document (so Tailwind & custom CSS apply)
  let styleTags = '';
  try {
    const sheets = Array.from(document.styleSheets);
    for (const sheet of sheets) {
      try {
        if (sheet.href) {
          styleTags += `<link rel="stylesheet" href="${sheet.href}">`;
        } else if (sheet.cssRules) {
          const rules = Array.from(sheet.cssRules).map((r) => r.cssText).join('\n');
          styleTags += `<style>${rules}</style>`;
        }
      } catch (e) {
        // Cross-origin stylesheet access might throw, ignore safely
        if (sheet.href) {
          styleTags += `<link rel="stylesheet" href="${sheet.href}">`;
        }
      }
    }
  } catch (err) {
    console.warn('Failed collecting styles for print:', err);
  }

  // Remove existing print iframes if any
  const existingIframe = document.getElementById('__app_print_iframe__');
  if (existingIframe) {
    existingIframe.remove();
  }

  // Create invisible iframe
  const iframe = document.createElement('iframe');
  iframe.id = '__app_print_iframe__';
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  iframe.style.zIndex = '-9999';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  const finalPageStyle = landscape
    ? '@page { size: A4 landscape; margin: 6mm 8mm; }'
    : pageStyle;

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        ${styleTags}
        <style>
          ${finalPageStyle}
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box !important;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            font-family: inherit;
          }
          body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
          }
          .no-print, [data-no-print="true"] {
            display: none !important;
          }
          /* Ensure printable cards or documents fit exactly on page */
          .printable-document {
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        </style>
      </head>
      <body>
        ${contentHtml}
      </body>
    </html>
  `);
  doc.close();

  // Wait for images inside iframe to load before triggering print
  const images = Array.from(doc.images);
  const imagePromises = images.map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  });

  Promise.all(imagePromises).then(() => {
    setTimeout(() => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (err) {
        console.error('Iframe print error, falling back to window.print():', err);
        window.print();
      } finally {
        // Clean up iframe after print dialog completes
        setTimeout(() => {
          if (iframe && iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        }, 4000);
      }
    }, 300);
  });
}

export default printElement;

