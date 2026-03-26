import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/articles/ArticleCard";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
  searchParams: { page?: string };
}

const PER_PAGE = 12;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) return { title: "Catégorie introuvable" };
  return {
    title: category.name,
    description: `Toute l'actualité ${category.name.toLowerCase()} sur Le Monde 7`,
  };
}

export default async function CategoriePage({ params, searchParams }: Props) {
  const page = parseInt(searchParams.page || "1");
  const skip = (page - 1) * PER_PAGE;

  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) notFound();

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { categoryId: category.id, isPublished: true },
      orderBy: { publishedAt: "desc" },
      skip,
      take: PER_PAGE,
      include: { category: true, author: true },
    }),
    prisma.article.count({ where: { categoryId: category.id, isPublished: true } }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="section-divider" />
      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      {category.description && (
        <p className="text-lm-muted mb-6">{category.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/categorie/${params.slug}?page=${p}`}
              className={`w-9 h-9 flex items-center justify-center border rounded ${p === page ? "bg-lm-blue text-white border-lm-blue" : "border-lm-border hover:border-lm-blue"}`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
