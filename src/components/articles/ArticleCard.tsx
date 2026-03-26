import Link from "next/link";
import Image from "next/image";
import { formatDateShort } from "@/lib/utils";
import type { Article, Category, User } from "@prisma/client";

type ArticleWithRelations = Article & {
  category: Category;
  author: User;
};

interface Props {
  article: ArticleWithRelations;
  compact?: boolean;
}

export default function ArticleCard({ article, compact = false }: Props) {
  if (compact) {
    return (
      <article className="flex gap-3 group">
        {article.imageUrl && (
          <div className="relative w-20 h-16 flex-shrink-0 overflow-hidden rounded">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <Link href={`/categorie/${article.category.slug}`} className="text-xs font-bold text-lm-blue hover:underline uppercase tracking-wide">
            {article.category.name}
          </Link>
          <Link href={`/articles/${article.slug}`}>
            <h3 className="text-sm font-serif font-semibold leading-snug group-hover:text-lm-blue line-clamp-2 mt-0.5">
              {article.title}
            </h3>
          </Link>
          <p className="text-xs text-lm-muted mt-1">{formatDateShort(article.publishedAt)}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="group">
      {article.imageUrl && (
        <Link href={`/articles/${article.slug}`}>
          <div className="relative aspect-video mb-3 overflow-hidden rounded">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      )}
      <Link href={`/categorie/${article.category.slug}`} className="text-xs font-bold text-lm-blue hover:underline uppercase tracking-wide">
        {article.category.name}
      </Link>
      <Link href={`/articles/${article.slug}`}>
        <h3 className="font-serif font-bold text-base leading-snug group-hover:text-lm-blue mt-1 mb-2 line-clamp-2">
          {article.title}
        </h3>
      </Link>
      <p className="text-sm text-lm-muted line-clamp-2 mb-2">{article.excerpt}</p>
      <div className="flex items-center gap-2 text-xs text-lm-muted">
        <span>{article.author.name}</span>
        <span>·</span>
        <time dateTime={article.publishedAt.toISOString()}>{formatDateShort(article.publishedAt)}</time>
        <span>·</span>
        <span>{article.readTime} min</span>
      </div>
    </article>
  );
}
