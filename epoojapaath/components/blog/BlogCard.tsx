import Image from "next/image";
import Link from "next/link";
import { formatDate, calculateReadTime } from "@/lib/utils";
import type { IBlog } from "@/types";

const categoryColors: Record<string, string> = {
  devotional:    "bg-saffron/10 text-saffron",
  "temple-story":"bg-lotus-purple/10 text-lotus-purple",
  festival:      "bg-lotus-pink/10 text-lotus-pink",
  astrology:     "bg-lotus-blue/10 text-lotus-blue",
  announcement:  "bg-deep-gold/10 text-deep-gold",
};

export function BlogCard({ blog }: { blog: Partial<IBlog> & { _id: string } }) {
  return (
    <div className="card-devotional overflow-hidden group">
      <Link href={`/blog/${blog.slug}`}>
        <div className="relative h-44 -mx-6 -mt-6 mb-4 overflow-hidden">
          <Image
            src={blog.coverImage || "/placeholder-blog.jpg"}
            alt={blog.title || "Blog"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${categoryColors[blog.category || "devotional"] || "bg-saffron/10 text-saffron"}`}>
            {blog.category?.replace("-", " ")}
          </span>
          <span className="text-muted-foreground text-xs">{calculateReadTime(blog.content || "")} min read</span>
        </div>

        <h3 className="font-heading text-foreground text-2xl mb-2 line-clamp-2 group-hover:text-saffron transition-colors">
          {blog.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{blog.excerpt}</p>

        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-deep-gold/10 pt-3">
          <span>
            {typeof blog.author === "object" && blog.author !== null
              ? (blog.author as { name?: string }).name
              : "ePoojapaath"}
          </span>
          <span>{blog.publishedAt ? formatDate(blog.publishedAt) : ""}</span>
        </div>
      </Link>
    </div>
  );
}
