import { redirect } from "next/navigation";
import { getSessionId } from "@lib/session";
import { createPostAction } from "@lib/actions/post.actions";
import PostEditor from "@components/PostEditor";

export default async function NewPostPage() {
  const sessionId = await getSessionId();
  if (!sessionId) redirect("/login");

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-surface">
      <PostEditor action={createPostAction} />
    </div>
  );
}
