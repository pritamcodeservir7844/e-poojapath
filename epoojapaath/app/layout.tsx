import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "ePoojapaath — India's Devotional Platform",
    template: "%s | ePoojapaath",
  },
  description: "Book online pujas, Chadawa offerings, and discover temples across India. Connect with the divine from wherever you are.",
  keywords: ["puja booking", "online puja", "temple", "chadawa", "Hindu", "epoojapaath"],
  authors: [{ name: "ePoojapaath Team" }],
  creator: "ePoojapaath",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "ePoojapaath",
    title: "ePoojapaath — India's Devotional Platform",
    description: "Book online pujas, Chadawa offerings, and discover temples across India.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ePoojapaath — India's Devotional Platform",
    description: "Book online pujas, Chadawa offerings, and discover temples across India.",
    images: ["/og-image.png"],
  },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: { fontFamily: "Hind, sans-serif" },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
