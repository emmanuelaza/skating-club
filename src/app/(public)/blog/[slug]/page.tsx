import type { Metadata } from 'next';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { Badge } from '@/components/ui/badge';
import { BlogCard } from '@/components/public/BlogCard';
import { urlFor } from '@/sanity/lib/image';
import { getPostBySlug, getAllPosts, getSiteConfig } from '@/sanity/lib/queries';
import { formatDate } from '@/lib/format';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const revalidate = 60;

type PortableValue = React.ComponentProps<typeof PortableText>['value'];

function img(source?: SanityImageSource, width = 1200): string | null {
  return source ? urlFor(source).width(width).url() : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [post, config] = await Promise.all([getPostBySlug(slug), getSiteConfig()]);
  const name = config?.name ?? 'Skating Club';
  if (!post) return { title: `Blog · ${name}` };
  const cover = img(post.mainImage, 1200);
  return {
    title: `${post.title} · ${name}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      images: cover ? [cover] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getAllPosts(50);
  const related = allPosts
    .filter((item) => item.slug !== post.slug && (!post.category || item.category === post.category))
    .slice(0, 3);

  const cover = img(post.mainImage, 1400);

  return (
    <article className="py-16">
      <div className="container max-w-3xl space-y-6">
        <header className="space-y-4">
          <div className="flex items-center gap-2">
            {post.category ? <Badge variant="secondary">{post.category}</Badge> : null}
            {post.publishedAt ? (
              <span className="text-sm text-muted-foreground">{formatDate(post.publishedAt)}</span>
            ) : null}
          </div>
          <h1 className="font-display text-4xl font-black leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>
          {post.author ? <p className="text-sm text-muted-foreground">Por {post.author}</p> : null}
        </header>

        {cover ? (
          <div className="overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt={post.title} className="w-full object-cover" />
          </div>
        ) : null}

        {post.body ? (
          <div className="prose prose-invert max-w-none text-foreground">
            <PortableText value={post.body as PortableValue} />
          </div>
        ) : null}
      </div>

      {related.length > 0 ? (
        <section className="container mt-20 max-w-5xl">
          <span className="mb-4 block h-[3px] w-10 rounded-full bg-primary" />
          <h2 className="mb-8 font-display text-2xl font-bold tracking-tight text-foreground">
            Posts relacionados
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((item) => (
              <BlogCard
                key={item._id}
                title={item.title}
                href={`/blog/${item.slug}` as Route}
                category={item.category}
                image={img(item.mainImage, 800)}
                publishedAt={item.publishedAt}
                excerpt={item.excerpt}
              />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
