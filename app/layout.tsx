import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import AntdRegistry from "./AntdRegistry";
import "./globals.css";
// Tailwind utilities (preflight disabled — see app/tailwind.css) used by
// the dashboard shell (components/dashboard/*).
import "./tailwind.css";
import { brand } from "@/lib/brand";

// Two Google fonts, loaded via next/font (self-hosted at build time — no
// extra network request or npm package needed): Playfair Display for the
// large editorial headings on the public site (matching the Karam Laza
// reference), Inter for everything else.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// Falls back to the live deployment (not localhost) so that metadataBase —
// and therefore the absolute og:image / twitter:image URLs derived from it —
// resolves correctly even when NEXT_PUBLIC_SITE_URL isn't set on Vercel.
// A localhost fallback here is why link previews (WhatsApp, iMessage, etc.)
// were failing to load on phones: the image URL pointed at localhost.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://seedan.vercel.app";
const SITE_NAME = "SEEDAN Member Portal";
const SITE_DESCRIPTION =
  "A working demo of the platform proposed for the Seed Entrepreneurs Association of Nigeria (SEEDAN): content management, membership registration & approval, and role-gated dashboards. It was built to show that day-to-day administration needs no developer, just a browser.";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Demo`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: `${SITE_NAME} — Demo`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `Preview image for ${SITE_NAME}`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Demo`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <NextTopLoader color={brand.secondary} showSpinner={false} />
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
