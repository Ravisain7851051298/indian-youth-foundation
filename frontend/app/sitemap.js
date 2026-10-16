export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indianyouthfoundation.org';
  const currentDate = new Date().toISOString();

  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/donation', priority: 0.95, changeFrequency: 'daily' },
    { path: '/donation/80G', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/campaigns', priority: 0.9, changeFrequency: 'daily' },
    { path: '/volunteer', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/members', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/blogs', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/event', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/programs', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/certificates', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/gallery', priority: 0.75, changeFrequency: 'weekly' },
    { path: '/mission-vision', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/who-we-are', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/story', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/team-members', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/feedback', priority: 0.65, changeFrequency: 'monthly' },
    { path: '/complaints', priority: 0.65, changeFrequency: 'monthly' },
    { path: '/privacy-policy', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.4, changeFrequency: 'yearly' },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
