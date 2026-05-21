import { registerAction } from "@lib/actions/auth.actions";
import { EuphratLogo } from "@components/EuphratLogo";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <a href="/" className="inline-flex justify-center no-underline">
            <EuphratLogo size={36} />
          </a>
        </div>

        <div className="bg-surface-low border border-border rounded-md p-8">
          <h1 className="font-serif font-normal text-xl text-on-surface mb-6 text-center">Create account</h1>
          <form action={registerAction as unknown as (fd: FormData) => Promise<void>} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="font-sans text-sm text-muted">Name</label>
              <input
                id="name" name="name" type="text" required
                className="w-full px-3 py-2 bg-surface border border-border rounded font-sans text-sm text-on-surface outline-none focus:border-accent transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-sans text-sm text-muted">Email</label>
              <input
                id="email" name="email" type="email" required
                className="w-full px-3 py-2 bg-surface border border-border rounded font-sans text-sm text-on-surface outline-none focus:border-accent transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="font-sans text-sm text-muted">Password</label>
              <input
                id="password" name="password" type="password" required minLength={8}
                className="w-full px-3 py-2 bg-surface border border-border rounded font-sans text-sm text-on-surface outline-none focus:border-accent transition-colors"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full py-2.5 bg-accent text-surface font-sans text-sm rounded hover:bg-accent-hover transition-colors"
            >
              Register
            </button>
            <p className="text-center font-sans text-sm text-muted">
              Already have an account?{" "}
              <a href="/login" className="text-accent hover:underline">Sign in</a>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
