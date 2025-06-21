import type React from "react"
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})
export const metadata: Metadata = {
  title: {
    default: "IIoT View'er",
    template: "%s | IIoT View'er",
  },
  description: "A secure and modern interface for organizational and IIoT management",
  keywords: ["iot", "iiot", "management", "secure", "organization"],
  authors: [{ name: "Michał Król" }],
  creator: "Michał Król",
  publisher: "Michał Król",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  // manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "IIoT View'er",
    description: "A secure and modern interface for organizational and IIoT management",
    siteName: "Aspen Medicaltech",
  },
  twitter: {
    card: "summary_large_image",
    title: "IIoT View'er",
    description: "A secure and modern interface for organizational and IIoT management",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} antialiased min-h-screen bg-background font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
