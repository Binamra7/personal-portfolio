import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-5 md:px-8">
      <p className="font-mono text-xs tracking-widest text-accent uppercase">
        404
      </p>
      <h1 className="mt-4 text-5xl font-medium tracking-tight md:text-7xl">
        Nothing here.
      </h1>
      <Link
        href="/"
        className="mt-8 text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
      >
        ← Back home
      </Link>
    </main>
  );
}
