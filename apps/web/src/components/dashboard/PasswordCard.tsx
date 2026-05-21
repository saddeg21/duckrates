"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@lib/actions/user.actions";

export function PasswordCard() {
  const [state, action, pending] = useActionState(changePasswordAction, undefined);

  return (
    <div className="rounded-md border border-border bg-surface-low p-6">
      <h2 className="font-serif font-normal text-lg text-on-surface mb-1">Password</h2>
      <p className="font-sans text-sm text-muted mb-6">Change your account password.</p>

      <form action={action} className="space-y-4">
        <div>
          <label className="block font-sans text-sm text-on-surface mb-1.5" htmlFor="currentPassword">
            Current password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            required
            className="w-full px-3 py-2 rounded border border-border bg-surface font-sans text-sm text-on-surface placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block font-sans text-sm text-on-surface mb-1.5" htmlFor="newPassword">
            New password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            minLength={8}
            className="w-full px-3 py-2 rounded border border-border bg-surface font-sans text-sm text-on-surface placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block font-sans text-sm text-on-surface mb-1.5" htmlFor="confirmPassword">
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            className="w-full px-3 py-2 rounded border border-border bg-surface font-sans text-sm text-on-surface placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {state?.error && (
          <p className="font-sans text-sm text-red-500">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 bg-accent text-surface font-sans text-sm rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {pending ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
