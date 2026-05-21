import { notFound } from "next/navigation";
import NextImage from "next/image";
import Link from "next/link";
import { getPublicAuthor } from "@lib/api/users";
import { Navbar } from "@components/navbar/Navbar";
import { Footer } from "@components/Footer";
import { PostCard } from "@components/PostCard";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function AuthorPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  let author;
  try {
    author = await getPublicAuthor(id, currentPage);
  } catch {
    notFound();
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < author.totalPages;

  return (
    <>
      <Navbar />
      <main className="max-w-[var(--width-content)] mx-auto px-4 sm:px-8 pt-14 pb-24">

        <div className="flex items-start gap-6 pb-10 mb-10 border-b border-border">
          <div className="w-20 h-20 rounded-full border border-border bg-surface-low overflow-hidden flex items-center justify-center shrink-0">
            {author.profilePic ? (
              <NextImage
                src={author.profilePic}
                alt={author.name}
                width={80}
                height={80}
                unoptimized
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="font-serif text-3xl text-muted select-none">
                {author.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="pt-1">
            <h1 className="font-serif font-bold text-3xl text-on-surface leading-tight m-0 mb-2">
              {author.name}
            </h1>
            {author.bio && (
              <p className="font-sans text-base text-muted leading-relaxed m-0 max-w-xl">
                {author.bio}
              </p>
            )}
            <p className="font-sans text-xs text-muted mt-3 uppercase tracking-widest">
              {author.totalPosts} {author.totalPosts === 1 ? "article" : "articles"}
            </p>
          </div>
        </div>

        {author.posts.length === 0 ? (
          <p className="font-serif text-on-surface text-lg text-center py-16">
            No published articles yet.
          </p>
        ) : (
          <>
            <div className="divide-y divide-border">
              {author.posts.map((post) => (
                <div key={post.id} className="py-8 first:pt-0">
                  <PostCard post={post} variant="compact" />
                </div>
              ))}
            </div>

            {author.totalPages > 1 && (
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
                <Link
                  href={hasPrev ? `/authors/${id}?page=${currentPage - 1}` : "#"}
                  aria-disabled={!hasPrev}
                  className={[
                    "font-sans text-sm px-4 py-2 rounded border transition-colors",
                    hasPrev
                      ? "border-border text-on-surface hover:bg-surface-overlay"
                      : "border-border text-muted pointer-events-none opacity-40",
                  ].join(" ")}
                >
                  ← Previous
                </Link>

                <span className="font-sans text-sm text-muted">
                  Page {currentPage} of {author.totalPages}
                </span>

                <Link
                  href={hasNext ? `/authors/${id}?page=${currentPage + 1}` : "#"}
                  aria-disabled={!hasNext}
                  className={[
                    "font-sans text-sm px-4 py-2 rounded border transition-colors",
                    hasNext
                      ? "border-border text-on-surface hover:bg-surface-overlay"
                      : "border-border text-muted pointer-events-none opacity-40",
                  ].join(" ")}
                >
                  Next →
                </Link>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
