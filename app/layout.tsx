import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getCachedSiteSettings } from "@/lib/settings-server";

const siteUrl = "https://brandistri.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Brandistri — Strategic Branding & Creative Studio",
    template: "%s · Brandistri",
  },
  description:
    "Brandistri helps businesses build powerful brand identities, modern websites, and digital growth systems.",
  keywords: [
    "branding agency",
    "visual identity",
    "web design",
    "brand strategy",
    "creative studio",
    "logo design",
    "digital growth",
  ],
  applicationName: "Brandistri",
  authors: [{ name: "Brandistri Studio" }],
  creator: "Brandistri",
  publisher: "Brandistri",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Brandistri",
    title: "Brandistri — Strategic Branding & Creative Studio",
    description:
      "Brandistri helps businesses build powerful brand identities, modern websites, and digital growth systems.",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Brandistri — Strategic Branding & Creative Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brandistri — Strategic Branding & Creative Studio",
    description:
      "Brandistri helps businesses build powerful brand identities, modern websites, and digital growth systems.",
    images: ["/assets/og-image.jpg"],
    creator: "@brandistri",
  },
  robots: {
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

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getCachedSiteSettings();

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,700&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-text-primary font-sans antialiased">
        <Navbar logoUrl={settings.business.logoUrl} />
        <main className="flex-1">{children}</main>
        <Footer contactEmail={settings.business.contactEmail} />
      </body>
    </html>
  );
}
