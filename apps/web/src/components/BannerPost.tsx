import NextImage from "next/image";
import { getRandomFeaturedPost } from "@lib/api/posts";

export async function BannerPost() {
  const post = await getRandomFeaturedPost().catch(() => null);

  if (!post || !post.coverImageKey) return null;

  return (
    <a href={`/posts/${post.id}`} className="group relative hidden sm:block w-full sm:h-[480px] lg:h-[640px] overflow-hidden mb-10 sm:mb-16 rounded-sm">
      <NextImage
        src={post.coverImageKey}
        alt={post.title}
        fill
        unoptimized
        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-5 sm:p-8 lg:p-10 max-w-xs sm:max-w-xl lg:max-w-2xl">
        {post.excerpt && (
          <p className="hidden sm:block font-sans text-xs sm:text-sm text-white/70 uppercase tracking-widest mb-3 line-clamp-2">
            {post.excerpt}
          </p>
        )}
        <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight text-white group-hover:text-white/90 m-0">
          {post.title}
        </h2>
      </div>
    </a>
  );
}
