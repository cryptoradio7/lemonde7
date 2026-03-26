# Le Monde 7

Clone de [lemonde.fr](https://www.lemonde.fr) — Site d'information grand public

**Stack :** Next.js 14 · Prisma · SQLite · Tailwind CSS · NextAuth.js · TypeScript

## Démarrage rapide

### Prérequis
- Node.js 18+
- npm 9+

### Installation

```bash
# Cloner le projet
git clone https://github.com/cryptoradio7/lemonde7.git
cd lemonde7

# Installer les dépendances
npm install --legacy-peer-deps

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos valeurs (voir section Variables d'environnement)

# Initialiser la base de données + seed
npm run db:migrate
npm run db:seed

# Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Variables d'environnement

Copier `.env.example` → `.env` et configurer :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | Chemin SQLite | `file:./dev.db` |
| `NEXTAUTH_URL` | URL de l'app | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret JWT (32+ chars) | Générer avec `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site | `https://lemonde7.vercel.app` |
| `SMTP_*` | Config email newsletter | Optionnel en dev |

## Commandes

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm start            # Lancer en production
npm test             # Tests unitaires

npm run db:migrate   # Appliquer les migrations Prisma
npm run db:seed      # Insérer 29 articles de test
npm run db:reset     # Reset complet de la DB + seed
npm run db:studio    # Interface Prisma Studio
```

## Compte admin

Après le seed, un compte admin est créé :
- **Email :** `admin@lemonde7.fr`
- **Mot de passe :** `admin123`
- **URL admin :** `/admin`

⚠️ Changer le mot de passe en production !

## Fonctionnalités

- 📰 **Page d'accueil** — fil d'actualités fidèle à lemonde.fr
- 📄 **Page article** — contenu complet, SEO, partage social
- 🔍 **Recherche** — plein texte avec filtres par catégorie
- 👤 **Authentification** — inscription, connexion, sessions JWT
- 📧 **Newsletter** — inscription avec conformité RGPD
- 📲 **Partage social** — Twitter/X, Facebook, LinkedIn, WhatsApp
- 🗺️ **SEO** — sitemap.xml, robots.txt, meta OpenGraph
- ⚙️ **Admin** — dashboard avec stats et liste articles

## Architecture

Voir [ARCHITECTURE.md](./ARCHITECTURE.md) pour les détails techniques.

## Déploiement Vercel

1. Connecter le repo GitHub sur [vercel.com](https://vercel.com)
2. Configurer les variables d'environnement dans Vercel Dashboard
3. Pour la DB en production : remplacer SQLite par PostgreSQL (ex: [Neon](https://neon.tech))
   - Changer `DATABASE_URL` dans Vercel vers la connexion PostgreSQL
   - Changer `provider = "sqlite"` → `provider = "postgresql"` dans `prisma/schema.prisma`
   - Relancer `prisma migrate deploy` + `prisma db seed`
4. Push sur `main` = déploiement automatique

## Structure du projet

```
lemonde7/
├── prisma/
│   ├── schema.prisma        # Modèle DB (User, Article, Category, Newsletter...)
│   └── seed.ts              # 29 articles réalistes en français
├── src/
│   ├── app/                 # Pages Next.js (App Router)
│   │   ├── page.tsx         # Accueil
│   │   ├── articles/[slug]/ # Page article
│   │   ├── categorie/[slug]/# Page catégorie
│   │   ├── recherche/       # Moteur de recherche
│   │   ├── newsletter/      # Page newsletter
│   │   ├── auth/            # Connexion / inscription
│   │   ├── admin/           # Dashboard admin
│   │   └── api/             # API Routes
│   ├── components/
│   │   ├── layout/          # Header, Footer, SearchBar, UserMenu
│   │   └── articles/        # Cards, partage, sections
│   └── lib/
│       ├── db.ts            # Client Prisma
│       ├── auth.ts          # NextAuth config
│       └── utils.ts         # Utilitaires
├── ARCHITECTURE.md
├── SPECS_FONCTIONNELLES.md
└── REVERSE_ENGINEERING.md
```

## Données de test

Le seed insère :
- **8 catégories** : Politique, Monde, Économie, Culture, Sport, Sciences, Technologie, Santé
- **29 articles** réalistes en français (textes complets, dates récentes)
- **3 auteurs** (admin + 2 journalistes)
- **1 abonné newsletter** de test

---

Développé par **AgileVizion** · 2026
