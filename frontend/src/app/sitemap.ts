import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://docodo.in';

    // Core pages
    const routes = [
        '',
        '/about',
        '/services',
        '/ai-tools',
        '/portfolio',
        '/blog',
        '/contact',
        '/growth-grader',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return [...routes];
}
