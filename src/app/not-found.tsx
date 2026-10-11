import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-5 md:px-8">
      <p className="font-mono text-accent text-xs uppercase tracking-widest">404</p>
      <h1 className="mt-4 font-medium text-5xl tracking-tight md:text-7xl">Nothing here.</h1>
      <Link
        href="/"
        className="mt-8 text-muted text-sm underline-offset-4 hover:text-fg hover:underline"
      >
        ← Back home
      </Link>
    </main>
  );
}
