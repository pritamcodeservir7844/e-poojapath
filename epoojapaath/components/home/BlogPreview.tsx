import { getFeaturedBlogs } from "@/services/blog.service";
import { BlogCard } from "@/components/blog/BlogCard";
import Link from "next/link";

export async function BlogPreview() {
  const blogs = await getFeaturedBlogs().catch(() => []);

  return (
    <section className="section-padding max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-saffron font-medium mb-2 font-sanskrit">ज्ञान और भक्ति</p>
        <h2 className="font-heading text-4xl md:text-5xl text-dark mb-4">Sacred Wisdom & Temple Stories</h2>
        <p className="text-muted max-w-xl mx-auto">
          Explore devotional articles, festival guides, temple histories, and Vedic wisdom.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {blogs.map((blog: any) => <BlogCard key={blog._id.toString()} blog={blog} />)}
      </div>

      <div className="text-center">
        <Link href="/blog" className="btn-outline-gold">Read All Articles 📖</Link>
      </div>
    </section>
  );
}
