import NextImage from "next/image";
import type { PublicPost } from "@lib/api/posts";
import { CategoryBadgeList } from "@components/CategoryBadge";

type Props = { post: PublicPost };

export function ListPostElement({ post }: Props) {
  const date = new Date(post.publishedAt).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <a
      href={`/posts/${post.id}`}
      className="group grid grid-cols-1 sm:grid-cols-[320px_1fr] gap-6 py-8 border-b border-border last:border-b-0 no-underline"
    >
      {post.coverImageKey && (
        <div className="relative aspect-[16/9] overflow-hidden rounded-sm">
          <NextImage
            src={post.coverImageKey}
            alt=""
            fill
            unoptimized
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
            sizes="(min-width: 640px) 320px, 100vw"
          />
        </div>
      )}

      <div className="flex flex-col justify-between min-w-0">
        <div>
          <p className="font-sans text-sm text-muted mb-2">
            <span className="font-medium text-accent">{post.authorName}</span>
            {post.authorName && <span className="mx-2">·</span>}
            <time dateTime={post.publishedAt}>{date}</time>
          </p>

          <h2 className="font-serif font-bold text-2xl leading-snug text-on-surface group-hover:text-accent transition-colors m-0 mb-2">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="font-sans text-base text-muted leading-relaxed line-clamp-2 m-0">
              {post.excerpt}
            </p>
          )}
        </div>

        {post.categories?.length > 0 && (
          <div className="mt-3">
            <CategoryBadgeList categories={post.categories} />
          </div>
        )}
      </div>
    </a>
  );
}
