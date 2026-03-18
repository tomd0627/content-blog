import type { Metadata } from "next";
import { DM_Mono, Lora } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { ThemeProvider, ThemeScript } from "@/components/layout/ThemeProvider";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  preload: true,
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://content-blog.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Field Notes — A Developer Blog",
    template: "%s | Field Notes",
  },
  description:
    "Thoughtful writing on front-end development, accessibility, performance, and the craft of building for the web.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Field Notes",
    title: "Field Notes — A Developer Blog",
    description:
      "Thoughtful writing on front-end development, accessibility, performance, and the craft of building for the web.",
    images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: "Field Notes" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Field Notes — A Developer Blog",
    description:
      "Thoughtful writing on front-end development, accessibility, performance, and the craft of building for the web.",
    images: ["/og-default.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    types: {
      "application/rss+xml": `${siteUrl}/feed.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${lora.variable} ${dmMono.variable}`}>
        <ThemeProvider>
          <SkipLink />
          <Header />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
