import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-lm-text text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo */}
          <div>
            <h2 className="text-xl font-serif font-bold mb-3">Le Monde 7</h2>
            <p className="text-sm text-gray-400">
              L'actualité française et internationale, en continu.
            </p>
          </div>

          {/* Rubriques */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-300">Rubriques</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {["politique", "monde", "economie", "culture", "sport"].map((slug) => (
                <li key={slug}>
                  <Link href={`/categorie/${slug}`} className="hover:text-white capitalize transition-colors">
                    {slug === "economie" ? "Économie" : slug.charAt(0).toUpperCase() + slug.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-300">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/newsletter" className="hover:text-white transition-colors">Newsletter</Link></li>
              <li><Link href="/recherche" className="hover:text-white transition-colors">Recherche</Link></li>
              <li><Link href="/auth/inscription" className="hover:text-white transition-colors">Créer un compte</Link></li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-300">Légal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link></li>
              <li><Link href="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link></li>
              <li><Link href="/cgu" className="hover:text-white transition-colors">CGU</Link></li>
            </ul>
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-700">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
            𝕏
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
            f
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
            in
          </a>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          © {new Date().getFullYear()} Le Monde 7. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
