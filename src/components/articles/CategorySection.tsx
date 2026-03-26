import Link from "next/link";
import Image from "next/image";
import { formatDateShort } from "@/lib/utils";
import type { Article, Category, User } from "@prisma/client";

type CategoryWithArticles = Category & {
  articles: (Article & { author: User })[];
};

interface Props {
  category: CategoryWithArticles;
}

export default function CategorySection({ category }: Props) {
  const [main, ...rest] = category.articles;
  if (!main) return null;

  return (
    <section className="mt-10">
      <div className="section-divider" />
      <div className="flex items-center justify-between mb-4">
        <Link href={`/categorie/${category.slug}`}>
          <h2 className="text-xl font-bold hover:text-lm-blue transition-colors">
            {category.name}
          </h2>
        </Link>
        <Link href={`/categorie/${category.slug}`} className="text-xs text-lm-muted hover:text-lm-blue transition-colors">
          Tous les articles →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Article principal */}
        <article className="md:col-span-2 group">
          {main.imageUrl && (
            <Link href={`/articles/${main.slug}`}>
              <div className="relative aspect-video mb-3 overflow-hidden rounded">
                <Image src={main.imageUrl} alt={main.title} fill className="object-cover group-hover:scale-105 transition-transform" />
              </div>
            </Link>
          )}
          <Link href={`/articles/${main.slug}`}>
            <h3 className="font-serif font-bold text-lg leading-snug group-hover:text-lm-blue mb-2 line-clamp-2">
              {main.title}
            </h3>
          </Link>
          <p className="text-sm text-lm-muted line-clamp-2 mb-2">{main.excerpt}</p>
          <p className="text-xs text-lm-muted">{formatDateShort(main.publishedAt)} · {main.readTime} min</p>
        </article>

        {/* Articles secondaires */}
        <div className="flex flex-col gap-4 divide-y divide-lm-border">
          {rest.map((article) => (
            <article key={article.id} className="pt-4 first:pt-0 group">
              <Link href={`/articles/${article.slug}`}>
                <h3 className="font-serif font-semibold text-sm leading-snug group-hover:text-lm-blue line-clamp-3">
                  {article.title}
                </h3>
              </Link>
              <p className="text-xs text-lm-muted mt-1">{formatDateShort(article.publishedAt)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
