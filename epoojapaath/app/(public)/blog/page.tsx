export const dynamic = "force-dynamic";

import { PublicPage } from "@/components/shared/PublicPage";
import { PageHero } from "@/components/ui/PageHero";
import { MandalaDivider } from "@/components/shared/MandalaDivider";
import { EmptyState } from "@/components/ui/EmptyState";
import { BlogCard } from "@/components/blog/BlogCard";
import { AdBanner } from "@/components/ads/AdBanner";
import { CategoryTabs } from "@/components/blog/CategoryTabs";
import { getPublishedBlogs, getFeaturedBlogs } from "@/services/blog.service";
import { getActiveAd } from "@/services/ad.service";
import { serialize } from "@/lib/utils";
import type { IBlog, IAd } from "@/types";

interface PageProps {
  searchParams: { category?: string; q?: string };
}

export default async function BlogPage({ searchParams }: PageProps) {
  const [blogsRaw, featuredRaw, sidebarAdRaw] = await Promise.all([
    getPublishedBlogs({ category: searchParams.category, search: searchParams.q }).catch(() => []),
    getFeaturedBlogs().catch(() => []),
    getActiveAd("sidebar").catch(() => null),
  ]);

  const blogs = serialize(blogsRaw) as any as (IBlog & { _id: string })[];
  const featured = serialize(featuredRaw) as any as (IBlog & { _id: string })[];
  const sidebarAd = serialize(sidebarAdRaw) as any as (IAd & { _id: string }) | null;

  return (
    <PublicPage>
      <PageHero
        sanskrit="ज्ञान और भक्ति"
        title="Sacred Wisdom & Stories"
        subtitle="Devotional articles, temple stories, festival guides, and Vedic wisdom."
      />
      <CategoryTabs active={searchParams.category} />
      <MandalaDivider />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3">
            {blogs.length === 0 ? (
              <EmptyState icon="📝" title="No articles found" description="Try a different category." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((b) => <BlogCard key={b._id.toString()} blog={b} />)}
              </div>
            )}
          </div>
          <aside className="space-y-6">
            {sidebarAd && <AdBanner ad={sidebarAd} />}
            {featured.length > 0 && (
              <div className="card-devotional">
                <h3 className="font-heading text-lg text-foreground mb-4">Featured Articles</h3>
                <ul className="space-y-3">
                  {featured.map((b) => (
                    <li key={b._id.toString()}>
                      <a href={`/blog/${b.slug}`} className="text-sm text-foreground hover:text-saffron transition-colors line-clamp-2 block">
                        {b.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </PublicPage>
  );
}
