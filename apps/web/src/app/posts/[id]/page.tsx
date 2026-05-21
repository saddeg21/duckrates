import { notFound } from "next/navigation";
import NextImage from "next/image";
import { getPublicPost } from "@lib/api/posts";
import { Navbar } from "@components/navbar/Navbar";
import { CategoryBadgeList } from "@components/CategoryBadge";
import { Footer } from "@components/Footer";

type Props = { params: Promise<{ id: string }> };

export default async function PostPage({ params }: Props) {
  const { id } = await params;

  let post;
  try {
    post = await getPublicPost(id);
  } catch {
    notFound();
  }

  const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const wordCount = post.renderedContent.replace(/<[^>]+>/g, "").split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <>
      <Navbar />
      <main className="max-w-[var(--width-content)] mx-auto px-4 sm:px-8 pt-14 pb-24">

        <h1 className="font-serif font-bold text-[clamp(2rem,5vw,3rem)] leading-[1.1] text-on-surface m-0 mb-5">
          {post.title}
        </h1>

        <p className="font-sans text-sm text-muted mb-6">{publishedDate}</p>

        {post.categories?.length > 0 && (
          <div className="mb-10">
            <CategoryBadgeList categories={post.categories} size="md" />
          </div>
        )}

        {post.coverImageKey && (
          <div className="relative w-full aspect-[16/9] overflow-hidden mb-10 rounded-sm">
            <NextImage
              src={post.coverImageKey}
              alt={post.title}
              fill
              unoptimized
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        )}

        <a href={`/authors/${post.authorId}`} className="flex items-center gap-4 border-t border-b border-border py-5 mb-12 no-underline hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-surface-low border border-border overflow-hidden flex items-center justify-center shrink-0">
            {post.authorProfilePic ? (
              <NextImage
                src={post.authorProfilePic}
                alt={post.authorName}
                width={36}
                height={36}
                unoptimized
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="font-serif font-bold text-sm text-on-surface select-none">
                {post.authorName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="font-sans text-sm font-medium text-on-surface m-0">{post.authorName}</p>
            <p className="font-sans text-xs text-muted m-0">{readingTime} min read</p>
          </div>
        </a>

        <article
          className="article-body"
          dangerouslySetInnerHTML={{ __html: post.renderedContent }}
        />

        <div className="mt-16 p-6 bg-surface-low">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface m-0 mb-2">
            Cite this Article
          </p>
          <p className="font-sans text-sm text-muted m-0">
            {post.authorName}. ({new Date(post.publishedAt).getFullYear()}). {post.title}.{" "}
            <em>The Living Archive</em>.
          </p>
        </div>
      </main>
      <Footer />      
    </>
  );
}
