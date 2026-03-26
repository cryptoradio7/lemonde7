import { prisma } from "@/lib/db";
import ArticleCard from "@/components/articles/ArticleCard";
import type { Metadata } from "next";

interface Props {
  searchParams: { q?: string; categorie?: string; page?: string };
}

export const metadata: Metadata = {
  title: "Recherche",
  description: "Rechercher des articles sur Le Monde 7",
};

const PER_PAGE = 12;

export default async function RecherchePage({ searchParams }: Props) {
  const query = searchParams.q?.trim() || "";
  const categorie = searchParams.categorie || "";
  const page = parseInt(searchParams.page || "1");
  const skip = (page - 1) * PER_PAGE;

  const where = {
    isPublished: true,
    ...(query && {
      OR: [
        { title: { contains: query } },
        { excerpt: { contains: query } },
        { content: { contains: query } },
      ],
    }),
    ...(categorie && { category: { slug: categorie } }),
  };

  const [articles, total, categories] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip,
      take: PER_PAGE,
      include: { category: true, author: true },
    }),
    prisma.article.count({ where }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="section-divider" />
      <h1 className="text-2xl font-bold mb-6">
        {query ? `Résultats pour "${query}"` : "Recherche d'articles"}
      </h1>

      {/* Formulaire de recherche */}
      <form action="/recherche" method="GET" className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Rechercher un article..."
            className="flex-1 border border-lm-border px-4 py-2 rounded focus:outline-none focus:border-lm-blue"
          />
          <button
            type="submit"
            className="bg-lm-blue text-white px-6 py-2 rounded hover:bg-blue-800 transition-colors"
          >
            Rechercher
          </button>
        </div>

        {/* Filtres catégories */}
        <div className="flex flex-wrap gap-2 mt-3">
          <a
            href={query ? `/recherche?q=${query}` : "/recherche"}
            className={`text-xs px-3 py-1 rounded-full border ${!categorie ? "bg-lm-blue text-white border-lm-blue" : "border-lm-border hover:border-lm-blue"}`}
          >
            Toutes
          </a>
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/recherche?${query ? `q=${query}&` : ""}categorie=${cat.slug}`}
              className={`text-xs px-3 py-1 rounded-full border ${categorie === cat.slug ? "bg-lm-blue text-white border-lm-blue" : "border-lm-border hover:border-lm-blue"}`}
            >
              {cat.name}
            </a>
          ))}
        </div>
      </form>

      {/* Résultats */}
      {articles.length === 0 ? (
        <div className="text-center py-16 text-lm-muted">
          <p className="text-lg">Aucun article trouvé</p>
          {query && <p className="mt-2">Essayez avec d'autres mots-clés</p>}
        </div>
      ) : (
        <>
          <p className="text-sm text-lm-muted mb-6">
            {total} article{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/recherche?${query ? `q=${query}&` : ""}${categorie ? `categorie=${categorie}&` : ""}page=${p}`}
                  className={`w-9 h-9 flex items-center justify-center border rounded ${p === page ? "bg-lm-blue text-white border-lm-blue" : "border-lm-border hover:border-lm-blue"}`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
