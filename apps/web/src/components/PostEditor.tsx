"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Markdown } from "tiptap-markdown";
import { useRef, useState } from "react";
import NextImage from "next/image";
import { resolveContentImages } from "@lib/utils/resolveContentImages";
import { uploadMedia } from "@lib/api/media";
import { POST_CATEGORIES, displayCategory, type PostCategory } from "@lib/categories";

type Props = {
  action: (formData: FormData) => Promise<{ error: string } | { updatedAt: string } | void>;
  initialTitle?: string;
  initialContent?: string;
  initialCategories?: PostCategory[];
  saveLabel?: string;
  statusBadge?: React.ReactNode;
  initialSavedAt?: string;
  transitionActions?: React.ReactNode;
  postId?: string;
  initialCoverImageKey?: string | null;
};

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        "flex items-center justify-center w-8 h-8 rounded text-sm font-sans transition-colors active:scale-90",
        active
          ? "bg-surface-overlay text-on-surface"
          : "text-muted hover:bg-surface-overlay hover:text-on-surface",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-border mx-1 self-center" />;
}

function Toolbar({ editor, onImageInsert }: { editor: Editor; onImageInsert: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-border bg-surface-low">
      <ToolbarButton
        title="Heading 1 (Ctrl+Alt+1)"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </ToolbarButton>
      <ToolbarButton
        title="Heading 2 (Ctrl+Alt+2)"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        title="Heading 3 (Ctrl+Alt+3)"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Bold (Ctrl+B)"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        title="Italic (Ctrl+I)"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        title="Underline (Ctrl+U)"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <span className="underline">U</span>
      </ToolbarButton>
      <ToolbarButton
        title="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <span className="line-through">S</span>
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        ≡
      </ToolbarButton>
      <ToolbarButton
        title="Ordered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1≡
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        ❝
      </ToolbarButton>
      <ToolbarButton
        title="Code block"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        {"</>"}
      </ToolbarButton>
      <ToolbarButton
        title="Horizontal rule"
        active={false}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        ─
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Insert image"
        active={false}
        onClick={onImageInsert}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Undo (Ctrl+Z)"
        active={false}
        onClick={() => editor.chain().focus().undo().run()}
      >
        ↺
      </ToolbarButton>
      <ToolbarButton
        title="Redo (Ctrl+Shift+Z)"
        active={false}
        onClick={() => editor.chain().focus().redo().run()}
      >
        ↻
      </ToolbarButton>
    </div>
  );
}

