import type { Metadata } from "next";
import NewsletterBanner from "@/components/layout/NewsletterBanner";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Inscrivez-vous à la newsletter du Monde 7 pour recevoir l'actualité chaque matin.",
};

export default function NewsletterPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="section-divider" />
      <h1 className="text-3xl font-bold mb-4">La newsletter du Monde 7</h1>
      <p className="text-lm-muted mb-8">
        Chaque matin à 7h, recevez une sélection des articles les plus importants de la journée,
        rédigée par notre équipe éditoriale. Gratuit, sans publicité.
      </p>
      <NewsletterBanner />
    </div>
  );
}
