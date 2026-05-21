import { Navbar } from "@components/navbar/Navbar";
import { ListPostElement } from "@components/list/ListPostElement";
import { getPostsByCategory } from "@lib/api/posts";
import { notFound } from "next/navigation";
import { CategoryScene } from "@components/scenes/CategoryScene";
import { displayCategory } from "@lib/categories";

type Props = {
    params: Promise<{ category: string }>;
    searchParams: Promise<{ page?: string }>;
};

export default async function CategoryPage({ params, searchParams }: Props) {
    const { category } = await params;
    const { page: pageParam } = await searchParams;
    const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

    let result;

    try {
        result = await getPostsByCategory(category, page);
    } catch {
        notFound();
    }

    const { posts, totalPages } = result;
    const displayName = displayCategory(category);

    return (
        <>
            <Navbar />
            <CategoryScene category={category} className="my-12" />
            <main className="max-w-[var(--width-content)] mx-auto px-4 sm:px-8 pt-14 pb-24">
                <h1 className="font-serif font-bold text-[clamp(2rem,5vw,3rem)] leading-[1.1] text-on-surface m-0 mb-5">
                    {displayName}
                </h1>
                <div>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <ListPostElement key={post.id} post={post} />
                        ))
                    ) : (
                        <p className="text-muted">No posts found in this category.</p>
                    )}
                </div>

                {totalPages > 1 && (
                    <nav aria-label="Pagination" className="flex items-center justify-center gap-4 mt-12 font-sans text-sm">
                        {page > 1 ? (
                            <a
                                href={`/posts/category/${category}?page=${page - 1}`}
                                className="px-4 py-2 border border-border rounded-sm text-on-surface hover:border-accent hover:text-accent transition-colors"
                            >
                                &larr; Previous
                            </a>
                        ) : (
                            <span className="px-4 py-2 border border-border rounded-sm text-muted cursor-not-allowed">
                                &larr; Previous
                            </span>
                        )}

                        <span className="text-muted">
                            Page {page} of {totalPages}
                        </span>

                        {page < totalPages ? (
                            <a
                                href={`/posts/category/${category}?page=${page + 1}`}
                                className="px-4 py-2 border border-border rounded-sm text-on-surface hover:border-accent hover:text-accent transition-colors"
                            >
                                Next &rarr;
                            </a>
                        ) : (
                            <span className="px-4 py-2 border border-border rounded-sm text-muted cursor-not-allowed">
                                Next &rarr;
                            </span>
                        )}
                    </nav>
                )}
            </main>
        </>
    );
}