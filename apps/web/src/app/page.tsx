import { Navbar } from "@components/navbar/Navbar";
import { getPublicPosts } from "@lib/api/posts";
import { PostCard } from "@components/PostCard";
import { BannerPost } from "@components/BannerPost";
import { HeroText } from "@components/HeroText";
import {
  ScrollReveal,
  ScrollRevealStagger,
  ScrollRevealItem,
} from "@components/ScrollReveal";
import { DuckScene } from "@components/DuckScene";
import { PhilosopherScene } from "@components/PhilosopherScene";
import { Footer } from "@components/Footer";
import { ArchiveLink } from "@components/ArchiveLink";

export default async function HomePage() {
  const posts = await getPublicPosts().catch(() => []);
  const [featured, ...rest] = posts;
  const sidebarPosts = rest.slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="max-w-[var(--width-content)] mx-auto px-4 sm:px-8 py-10 sm:py-20">
        <HeroText />
        <DuckScene className="my-20" />
        <BannerPost/>
        <ScrollReveal>
          <div className="w-full flex justify-between items-end mb-4">
            <h1 className="font-serif font-bold text-[2rem] text-on-surface leading-tight m-0">
              Latest Essays
            </h1>
            <div className="hidden md:block">
              <ArchiveLink />
            </div>
          </div>
        </ScrollReveal>
        
        {posts.length === 0 ? (
          <p className="text-muted font-sans text-xl">No essays published yet.</p>
        ) : (
          <>
            <ScrollRevealStagger className="md:hidden border-t border-border pt-8">
              {posts.map((post, i) => (
                <ScrollRevealItem key={post.id}>
                  <PostCard post={post} variant={i === 0 ? "featured" : "compact"} />
                  {i < posts.length - 1 && <div className="h-px bg-border mb-6" />}
                </ScrollRevealItem>
              ))}
            </ScrollRevealStagger>

            <div className="hidden md:grid grid-cols-[3fr_2fr] gap-0 items-start border-t border-border pt-12">
              <ScrollReveal className="pr-14 border-r border-border">
                {featured && <PostCard post={featured} variant="featured" />}
              </ScrollReveal>
              {sidebarPosts.length > 0 && (
                <ScrollRevealStagger className="flex flex-col gap-7 pl-14">
                  {sidebarPosts.map((post) => (
                    <ScrollRevealItem key={post.id}>
                      <PostCard post={post} variant="compact" />
                    </ScrollRevealItem>
                  ))}
                </ScrollRevealStagger>
              )}
            </div>
            <div className="w-full flex md:hidden justify-center pt-8 border-t border-border mt-2">
              <ArchiveLink />
            </div>
          </>
        )}

      </main>
      <Footer/>
    </>
  );
}
