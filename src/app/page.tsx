import { prisma } from "@/lib/db";
import ArticleCard from "@/components/articles/ArticleCard";
import ArticleCardLarge from "@/components/articles/ArticleCardLarge";
import CategorySection from "@/components/articles/CategorySection";
import NewsletterBanner from "@/components/layout/NewsletterBanner";

export const revalidate = 60;

export default async function HomePage() {
  const [featuredArticles, latestArticles, categories] = await Promise.all([
    prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 5,
      include: { category: true, author: true },
    }),
    prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      skip: 5,
      take: 12,
      include: { category: true, author: true },
    }),
    prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        articles: {
          where: { isPublished: true },
          orderBy: { publishedAt: "desc" },
          take: 4,
          include: { author: true },
        },
      },
    }),
  ]);

  const hero = featuredArticles[0];
  const secondary = featuredArticles.slice(1, 3);
  const tertiary = featuredArticles.slice(3, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero section */}
      {hero && (
        <section className="mb-8">
          <div className="section-divider" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ArticleCardLarge article={hero} />
            </div>
            <div className="flex flex-col gap-4">
              {secondary.map((article) => (
                <ArticleCard key={article.id} article={article} compact />
              ))}
            </div>
          </div>
          {tertiary.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-lm-border">
              {tertiary.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Newsletter */}
      <NewsletterBanner />

      {/* Sections par catégorie */}
      {categories
        .filter((c) => c.articles.length > 0)
        .map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}

      {/* Dernières nouvelles */}
      {latestArticles.length > 0 && (
        <section className="mt-10">
          <div className="section-divider" />
          <h2 className="text-xl font-bold mb-4">À lire aussi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
