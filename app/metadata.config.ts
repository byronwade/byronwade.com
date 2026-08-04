import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com"),
  title: {
    template: "%s | Byron Wade",
    default: "Byron Wade — Software for Service Businesses",
  },
  description:
    "Full-stack developer and operator building products for service businesses. From a $2.4M plumbing company to Thorbis, Goodmarks, and modern Next.js apps.",
  applicationName: "Byron Wade Portfolio",
  authors: [{ name: "Byron Wade", url: "https://byronwade.com" }],
  generator: "Next.js",
  keywords: [
    "Full Stack Developer",
    "Service Business Software",
    "Field Service",
    "Web Development",
    "React Developer",
    "Next.js Developer",
    "Design Systems",
    "Thorbis",
    "Byron Wade",
    "Product Engineer",
    "Accessibility",
    "Web Performance",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Byron Wade",
  publisher: "Byron Wade",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "technology",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  // Icons are provided via the App Router file convention (app/icon.png, app/apple-icon.png)
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "en_GB",
    siteName: "Byron Wade",
    title: "Byron Wade — Software for Service Businesses",
    description:
      "Full-stack developer and operator building field-service products, design systems, and high-performance Next.js apps.",
    url: "https://byronwade.com",
    images: [
      {
        url: new URL(
          "/api/og?title=Byron Wade&description=Software for service businesses&type=website",
          process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com"
        ).toString(),
        width: 1200,
        height: 630,
        alt: "Byron Wade — Software for Service Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Byron Wade — Software for Service Businesses",
    description:
      "Full-stack developer and operator building field-service products, design systems, and high-performance Next.js apps.",
    creator: "@byron_c_wade",
    images: [
      new URL(
        "/api/og?title=Byron Wade&description=Software for service businesses&type=website",
        process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com"
      ).toString(),
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Byron Wade",
    statusBarStyle: "black-translucent",
  },
  other: {
    "msapplication-TileColor": "#000000",
    "theme-color": "#000000",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};
