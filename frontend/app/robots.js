export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indianyouthfoundation.org';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/dashboard/*',
          '/profile/',
          '/profile/*',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/dashboard/*',
          '/profile/',
          '/profile/*',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
