/**
 * Absolute site URL, used for metadata, sitemap and Open Graph tags.
 * Set NEXT_PUBLIC_SITE_URL to a custom domain; otherwise Vercel's production
 * URL is used, falling back to localhost for local builds.
 */
type Env = Record<string, string | undefined>;

export function getSiteUrl(env: Env = process.env): string {
  if (env.NEXT_PUBLIC_SITE_URL)
    return env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}
