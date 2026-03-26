import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ShareButtons from "@/components/articles/ShareButtons";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: { category: true, author: true },
  });

  if (!article) return { title: "Article introuvable" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.imageUrl ? [article.imageUrl] : [],
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
      authors: [article.author.name || "Rédaction"],
      section: article.category.name,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug, isPublished: true },
    include: {
      category: true,
      author: true,
      tags: true,
      comments: {
        where: { isVisible: true },
        include: { author: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!article) notFound();

  // Incrémenter le compteur de vues
  await prisma.article.update({
    where: { id: article.id },
    data: { viewCount: { increment: 1 } },
  });

  // Articles similaires
  const relatedArticles = await prisma.article.findMany({
    where: {
      categoryId: article.categoryId,
      id: { not: article.id },
      isPublished: true,
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
    include: { category: true, author: true },
  });

  const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/articles/${article.slug}`;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-lm-muted mb-4">
        <Link href="/" className="hover:text-lm-blue">Accueil</Link>
        <span className="mx-2">/</span>
        <Link href={`/categorie/${article.category.slug}`} className="hover:text-lm-blue">
          {article.category.name}
        </Link>
      </nav>

      {/* Catégorie */}
      <Link
        href={`/categorie/${article.category.slug}`}
        className="text-xs font-bold uppercase tracking-wider text-lm-blue hover:underline"
      >
        {article.category.name}
      </Link>

      {/* Titre */}
      <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight mt-2 mb-4">
        {article.title}
      </h1>

      {/* Chapeau */}
      <p className="text-lg text-lm-muted leading-relaxed mb-6 font-serif">
        {article.excerpt}
      </p>

      {/* Meta */}
      <div className="flex items-center justify-between border-y border-lm-border py-3 mb-6">
        <div className="text-sm text-lm-muted">
          <span className="font-medium text-lm-text">{article.author.name}</span>
          <span className="mx-2">·</span>
          <time dateTime={article.publishedAt.toISOString()}>
            {formatDate(article.publishedAt)}
          </time>
          <span className="mx-2">·</span>
          <span>{article.readTime} min de lecture</span>
        </div>
        <ShareButtons url={articleUrl} title={article.title} />
      </div>

      {/* Image principale */}
      {article.imageUrl && (
        <figure className="mb-8">
          <div className="relative aspect-video w-full overflow-hidden rounded">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          {article.imageCaption && (
            <figcaption className="text-xs text-lm-muted mt-2">
              {article.imageCaption}
            </figcaption>
          )}
        </figure>
      )}

      {/* Contenu */}
      <div
        className="article-content prose prose-lg max-w-none font-serif leading-relaxed"
        dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<br/>") }}
      />

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-lm-border">
          {article.tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="text-xs bg-lm-gray text-lm-muted px-3 py-1 rounded-full hover:bg-lm-blue hover:text-white transition-colors"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      )}

      {/* Partage */}
      <div className="mt-8 pt-6 border-t border-lm-border">
        <p className="text-sm font-medium mb-3">Partager cet article</p>
        <ShareButtons url={articleUrl} title={article.title} showLabels />
      </div>

      {/* Articles liés */}
      {relatedArticles.length > 0 && (
        <aside className="mt-12 pt-6 border-t-2 border-lm-blue">
          <h2 className="text-lg font-bold mb-4">À lire aussi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedArticles.map((related) => (
              <Link key={related.id} href={`/articles/${related.slug}`} className="group">
                {related.imageUrl && (
                  <div className="relative aspect-video mb-2 overflow-hidden rounded">
                    <Image src={related.imageUrl} alt={related.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                  </div>
                )}
                <h3 className="text-sm font-serif font-semibold group-hover:text-lm-blue line-clamp-2">
                  {related.title}
                </h3>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </article>
  );
}
