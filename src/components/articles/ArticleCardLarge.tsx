import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { Article, Category, User } from "@prisma/client";

type ArticleWithRelations = Article & {
  category: Category;
  author: User;
};

interface Props {
  article: ArticleWithRelations;
}

export default function ArticleCardLarge({ article }: Props) {
  return (
    <article className="group">
      {article.imageUrl && (
        <Link href={`/articles/${article.slug}`}>
          <div className="relative aspect-video mb-4 overflow-hidden rounded">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
        </Link>
      )}
      <Link href={`/categorie/${article.category.slug}`} className="text-xs font-bold text-lm-blue hover:underline uppercase tracking-wide">
        {article.category.name}
      </Link>
      <Link href={`/articles/${article.slug}`}>
        <h2 className="font-serif font-bold text-2xl leading-tight group-hover:text-lm-blue mt-1 mb-2 line-clamp-3">
          {article.title}
        </h2>
      </Link>
      <p className="text-base text-lm-muted leading-relaxed mb-3 line-clamp-3">{article.excerpt}</p>
      <div className="flex items-center gap-2 text-sm text-lm-muted">
        <span className="font-medium text-lm-text">{article.author.name}</span>
        <span>·</span>
        <time dateTime={article.publishedAt.toISOString()}>{formatDate(article.publishedAt)}</time>
        <span>·</span>
        <span>{article.readTime} min de lecture</span>
      </div>
    </article>
  );
}
