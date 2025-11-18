import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";
import { Icon } from "@iconify/react";

export const metadata = {
  title: "Blog | Mina Zaky",
  description: "Read my latest articles and thoughts",
};

export default function BlogPage() {
  const allPosts = getSortedPostsData();

  return (
    <div className="min-h-screen bg-black">
      {}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#00ff88] opacity-5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-[#0088ff] opacity-5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-[#00ff88] transition-colors duration-300 mb-8"
          >
            <Icon icon="mdi:arrow-left" className="text-xl" />
            Back to Home
          </Link>

          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Blog
            </h1>
            <div className="w-20 h-1 bg-[#00ff88] mx-auto mb-6" />
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Banter about things and ideas.
            </p>
          </div>

          {}
          <div className="space-y-8">
            {allPosts.length === 0 ? (
              <div className="text-center py-20">
                <Icon
                  icon="mdi:file-document-outline"
                  className="text-6xl text-white/20 mx-auto mb-4"
                />
                <p className="text-white/60">
                  No blog posts yet. Check back soon!
                </p>
              </div>
            ) : (
              allPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="block bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/10 hover:border-[#00ff88] transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-[#00ff88] transition-colors duration-300">
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-2 text-white/50 text-sm flex-shrink-0">
                      <Icon icon="mdi:calendar" className="text-lg" />
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </div>

                  {post.excerpt && (
                    <p className="text-white/70 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-[#00ff88] font-medium group-hover:gap-4 transition-all duration-300">
                    <span>Read More</span>
                    <Icon icon="mdi:arrow-right" className="text-xl" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
