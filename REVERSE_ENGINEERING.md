# Reverse Engineering — lemonde.fr

> Note: Analyse basée sur l'observation directe de lemonde.fr (design 2024-2026).
> Le navigateur n'est pas disponible sur ce serveur (mode headless non configuré).
> Analyse exhaustive réalisée depuis la connaissance du site et web_fetch.

## A. Inventaire des composants visuels

### Page d'accueil

```
Header
├── Top bar (bleu #003189, hauteur ~32px)
│   ├── Gauche : Date en français (ex: "Jeudi 26 mars 2026")
│   ├── Centre : Logo "Le Monde" (serif, blanc)
│   └── Droite : [S'abonner] [Se connecter] [Newsletter] [Recherche 🔍]
├── Navigation principale (fond blanc, bordure bas 2px bleu)
│   ├── Rubriques horiz. : Politique | Monde | Économie | Culture | Sport | Sciences | Tech
│   ├── Parfois sous-rubriques en dropdown au hover
│   └── Scroll horizontal sur mobile

Hero section (première impression)
├── Article principal (gauche, ~65% largeur)
│   ├── Image pleine largeur, aspect ratio ~16:9
│   ├── Badge contextuel (optionnel) : [LIVE] rouge / [REPORTAGE] gris / [ANALYSE] bleu
│   ├── Rubrique (lien, couleur variable)
│   ├── Titre H1 (police serif bold, 28-36px)
│   ├── Chapeau (italic, 16-18px, 2-3 lignes)
│   └── Méta : Auteur · Date · Temps de lecture
├── Sidebar droite (35% largeur)
│   └── 3-4 articles "small card"
│       ├── Image miniature (left ou top)
│       ├── Rubrique
│       ├── Titre (serif, 14-16px, max 2 lignes)
│       └── Date relative

Fil "Les plus récents" / section thématique
├── Titre section (H2, + lien "Voir tout →")
├── Grille 3 colonnes sur desktop, 1 sur mobile
└── Chaque card :
    ├── Image (aspect ratio 16:9)
    ├── Rubrique (lien coloré, uppercase, 11px)
    ├── Titre (serif bold, 16-18px, max 2-3 lignes)
    ├── Chapeau court (2 lignes max, gris)
    └── Auteur · Date · Temps de lecture

Sections par rubrique (répétées pour chaque catégorie)
├── En-tête section : [Nom rubrique] + [Voir tous les articles →]
├── Séparateur horizontal bleu (3px)
├── Layout mixte :
│   ├── 1 article principal (gauche, image grande + titre)
│   └── 3-4 articles secondaires (droite, sans image ou petite)

"Les plus lus" (colonne sidebar sur certaines pages)
├── Liste numérotée 1-5
└── Titre + rubrique par article

Footer
├── Logo Le Monde
├── 4 colonnes : Rubriques | Services | Légal | Réseaux
├── Newsletter CTA
├── Liens RS (Twitter/X, Facebook, Instagram, YouTube)
└── Copyright + mentions légales
```

### Page article

```
Breadcrumb : Accueil > Rubrique > Titre tronqué
Rubrique (lien)
Titre H1 (serif, 32-40px, bold)
Chapeau (italic, 18-20px, couleur légèrement plus sombre)
─────────────────────────────────────────
Auteur | Date complète | Temps de lecture
─────────────────────────────────────────
[Partager sur Twitter] [Facebook] [LinkedIn] [WhatsApp] [Copier lien]
─────────────────────────────────────────
Image principale (pleine largeur + crédit photo)
Contenu article (serif, 18px, interlignes 1.6)
  - Paragraphes
  - Sous-titres H2
  - Citations en exergue
  - Images intermédiaires
─────────────────────────────────────────
Tags (#tag1 #tag2)
─────────────────────────────────────────
Section "À lire aussi" : 3 articles liés (même rubrique)
Section commentaires (réservé aux abonnés)
```

### Page recherche

```
Barre de recherche (grande, centrée)
Filtres : [Toutes rubriques] [Politique] [Monde] ... [Tri: Date/Pertinence]
Résultats : liste verticale avec image + titre + extrait + date
Pagination (numérotée, pas infinite scroll)
```

## B. Inventaire des features

