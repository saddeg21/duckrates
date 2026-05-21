import NextImage from "next/image";
import type { PublicPost } from "@lib/api/posts";
import { CategoryBadgeList } from "@components/CategoryBadge";

type Props = {
  post: PublicPost;
  variant: "featured" | "compact";
};

function MobileCard({ post }: { post: PublicPost }) {
  const date = new Date(post.publishedAt).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <a href={`/posts/${post.id}`} className="group block pb-5 no-underline">
      {post.coverImageKey && (
        <div className="relative w-full aspect-[16/9] overflow-hidden mb-4 rounded-sm">
          <NextImage
            src={post.coverImageKey}
            alt={post.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-[1.015] transition-transform duration-300"
            sizes="100vw"
          />
        </div>
      )}
      <p className="font-sans text-xs text-muted mb-2">
        <span className="font-medium text-accent hover:underline">{post.authorName}</span>
        {post.authorName && <span className="mx-2">·</span>}
        {date}
      </p>
      <h2 className="font-serif font-bold text-[1.3rem] leading-snug text-on-surface group-hover:text-accent m-0 mb-2">
        {post.title}
      </h2>
      {post.excerpt && (
        <p className="font-sans text-sm text-muted leading-relaxed line-clamp-3 m-0">
          {post.excerpt}
        </p>
      )}
      {post.categories?.length > 0 && (
        <div className="mt-3">
          <CategoryBadgeList categories={post.categories} />
        </div>
      )}
    </a>
  );
}

export function PostCard({ post, variant }: Props) {
  const date = new Date(post.publishedAt).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (variant === "featured") {
    return (
      <>
        <div className="md:hidden">
          <MobileCard post={post} />
        </div>

        <a href={`/posts/${post.id}`} className="hidden md:block group no-underline title-underline">
          {post.coverImageKey && (
            <div className="relative w-full aspect-video overflow-hidden mb-8">
              <NextImage
                src={post.coverImageKey}
                alt={post.title}
                fill
                unoptimized
                className="object-cover group-hover:scale-[1.015] transition-transform duration-500"
                sizes="66vw"
                priority
              />
            </div>
          )}
          <div className="grid grid-cols-[1fr_1fr] items-start gap-10">
            <h2 className="font-serif font-bold text-[3rem] leading-[1.15] text-on-surface group-hover:text-accent m-0">
              {post.title}
            </h2>
            <div className="pt-1">
              <p className="font-sans text-sm text-muted mb-3">
                {post.authorName && (
                  <span className="font-medium text-accent hover:underline">{post.authorName}</span>
                )}
                {post.authorName && <span className="mx-2">·</span>}
                {date}
              </p>
              {post.excerpt && (
                <p className="font-sans text-base text-on-surface leading-relaxed line-clamp-4">
                  {post.excerpt}
                </p>
              )}
              {post.categories?.length > 0 && (
                <div className="mt-3">
                  <CategoryBadgeList categories={post.categories} />
                </div>
              )}
            </div>
          </div>
        </a>
      </>
    );
  }

  return (
    <>
      <div className="md:hidden">
        <MobileCard post={post} />
      </div>

      <a
        href={`/posts/${post.id}`}
        className="hidden md:block group border-b border-border pb-7 last:border-0 last:pb-0 no-underline"
      >
        <p className="font-sans text-sm text-muted mb-2">
          <span className="text-accent font-medium">{post.authorName}</span>
          <span className="mx-2">·</span>
          {date}
        </p>
        <h3 className="font-serif font-bold text-[1.6rem] leading-snug text-on-surface group-hover:text-accent m-0 mb-2 line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="font-sans text-base text-muted leading-relaxed line-clamp-3 m-0">
            {post.excerpt}
          </p>
        )}
        {post.categories?.length > 0 && (
          <div className="mt-2">
            <CategoryBadgeList categories={post.categories} />
          </div>
        )}
      </a>
    </>
  );
}
