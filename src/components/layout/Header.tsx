import Link from "next/link";
import { prisma } from "@/lib/db";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

export default async function Header() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  const now = new Date();
  const dateStr = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="border-b border-lm-border">
      {/* Barre supérieure */}
      <div className="bg-lm-blue text-white text-xs py-1 px-4 flex justify-between items-center">
        <span className="capitalize">{dateStr}</span>
        <div className="flex items-center gap-4">
          <Link href="/newsletter" className="hover:underline">Newsletter</Link>
          <UserMenu />
        </div>
      </div>

      {/* Logo */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex flex-col items-start group">
          <span className="text-3xl font-serif font-bold tracking-tight text-lm-text group-hover:text-lm-blue">
            Le Monde 7
          </span>
          <span className="text-xs text-lm-muted tracking-widest uppercase">
            L&apos;actualité en continu
          </span>
        </Link>
        <SearchBar />
      </div>

      {/* Navigation catégories */}
      <nav className="border-t border-lm-border bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/categorie/${cat.slug}`}
                  className="nav-category block px-4 py-3 text-sm font-medium text-lm-text whitespace-nowrap transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
