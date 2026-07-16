import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { BlogCard } from '@/components/public/BlogCard';
import { Section, PageHero } from '@/components/public/Section';
import { urlFor } from '@/sanity/lib/image';
import { getAllPosts, getSiteConfig } from '@/sanity/lib/queries';
import { cn } from '@/lib/utils';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const revalidate = 60;

function img(source?: SanityImageSource): string | null {
  return source ? urlFor(source).width(800).url() : null;
}

function readingMinutes(excerpt?: string): number | undefined {
  if (!excerpt) return undefined;
  return Math.max(2, Math.ceil(excerpt.split(/\s+/).length / 40));
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const name = config?.name ?? 'Skating Club';
  return { title: `Blog · ${name}`, description: 'Noticias, consejos y comunidad.' };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const posts = await getAllPosts(50);

  const categories = Array.from(
    new Set(posts.map((post) => post.category).filter((value): value is string => Boolean(value))),
  ).sort();
  const filtered = category ? posts.filter((post) => post.category === category) : posts;

  return (
    <>
      <PageHero title="Blog" subtitle="Historias y consejos de la comunidad." />

      <Section>
      {categories.length > 0 ? (
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <Link
            href={'/blog' as Route}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm transition-colors',
              !category ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground',
            )}
          >
            Todas
          </Link>
          {categories.map((value) => (
            <Link
              key={value}
              href={`/blog?category=${encodeURIComponent(value)}` as Route}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm capitalize transition-colors',
                category === value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground',
              )}
            >
              {value}
            </Link>
          ))}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">Aún no hay publicaciones.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <BlogCard
              key={post._id}
              title={post.title}
              href={`/blog/${post.slug}` as Route}
              category={post.category}
              image={img(post.mainImage)}
              publishedAt={post.publishedAt}
              excerpt={post.excerpt}
              readingMinutes={readingMinutes(post.excerpt)}
            />
          ))}
        </div>
      )}
      </Section>
    </>
  );
}
