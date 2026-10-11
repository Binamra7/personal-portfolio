/**
 * Every piece of copy, link and project on the site lives in this file.
 * Components only render what is here — edit this file to change content.
 * Keep sentences short: visitors skim, they don't read paragraphs.
 */

export type SocialLink = {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "x";
};

export type Project = {
  /** URL-safe id, also used for anchors and test ids. */
  slug: string;
  title: string;
  /** One sentence. Shown under the title. */
  summary: string;
  /** Path under /public. 16:9 screenshots crop best (top-anchored). */
  image: string;
  imageAlt: string;
  stack: string[];
  sourceUrl: string;
  /** Omit when there is no live demo. */
  liveUrl?: string;
};

export type SkillGroup = {
  label: string;
  items: string[];
};

export type Milestone = {
  year: string;
  text: string;
};

export const profile = {
  name: "Binamra Khadka",
  firstName: "Binamra",
  initials: "BK",
  role: "Full-stack developer",
  location: "Nepal",
  headline: "I build web apps end to end.",
  intro: "Clean interfaces up front. Solid APIs behind them.",
  email: "binamra7khadka6@gmail.com",
  phone: { display: "+977 986 932 7496", href: "tel:+9779869327496" },
  /** Set to a /public path (e.g. "/resume.pdf") to show a résumé link. */
  resumeUrl: null as string | null,
} as const;

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/binamra7", icon: "github" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/binamra-khadka-1502a3209/",
    icon: "linkedin",
  },
  { label: "X", href: "https://x.com/whobinam", icon: "x" },
];

export const navItems = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;

export const projects: Project[] = [
  {
    slug: "sleekstore",
    title: "SleekStore",
    summary: "A full-stack store with search, filters, accounts and a cart.",
    image: "/projects/sleekstore.webp",
    imageAlt:
      "SleekStore product listing with search, sort and category filters",
    stack: ["React", "Redux", "Node", "Express", "MongoDB"],
    sourceUrl: "https://github.com/binamra7/mern-ecommerce",
    liveUrl: "https://sleekstore.vercel.app/",
  },
  {
    slug: "bug-reporter",
    title: "Bug Reporter",
    summary: "Log bugs, sort them by severity, and track them to resolved.",
    image: "/projects/bug-reporter.webp",
    imageAlt: "Bug Reporter dashboard listing active bugs by severity",
    stack: ["React", "Node", "Express", "MongoDB"],
    sourceUrl: "https://github.com/binamra7/bugReporter",
    liveUrl: "https://bug-reporter-virid.vercel.app/",
  },
  {
    slug: "weather-app",
    title: "Weather App",
    summary: "Live conditions for any city, powered by OpenWeatherMap.",
    image: "/projects/weather-app.webp",
    imageAlt: "Weather App showing 69°F and clouds in New York",
    stack: ["React", "OpenWeatherMap API"],
    sourceUrl: "https://github.com/binamra7/weather-app",
    liveUrl: "https://weather-app-topaz-xi.vercel.app/",
  },
  {
    slug: "filmstop",
    title: "FilmStop",
    summary:
      "Pick your top five films and see what the community ranks highest.",
    image: "/projects/filmstop.webp",
    imageAlt: "FilmStop page showing the audience's highest rated movie",
    stack: ["React", "Redux", "Node", "Express", "MongoDB"],
    sourceUrl: "https://github.com/binamra7/filmstop",
  },
];

export const about = {
  lines: [
    "I like turning rough ideas into things people can actually use.",
    "Most of my work is JavaScript, from React on the client to Node on the server.",
  ],
  milestones: [
    { year: "2019", text: "Wrote my first lines of code" },
    { year: "2020", text: "Fell into web development" },
    { year: "2021", text: "Shipping full-stack projects" },
  ] satisfies Milestone[],
};

export const skills: SkillGroup[] = [
  { label: "Languages", items: ["JavaScript", "C / C++", "HTML", "CSS"] },
  { label: "Frontend", items: ["React", "Redux", "Next.js"] },
  { label: "Backend", items: ["Node.js", "Express", "MongoDB"] },
  { label: "Design", items: ["Figma", "Photoshop"] },
];
