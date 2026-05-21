import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@components/navbar/Navbar";
import { getPublicArchive } from "@lib/api/posts";
import { PostCard } from "@components/PostCard";
import { Footer } from "@components/Footer";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

const PAGE_SIZE = 10;

export default async function ArchivePage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const result = await getPublicArchive(page, PAGE_SIZE).catch(() => null);

  if (!result) {
    return (
      <>
        <Navbar />
        <main className="max-w-[var(--width-content)] mx-auto px-4 sm:px-8 py-10 sm:py-20">
          <p className="text-muted font-sans text-xl">
            Failed to load the archive. Please try again.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  if (result.total > 0 && page > result.totalPages) notFound();

  const { posts, totalPages, total } = result;

  return (
    <>
      <Navbar />
      <main className="max-w-[var(--width-content)] mx-auto px-4 sm:px-8 py-10 sm:py-20">
        <header className="border-b border-border pb-6 mb-10">
          <h1 className="font-serif font-bold text-[2.5rem] sm:text-[3rem] text-on-surface leading-tight m-0 mb-2">
            The Archive
          </h1>
          <p className="font-sans text-sm text-muted m-0">
            {total === 0
              ? "No essays published yet."
              : `${total} ${total === 1 ? "essay" : "essays"} · Page ${page} of ${totalPages}`}
          </p>
        </header>

        {posts.length > 0 && (
          <div className="flex flex-col">
            {posts.map((post, i) => (
              <div key={post.id}>
                <div className="py-7">
                  <PostCard post={post} variant="compact" />
                </div>
                {i < posts.length - 1 && <div className="h-px bg-border" />}
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} />
        )}
      </main>
      <Footer />
    </>
  );
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const prevHref = page - 1 === 1 ? "/archive" : `/archive?page=${page - 1}`;
  const nextHref = `/archive?page=${page + 1}`;

  return (
    <nav
      aria-label="Archive pagination"
      className="flex items-center justify-between border-t border-border mt-10 pt-8"
    >
      {hasPrev ? (
        <Link
          href={prevHref}
          className="group inline-flex items-center gap-2 font-serif font-semibold text-[1.05rem] text-accent no-underline hover:text-[var(--accent-hover)]"
        >
          <span
            aria-hidden
            className="inline-block transition-transform duration-200 group-hover:-translate-x-1"
          >
            ←
          </span>
          <span>Newer</span>
        </Link>
      ) : (
        <span className="font-serif text-[1.05rem] text-muted opacity-50">
          ← Newer
        </span>
      )}

      <span className="font-sans text-sm text-muted">
        {page} / {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={nextHref}
          className="group inline-flex items-center gap-2 font-serif font-semibold text-[1.05rem] text-accent no-underline hover:text-[var(--accent-hover)]"
        >
          <span>Older</span>
          <span
            aria-hidden
            className="inline-block transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      ) : (
        <span className="font-serif text-[1.05rem] text-muted opacity-50">
          Older →
        </span>
      )}
    </nav>
  );
}
