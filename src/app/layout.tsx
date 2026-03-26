import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: {
    default: "Le Monde 7 - L'actualité en continu",
    template: "%s | Le Monde 7",
  },
  description:
    "Le Monde 7 - Toute l'actualité française et internationale : politique, économie, culture, sport, sciences et technologie.",
  keywords: ["actualité", "news", "france", "politique", "économie", "culture"],
  authors: [{ name: "Rédaction Le Monde 7" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "Le Monde 7",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
