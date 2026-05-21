import { redirect } from "next/navigation";
import { getSessionId } from "@lib/session";
import { getDashboardPosts } from "@lib/api/posts";
import Link from "next/link";
import { PostStatusBadge } from "@components/dashboard/PostStatusBadge";
import { CategoryBadgeList } from "@components/CategoryBadge";

type Status = "draft" | "published" | "archived" | "scheduled";

const STATUS_FILTERS: { label: string; value: Status | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Archived", value: "archived" },
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const sessionId = await getSessionId();
  if (!sessionId) redirect("/login");

  const { status, page } = await searchParams;
  const activeFilter = (status ?? "all") as Status | "all";
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const result = await getDashboardPosts(
    sessionId,
    currentPage,
    activeFilter === "all" ? undefined : activeFilter,
  ).catch(() => ({ posts: [], page: 1, totalPages: 1, total: 0, statusCounts: {} as Record<string, number> }));

  const totalAll = Object.values(result.statusCounts).reduce((a, b) => a + b, 0);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < result.totalPages;

  function filterHref(f: Status | "all", p = 1) {
    const params = new URLSearchParams();
    if (f !== "all") params.set("status", f);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/dashboard${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="flex-1 overflow-y-auto">
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif font-normal text-2xl text-on-surface leading-tight">
            Posts
          </h1>
          <p className="font-sans text-sm text-muted mt-0.5">
            {totalAll} total &middot; {result.statusCounts["draft"] ?? 0} drafts
          </p>
        </div>
        <Link
          href="/dashboard/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-surface font-sans text-sm rounded hover:bg-accent-hover transition-colors no-underline"
        >
          <span>✦</span> New Post
        </Link>
      </div>

      <div className="flex gap-1 mb-6 border-b border-border">
        {STATUS_FILTERS.map((f) => (
          <Link
            key={f.value}
            href={filterHref(f.value)}
            className={[
              "px-4 py-2 font-sans text-sm border-b-2 -mb-px transition-colors no-underline",
              activeFilter === f.value
                ? "border-accent text-accent font-medium"
                : "border-transparent text-muted hover:text-on-surface",
            ].join(" ")}
          >
            {f.label}
            {f.value !== "all" && (result.statusCounts[f.value] ?? 0) > 0 && (
              <span className="ml-1.5 text-xs">
                ({result.statusCounts[f.value]})
              </span>
            )}
          </Link>
        ))}
      </div>

      {result.posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-serif text-on-surface text-lg mb-2">No posts here yet.</p>
          <p className="font-sans text-sm text-muted">
            {activeFilter === "all" ? (
              <>Start writing — <Link href="/dashboard/posts/new">create your first post</Link>.</>
            ) : (
              <>No {activeFilter} posts found.</>
            )}
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-md border border-border overflow-hidden">
            <div className="grid grid-cols-[1fr_8rem_9rem] bg-surface-low border-b border-border">
              <div className="px-5 py-3 font-sans font-medium text-muted tracking-wide text-xs uppercase">Title</div>
              <div className="px-5 py-3 font-sans font-medium text-muted tracking-wide text-xs uppercase">Status</div>
              <div className="px-5 py-3 font-sans font-medium text-muted tracking-wide text-xs uppercase hidden sm:block">Updated</div>
            </div>
            {result.posts.map((post, i) => (
              <div
                key={post.id}
                className={[
                  "grid grid-cols-[1fr_8rem_9rem] h-14 items-center border-b border-border last:border-0 transition-colors",
                  i % 2 === 0 ? "bg-surface" : "bg-surface/60",
                  "hover:bg-surface-low",
                ].join(" ")}
              >
                <div className="px-5 flex items-center gap-3 min-w-0 overflow-hidden">
                  <Link
                    href={`/dashboard/posts/${post.id}`}
                    className="font-sans text-sm text-on-surface font-medium hover:text-accent transition-colors no-underline truncate min-w-0"
                  >
                    {post.title || <span className="text-muted italic">Untitled</span>}
                  </Link>
                  {post.categories.length > 0 && (
                    <div className="shrink-0">
                      <CategoryBadgeList categories={post.categories} />
                    </div>
                  )}
                </div>
                <div className="px-5">
                  <PostStatusBadge status={post.status as Status} />
                </div>
                <div className="px-5 font-sans text-sm text-muted hidden sm:block">
                  {new Date(post.updatedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>

          {result.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <Link
                href={hasPrev ? filterHref(activeFilter, currentPage - 1) : "#"}
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
                Page {currentPage} of {result.totalPages}
              </span>
              <Link
                href={hasNext ? filterHref(activeFilter, currentPage + 1) : "#"}
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
    </div>
    </div>
  );
}
