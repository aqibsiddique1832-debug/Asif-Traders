import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import PublicShell from "@/components/PublicShell";
import { AdminProvider } from "@/context/AdminContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import { AnnouncerProvider, SkipLink } from "@/components/A11y";

export const metadata: Metadata = {
  title: "ASIF TRADERS - Building Materials Supplier | Cement, Steel, TMT, Pipes, Tiles",
  description: "Your trusted partner for quality building materials in Navi Mumbai and Thane. Wholesale prices on cement, TMT bars, structural steel, GI/MS pipes, tiles, AAC blocks, cement sheets, and sand & aggregate. Fast local delivery.",
  keywords: "building materials, cement supplier, TMT bars, steel, pipes, tiles, AAC blocks, Navi Mumbai, Thane, wholesale building materials",
  openGraph: {
    title: "ASIF TRADERS - Building Materials Supplier",
    description: "Quality building materials at wholesale prices. Serving contractors and builders across Navi Mumbai and Thane.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASIF TRADERS - Building Materials Supplier",
    description: "Quality building materials at wholesale prices. Serving contractors and builders across Navi Mumbai and Thane.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen flex flex-col bg-warm-white">
        <SkipLink />
        <AnnouncerProvider>
          <RecentlyViewedProvider>
            <AdminProvider>
              <WishlistProvider>
                <Providers>
                  <PublicShell>{children}</PublicShell>
                </Providers>
              </WishlistProvider>
            </AdminProvider>
          </RecentlyViewedProvider>
        </AnnouncerProvider>
      </body>
    </html>
  );
}
