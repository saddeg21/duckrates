type Status = "draft" | "published" | "archived" | "scheduled";

const CONFIG: Record<Status, { label: string; classes: string }> = {
  draft: {
    label: "Draft",
    classes: "bg-surface-overlay text-muted",
  },
  published: {
    label: "Published",
    classes: "bg-success/10 text-success",
  },
  scheduled: {
    label: "Scheduled",
    classes: "bg-info/10 text-info",
  },
  archived: {
    label: "Archived",
    classes: "bg-surface-overlay text-muted line-through",
  },
};

export function PostStatusBadge({ status }: { status: Status }) {
  const cfg = CONFIG[status] ?? CONFIG.draft;
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded text-xs font-sans font-medium tracking-wide ${cfg.classes}`}
    >
      {cfg.label}
    </span>
  );
}
