"use client";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { EuphratLogo } from "@components/EuphratLogo";
import { POST_CATEGORIES, displayCategory } from "@lib/categories";

const categories = [...POST_CATEGORIES];

export function Navbar() {
  const COLOR = "#CF5C36";
  const [open, setOpen] = useState(false);

  const { scrollY } = useScroll();
  const textX = useTransform(scrollY, [0, 80], [0, -32]);
  const textOpacity = useTransform(scrollY, [0, 80], [1, 0]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav className="sticky top-0 z-20 bg-nav-bg ">
        <div className="max-w-[var(--width-content-navbar)] mt-4 mx-auto px-4 sm:px-8 flex items-center justify-between h-[4.5em]">
          <a className="flex items-center gap-0 no-underline hover:scale-105 transition-transform duration-200 hover:scale-101" href="/">
            <EuphratLogo size={48} />
            <motion.span
              className="font-serif font-bold text-on-surface text-xl tracking-[0.04em] ml-2 whitespace-nowrap select-none will-change-[transform,opacity]"
              style={{ x: textX, opacity: textOpacity, color: COLOR }}
            >
              DUCKRATES
            </motion.span>
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-6 font-serif font-semibold text-lg">
              {categories.map((category) => (
                <li
                  key={category}
                  className="group relative hover:text-accent transition-colors cursor-pointer">
                  <a href={`/posts/category/${category}`} className="relative inline-block px-1 no-underline">
                    {displayCategory(category)}
                    <span className="pointer-events-none absolute left-0 -bottom-1 h-[2px] w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
            <a className="font-serif bg-accent text-white px-3 py-2 font-bold tracking-wide rounded-md hover:bg-accent-hover cursor-pointer no-underline">
              Stories
            </a>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="relative w-7 h-[20px] z-30"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span
                className="absolute left-0 right-0 h-[2px] bg-on-surface origin-center"
                style={{
                  top: open ? "9px" : "0px",
                  transform: open ? "rotate(45deg)" : "rotate(0deg)",
                  transition: open
                    ? "top 0.2s ease, transform 0.2s ease 0.2s"
                    : "transform 0.2s ease, top 0.2s ease 0.2s",
                }}
              />
              <span
                className="absolute left-0 right-0 h-[2px] bg-on-surface origin-center"
                style={{
                  top: "9px",
                  opacity: open ? 0 : 1,
                  transition: "opacity 0.15s ease",
                }}
              />
              <span
                className="absolute left-0 right-0 h-[2px] bg-on-surface origin-center"
                style={{
                  top: open ? "9px" : "18px",
                  transform: open ? "rotate(-45deg)" : "rotate(0deg)",
                  transition: open
                    ? "top 0.2s ease, transform 0.2s ease 0.2s"
                    : "transform 0.2s ease, top 0.2s ease 0.2s",
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-10 md:hidden flex flex-col bg-surface transition-all duration-300 ease-in-out
          ${open ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-4"}`}
      >
        <div className="h-[4.5em] shrink-0" />

        <div className="flex flex-col justify-between flex-1 px-8 py-12">
          <ul className="flex flex-col">
            {categories.map((category, i) => (
              <li key={category}>
                {i > 0 && <hr className="border-border" />}
                <a
                  href={`/posts/category/${category}`}
                  className="block font-serif font-bold text-[2rem] text-on-surface hover:text-accent transition-colors cursor-pointer py-5"
                  onClick={() => setOpen(false)}
                >
                  {displayCategory(category)}
                </a>
              </li>
            ))}
          </ul>

          <a
            className="font-serif bg-accent text-white px-5 py-3 font-bold tracking-wide rounded-sm hover:bg-accent-hover cursor-pointer text-center text-lg"
            onClick={() => setOpen(false)}
          >
            Stories
          </a>
        </div>
      </div>
    </>
  );
}
