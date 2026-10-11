/**
 * Every piece of copy, link and project on the site lives in this file.
 * Components only render what is here — edit this file to change content.
 * Keep sentences short: visitors skim, they don't read paragraphs.
 * Source of truth for facts: the résumé in /public.
 */

export type SocialLink = {
  label: string;
  href: string;
  icon: "github" | "linkedin";
};

export type Stat = {
  /** Number the counter lands on. */
  to: number;
  /** Number the counter starts from (default 0). */
  from?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export type Project = {
  /** URL-safe id, also used for anchors and test ids. */
  slug: string;
  title: string;
  /** One sentence, ≤ 90 characters. */
  summary: string;
  stack: string[];
  /** Omit for private code. */
  sourceUrl?: string;
  /** Omit when there is no live demo. */
  liveUrl?: string;
  /** Screenshot under /public. Projects without one need a `visual`. */
  image?: { src: string; alt: string };
  /** Built-in illustration for projects without a screenshot. */
  visual?: "rag-terminal";
};

export type Role = {
  period: string;
  title: string;
  company: string;
  place: string;
  /** Two or three short lines. */
  highlights: string[];
};

export type ToolGroup = {
  label: string;
  items: string[];
};

export const profile = {
  name: "Binamra Khadka",
  initials: "bk",
  role: "Full-stack software engineer",
  city: "Kathmandu",
  country: "Nepal",
  timeZone: "Asia/Kathmandu",
  email: "binamra7khadka6@gmail.com",
  phone: { display: "+977 986 932 7496", href: "tel:+9779869327496" },
  /** Set to null to hide the résumé links. */
  resumeUrl: "/binamra-khadka-resume.pdf" as string | null,
} as const;

/** The giant hero statement. Each entry is one line; `accent` lines are highlighted. */
export const heroLines: { text: string; accent?: boolean }[] = [
  { text: "I build fast," },
  { text: "real-time & AI", accent: true },
  { text: "web products." },
];

export const heroIntro =
  "Software developer at Bajra Technologies. Rails, Next.js and LLM tooling, from database to UI.";

export const stats: Stat[] = [
  { to: 500, suffix: "M+", label: "rows migrated, zero data lost" },
  {
    from: 3.2,
    to: 1.2,
    decimals: 1,
    suffix: "s",
    label: "API response, down from 3.2s",
  },
  { to: 1000, suffix: "+", label: "AI conversations handled daily" },
  { to: 15, suffix: "+", label: "MCP tools written" },
];

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/binamra7", icon: "github" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/binamra7",
    icon: "linkedin",
  },
];

export const navItems: { label: string; href: string; desktopOnly?: boolean }[] = [
  { label: "Work", href: "#work" },
  { label: "Career", href: "#career" },
  // Hidden in the dock on small screens to keep it on one line.
  { label: "Education", href: "#education", desktopOnly: true },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

/** Shown large, one after another. */
export const featuredProjects: Project[] = [
  {
    slug: "sleekstore",
    title: "SleekStore",
    summary: "A full-stack store with Stripe checkout, accounts and an admin panel.",
    stack: ["React", "Redux", "Node", "Express", "MongoDB", "Stripe"],
    sourceUrl: "https://github.com/binamra7/mern-ecommerce",
    liveUrl: "https://sleekstore.vercel.app/",
    image: {
      src: "/projects/sleekstore.webp",
      alt: "SleekStore product listing with search, sort and category filters",
    },
  },
  {
    slug: "rag-assistant",
    title: "Local RAG Assistant",
    summary: "Ask questions of 10,000+ note chunks. Every answer cites its source.",
    stack: ["Python", "MCP", "LangChain", "Vector DB"],
    visual: "rag-terminal",
  },
];

/** Older work, shown as a compact list with hover previews. */
export const archiveProjects: Project[] = [
  {
    slug: "bug-reporter",
    title: "Bug Reporter",
    summary: "Log bugs, sort them by severity, and track them to resolved.",
    stack: ["React", "Node", "MongoDB"],
    sourceUrl: "https://github.com/binamra7/bugReporter",
    // Demo frontend (bug-reporter-virid.vercel.app) is up, but its Heroku API is gone.
    // Restore `liveUrl` once the API is redeployed.
    image: {
      src: "/projects/bug-reporter.webp",
      alt: "Bug Reporter dashboard listing active bugs by severity",
    },
  },
  {
    slug: "filmstop",
    title: "FilmStop",
    summary: "Pick your top five films and see what the community ranks highest.",
    stack: ["React", "Redux", "Express"],
    sourceUrl: "https://github.com/binamra7/Filmstop",
    // Demo frontend (filmstop.vercel.app) is up, but its Heroku API is gone.
    // Restore `liveUrl` once the API is redeployed.
    image: {
      src: "/projects/filmstop.webp",
      alt: "FilmStop page showing the audience's highest rated movie",
    },
  },
  {
    slug: "weather-app",
    title: "Weather App",
    summary: "Live conditions for any city, powered by OpenWeatherMap.",
    stack: ["React", "OpenWeatherMap"],
    sourceUrl: "https://github.com/binamra7/weather-app",
    liveUrl: "https://weather-app-topaz-xi.vercel.app/",
    image: {
      src: "/projects/weather-app.webp",
      alt: "Weather App showing 69°F and clouds",
    },
  },
];

export const career: Role[] = [
  {
    period: "2025 — Now",
    title: "Software Developer",
    company: "Bajra Technologies",
    place: "Kathmandu",
    highlights: [
      "Building Bajra AI: an omni-channel inbox and AI call center.",
      "MCP clients and servers, plus RAG over company knowledge.",
      "Led a 500M-row migration with near-zero downtime.",
    ],
  },
  {
    period: "2025",
    title: "Ruby on Rails Trainee",
    company: "Bajra Technologies",
    place: "Kathmandu",
    highlights: [
      "REST APIs for a game-hosting platform.",
      "Ran the backend as Docker microservices.",
    ],
  },
  {
    period: "2022 — 2023",
    title: "Full Stack Developer Intern",
    company: "LineupAppQ",
    place: "Remote",
    highlights: [
      "Kept a 1,000+ user app fast and stable.",
      "Shipped features on 5+ third-party APIs and WebSockets.",
      "Mentored three junior interns.",
    ],
  },
];

export type Education = {
  period: string;
  degree: string;
  field: string;
  school: string;
  university: string;
  place: string;
};

export const education: Education[] = [
  {
    period: "2021 — 2025",
    degree: "B.Sc. CSIT",
    field: "Computer Science & Information Technology",
    school: "Trinity College",
    university: "Tribhuvan University",
    place: "Kathmandu",
  },
];

export const toolkit: ToolGroup[] = [
  { label: "Languages", items: ["TypeScript", "Ruby", "Python", "SQL"] },
  {
    label: "Frameworks",
    items: ["Rails", "Next.js", "React", "Node", "Fastify"],
  },
  { label: "AI & real-time", items: ["RAG", "MCP", "LangChain", "WebSockets"] },
  { label: "Data", items: ["PostgreSQL", "Redis", "MongoDB", "Prisma"] },
  {
    label: "Ops",
    items: ["Docker", "Kubernetes", "Sidekiq", "GitHub Actions"],
  },
];
