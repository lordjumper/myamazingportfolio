import { getPostData, getAllPostIds } from "@/lib/posts";
import Link from "next/link";
import { Icon } from "@iconify/react";
import ShareButtons from "./ShareButtons";

export async function generateStaticParams() {
  const posts = getAllPostIds();
  return posts.map((post) => ({
    id: post.params.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postData = await getPostData(id);
  return {
    title: `${postData.title} | Blog`,
    description: postData.excerpt,
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postData = await getPostData(id);

  return (
    <div className="min-h-screen bg-black">
      <article className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#00ff88] opacity-5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-[#0088ff] opacity-5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/60 hover:text-[#00ff88] transition-colors duration-300 mb-8"
          >
            <Icon icon="mdi:arrow-left" className="text-xl" />
            Back to Blog
          </Link>

          {}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {postData.title}
            </h1>
            <div className="flex items-center gap-6 text-white/60">
              <div className="flex items-center gap-2">
                <Icon icon="mdi:calendar" className="text-xl text-[#00ff88]" />
                <time dateTime={postData.date}>
                  {new Date(postData.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Icon
                  icon="mdi:clock-outline"
                  className="text-xl text-[#0088ff]"
                />
                <span>{postData.readTime || 5} min read</span>
              </div>
            </div>
            <div className="w-full h-px bg-white/10 mt-8" />
          </header>

          {}
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-h1:text-4xl prose-h1:mb-6 prose-h1:text-white
              prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-white
              prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
              prose-p:text-white/70 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-[#0088ff] prose-a:no-underline hover:prose-a:text-[#00ff88] prose-a:transition-colors
              prose-strong:text-white prose-strong:font-bold
              prose-code:text-[#00ff88] prose-code:bg-white/5 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
              prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
              prose-ul:text-white/70 prose-ul:my-6
              prose-ol:text-white/70 prose-ol:my-6
              prose-li:my-2
              prose-blockquote:border-l-4 prose-blockquote:border-[#00ff88] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-white/60"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml || "" }}
          />

          {}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <ShareButtons title={postData.title} />

              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-[#00ff88] text-black px-6 py-3 rounded-full font-semibold hover:bg-[#00cc6f] transition-colors duration-300"
              >
                <Icon icon="mdi:arrow-left" className="text-xl" />
                Back to All Posts
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
}
