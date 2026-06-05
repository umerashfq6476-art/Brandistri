export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  date: string;
  tags: string[];
};

export const posts: Post[] = [
  {
    slug: "what-makes-a-brand-system-last",
    title: "What makes a brand system actually last",
    excerpt:
      "Most identities don't fail at launch — they fail in the third year, when the original team is gone and the rules get foggy.",
    body:
      "The brands that age well share three traits: a defensible visual idea, a writing voice their team can recreate without a stylist, and guidelines short enough to actually be read. We'll break down each.",
    author: "Mira Patel",
    date: "2026-04-12",
    tags: ["branding", "systems"],
  },
  {
    slug: "designing-for-the-first-five-seconds",
    title: "Designing for the first five seconds",
    excerpt:
      "Above-the-fold is a tired phrase, but the underlying truth — that the first impression decides whether the rest gets read — is still doing the work.",
    body:
      "We look at three landing pages we shipped this year and what made the opening frame work: a single visual idea, a verb-led headline, and one obvious next step.",
    author: "Jonas Reed",
    date: "2026-03-02",
    tags: ["web", "conversion"],
  },
  {
    slug: "how-we-name-things",
    title: "How we name things",
    excerpt:
      "Naming is the hardest cheap deliverable. A short, true-feeling name can outlast every other thing the studio makes.",
    body:
      "Our naming process: divergent generation, sound and shape filtering, a small trademark pass, and a one-day team vote. We'll share the templates we use.",
    author: "Mira Patel",
    date: "2026-01-20",
    tags: ["naming", "process"],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
