import { MetadataRoute } from 'next';
import { posts, digests } from '#/.velite';

const SITE_URL = 'https://defangweng.xyz';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  const postRoutes = posts
    .filter((post) => post.published)
    .map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  const digestLocales = ['en', 'zh'] as const;
  const digestRoutes = digestLocales.flatMap((locale) => [
    {
      url: `${SITE_URL}/digest/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    ...digests
      .filter((digest) => digest.published && digest.lang === locale)
      .map((digest) => ({
        url: `${SITE_URL}/digest/${locale}/${digest.slug}`,
        lastModified: new Date(digest.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
  ]);

  return [...routes, ...postRoutes, ...digestRoutes];
}
