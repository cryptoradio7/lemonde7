# Specs Fonctionnelles — lemonde7

Clone de lemonde.fr | Production | Mode guidé
Référence visuelle : www.lemonde.fr

---

## Story #1 — Page d'accueil avec fil d'actualités

**En tant que** visiteur
**Je veux** voir une page d'accueil structurée comme lemonde.fr avec les dernières actualités
**Pour** accéder rapidement aux articles les plus importants par thématique

**Critères d'acceptation :**
- [ ] Hero section : 1 article principal (image 16:9, titre serif bold, chapeau, auteur, date) + 2-4 articles compacts en sidebar droite
- [ ] Sections par catégorie : une section par catégorie active (séparateur bleu 3px), article principal + 3 titres d'articles
- [ ] Newsletter banner intégré entre le hero et les sections catégories
- [ ] Navigation : liste des catégories en horizontal, scrollable sur mobile
- [ ] Header bleu avec logo, date du jour, liens connexion/inscription
- [ ] Page se charge en < 3s (Next.js SSR + revalidation 60s)
- [ ] Layout responsive : 1 colonne mobile, 2-3 colonnes desktop

**Edge cases :**
- Si aucun article en DB → afficher message "Aucun article disponible"
- Si une catégorie a 0 articles → ne pas afficher sa section
- Si image article manquante → placeholder gris avec initiales de la rubrique
- Si l'article principal a un titre > 100 chars → tronquer avec ellipsis

**Complexité :** M
**Dépendances :** DB seedée avec articles

---

## Story #2 — Page article avec contenu complet

**En tant que** lecteur
**Je veux** lire un article complet avec toutes ses métadonnées
**Pour** consommer l'information de manière optimale

**Critères d'acceptation :**
- [ ] URL propre : `/articles/[slug]` (slug unique, SEO-friendly)
- [ ] Affichage : breadcrumb, badge rubrique, titre H1, chapeau italic, auteur, date, temps lecture
- [ ] Image principale pleine largeur avec légende (si fournie)
- [ ] Contenu article avec rendu correct des retours à la ligne
- [ ] Boutons de partage : Twitter/X, Facebook, LinkedIn, WhatsApp, copier lien
- [ ] Section "À lire aussi" : 3 articles de la même catégorie
- [ ] Compteur de vues incrémenté à chaque visite
- [ ] Meta tags OpenGraph complets (titre, description, image, type article)
- [ ] Structured data JSON-LD pour les moteurs de recherche

**Edge cases :**
- Article inexistant ou non publié → 404
- Article sans image → layout sans image, titre en haut
- Compteur de vues concurrent → `increment: 1` atomique (Prisma)
- Partage sur WhatsApp → URL encodée correctement

**Assets visuels :** voir REVERSE_ENGINEERING.md § D (layout article)

**Complexité :** M
**Dépendances :** Story #1

---

## Story #3 — Moteur de recherche

**En tant que** lecteur
**Je veux** rechercher des articles par mots-clés
**Pour** retrouver un article ou explorer un sujet

**Critères d'acceptation :**
- [ ] Barre de recherche accessible depuis le header (icône loupe → input)
- [ ] Page résultats `/recherche?q=...` avec liste d'articles correspondants
- [ ] Recherche dans : titre, extrait, contenu (Prisma `contains`)
- [ ] Filtres par catégorie (liens cliquables, état actif mis en évidence)
- [ ] Compteur de résultats ("12 articles trouvés")
- [ ] Pagination (12 articles par page)
- [ ] Message "Aucun résultat" si 0 correspondance
- [ ] Champ pre-rempli avec la query courante au rechargement

**Edge cases :**
- Recherche vide → afficher tous les articles (page "Recherche")
- Query avec caractères spéciaux → encodage URL correct
- Query très longue (>200 chars) → tronquer côté serveur
- Catégorie inexistante dans URL → ignorer le filtre

**Complexité :** S
**Dépendances :** Articles en DB

---

## Story #4 — Authentification et création de compte

**En tant que** visiteur
**Je veux** créer un compte et me connecter
**Pour** accéder aux fonctionnalités personnalisées (commentaires, newsletter, etc.)

**Critères d'acceptation :**
- [ ] Page `/auth/inscription` : formulaire nom + email + password (min 8 chars)
- [ ] Validation côté client (Zod) : email format, password longueur
- [ ] Vérification email unique → message d'erreur si déjà utilisé
- [ ] Hash du mot de passe bcrypt (salt 12)
- [ ] Page `/auth/connexion` : formulaire email + password
- [ ] Session JWT stockée (cookie httpOnly)
- [ ] UserMenu dans header : affiche nom si connecté, bouton déconnexion
- [ ] Admin badge dans header si role="admin"
- [ ] Redirection vers "/" après connexion réussie

**Edge cases :**
- Mot de passe incorrect → "Email ou mot de passe incorrect" (pas de distinction pour sécurité)
- Compte inexistant → même message générique
- Session expirée → redirection vers /auth/connexion
- Inscription avec email déjà confirmé newsletter → pas de conflit (tables séparées)

**Complexité :** M
**Dépendances :** Aucune

---

## Story #5 — Newsletter

**En tant que** visiteur
**Je veux** m'inscrire à la newsletter du Monde 7
**Pour** recevoir l'actualité chaque matin par email

