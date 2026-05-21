import { redirect, notFound } from "next/navigation";
import { getSessionId } from "@lib/session";
import { getDashboardPost } from "@lib/api/posts";
import { updatePostAction } from "@lib/actions/post.actions";
import PostEditor from "@components/PostEditor";
import { PostStatusBadge } from "@components/dashboard/PostStatusBadge";
import { TransitionButtons } from "@components/dashboard/TransitionButtons";
import type { PostCategory } from "@lib/categories";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const sessionId = await getSessionId();
  if (!sessionId) redirect("/login");

  let post;
  try {
    post = await getDashboardPost(id, sessionId);
  } catch {
    notFound();
  }

  const boundUpdateAction = updatePostAction.bind(null, id);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <PostEditor
        action={boundUpdateAction}
        initialTitle={post.title}
        initialContent={JSON.stringify(post.content)}
        initialCategories={post.categories as PostCategory[]}
        saveLabel="Save"
        initialSavedAt={post.updatedAt}
        statusBadge={
          <PostStatusBadge status={post.status as "draft" | "published" | "archived" | "scheduled"} />
        }
        transitionActions={<TransitionButtons id={id} status={post.status} />}
        initialCoverImageKey={post.coverImageKey}
      />
    </div>
  );
}
