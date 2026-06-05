import type { Metadata } from "next";

export const siteConfig = {
  name: "Brandistri",
  shortName: "Brandistri",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://brandistri.com",
  description:
    "Brandistri helps businesses build powerful brand identities, modern websites, and digital growth systems.",
  ogImage: "/assets/og-image.jpg",
  twitter: "@brandistri",
  email: "mashab@brandistri.com",
  founded: "2021",
  sameAs: [
    "https://instagram.com/brandistri",
    "https://linkedin.com/company/brandistri",
    "https://behance.net/brandistri",
    "https://x.com/brandistri",
  ],
};

export type BuildMetadataInput = {
  title: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
  tags?: string[];
};

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  ogImage = siteConfig.ogImage,
  noIndex = false,
  type = "website",
  publishedTime,
  authors,
  tags,
}: BuildMetadataInput): Metadata {
  const fullTitle = title.includes(siteConfig.name)
    ? title
    : `${title} | ${siteConfig.name}`;
  const url = absoluteUrl(path);
  const image = ogImage.startsWith("http") ? ogImage : absoluteUrl(ogImage);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
      ...(publishedTime && type === "article" ? { publishedTime } : {}),
      ...(authors && type === "article" ? { authors } : {}),
      ...(tags && type === "article" ? { tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: siteConfig.twitter,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${siteConfig.url}${path === "/" ? "" : path}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/assets/logo.png"),
    foundingDate: siteConfig.founded,
    sameAs: siteConfig.sameAs,
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: siteConfig.email,
        contactType: "customer support",
        availableLanguage: ["English"],
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function articleJsonLd({
  title,
  description,
  path,
  publishedTime,
  author,
  image,
  tags,
}: {
  title: string;
  description: string;
  path: string;
  publishedTime: string;
  author: string;
  image?: string;
  tags?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    image: image
      ? image.startsWith("http")
        ? image
        : absoluteUrl(image)
      : absoluteUrl(siteConfig.ogImage),
    datePublished: publishedTime,
    dateModified: publishedTime,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/assets/logo.png"),
      },
    },
    ...(tags && tags.length ? { keywords: tags.join(", ") } : {}),
  };
}

