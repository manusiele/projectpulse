import type { Metadata } from "next";
import "./globals.css";
import { InstallPrompt } from "@/components/InstallPrompt";
import { NotificationPrompt } from "@/components/NotificationPrompt";
import { RegisterServiceWorker } from "./register-sw";

export const metadata: Metadata = {
  title: "FocusLock — Daily Project Ideas",
  description:
    "Your daily AI-powered project idea engine. One brutally honest problem statement, one shippable project, exact stack, real potential.",
  icons: {
    icon: '/icon-512.png',
    shortcut: '/icon-512.png',
    apple: '/icon-512.png',
  },
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FocusLock',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0a0a] text-gray-100 antialiased">
        <RegisterServiceWorker />
        {children}
        <InstallPrompt />
        <NotificationPrompt />
      </body>
    </html>
  );
}