**Critères d'acceptation :**
- [ ] Formulaire d'inscription dans le banner homepage ET page `/newsletter`
- [ ] Validation email côté client + serveur
- [ ] Message de confirmation après inscription réussie ("Merci ! Vous êtes inscrit.")
- [ ] Message d'erreur si email déjà inscrit
- [ ] API POST `/api/newsletter` : upsert en DB, marque isConfirmed=true (MVP simplifié)
- [ ] Mention RGPD sous le formulaire ("politique de confidentialité, désinscription en un clic")
- [ ] Page `/newsletter` dédiée avec CTA

**Edge cases :**
- Email invalide → message d'erreur inline
- Soumission double (double-clic) → bouton désactivé pendant la requête
- Email déjà inscrit → message spécifique (pas d'erreur 500)

**Complexité :** S
**Dépendances :** Aucune

---

## Story #6 — Partage réseaux sociaux

**En tant que** lecteur
**Je veux** partager un article sur les réseaux sociaux
**Pour** diffuser une information à mon réseau

**Critères d'acceptation :**
- [ ] Boutons présents sur chaque page article : Twitter/X, Facebook, LinkedIn, WhatsApp
- [ ] Bouton "Copier le lien" avec feedback visuel (icône changed ou toast)
- [ ] Chaque bouton ouvre la fenêtre de partage du réseau (target="_blank")
- [ ] URLs correctement encodées (encodeURIComponent)
- [ ] Titre de l'article inclus dans le texte de partage (Twitter, LinkedIn)
- [ ] Boutons affichés sur mobile et desktop

**Edge cases :**
- Clipboard API non disponible (HTTP) → fallback avec prompt()
- Partage WhatsApp sur desktop → ouvre WhatsApp Web
- URL avec caractères spéciaux → double encodage évité

**Complexité :** S
**Dépendances :** Story #2

---

## Story #7 — SEO

**En tant que** moteur de recherche
**Je veux** indexer correctement le site lemonde7
**Pour** référencer les articles dans les résultats de recherche

**Critères d'acceptation :**
- [ ] Chaque article a des meta tags uniques (title, description, og:title, og:description, og:image)
- [ ] Layout racine avec metadata defaults (title template : "%s | Le Monde 7")
- [ ] Sitemap XML dynamique sur `/sitemap.xml` (toutes les URLs publiées)
- [ ] robots.txt sur `/robots.txt` (allow tout sauf /admin et /api)
- [ ] URLs propres en français kebab-case (ex: `/articles/reforme-constitutionnelle-gouvernement`)
- [ ] Canonical URL sur chaque page
- [ ] Open Graph image sur chaque article (utilise imageUrl)
- [ ] Schema.org Article JSON-LD sur les pages articles

**Edge cases :**
- Article sans image → pas de og:image (ne pas générer de balise vide)
- Titre très long → tronquer à 60 chars pour SEO title
- Sitemap > 50k URLs → implémenter sitemapindex (pas nécessaire en MVP)

**Complexité :** S
**Dépendances :** Story #2

---

## Story #8 — Interface d'administration

**En tant qu'** administrateur
**Je veux** gérer le contenu du site depuis un backoffice
**Pour** publier et administrer les articles sans toucher au code

**Critères d'acceptation :**
- [ ] Route `/admin` protégée (role="admin" requis, sinon redirect connexion)
- [ ] Dashboard avec stats : nb articles, nb utilisateurs, nb abonnés newsletter, nb catégories
- [ ] Tableau des articles récents avec : titre, catégorie, auteur, vues, lien "Voir"
- [ ] Navigation admin dans le header si user.role === "admin"

**Suggestions BA (Phase 2) :**
- Formulaire création/édition article (rich text editor)
- Gestion des catégories
- Export liste abonnés newsletter (CSV)
- Modération des commentaires

**Edge cases :**
- Accès sans auth → redirect `/auth/connexion`
- Accès avec role "user" → redirect "/"
- DB vide → afficher "0" dans les stats (pas d'erreur)

**Complexité :** S
**Dépendances :** Story #4

---

## Suggestions BA — Features phase 2

| Feature | Justification | Priorité |
|---------|--------------|---------|
| Badge LIVE / ALERTE | Présent sur lemonde.fr, crée l'urgence | Haute |
| Commentaires abonnés | Engagement, différenciation | Moyenne |
| "Les plus lus" sidebar | Présent sur lemonde.fr, améliore navigation | Moyenne |
| Dark mode | Standard 2025, accessibilité | Faible |
| Page profil auteur | Humanise la rédaction | Faible |
| Rich text editor admin | Nécessaire pour la rédaction autonome | Haute |
| Export newsletter CSV | Opérationnel nécessaire | Haute |
| Push notifications | Alertes breaking news | Faible |

---

## Ordre de développement recommandé

```
Sprint 1 (fondations) :
  Story #4 (Auth) → Story #1 (Accueil) → Story #2 (Article)

Sprint 2 (fonctionnalités) :
  Story #3 (Recherche) || Story #5 (Newsletter) || Story #7 (SEO)

Sprint 3 (enrichissement) :
  Story #6 (Partage social) || Story #8 (Admin)

Audit + DevOps en parallèle du Sprint 3
```

---

## Récapitulatif complexité

| Story | Titre | Complexité | Dépendances |
|-------|-------|-----------|------------|
| #1 | Page d'accueil | M | DB |
| #2 | Page article | M | #1 |
| #3 | Recherche | S | DB |
| #4 | Auth | M | - |
| #5 | Newsletter | S | - |
| #6 | Partage social | S | #2 |
| #7 | SEO | S | #2 |
| #8 | Admin | S | #4 |

**Total estimé : ~3-4 jours de développement (agent)**