export default function PostEditor({
  action,
  initialTitle = "",
  initialContent,
  initialCategories = [],
  saveLabel = "Save draft",
  statusBadge,
  initialSavedAt,
  transitionActions,
  initialCoverImageKey = null,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(initialSavedAt ?? null);
  const [saving, setSaving] = useState(false);
  const [coverKey, setCoverKey] = useState<string | null>(initialCoverImageKey);
  const [uploading, setUploading] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [categories, setCategories] = useState<PostCategory[]>(initialCategories);

  function toggleCategory(cat: PostCategory) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Markdown.configure({
        html: false,          // gelen HTML'yi kabul etme
        transformPastedText: true,  // yapıştırılan metni markdown olarak parse et
        transformCopiedText: false,
      }),
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content: initialContent ? JSON.parse(initialContent) : "",
    editorProps: {
      attributes: {
        class: "editor-prose outline-none min-h-[420px] px-10 py-8 font-serif text-on-surface",
      },
    },
  });

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setCoverError(null);
    try {
      const { url } = await uploadMedia(file);
      setCoverKey(url);
    } catch {
      setCoverError("Upload failed.");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editor || !formRef.current) return;

    setSaving(true);
    setError(null);

    const formData = new FormData(formRef.current);
    if (coverKey !== null) formData.set("coverImageKey", coverKey);
    formData.set("categories", JSON.stringify(categories));
    const resolved = await resolveContentImages(editor.getJSON(), uploadMedia);
    formData.set("content", JSON.stringify(resolved));

    const result = await action(formData);
    if (result !== undefined && "error" in result) {
      setError(result.error);
    } else if (result !== undefined && "updatedAt" in result) {
      setSavedAt(result.updatedAt as string);
    }
    setSaving(false);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between px-6 py-2.5 border-b border-border bg-surface-low shrink-0 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {statusBadge}
          {savedAt && (
            <span className="font-sans text-xs text-muted hidden sm:block">
              Last saved {new Date(savedAt).toLocaleString("en-GB", {
                day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
              })}
            </span>
          )}
        </div>

        {!savedAt && (
          <span className="font-sans font-bold text-sm text-muted">
            NEW POST
          </span>
        )}

        <div className="flex items-center gap-2 shrink-0">
          {transitionActions}
          {transitionActions && (
            <div className="w-px h-5 bg-border mx-1" />
          )}
          <a
            href="/dashboard"
            className="px-3 py-1.5 font-sans text-sm text-muted hover:text-on-surface transition-colors no-underline"
          >
            Cancel
          </a>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-1.5 bg-accent text-surface font-sans text-sm rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : saveLabel}
          </button>
        </div>
      </div>

      <div className="shrink-0 px-12 pt-6 pb-2 bg-surface-low">
        <div className="max-w-xl mx-auto">
          <p className="font-sans text-xs text-muted uppercase tracking-widest mb-2">Cover image</p>

          {coverKey ? (
            <div className="relative w-full aspect-[16/9] rounded overflow-hidden border border-border group">
              <NextImage
                src={coverKey}
                alt="Cover"
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 320px) 6 0vw, 320px"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end justify-end p-3 gap-2 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-3 py-1.5 bg-surface/90 font-sans text-xs text-on-surface rounded hover:bg-surface transition-colors disabled:opacity-50"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => setCoverKey(null)}
                  className="px-3 py-1.5 bg-surface/90 font-sans text-xs text-on-surface rounded hover:bg-surface transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full aspect-[16/9] flex flex-col items-center justify-center gap-2 rounded border border-dashed border-border hover:border-accent hover:bg-surface transition-colors disabled:opacity-50 group"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin text-muted" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  <span className="font-sans text-sm text-muted">Uploading…</span>
                </>
              ) : (
                <>
                  <svg className="text-muted group-hover:text-accent transition-colors" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="font-sans text-sm text-muted group-hover:text-on-surface transition-colors">
                    Click to add a cover image
                  </span>
                  <span className="font-sans text-xs text-muted/70">
                    JPG, PNG or WebP · 16:9 recommended · max 5 MB
                  </span>
                </>
              )}
            </button>
          )}

          {coverError && (
            <p className="mt-1.5 font-sans text-xs text-red-500">{coverError}</p>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleCoverChange}
        />
      </div>

      <div className="px-12 pt-10 pb-6 bg-surface-low shrink-0">
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={initialTitle}
          placeholder="Untitled"
          className="w-full bg-transparent font-serif text-4xl text-on-surface placeholder-border outline-none leading-tight tracking-tight border-b-2 border-border focus:border-accent pb-3 transition-colors"
        />
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="font-sans text-xs text-muted uppercase tracking-widest">Categories</span>
          {POST_CATEGORIES.map((cat) => {
            const active = categories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={[
                  "px-3 py-1 rounded-full font-sans text-xs transition-colors border",
                  active
                    ? "bg-accent text-surface border-accent"
                    : "bg-transparent text-muted border-border hover:border-accent hover:text-on-surface",
                ].join(" ")}
              >
                {displayCategory(cat)}
              </button>
            );
          })}
        </div>
      </div>

      {editor && (
        <div className="flex flex-col flex-1 min-h-0 bg-surface border-t border-border">
          <div className="shrink-0 border-b border-border">
            <Toolbar editor={editor} onImageInsert={() => imageInputRef.current?.click()} />
          </div>
          <div
            className="flex-1 overflow-y-auto cursor-text"
            onClick={() => editor.commands.focus()}
          >
            <EditorContent editor={editor} />
            {error && (
              <p className="px-12 pb-4 font-sans text-sm text-accent">{error}</p>
            )}
          </div>
        </div>
      )}

      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file || !editor) return;
          const blobUrl = URL.createObjectURL(file);
          editor.chain().focus().setImage({ src: blobUrl }).run();
          if (imageInputRef.current) imageInputRef.current.value = "";
        }}
      />

      <input type="hidden" name="content" />
    </form>
  );
}
