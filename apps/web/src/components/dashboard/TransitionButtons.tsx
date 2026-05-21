"use client";

import { useTransition } from "react";
import {
  publishPostAction,
  archivePostAction,
  revertToDraftAction,
} from "@lib/actions/post.actions";

interface Props {
  id: string;
  status: string;
}

export function TransitionButtons({ id, status }: Props) {
  const [isPending, startTransition] = useTransition();

  function handle(action: (id: string) => Promise<unknown>) {
    startTransition(() => {
      action(id);
    });
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      {status === "draft" && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => handle(publishPostAction)}
          className="px-4 py-2 border border-accent text-accent font-sans text-sm rounded hover:bg-accent hover:text-surface transition-colors disabled:opacity-50"
        >
          Publish
        </button>
      )}

      {status === "scheduled" && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => handle(publishPostAction)}
          className="px-4 py-2 border border-accent text-accent font-sans text-sm rounded hover:bg-accent hover:text-surface transition-colors disabled:opacity-50"
        >
          Publish now
        </button>
      )}

      {status === "published" && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => handle(archivePostAction)}
          className="px-4 py-2 font-sans text-sm text-muted hover:text-on-surface transition-colors disabled:opacity-50"
        >
          Archive
        </button>
      )}

      {status === "scheduled" && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => handle(revertToDraftAction)}
          className="px-4 py-2 font-sans text-sm text-muted hover:text-on-surface transition-colors disabled:opacity-50"
        >
          Revert to draft
        </button>
      )}

      {status === "archived" && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => handle(revertToDraftAction)}
          className="px-4 py-2 border border-border text-muted font-sans text-sm rounded hover:text-on-surface hover:border-on-surface transition-colors disabled:opacity-50"
        >
          Revert to draft
        </button>
      )}
    </div>
  );
}
