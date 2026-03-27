import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NotificationPrompt } from "@/components/NotificationPrompt";
import { ClientProviders } from "./client-providers";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProjectPulse — Daily AI-Generated Project Ideas for Developers",
  description:
    "Get one AI-powered project idea daily. Real problem statements, shippable projects, exact tech stacks, and deployment guides. Perfect for developers looking for their next side project.",
  keywords: [
    "project ideas",
    "developer projects",
    "side project ideas",
    "coding projects",
    "AI project generator",
    "tech stack recommendations",
    "startup ideas",
    "web development projects",
    "app ideas",
    "programming projects",
    "developer inspiration",
    "build in public",
  ],
  authors: [{ name: "ProjectPulse" }],
  creator: "ProjectPulse",
  publisher: "ProjectPulse",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://projectpulse-dev.vercel.app",
    title: "ProjectPulse — Daily AI-Generated Project Ideas",
    description:
      "Your daily AI-powered project idea engine. One brutally honest problem statement, one shippable project, exact stack, real potential.",
    siteName: "ProjectPulse",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "ProjectPulse Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ProjectPulse — Daily AI-Generated Project Ideas",
    description:
      "Get one AI-powered project idea daily. Real problem statements, shippable projects, exact tech stacks.",
    images: ["/icon-512.png"],
    creator: "@projectpulse",
  },
  icons: {
    icon: '/icon-512.png',
    shortcut: '/icon-512.png',
    apple: '/icon-512.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ProjectPulse',
  },
  alternates: {
    canonical: "https://projectpulse-dev.vercel.app",
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans min-h-screen bg-[#0a0a0a] text-gray-100 antialiased`}>
        <ClientProviders>
          {children}
          <NotificationPrompt />
        </ClientProviders>
      </body>
    </html>
  );
}
