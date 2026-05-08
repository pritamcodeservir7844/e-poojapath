import { notFound } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { getBlogBySlug, getPublishedBlogs } from "@/services/blog.service";
import { getActiveAd } from "@/services/ad.service";
import { AdBanner } from "@/components/ads/AdBanner";
import { BlogCard } from "@/components/blog/BlogCard";
import { formatDate, calculateReadTime } from "@/lib/utils";
import type { IUser } from "@/types";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug).catch(() => null);
  if (!blog) return { title: "Blog Not Found" };
  return { title: `${blog.title} | ePoojapaath`, description: blog.excerpt };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const [blog, sidebarAd] = await Promise.all([
    getBlogBySlug(params.slug).catch(() => null),
    getActiveAd("sidebar").catch(() => null),
  ]);
  if (!blog) notFound();

  const related = await getPublishedBlogs({ category: blog.category }).catch(() => []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const relatedFiltered = (related as any[]).filter((b) => b._id.toString() !== blog._id.toString()).slice(0, 3);

  const authorName = typeof blog.author === "object" ? (blog.author as IUser).name : "ePoojapaath";

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="relative h-72 md:h-96 w-full">
          <Image src={blog.coverImage || "/placeholder-blog.jpg"} alt={blog.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 max-w-3xl">
            <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium capitalize mb-3 bg-saffron text-white`}>
              {blog.category?.replace("-", " ")}
            </span>
            <h1 className="font-heading text-3xl md:text-4xl text-cream mb-3">{blog.title}</h1>
            <div className="flex items-center gap-4 text-cream/60 text-sm">
              <span>By {authorName}</span>
              <span>{blog.publishedAt ? formatDate(blog.publishedAt) : ""}</span>
              <span>{calculateReadTime(blog.content)} min read</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <article className="lg:col-span-3">
              <div className="card-devotional prose prose-stone max-w-none prose-headings:font-heading prose-headings:text-dark prose-a:text-saffron"
                dangerouslySetInnerHTML={{ __html: blog.content }} />

              {/* Share */}
              <div className="mt-8 card-devotional">
                <p className="font-heading text-lg text-dark mb-3">Share this article</p>
                <div className="flex gap-3">
                  <a href={`https://wa.me/?text=${encodeURIComponent(blog.title + " " + process.env.NEXT_PUBLIC_APP_URL + "/blog/" + blog.slug)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="bg-green-100 text-green-700 text-sm px-4 py-2 rounded-lg hover:bg-green-200 transition-colors">
                    WhatsApp
                  </a>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog.slug}`}
                    target="_blank" rel="noopener noreferrer"
                    className="bg-blue-100 text-blue-700 text-sm px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                    Twitter
                  </a>
                </div>
              </div>

              <div className="mt-6 p-4 bg-cream rounded-xl border border-deep-gold/20 text-center text-sm text-muted">
                💬 Comments coming soon
              </div>

              {/* Related */}
              {relatedFiltered.length > 0 && (
                <div className="mt-10">
                  <h2 className="font-heading text-2xl text-dark mb-6">Related Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {relatedFiltered.map((b: any) => <BlogCard key={b._id.toString()} blog={b} />)}
                  </div>
                </div>
              )}
            </article>

            <aside>
              {sidebarAd && <AdBanner ad={sidebarAd as Parameters<typeof AdBanner>[0]["ad"]} />}
              <div className="card-devotional mt-6">
                <p className="font-heading text-lg text-dark mb-2">About Author</p>
                <p className="text-muted text-sm">{authorName}</p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
