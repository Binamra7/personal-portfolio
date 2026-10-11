/** Soft accent glow. Position and size come from `className`. */
export function Glow({ className }: { className: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full bg-[radial-gradient(closest-side,rgb(244_167_59/0.12),transparent)] opacity-70 ${className}`}
    />
  );
}
