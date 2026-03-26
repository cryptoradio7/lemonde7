import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();
  if (!session || (session.user as { role?: string })?.role !== "admin") {
    redirect("/auth/connexion");
  }

  const [articlesCount, usersCount, newsletterCount, categoriesCount] = await Promise.all([
    prisma.article.count(),
    prisma.user.count(),
    prisma.newsletterSubscriber.count({ where: { isConfirmed: true } }),
    prisma.category.count(),
  ]);

  const recentArticles = await prisma.article.findMany({
    take: 10,
    orderBy: { publishedAt: "desc" },
    include: { category: true, author: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="section-divider" />
      <h1 className="text-2xl font-bold mb-8">Administration</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Articles", value: articlesCount, href: "/admin/articles" },
          { label: "Utilisateurs", value: usersCount, href: "/admin/utilisateurs" },
          { label: "Abonnés newsletter", value: newsletterCount, href: "/admin/newsletter" },
          { label: "Catégories", value: categoriesCount, href: "/admin/categories" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-lm-gray rounded p-4 hover:shadow-md transition-shadow">
            <p className="text-3xl font-bold text-lm-blue">{stat.value}</p>
            <p className="text-sm text-lm-muted mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Articles récents */}
      <h2 className="text-lg font-bold mb-4">Articles récents</h2>
      <div className="bg-white border border-lm-border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-lm-gray">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Titre</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Catégorie</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Auteur</th>
              <th className="text-left px-4 py-3 font-medium">Vues</th>
              <th className="text-left px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lm-border">
            {recentArticles.map((article) => (
              <tr key={article.id} className="hover:bg-lm-gray">
                <td className="px-4 py-3">
                  <Link href={`/articles/${article.slug}`} className="hover:text-lm-blue line-clamp-1 font-medium">
                    {article.title}
                  </Link>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-lm-muted">{article.category.name}</td>
                <td className="px-4 py-3 hidden md:table-cell text-lm-muted">{article.author.name}</td>
                <td className="px-4 py-3 text-lm-muted">{article.viewCount}</td>
                <td className="px-4 py-3">
                  <Link href={`/articles/${article.slug}`} className="text-lm-blue hover:underline text-xs">
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
