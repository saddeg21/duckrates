import { redirect, notFound } from "next/navigation";
import { getSessionId, getUserId } from "@lib/session";
import { getMe } from "@lib/api/users";
import { ProfileCard } from "@components/dashboard/ProfileCard";
import { PasswordCard } from "@components/dashboard/PasswordCard";

type Props = { params: Promise<{ id: string }> };

export default async function UserPage({ params }: Props) {
  const { id } = await params;
  const [sessionId, currentUserId] = await Promise.all([getSessionId(), getUserId()]);

  if (!sessionId) redirect("/login");
  if (id !== currentUserId) notFound();

  let user;
  try {
    user = await getMe(sessionId);
  } catch {
    notFound();
  }

  return (
    <div className="p-6 lg:p-10 max-w-[var(--width-content-navbar)] mx-auto overflow-y-auto flex-1">
      <div className="mb-8">
        <h1 className="font-serif font-normal text-2xl text-on-surface leading-tight">
          My Profile
        </h1>
        <p className="font-sans text-sm text-muted mt-0.5">
          Manage your account details.
        </p>
      </div>

      <div className="space-y-6">
        <ProfileCard user={user} />
        <PasswordCard />
      </div>
    </div>
  );
}
