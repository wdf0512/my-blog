import { posts } from '#/.velite';
import { BlogFilter } from '@/components/blog/BlogFilter';
import { ScrambleText } from '@/components/ui/ScrambleText';

export const metadata = {
  title: 'Blog - All Articles',
  description: 'Articles about web development, tech, and indie hacking',
};

export default function BlogPage() {
  const publishedPosts = posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const allTags = Array.from(
    new Set(publishedPosts.flatMap((post) => post.tags || []))
  ).slice(0, 10);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
      <div className="mb-12">
        <h1 className="font-display text-5xl md:text-6xl font-black mb-4 text-text-primary">
          <ScrambleText trigger={false} duration={700}>All Articles</ScrambleText>
        </h1>
        <p className="text-text-secondary text-xl max-w-2xl">
          {publishedPosts.length} articles about web development, indie hacking,
          and building products. Updated regularly with new content.
        </p>
      </div>

      {publishedPosts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="font-display text-2xl font-bold mb-2 text-text-primary">
            No articles yet
          </h3>
          <p className="text-text-secondary">Check back soon for new content!</p>
        </div>
      ) : (
        <BlogFilter posts={publishedPosts} allTags={allTags} />
      )}
    </div>
  );
}