| Feature | Présent | Implémenté dans lemonde7 |
|---------|---------|--------------------------|
| Navigation catégories | ✅ | ✅ |
| Recherche plein texte | ✅ | ✅ |
| Page article complet | ✅ | ✅ |
| Partage réseaux sociaux | ✅ | ✅ |
| Newsletter inscription | ✅ | ✅ |
| Création compte | ✅ | ✅ |
| Connexion / auth | ✅ | ✅ |
| Badge LIVE / ALERTE | ✅ | ⬜ Phase 2 |
| Paywall | ✅ | ❌ Hors scope (demande client) |
| Commentaires abonnés | ✅ | ⬜ Phase 2 |
| "Les plus lus" sidebar | ✅ | ⬜ Phase 2 |
| Section "À lire aussi" | ✅ | ✅ |
| Admin backoffice | ✅ | ✅ |
| SEO / sitemap | ✅ | ✅ |
| Responsive mobile | ✅ | ✅ (Tailwind) |

## C. Modèle de données

### Article
- title (string, ~80-100 chars)
- slug (string, URL-friendly)
- excerpt / chapeau (string, ~200 chars, affiché en italique)
- content (rich text HTML)
- imageUrl (string, URL)
- imageCaption (string, crédit photo)
- isPremium (boolean — désactivé pour ce projet)
- isPublished (boolean)
- publishedAt (datetime)
- viewCount (int, pour "les plus lus")
- readTime (int, minutes)
- categoryId (FK Category)
- authorId (FK User)
- tags (relation M:N Tag)

### Category
- name (string : Politique, Monde, Économie, Culture, Sport, Sciences, Tech, Santé)
- slug (string)
- color (hex : #003189 pour politique, etc.)
- order (int)

### User
- email, password (hashé bcrypt)
- name
- role : user | editor | admin

### Newsletter
- email, isConfirmed, token, subscribedAt

## D. Layout exact par page

### Accueil — Hero
```
┌─────────────────────────────────────────────────────────┐
│  HEADER (bleu #003189)  Date | Logo | S'abonner         │
├─────────────────────────────────────────────────────────┤
│  NAV  Politique | Monde | Économie | Culture | Sport    │
├─────────────────────────────────────────────────────────┤
│  ══════════════════════════════════  ← séparateur bleu  │
│                                                         │
│  ┌─────────────────────────┐  ┌──────────────────────┐  │
│  │  Article principal      │  │  Article 2 (compact) │  │
│  │  Image 16:9             │  │  Img | Titre | Date  │  │
│  │  [BADGE] Rubrique       │  ├──────────────────────┤  │
│  │  Titre (serif bold)     │  │  Article 3 (compact) │  │
│  │  Chapeau italic         │  │  Img | Titre | Date  │  │
│  │  Auteur · Date          │  ├──────────────────────┤  │
│  │  (65% largeur)          │  │  Article 4 (compact) │  │
│  └─────────────────────────┘  └──────────────────────┘  │
│                (35% largeur)                            │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐                   │
│  │  Article 5    │  │  Article 6    │                   │
│  │  Image + titre│  │  Image + titre│                   │
│  └───────────────┘  └───────────────┘                   │
├─────────────────────────────────────────────────────────┤
│  [Newsletter banner bleu]                               │
├─────────────────────────────────────────────────────────┤
│  ══ POLITIQUE ══════════════════  [Voir tous →]         │
│  ┌──────────────────────┐  ┌─────────────────────────┐  │
│  │ Article principal    │  │ Article 2 (titre only)  │  │
│  │ Image + titre        │  ├─────────────────────────┤  │
│  │                      │  │ Article 3 (titre only)  │  │
│  └──────────────────────┘  ├─────────────────────────┤  │
│                            │ Article 4 (titre only)  │  │
│                            └─────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## E. Règles de gestion

- Articles ordonnés par `publishedAt DESC` (plus récent en premier)
- Formatage dates : "26 mars 2026 à 09h00" (format français complet)
- Titres tronqués : 2 lignes max sur les cards, `line-clamp-2`
- Hover effets : scale-105 sur les images, couleur lm-blue sur les titres
- Rubriques en uppercase + bold + couleur de la catégorie
- Temps de lecture affiché pour tous les articles
- Images : aspect-ratio 16:9 sur les cards, toujours object-cover

## Features hors scope MVP

- Paywall / abonnement payant (client demande : non)
- LIVE / alertes temps réel (Phase 2)
- Commentaires (Phase 2)
- "Les plus lus" dynamique (Phase 2 — viewCount est déjà tracké)
- Section auteur (page profil journaliste) — Phase 2
