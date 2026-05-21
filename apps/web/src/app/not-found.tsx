import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@components/navbar/Navbar"
import { NotFoundScene } from "@components/scenes/NotFoundScene"

export const metadata: Metadata = {
    title: "Not found — Project Euphrat",
    description: "This page doesn't exist. Head back to the archive.",
    robots: { index: false, follow: false },
}

export default function NotFound() {
    return (
        <div className="min-h-dvh flex flex-col">
            <Navbar/>
            <main className="flex-1 min-h-0 flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4 py-4">
                <NotFoundScene
                    className="max-w-[min(420px,40vh)]"
                    color="#CF5C36"
                />
                <section className="flex flex-col items-center gap-2 sm:gap-3 text-center max-w-prose">
                    <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-display">
                        Uppss! Lost in the crumbs?
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-muted">
                        Let&rsquo;s get you back home.
                    </p>
                </section>
                <Link
                    href="/"
                    className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-medium text-surface no-underline hover:bg-accent-hover hover:no-underline"
                >
                    Take me home
                </Link>
            </main>
        </div>
    )
}
