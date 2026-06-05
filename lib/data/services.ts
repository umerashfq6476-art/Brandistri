import {
  Layers,
  Target,
  Monitor,
  Share2,
  Video,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type Benefit = {
  title: string;
  description: string;
};

export type Service = {
  slug: string;
  title: string;
  iconName: "Layers" | "Target" | "Monitor" | "Share2" | "Video" | "Briefcase";
  tagline: string;
  summary: string;
  description: string;
  deliverables: string[];
  process: ProcessStep[];
  benefits: Benefit[];
  cta: string;
};

export const serviceIcons: Record<Service["iconName"], LucideIcon> = {
  Layers,
  Target,
  Monitor,
  Share2,
  Video,
  Briefcase,
};

export const services: Service[] = [
  {
    slug: "brand-identity",
    title: "Brand Identity & Visual Design",
    iconName: "Layers",
    tagline: "Where your brand becomes visual",
    summary:
      "Complete visual systems that define how your brand looks, feels, and communicates across every touchpoint.",
    description:
      "We create complete visual systems that define how your brand looks, feels, and communicates across every touchpoint. From the first logo sketch to the last social media template, every element is designed to feel intentional, premium, and unmistakably yours.",
    deliverables: [
      "Logo Design & Variations",
      "Visual Identity System",
      "Brand Style Guide",
      "Typography System",
      "Color Palette Development",
      "Social Media Brand Kit",
      "Brand Assets & Templates",
      "Packaging Direction",
    ],
    process: [
      {
        number: "01",
        title: "Discovery & Brand Audit",
        description:
          "We start by understanding your business, audience, and competitive landscape to define a clear creative direction.",
      },
      {
        number: "02",
        title: "Concept Exploration",
        description:
          "We develop multiple visual directions — sketches, type studies, and mood frames — before committing to a system.",
      },
      {
        number: "03",
        title: "Identity System Design",
        description:
          "We build out the full system: logo suite, typography, color, motion principles, and brand assets.",
      },
      {
        number: "04",
        title: "Guidelines & Handoff",
        description:
          "We deliver a complete brand book and an organized asset library so your team can apply the identity anywhere.",
      },
    ],
    benefits: [
      {
        title: "Instant Recognition",
        description:
          "A distinctive identity that customers remember after one glance — building trust through repeated exposure.",
      },
      {
        title: "Consistency at Scale",
        description:
          "A documented system that keeps your brand coherent across teams, platforms, and years of growth.",
      },
      {
        title: "Premium Perceived Value",
        description:
          "Considered design signals quality, which directly impacts pricing power and customer conversion.",
      },
    ],
    cta: "Start Brand Identity Project",
  },
  {
    slug: "brand-strategy",
    title: "Brand Strategy",
    iconName: "Target",
    tagline: "The thinking behind powerful brands",
    summary:
      "The strategic foundation every successful brand needs — defining who you are, who you serve, and how you win.",
    description:
      "We build the strategic foundation that every successful brand needs — defining who you are, who you serve, and how you win. Strategy is the upstream work that makes every creative decision easier, sharper, and more defensible.",
    deliverables: [
      "Brand Positioning",
      "Brand Messaging Framework",
      "Brand Voice & Tone Guide",
      "Audience Research & Personas",
      "Competitor Analysis",
      "Business Direction",
      "Brand Personality Development",
      "Naming & Tagline Support",
    ],
    process: [
      {
        number: "01",
        title: "Research & Insight",
        description:
          "We interview stakeholders, study your category, and map the audience to find the truths your brand can own.",
      },
      {
        number: "02",
        title: "Positioning Workshop",
        description:
          "We collaboratively define your unique position — the intersection of what you do best and what the market needs.",
      },
      {
        number: "03",
        title: "Messaging Framework",
        description:
          "We craft a hierarchy of messages — from one-line value prop to long-form narrative — that scale across channels.",
      },
      {
        number: "04",
        title: "Strategy Playbook",
        description:
          "We deliver a single source of truth: a playbook that aligns marketing, design, and product around one story.",
      },
    ],
    benefits: [
      {
        title: "Sharper Decision Making",
        description:
          "Strategy gives every team a filter for saying no, so creative work stays focused and on-brand.",
      },
      {
        title: "Differentiated Position",
        description:
          "A clear point of view that separates you from competitors and gives customers a reason to choose you.",
      },
      {
        title: "Compounding Brand Equity",
        description:
          "A consistent story told over time becomes the most valuable asset your business owns.",
      },
    ],
    cta: "Start Brand Strategy",
  },
  {
    slug: "web-design",
    title: "Web Design & Development",
    iconName: "Monitor",
    tagline: "Digital experiences that represent your brand",
    summary:
      "Websites that are beautiful, fast, and built to convert — fully aligned with your brand identity.",
    description:
      "We design and develop websites that are beautiful, fast, and built to convert — fully aligned with your brand identity. Every screen is engineered for performance, accessibility, and measurable business outcomes.",
    deliverables: [
      "Brand-Focused Website Design",
      "UI/UX Design",
      "Responsive Development",
      "Landing Page Design",
      "Portfolio Websites",
      "Business Websites",
      "Conversion Optimization",
      "SEO Foundation Setup",
    ],
    process: [
      {
        number: "01",
        title: "UX Architecture",
        description:
          "We map user journeys, define the information architecture, and sketch wireframes before any pixels are pushed.",
      },
      {
        number: "02",
        title: "Visual Design",
        description:
          "We layer your brand system onto the architecture — type, color, motion, imagery — for every breakpoint.",
      },
      {
        number: "03",
        title: "Development",
        description:
          "We build with modern frameworks like Next.js, optimized for Core Web Vitals, SEO, and analytics from day one.",
      },
      {
        number: "04",
        title: "Launch & Optimize",
        description:
          "We QA across devices, ship the launch, and set up the analytics needed to keep improving after go-live.",
      },
    ],
    benefits: [
      {
        title: "Higher Conversion Rates",
        description:
          "Clear UX paired with persuasive design turns more visitors into qualified leads and customers.",
      },
      {
        title: "Faster Load, Better SEO",
        description:
          "A performant, technically sound site climbs search rankings and reduces bounce on every channel.",
      },
      {
        title: "Easy to Maintain",
        description:
          "Component-based builds and clean handoff mean your team can ship updates without breaking anything.",
      },
    ],
    cta: "Start Web Project",
  },
  {
    slug: "social-media-branding",
    title: "Social Media Branding",
    iconName: "Share2",
    tagline: "Consistent identity across every platform",
    summary:
      "A complete social brand system so your content looks intentional, recognizable, and premium on every feed.",
    description:
      "We extend your brand identity into a complete social system — templates, layouts, and visual rules — so every post looks intentional, recognizable, and premium. Designed for teams that need to ship content fast without losing brand consistency.",
    deliverables: [
      "Social Media Brand System",
      "Instagram Branding Kit",
      "Content Visual Templates",
      "Profile & Cover Design",
      "Highlight Covers",
      "Post Design System",
      "Brand Consistency Guide",
      "Growth-Focused Strategy",
    ],
    process: [
      {
        number: "01",
        title: "Channel Audit",
        description:
          "We review your current social presence and competitor channels to find gaps and quick wins.",
      },
      {
        number: "02",
        title: "Visual System Design",
        description:
          "We build a modular template library — grids, layouts, and motion — that flexes across post types.",
      },
      {
        number: "03",
        title: "Content Playbook",
        description:
          "We define formats, voice, and posting rhythms so your team can produce on-brand content at scale.",
      },
      {
        number: "04",
        title: "Rollout & Training",
        description:
          "We hand off editable files, document the system, and train your team to keep the brand consistent.",
      },
    ],
    benefits: [
      {
        title: "Recognizable Feed",
        description:
          "A cohesive visual rhythm makes your profile stop the scroll and build follower trust faster.",
      },
      {
        title: "Faster Content Production",
        description:
          "Templates remove decision fatigue so your team ships more posts in less time, without sacrificing quality.",
      },
      {
        title: "Stronger Growth Signals",
        description:
          "Consistent branding paired with strategic formats increases reach, saves, and follower conversion.",
      },
    ],
    cta: "Start Social Branding",
  },
  {
    slug: "video-content",
    title: "Video Editing & Content",
    iconName: "Video",
    tagline: "Cinematic content that connects and converts",
    summary:
      "Brand-led video and motion content that earns attention, communicates clearly, and drives action.",
    description:
      "We produce cinematic video and motion content that connects emotionally and converts strategically — from launch films to scroll-stopping reels. Every cut is built around a clear narrative and a clear call to action.",
    deliverables: [
      "Brand Videos",
      "Promotional Videos",
      "Social Media Reels",
      "Motion Graphics",
      "Product Showcase Videos",
      "Brand Story Videos",
      "Short Form Content",
      "Visual Campaign Content",
    ],
    process: [
      {
        number: "01",
        title: "Concept & Script",
        description:
          "We define the story, hook, and call to action before any frame is shot or edited.",
      },
      {
        number: "02",
        title: "Production & Assets",
        description:
          "We source footage, design motion elements, and prepare brand-aligned visual assets for the edit.",
      },
      {
        number: "03",
        title: "Editing & Sound",
        description:
          "We cut, grade, score, and mix — building rhythm and emotion into every second of the final piece.",
      },
      {
        number: "04",
        title: "Versioning & Delivery",
        description:
          "We export tailored cuts for every channel — vertical, square, horizontal — ready to publish.",
      },
    ],
    benefits: [
      {
        title: "Emotional Connection",
        description:
          "Video communicates personality and feeling faster than any other medium, building deeper brand affinity.",
      },
      {
        title: "Higher Engagement",
        description:
          "Well-crafted motion content outperforms static formats on every platform's algorithm.",
      },
      {
        title: "Versatile Asset Library",
        description:
          "One shoot, many cuts — we maximize the value of every production with multi-channel deliverables.",
      },
    ],
    cta: "Start Video Project",
  },
  {
    slug: "business-branding",
    title: "Business Branding Solutions",
    iconName: "Briefcase",
    tagline: "Full brand systems for growing businesses",
    summary:
      "End-to-end brand systems for startups, rebrands, and businesses ready to scale with confidence.",
    description:
      "We deliver end-to-end branding solutions for startups launching, established businesses rebranding, and companies preparing to scale. One studio, one team, one cohesive brand system — strategy through execution.",
    deliverables: [
      "Startup Branding Package",
      "Rebranding Services",
      "Business Identity System",
      "Launch Brand Strategy",
      "Customer Experience Direction",
      "Digital Brand Presence",
      "Brand Scaling Systems",
    ],
    process: [
      {
        number: "01",
        title: "Brand Diagnosis",
        description:
          "We assess where your brand is today — strategy, design, presence — and define what success looks like.",
      },
      {
        number: "02",
        title: "Strategy & Direction",
        description:
          "We align on positioning, audience, and the creative direction that will guide the entire build.",
      },
      {
        number: "03",
        title: "System Build",
        description:
          "We design and produce every required asset: identity, web, content, and customer-facing touchpoints.",
      },
      {
        number: "04",
        title: "Launch & Scale",
        description:
          "We support the rollout, train your team, and stay close to help the brand grow into its new system.",
      },
    ],
    benefits: [
      {
        title: "One Cohesive Brand",
        description:
          "Every touchpoint built under one strategy means no fragmented messaging or mismatched visuals.",
      },
      {
        title: "Faster Time to Market",
        description:
          "A single studio managing strategy, identity, and digital removes handoff friction and ships sooner.",
      },
      {
        title: "Scalable Foundation",
        description:
          "Systems and guidelines that grow with your business — from first launch to international expansion.",
      },
    ],
    cta: "Start Business Branding",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(slug: string, count = 3) {
  return services.filter((s) => s.slug !== slug).slice(0, count);
}
