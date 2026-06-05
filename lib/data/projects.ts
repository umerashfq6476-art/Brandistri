export type Metric = {
  value: string;
  label: string;
  description: string;
};

export type StrategyPoint = {
  iconName: "Compass" | "Sparkles" | "LayoutGrid" | "Rocket" | "Wand2" | "Eye";
  title: string;
  description: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: number;
  duration: string;
  category:
    | "Brand Identity"
    | "Web Design"
    | "Social Branding"
    | "Video Content"
    | "Brand Strategy";
  description: string;
  tags: string[];
  featured: boolean;
  imageUrl: string;
  color: string;
  cover: string;
  summary: string;
  story: string;
  services: string[];
  challenge: string;
  solution: string;
  strategy: StrategyPoint[];
  palette: { name: string; hex: string }[];
  typography: { display: string; body: string };
  results: string;
  metrics: Metric[];
  testimonial: Testimonial | null;
  /** Optional gallery image URLs (from Supabase Storage). */
  gallery?: string[];
};

export const projectCategories = [
  "All Projects",
  "Brand Identity",
  "Web Design",
  "Social Branding",
  "Video Content",
  "Brand Strategy",
] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export const projects: Project[] = [
  {
    id: "01",
    slug: "nova-brand-identity",
    title: "Nova — Brand Identity",
    client: "Nova Tech Solutions",
    year: 2024,
    duration: "8 weeks",
    category: "Brand Identity",
    description:
      "Complete brand identity system for a modern tech startup entering the AI productivity space.",
    tags: ["Logo Design", "Visual Identity", "Brand Guide"],
    featured: true,
    imageUrl: "linear-gradient(135deg, #6366F1 0%, #1A1A1A 100%)",
    color: "#6366F1",
    cover: "/assets/projects/nova-cover.jpg",
    summary:
      "Complete brand identity system for a modern tech startup entering the AI productivity space.",
    story:
      "Nova came to us pre-Series A with a working product but no story. We rebuilt the system from the wordmark out — confident geometry, a single accent color, and a typographic frame that earns its space across product, marketing, and pitch.",
    services: ["brand-identity", "brand-strategy"],
    challenge:
      "Nova needed a brand that felt innovative and trustworthy at the same time. Their early identity leaned generic-tech: blue gradients, soft icons, no point of view. As they scaled toward enterprise, the brand was actively losing them deals against more confident competitors.",
    solution:
      "We created a bold, minimal identity system anchored by a geometric wordmark and a single high-contrast accent. Every touchpoint — from product UI to investor decks — was built on the same typographic grid, so the brand reads as one company instead of three.",
    strategy: [
      {
        iconName: "Compass",
        title: "Positioning audit",
        description:
          "We mapped the AI productivity space and found a clear seat: the calm, considered alternative to the loud market leaders.",
      },
      {
        iconName: "Sparkles",
        title: "Identity system",
        description:
          "A custom wordmark, restrained palette, and a type system tuned for both dense UI and large display moments.",
      },
      {
        iconName: "LayoutGrid",
        title: "Applied guidelines",
        description:
          "A 60-page brand book covering tone, layout, motion, and the dozens of real-world artifacts the team ships every week.",
      },
    ],
    palette: [
      { name: "Indigo", hex: "#6366F1" },
      { name: "Ink", hex: "#0A0A0A" },
      { name: "Cloud", hex: "#F4F4F5" },
      { name: "Lime", hex: "#ADFF2F" },
    ],
    typography: { display: "Clash Display", body: "Satoshi" },
    results: "Brand recognition increased by 80% post-launch.",
    metrics: [
      {
        value: "+80%",
        label: "Brand recognition",
        description: "Unaided recall in their target enterprise segment.",
      },
      {
        value: "3.2x",
        label: "Inbound demos",
        description: "From the website in the first 90 days post-launch.",
      },
      {
        value: "$18M",
        label: "Series A",
        description: "Closed four months after the new brand shipped.",
      },
    ],
    testimonial: {
      quote:
        "The new identity didn't just change how we look — it changed how seriously the market takes us. Sales cycles got shorter the week we shipped it.",
      author: "Maya Okafor",
      role: "Co-founder & CEO, Nova",
    },
  },
  {
    id: "02",
    slug: "vertex-web-design",
    title: "Vertex — Web Design",
    client: "Vertex Robotics",
    year: 2025,
    duration: "10 weeks",
    category: "Web Design",
    description:
      "Marketing site and product configurator for an industrial robotics platform.",
    tags: ["Web Design", "UI/UX", "Motion"],
    featured: true,
    imageUrl: "linear-gradient(135deg, #ADFF2F 0%, #111111 100%)",
    color: "#ADFF2F",
    cover: "/assets/projects/vertex-cover.jpg",
    summary:
      "Marketing site and product configurator for an industrial robotics platform.",
    story:
      "Vertex needed a marketing site that could carry technical depth without burying the reader. We designed a system that opens with a clear promise, then lets engineers drill down through interactive specs at their own pace.",
    services: ["web-design", "brand-identity"],
    challenge:
      "Vertex sells complex industrial robotics into a buying committee that includes both procurement leads and floor engineers. The old site spoke to neither — it was a brochure for executives that engineers bounced from in seconds.",
    solution:
      "A single-page-feel site with a quiet executive top and a dense, interactive engineering bottom. A live configurator lets buyers spec a unit and walk away with a quote — no email gate, no sales call required.",
    strategy: [
      {
        iconName: "Eye",
        title: "Two-audience IA",
        description:
          "An information architecture that respects the executive scan and the engineering deep-dive without compromising either.",
      },
      {
        iconName: "LayoutGrid",
        title: "Interactive configurator",
        description:
          "A real-time spec builder backed by their product database — buyers see price and lead time the moment they click.",
      },
      {
        iconName: "Rocket",
        title: "Performance first",
        description:
          "Hard budget: 1.5s LCP on factory-floor 4G. We built every animation around that constraint.",
      },
    ],
    palette: [
      { name: "Signal", hex: "#ADFF2F" },
      { name: "Carbon", hex: "#111111" },
      { name: "Steel", hex: "#3F3F46" },
      { name: "Bone", hex: "#F4F4F5" },
    ],
    typography: { display: "Clash Display", body: "Satoshi" },
    results: "Configurator drives 60% of qualified pipeline.",
    metrics: [
      {
        value: "+140%",
        label: "Qualified leads",
        description: "Month-over-month after launch, sourced from the site.",
      },
      {
        value: "1.2s",
        label: "LCP on 4G",
        description: "Measured on the configurator route, below the 1.5s budget.",
      },
      {
        value: "60%",
        label: "Of pipeline",
        description: "Now originates from a self-serve configurator session.",
      },
    ],
    testimonial: {
      quote:
        "Our engineers used to bounce off the old site in twelve seconds. Now they're spending eight minutes in the configurator and showing up to calls already sold.",
      author: "Daniel Reyes",
      role: "Head of Growth, Vertex",
    },
  },
  {
    id: "03",
    slug: "pulse-social-branding",
    title: "Pulse — Social Branding",
    client: "Pulse Fitness",
    year: 2024,
    duration: "12 weeks (ongoing)",
    category: "Social Branding",
    description:
      "Always-on social system for a boutique fitness studio chain — templates, content cadence, and a recognizable visual language.",
    tags: ["Social Strategy", "Content", "Templates"],
    featured: true,
    imageUrl: "linear-gradient(135deg, #FF6B35 0%, #1A1A1A 100%)",
    color: "#FF6B35",
    cover: "/assets/projects/pulse-cover.jpg",
    summary:
      "Always-on social system for a boutique fitness chain — templates, cadence, and a recognizable visual language.",
    story:
      "Pulse was posting six times a week and nothing was sticking. We replaced the chaos with a calm template system, a tight three-format cadence, and a content engine the studio team can run on their own.",
    services: ["social-branding", "brand-strategy"],
    challenge:
      "Twelve studios, twelve managers, twelve different visual instincts — the Pulse feed looked like twelve different brands. Engagement was flat and the head office was burning out trying to police every post.",
    solution:
      "A single template kit covering the only three formats that actually drive results, plus a content calendar that any studio manager can execute without a designer. Strong enough to be recognizable, loose enough to feel local.",
    strategy: [
      {
        iconName: "LayoutGrid",
        title: "Three-format system",
        description:
          "We cut the formats from eleven to three. Class promo, member story, coach spotlight. Everything else gets a no.",
      },
      {
        iconName: "Wand2",
        title: "Studio-proof templates",
        description:
          "Figma templates with locked type and color, editable photo and copy. A manager can ship a post in four minutes.",
      },
      {
        iconName: "Sparkles",
        title: "Weekly content engine",
        description:
          "A two-hour Monday cadence that produces the full week's content for every studio. Built around what they're already doing.",
      },
    ],
    palette: [
      { name: "Pulse", hex: "#FF6B35" },
      { name: "Night", hex: "#0A0A0A" },
      { name: "Glow", hex: "#FFD8C2" },
      { name: "Bone", hex: "#F4F4F5" },
    ],
    typography: { display: "Clash Display", body: "Satoshi" },
    results: "Engagement up 4x, head office time on social cut in half.",
    metrics: [
      {
        value: "4.1x",
        label: "Engagement",
        description: "Average per-post engagement vs. the prior 90 days.",
      },
      {
        value: "-52%",
        label: "Production time",
        description: "Hours the head-office team spends on social per week.",
      },
      {
        value: "12",
        label: "Studios aligned",
        description: "Every location now ships on the same visual system.",
      },
    ],
    testimonial: {
      quote:
        "We stopped looking like twelve different gyms in a trench coat. The feed finally feels like Pulse — and the managers can actually run it.",
      author: "Sara Lindqvist",
      role: "Brand Director, Pulse",
    },
  },
  {
    id: "04",
    slug: "helix-video-content",
    title: "Helix — Video Content",
    client: "Helix Labs",
    year: 2025,
    duration: "6 weeks",
    category: "Video Content",
    description:
      "Launch film and short-form cut-down system for a biotech tools company.",
    tags: ["Video Production", "Motion Design", "Direction"],
    featured: false,
    imageUrl: "linear-gradient(135deg, #9333EA 0%, #111111 100%)",
    color: "#9333EA",
    cover: "/assets/projects/helix-cover.jpg",
    summary:
      "Launch film and short-form cut-down system for a biotech tools company.",
    story:
      "Helix was launching a category-defining lab tool and needed a film that respected the science without making viewers feel stupid. We wrote, directed, and edited a two-minute hero, then built a system to spin out a year of short-form from the same shoot.",
    services: ["video-content", "brand-strategy"],
    challenge:
      "Most biotech launches drown in jargon or oversimplify into condescension. Helix needed to land between — confident, plainspoken, and visually serious — and they needed assets that worked across LinkedIn, conferences, and the homepage.",
    solution:
      "A single three-day shoot with a tight script and an aggressive shot list, edited into one hero film and twelve short-form cuts. One production, twelve weeks of content runway.",
    strategy: [
      {
        iconName: "Eye",
        title: "Plainspoken script",
        description:
          "We wrote the narration the way a senior scientist actually talks to a peer — confident, specific, no marketing varnish.",
      },
      {
        iconName: "Wand2",
        title: "Modular shoot list",
        description:
          "Every shot was framed to crop cleanly to 9:16, 1:1, and 16:9 — one production fed every channel.",
      },
      {
        iconName: "Rocket",
        title: "Cut-down system",
        description:
          "Twelve short-form pieces built from the hero shoot, each with its own narrative spine, not just a chopped version of the long film.",
      },
    ],
    palette: [
      { name: "Helix", hex: "#9333EA" },
      { name: "Lab", hex: "#0A0A0A" },
      { name: "Strand", hex: "#E9D5FF" },
      { name: "Bone", hex: "#F4F4F5" },
    ],
    typography: { display: "Clash Display", body: "Satoshi" },
    results: "Hero film hit 1.8M plays. Twelve cut-downs powered a full quarter of social.",
    metrics: [
      {
        value: "1.8M",
        label: "Hero plays",
        description: "Across LinkedIn, YouTube, and the conference circuit.",
      },
      {
        value: "12",
        label: "Cut-downs",
        description: "Short-form pieces produced from a single three-day shoot.",
      },
      {
        value: "1 quarter",
        label: "Of runway",
        description: "Powered Helix's organic social without re-shooting once.",
      },
    ],
    testimonial: {
      quote:
        "We've never had a launch asset that scientists actually shared. The script respected our work and the film respected our viewers.",
      author: "Dr. Anna Pettersson",
      role: "VP Marketing, Helix Labs",
    },
  },
  {
    id: "05",
    slug: "atlas-brand-strategy",
    title: "Atlas — Brand Strategy",
    client: "Atlas Finance",
    year: 2024,
    duration: "10 weeks",
    category: "Brand Strategy",
    description:
      "Positioning, narrative, and messaging system for a consumer fintech preparing to enter a new market.",
    tags: ["Strategy", "Positioning", "Messaging"],
    featured: false,
    imageUrl: "linear-gradient(135deg, #06B6D4 0%, #1A1A1A 100%)",
    color: "#06B6D4",
    cover: "/assets/projects/atlas-cover.jpg",
    summary:
      "Positioning, narrative, and messaging system for a consumer fintech preparing to enter a new market.",
    story:
      "Atlas had a great product and a forgettable story. We rebuilt the narrative from first principles — who they're for, what they actually do, and why a sane person would switch banks for them.",
    services: ["brand-strategy", "brand-identity"],
    challenge:
      "Atlas was about to launch in a market with six aggressive incumbents and a buyer who's been pitched fintech a thousand times. Their existing messaging sounded like every other neobank: friendly, vague, and easy to ignore.",
    solution:
      "A positioning that picks a fight with the category, a narrative spine that survives outside the deck, and a messaging matrix that gives every team — product, sales, support — the same sentences in their pocket.",
    strategy: [
      {
        iconName: "Compass",
        title: "Category map",
        description:
          "We mapped the competitive set and found the angle nobody was willing to take. Then we made it Atlas's.",
      },
      {
        iconName: "Sparkles",
        title: "Narrative spine",
        description:
          "A single-page story the CEO can tell on a podcast, a sales rep can tell in a demo, and a support agent can tell in a ticket reply.",
      },
      {
        iconName: "LayoutGrid",
        title: "Messaging matrix",
        description:
          "Audience × message × proof. Sixty exact sentences the company can deploy without rewriting strategy every Tuesday.",
      },
    ],
    palette: [
      { name: "Atlas", hex: "#06B6D4" },
      { name: "Deep", hex: "#0A0A0A" },
      { name: "Mist", hex: "#A5F3FC" },
      { name: "Bone", hex: "#F4F4F5" },
    ],
    typography: { display: "Clash Display", body: "Satoshi" },
    results: "Closed Series A within six months of launch.",
    metrics: [
      {
        value: "6 mo",
        label: "To Series A",
        description: "From relaunch to a priced round at 4x the prior valuation.",
      },
      {
        value: "+92%",
        label: "Aided awareness",
        description: "In the target customer segment, six months post-launch.",
      },
      {
        value: "47%",
        label: "Lower CAC",
        description: "Paid acquisition cost dropped as the narrative did the lifting.",
      },
    ],
    testimonial: {
      quote:
        "Strategy is the one deliverable we still quote from a year later. Every team uses it. Every meeting starts from it.",
      author: "Jules Martin",
      role: "CMO, Atlas Finance",
    },
  },
  {
    id: "06",
    slug: "verdant-brand-identity",
    title: "Verdant — Brand Identity",
    client: "Verdant Skin",
    year: 2025,
    duration: "9 weeks",
    category: "Brand Identity",
    description:
      "Identity, packaging, and DTC site for an active-ingredients skincare brand.",
    tags: ["Identity", "Packaging", "E-commerce"],
    featured: false,
    imageUrl: "linear-gradient(135deg, #10B981 0%, #111111 100%)",
    color: "#10B981",
    cover: "/assets/projects/verdant-cover.jpg",
    summary:
      "Identity, packaging, and DTC site for an active-ingredients skincare brand.",
    story:
      "Verdant wanted to move past the soft, dreamy skincare cliché — and into a system that feels confident and clinical without going cold. We built an identity that earns the shelf and a DTC site that ships in two clicks.",
    services: ["brand-identity", "web-design"],
    challenge:
      "Active-ingredients skincare is a credibility market: serious customers don't trust pastel watercolor brands, but they bounce off lab-coat sterility too. Verdant needed to feel earned, clinical, and human at once.",
    solution:
      "A precise typographic system, a single saturated green, and packaging that treats the back of the bottle as the hero. The site reads like a product brief, not a catalog.",
    strategy: [
      {
        iconName: "Eye",
        title: "Ingredient-first design",
        description:
          "Concentration, pH, and clinical evidence get more pixels than founder photos. The customer rewards the honesty.",
      },
      {
        iconName: "LayoutGrid",
        title: "Modular packaging",
        description:
          "One bottle silhouette, one label grid, infinite SKUs. The line scales without a redesign every launch.",
      },
      {
        iconName: "Rocket",
        title: "Two-click DTC",
        description:
          "From product page to checkout in two interactions. No upsell carousels, no quiz funnel, no friction.",
      },
    ],
    palette: [
      { name: "Verdant", hex: "#10B981" },
      { name: "Soil", hex: "#0A0A0A" },
      { name: "Linen", hex: "#F4F4F5" },
      { name: "Glass", hex: "#A7F3D0" },
    ],
    typography: { display: "Clash Display", body: "Satoshi" },
    results: "$1.2M GMV in launch quarter.",
    metrics: [
      {
        value: "$1.2M",
        label: "Launch GMV",
        description: "First-quarter DTC revenue, 38% above their internal plan.",
      },
      {
        value: "3.4%",
        label: "Site conversion",
        description: "Well above the 1.8% category benchmark for skincare DTC.",
      },
      {
        value: "40+",
        label: "Retailers",
        description: "Picked up the line in the first six months on shelf.",
      },
    ],
    testimonial: {
      quote:
        "We finally look like the brand our chemistry deserves. The site is doing the job three salespeople used to do.",
      author: "Imogen Vance",
      role: "Founder, Verdant",
    },
  },
  {
    id: "07",
    slug: "kindred-web-design",
    title: "Kindred — Web Design",
    client: "Kindred Ventures",
    year: 2025,
    duration: "7 weeks",
    category: "Web Design",
    description:
      "Publishing-first marketing site for a venture studio backing early-stage founders.",
    tags: ["Web Design", "Editorial", "CMS"],
    featured: false,
    imageUrl: "linear-gradient(135deg, #F59E0B 0%, #111111 100%)",
    color: "#F59E0B",
    cover: "/assets/projects/kindred-cover.jpg",
    summary:
      "Publishing-first marketing site for a venture studio backing early-stage founders.",
    story:
      "Kindred didn't want a portfolio reel — they wanted an essay machine. We built a publishing-first site where long-form thinking is the front door and the portfolio is a quiet second tab.",
    services: ["web-design", "social-branding"],
    challenge:
      "Most venture studio sites look identical: hero portfolio grid, team page, tiny logo. Kindred competes on judgment, not deal flow, so the site needed to lead with thinking, not assets.",
    solution:
      "An editorial home page that surfaces three recent essays above the fold, a typographic system tuned for long reads, and a CMS the partners actually use because the writing surface is the same as the reading surface.",
    strategy: [
      {
        iconName: "Sparkles",
        title: "Essay as homepage",
        description:
          "The most recent piece of long-form is the hero. The portfolio is one click away, not in the user's face.",
      },
      {
        iconName: "LayoutGrid",
        title: "Reader-first type",
        description:
          "A 19px body size, generous measure, and a footnote system. Built for the kind of reader who finishes the piece.",
      },
      {
        iconName: "Wand2",
        title: "Writing-surface CMS",
        description:
          "Partners draft in the same view their readers see. Zero translation cost between thinking and shipping.",
      },
    ],
    palette: [
      { name: "Ember", hex: "#F59E0B" },
      { name: "Bind", hex: "#0A0A0A" },
      { name: "Paper", hex: "#FAFAF9" },
      { name: "Margin", hex: "#FCD34D" },
    ],
    typography: { display: "Clash Display", body: "Satoshi" },
    results: "3x inbound deal flow within the first quarter.",
    metrics: [
      {
        value: "3.1x",
        label: "Inbound deals",
        description: "Qualified founder intros vs. the prior quarter.",
      },
      {
        value: "8 min",
        label: "Avg read time",
        description: "On the home essay — well above the 1:20 industry median.",
      },
      {
        value: "14",
        label: "Essays shipped",
        description: "By the partners in the first 90 days. The CMS got used.",
      },
    ],
    testimonial: {
      quote:
        "The site changed who emails us. We're hearing from the founders we actually want to back, before they pitch anyone else.",
      author: "Mateo Aguirre",
      role: "Partner, Kindred",
    },
  },
  {
    id: "08",
    slug: "north-social-branding",
    title: "North — Social Branding",
    client: "North Coffee Co.",
    year: 2024,
    duration: "5 weeks",
    category: "Social Branding",
    description:
      "Social system and shelf-to-feed brand language for a specialty coffee roaster expanding nationally.",
    tags: ["Social", "Brand Extension", "Templates"],
    featured: false,
    imageUrl: "linear-gradient(135deg, #EF4444 0%, #1A1A1A 100%)",
    color: "#EF4444",
    cover: "/assets/projects/north-cover.jpg",
    summary:
      "Social system and shelf-to-feed brand language for a specialty coffee roaster expanding nationally.",
    story:
      "North had a packaging system everyone on Coffee Twitter loved and a social feed that looked nothing like it. We translated the shelf language into a feed system that scales across origins, drops, and a team of three people.",
    services: ["social-branding", "brand-identity"],
    challenge:
      "The packaging was the hero — sharp type, strong color, a real point of view. The Instagram was photos of latte art and a Canva sale graphic. The two looked like different companies, and the brand was leaking equity on every post.",
    solution:
      "A template system built directly from the bag — same grid, same type, same color discipline — and a content rhythm that ties feed posts to drops, origins, and the people behind them.",
    strategy: [
      {
        iconName: "Eye",
        title: "Shelf to feed",
        description:
          "We pulled the type grid off the bags and rebuilt it as a four-template Figma system. The brand finally reads as one thing.",
      },
      {
        iconName: "Compass",
        title: "Origin-led calendar",
        description:
          "Every week is anchored to a real coffee — a new drop, a farm visit, a roaster note. No filler, no calendar holes.",
      },
      {
        iconName: "Rocket",
        title: "Three-person workflow",
        description:
          "A workflow the head roaster, the shop manager, and the founder can run between them. No agency on retainer.",
      },
    ],
    palette: [
      { name: "Roast", hex: "#EF4444" },
      { name: "Bean", hex: "#0A0A0A" },
      { name: "Cream", hex: "#FEF2F2" },
      { name: "Bone", hex: "#F4F4F5" },
    ],
    typography: { display: "Clash Display", body: "Satoshi" },
    results: "Wholesale inbound up 5x. The feed finally looks like the bag.",
    metrics: [
      {
        value: "5.2x",
        label: "Wholesale inbound",
        description: "New retailer inquiries via Instagram in the first quarter.",
      },
      {
        value: "+38%",
        label: "Follower growth",
        description: "Quarter-over-quarter, with engagement holding flat per follower.",
      },
      {
        value: "0",
        label: "Canva posts",
        description: "Down from roughly twelve per month. The template system held.",
      },
    ],
    testimonial: {
      quote:
        "Customers told us the Instagram finally feels like the coffee. That sentence is worth the entire engagement.",
      author: "Eli Brennan",
      role: "Founder, North Coffee",
    },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx === -1) return null;
  return projects[(idx + 1) % projects.length];
}

export function getProjectsByCategory(category: ProjectCategory) {
  if (category === "All Projects") return projects;
  return projects.filter((p) => p.category === category);
}
