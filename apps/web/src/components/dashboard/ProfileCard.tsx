"use client";

import { useActionState, useRef, useState } from "react";
import { updateProfileAction } from "@lib/actions/user.actions";
import { uploadMedia } from "@lib/api/media";
import type { CurrentUser } from "@lib/api/users";

export function ProfileCard({ user }: { user: CurrentUser }) {
  const [state, action, pending] = useActionState(updateProfileAction, undefined);
  const [avatarUrl, setAvatarUrl] = useState<string>(user.profilePic ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const { url } = await uploadMedia(file);
      setAvatarUrl(url);
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-md border border-border bg-surface-low p-6">
      <h2 className="font-serif font-normal text-lg text-on-surface mb-1">Profile</h2>
      <p className="font-sans text-sm text-muted mb-6">Update your name, email, and profile picture.</p>

      <form action={action} className="space-y-5">
        <div>
          <span className="block font-sans text-sm text-on-surface mb-2">Profile picture</span>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border border-border bg-surface overflow-hidden flex items-center justify-center shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-serif text-xl text-muted">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-1.5 border border-border font-sans text-sm text-on-surface rounded hover:bg-surface-overlay transition-colors disabled:opacity-50"
              >
                {uploading ? "Uploading…" : "Change photo"}
              </button>
              {uploadError && (
                <p className="font-sans text-xs text-red-500">{uploadError}</p>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <input type="hidden" name="profilePic" value={avatarUrl} />
        </div>

        <div>
          <label className="block font-sans text-sm text-on-surface mb-1.5" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={user.name}
            required
            minLength={2}
            className="w-full px-3 py-2 rounded border border-border bg-surface font-sans text-sm text-on-surface placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block font-sans text-sm text-on-surface mb-1.5" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={user.email}
            required
            className="w-full px-3 py-2 rounded border border-border bg-surface font-sans text-sm text-on-surface placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block font-sans text-sm text-on-surface mb-1.5" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            defaultValue={user.bio ?? ""}
            placeholder="A short description about yourself…"
            className="w-full px-3 py-2 rounded border border-border bg-surface font-sans text-sm text-on-surface placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent resize-none"
          />
        </div>

        {state?.error && (
          <p className="font-sans text-sm text-red-500">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending || uploading}
          className="px-4 py-2 bg-accent text-surface font-sans text-sm rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
