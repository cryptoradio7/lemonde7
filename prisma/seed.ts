import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed...');

  // Créer les catégories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'politique' }, update: {}, create: { name: 'Politique', slug: 'politique', color: '#003189', order: 1 } }),
    prisma.category.upsert({ where: { slug: 'monde' }, update: {}, create: { name: 'Monde', slug: 'monde', color: '#2d3436', order: 2 } }),
    prisma.category.upsert({ where: { slug: 'economie' }, update: {}, create: { name: 'Économie', slug: 'economie', color: '#00b894', order: 3 } }),
    prisma.category.upsert({ where: { slug: 'culture' }, update: {}, create: { name: 'Culture', slug: 'culture', color: '#6c5ce7', order: 4 } }),
    prisma.category.upsert({ where: { slug: 'sport' }, update: {}, create: { name: 'Sport', slug: 'sport', color: '#e17055', order: 5 } }),
    prisma.category.upsert({ where: { slug: 'sciences' }, update: {}, create: { name: 'Sciences', slug: 'sciences', color: '#0984e3', order: 6 } }),
    prisma.category.upsert({ where: { slug: 'technologie' }, update: {}, create: { name: 'Technologie', slug: 'technologie', color: '#fd79a8', order: 7 } }),
    prisma.category.upsert({ where: { slug: 'sante' }, update: {}, create: { name: 'Santé', slug: 'sante', color: '#55efc4', order: 8 } }),
  ]);

  const [politique, monde, economie, culture, sport, sciences, technologie, sante] = categories;

  // Créer les auteurs
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lemonde7.fr' },
    update: {},
    create: {
      email: 'admin@lemonde7.fr',
      name: 'Rédaction Le Monde 7',
      password: hashedPassword,
      role: 'admin',
    },
  });

  const journalist1 = await prisma.user.upsert({
    where: { email: 'marie.dupont@lemonde7.fr' },
    update: {},
    create: {
      email: 'marie.dupont@lemonde7.fr',
      name: 'Marie Dupont',
      password: hashedPassword,
      role: 'editor',
    },
  });

  const journalist2 = await prisma.user.upsert({
    where: { email: 'thomas.martin@lemonde7.fr' },
    update: {},
    create: {
      email: 'thomas.martin@lemonde7.fr',
      name: 'Thomas Martin',
      password: hashedPassword,
      role: 'editor',
    },
  });

  // Créer les tags
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { slug: 'france' }, update: {}, create: { name: 'France', slug: 'france' } }),
    prisma.tag.upsert({ where: { slug: 'europe' }, update: {}, create: { name: 'Europe', slug: 'europe' } }),
    prisma.tag.upsert({ where: { slug: 'ia' }, update: {}, create: { name: 'Intelligence artificielle', slug: 'ia' } }),
    prisma.tag.upsert({ where: { slug: 'climat' }, update: {}, create: { name: 'Climat', slug: 'climat' } }),
    prisma.tag.upsert({ where: { slug: 'economie-mondiale' }, update: {}, create: { name: 'Économie mondiale', slug: 'economie-mondiale' } }),
  ]);

  // Articles
  const articles = [
    // Politique
    {
      title: "Réforme constitutionnelle : le gouvernement annonce un calendrier ambitieux",
      slug: "reforme-constitutionnelle-gouvernement-calendrier",
      excerpt: "Le Premier ministre a présenté hier les grandes lignes d'une réforme constitutionnelle qui vise à moderniser les institutions de la Ve République et à renforcer les droits des citoyens.",
      content: `Le gouvernement a dévoilé hier un projet de réforme constitutionnelle d'envergure, qui devrait être soumis au Parlement au cours du premier trimestre. Cette initiative, présentée comme l'une des plus ambitieuses depuis 1958, prévoit notamment la reconnaissance du droit à l'environnement dans le préambule de la Constitution, ainsi qu'une réforme en profondeur du Conseil économique et social.

« Nous avons une responsabilité historique », a déclaré le Premier ministre lors d'une conférence de presse à Matignon. « Les Françaises et les Français nous demandent d'agir avec courage et lucidité face aux défis du siècle. »

La réforme prévoit également une révision du mode de scrutin pour les élections législatives, avec l'introduction d'une dose de proportionnelle qui permettrait à davantage de formations politiques d'être représentées à l'Assemblée nationale. L'opposition a accueilli cette annonce avec scepticisme.

« On nous promet cette réforme depuis des années », a réagi le chef de file du principal parti d'opposition. « Nous attendons de voir le texte avant de nous prononcer. »

Les constitutionnalistes consultés par Le Monde 7 soulignent la complexité juridique de certaines dispositions envisagées, notamment celles touchant au partage des compétences entre l'État et les collectivités territoriales. Le calendrier parlementaire s'annonce chargé pour les mois à venir.`,
      imageUrl: "https://picsum.photos/seed/politique1/800/450",
      categoryId: politique.id,
      authorId: journalist1.id,
      readTime: 4,
      publishedAt: new Date('2026-03-25T08:00:00Z'),
    },
    {
      title: "Budget 2027 : les arbitrages difficiles face à la pression des marchés",
      slug: "budget-2027-arbitrages-pression-marches",
      excerpt: "Le ministère des Finances est contraint de revoir à la baisse plusieurs engagements de dépenses sous la pression des agences de notation et des investisseurs institutionnels.",
      content: `Les discussions budgétaires pour l'exercice 2027 s'annoncent particulièrement tendues au sein du gouvernement. Selon nos informations, Bercy doit composer avec une croissance moins dynamique que prévu et des recettes fiscales en deçà des projections initiales.

Les ministres de dépenses se sont réunis en séance de travail avec la direction du Budget pour examiner les pistes d'économie. Plusieurs programmes phares, notamment dans les domaines de la transition énergétique et de l'éducation, pourraient voir leurs crédits amputés.

Du côté des marchés financiers, la nervosité est palpable. Le spread entre les obligations françaises et allemandes a légèrement augmenté ces dernières semaines, signe que les investisseurs suivent de près l'évolution des finances publiques hexagonales.

« La France doit démontrer sa capacité à tenir ses engagements européens », estime un économiste de la Banque de France. « La crédibilité budgétaire est un bien précieux qu'il faut préserver. »

Le projet de loi de finances devra être déposé au Parlement avant la fin du mois de septembre, laissant peu de temps aux arbitrages. Les négociations avec les partenaires sociaux sur la réforme des retraites compliquent encore davantage l'équation.`,
      imageUrl: "https://picsum.photos/seed/budget1/800/450",
      categoryId: politique.id,
      authorId: journalist2.id,
      readTime: 5,
      publishedAt: new Date('2026-03-24T10:30:00Z'),
    },
    // Monde
    {
      title: "Sommet du G20 : les grandes puissances face au défi climatique",
      slug: "sommet-g20-grandes-puissances-defi-climatique",
      excerpt: "Les dirigeants des vingt plus grandes économies mondiales se réunissent cette semaine pour tenter de trouver un accord sur le financement de la transition énergétique.",
      content: `Le sommet du G20 s'est ouvert ce matin dans un contexte de tensions géopolitiques exacerbées. Les délégations des pays membres doivent trouver un terrain d'entente sur des questions aussi épineuses que le financement climatique, la régulation de l'intelligence artificielle et la réforme du système commercial international.

La question du financement des pays en développement pour faire face au changement climatique s'annonce comme le principal point de friction. Les nations insulaires et africaines réclament un fonds de 300 milliards de dollars par an d'ici 2030, une demande que plusieurs grandes puissances jugent irréaliste dans le contexte économique actuel.

« Nous ne pouvons pas continuer à promettre et à ne pas tenir », a lancé le représentant d'un État insulaire du Pacifique lors de la session d'ouverture. « Nos îles sont en train de disparaître sous les eaux. Ce n'est pas une métaphore, c'est une réalité quotidienne. »

Les négociateurs travaillent également sur un accord-cadre concernant la régulation des systèmes d'intelligence artificielle à usage militaire, sujet qui divise profondément les participants. Les États-Unis et la Chine, dont les relations restent tendues, ont signalé leur disponibilité pour des discussions bilatérales en marge du sommet.`,
      imageUrl: "https://picsum.photos/seed/g20/800/450",
      categoryId: monde.id,
      authorId: admin.id,
      readTime: 6,
      publishedAt: new Date('2026-03-25T06:00:00Z'),
    },
    {
      title: "Ukraine : les négociations de paix avancent prudemment",
      slug: "ukraine-negociations-paix-avancent",
      excerpt: "Des émissaires des deux parties se sont réunis à Genève pour des discussions préliminaires sous l'égide des Nations unies. Un cessez-le-feu partiel semble à portée.",
      content: `Des représentants ukrainiens et russes ont tenu des discussions préliminaires à Genève sous la médiation des Nations unies. Ces pourparlers discrets, qui se tiennent dans le plus grand secret, pourraient marquer un tournant dans un conflit qui dure depuis plusieurs années.

Selon des sources diplomatiques proches des négociations, les discussions portent principalement sur la mise en place d'un cessez-le-feu humanitaire dans plusieurs zones de conflit, permettant l'évacuation de civils et la livraison d'aide humanitaire.

La position ukrainienne reste ferme sur la question de l'intégrité territoriale, tandis que la délégation russe insiste sur des garanties de sécurité. Ces deux exigences fondamentales rendent tout accord global encore très distant.

Les partenaires européens, qui suivent de près ces développements, ont exprimé leur soutien à la médiation onusienne tout en réaffirmant leur attachement au droit international. La question des sanctions économiques reste un outil de pression dont l'éventuelle levée partielle pourrait faciliter les négociations.`,
      imageUrl: "https://picsum.photos/seed/ukraine/800/450",
      categoryId: monde.id,
      authorId: journalist1.id,
      readTime: 5,
      publishedAt: new Date('2026-03-23T09:15:00Z'),
    },
    // Économie
    {
      title: "L'inflation recule enfin : les ménages peuvent-ils souffler ?",
      slug: "inflation-recule-menages-souffler",
      excerpt: "L'INSEE annonce un taux d'inflation à 2,1% en février, son niveau le plus bas depuis trois ans. Les économistes s'interrogent sur la durabilité de cette accalmie.",
      content: `L'Institut national de la statistique et des études économiques (INSEE) a publié hier ses chiffres d'inflation pour le mois de février : 2,1% en glissement annuel, son niveau le plus bas depuis 2023. Une bouffée d'air pour les ménages français, qui ont vu leur pouvoir d'achat grignoté par plusieurs années de hausses de prix.

Cette détente s'explique principalement par la baisse des prix de l'énergie et la stabilisation des prix alimentaires. Les prix des produits frais restent cependant volatils, et certains postes comme les services continuent de progresser à un rythme soutenu.

« C'est une bonne nouvelle, mais la prudence s'impose », tempère un économiste de l'Observatoire français des conjonctures économiques (OFCE). « L'inflation sous-jacente, qui exclut l'énergie et l'alimentation, reste encore trop élevée pour que la Banque centrale européenne puisse envisager de nouvelles baisses de taux à court terme. »

Pour les ménages, l'impact concret reste limité à court terme. Les loyers, les assurances et les mutuelles continuent d'augmenter, pesant sur le budget des plus modestes. Les négociations salariales du printemps seront cruciales pour déterminer si le pouvoir d'achat peut réellement se redresser.`,
      imageUrl: "https://picsum.photos/seed/inflation/800/450",
      categoryId: economie.id,
      authorId: journalist2.id,
      readTime: 4,
      publishedAt: new Date('2026-03-22T08:45:00Z'),
    },
    {
      title: "Airbus commande record : l'aéronautique européenne repart",
      slug: "airbus-commande-record-aeronautique-europeenne",
      excerpt: "L'avionneur européen annonce une commande de 400 appareils passée par un consortium de compagnies asiatiques, une transaction estimée à 50 milliards d'euros.",
      content: `Airbus a annoncé hier avoir signé une commande historique pour 400 appareils auprès d'un consortium regroupant cinq compagnies aériennes asiatiques. Cette transaction, la plus importante de l'histoire de l'avionneur européen, est évaluée à plus de 50 milliards d'euros aux prix catalogue.

La commande porte principalement sur des A320neo, la famille d'appareils monocouloir qui représente l'essentiel des livraisons d'Airbus, mais comprend également une cinquantaine d'A350, le long-courrier phare de la gamme. Les livraisons s'échelonneront de 2028 à 2035.

Cette annonce confirme la vigueur retrouvée du trafic aérien en Asie-Pacifique, région qui devrait représenter le principal moteur de croissance du transport aérien mondial dans les prochaines décennies. Elle renforce également la position d'Airbus face à son rival américain Boeing, qui traverse une période difficile.

Sur le plan industriel, cette commande signifie une montée en cadence de la production à Toulouse et dans les autres sites du groupe. Des centaines d'emplois devraient être créés dans la chaîne d'approvisionnement française et européenne.`,
      imageUrl: "https://picsum.photos/seed/airbus/800/450",
      categoryId: economie.id,
      authorId: journalist1.id,
      readTime: 4,
      publishedAt: new Date('2026-03-21T11:00:00Z'),
    },
    // Culture
    {
      title: "César 2026 : triomphe pour un film sur la mémoire coloniale",
      slug: "cesar-2026-triomphe-film-memoire-coloniale",
      excerpt: "Le long-métrage de la réalisatrice Amara Diallo remporte cinq statuettes, dont celle du meilleur film, dans une cérémonie marquée par des discours engagés.",
      content: `La 51e cérémonie des César a sacré hier soir « Les Silences de la savane », le second long-métrage d'Amara Diallo, qui repart avec cinq récompenses dont celles du meilleur film, de la meilleure réalisation et de la meilleure actrice. Un triomphe unanimement salué par la presse spécialisée.

Le film, qui retrace l'histoire d'une famille franco-sénégalaise sur trois générations, aborde frontalement la question des mémoires coloniales et de leurs héritages contemporains. Coproduit par des sociétés françaises et sénégalaises, il avait été présenté en compétition à Cannes l'année dernière.

Dans son discours de remerciement, Amara Diallo a rendu hommage aux « invisibles de l'histoire », ces femmes et ces hommes dont les récits n'ont pas encore trouvé leur place dans les livres scolaires ni dans la mémoire collective française. Un discours qui a valu à la réalisatrice une longue standing ovation.

La soirée a également été marquée par le César d'honneur remis à l'actrice Isabelle Adjani, dont la carrière s'étale sur cinq décennies. L'actrice, visiblement émue, a évoqué ses débuts et rendu hommage aux jeunes talents qui « portent le cinéma français vers de nouveaux horizons ».`,
      imageUrl: "https://picsum.photos/seed/cesar/800/450",
      categoryId: culture.id,
      authorId: journalist2.id,
      readTime: 4,
      publishedAt: new Date('2026-03-25T07:30:00Z'),
    },
    {
      title: "Exposition Picasso au Grand Palais : un demi-million de visiteurs en deux mois",
      slug: "exposition-picasso-grand-palais-visiteurs",
      excerpt: "L'exposition rétrospective dédiée au peintre espagnol bat des records d'affluence et confirme la puissance d'attraction des grands maîtres de la modernité.",
      content: `L'exposition « Picasso, l'insomnie créatrice » présentée au Grand Palais de Paris vient de franchir le cap du demi-million de visiteurs, deux mois seulement après son ouverture. Un record pour une exposition française depuis la réouverture du monument rénové.

La rétrospective, qui rassemble plus de 300 œuvres provenant de musées du monde entier, offre un regard inédit sur les années de la maturité du peintre, de 1950 à sa mort en 1973. Elle met en lumière des séries moins connues du grand public, notamment ses variations sur les maîtres anciens.

« Picasso n'a jamais cessé de se réinventer, même à 90 ans », explique la commissaire de l'exposition, Christine Lefebvre. « C'est peut-être le secret de sa fascination permanente sur les spectateurs de toutes générations. »

Les files d'attente, parfois de deux heures en week-end, témoignent de l'engouement populaire pour l'art de Picasso, dont certaines œuvres restent parmi les plus chères jamais vendues aux enchères. L'exposition se prolonge jusqu'au 15 juin.`,
      imageUrl: "https://picsum.photos/seed/picasso/800/450",
      categoryId: culture.id,
      authorId: admin.id,
      readTime: 3,
      publishedAt: new Date('2026-03-20T09:00:00Z'),
    },
    // Sport
    {
      title: "Ligue des champions : le PSG en quarts de finale après un match épique",
      slug: "ligue-champions-psg-quarts-finale",
      excerpt: "Les Parisiens se sont qualifiés aux tirs au but après une rencontre haletante contre le FC Barcelone, qui restera dans les annales du football européen.",
      content: `Le Paris Saint-Germain s'est qualifié pour les quarts de finale de la Ligue des champions en s'imposant aux tirs au but face au FC Barcelone, au terme d'un match d'anthologie qui s'est terminé 3-3 après prolongations.

Menés 2-0 à la pause, les Parisiens ont réalisé un retour spectaculaire en deuxième mi-temps, portés par un public du Parc des Princes en ébullition. Le but égalisateur de Mbappé à la 89e minute a soulevé les 48 000 spectateurs présents dans l'enceinte de la porte d'Auteuil.

En prolongations, les deux équipes ont chacune inscrit un but supplémentaire, portant le score à 3-3. La séance de tirs au but a tourné en faveur des Parisiens grâce à trois arrêts décisifs du gardien franco-costaricain.

« C'est la nuit la plus folle de ma carrière », a déclaré le capitaine parisien en zone mixte. « Nous n'avons jamais douté, même quand on était menés. C'est ça, l'ADN de ce club. »

En quarts de finale, le PSG affrontera le vainqueur du duel entre Manchester City et l'Atlético de Madrid. Le tirage au sort aura lieu jeudi au siège de l'UEFA à Nyon.`,
      imageUrl: "https://picsum.photos/seed/psg/800/450",
      categoryId: sport.id,
      authorId: journalist2.id,
      readTime: 4,
      publishedAt: new Date('2026-03-25T23:00:00Z'),
    },
    {
      title: "Roland-Garros 2026 : le tableau des favoris se dessine",
      slug: "roland-garros-2026-favoris-tableau",
      excerpt: "À deux mois du début du tournoi parisien, les résultats sur terre battue permettent de dégager les principaux favoris. Les Français nourissent de belles ambitions.",
      content: `La saison sur terre battue bat son plein et les premières indications sur l'état de forme des prétendants au titre à Roland-Garros se précisent. À deux mois du coup d'envoi du tournoi du Grand Chelem le plus relevé de la saison, le tableau des favoris commence à se dessiner.

Du côté des hommes, le tenant du titre espagnol Carlos Alcaraz reste la référence sur terre battue malgré une préparation perturbée par une blessure au genou. Son principal rival sera le Serbe Novak Djokovic, qui à 38 ans affiche une forme remarquable après sa victoire à Monte-Carlo.

Côté français, Arthur Fils est monté dans la hiérarchie mondiale au fil des mois et nourrit de réelles ambitions pour le tournoi qui se déroule à domicile. Sa victoire au tournoi de Rome il y a deux ans reste une référence.

Chez les femmes, la Biélorusse Aryna Sabalenka et la Polonaise Iga Swiatek font figure de grandes favorites, mais la jeune Française Océane Dodin, révélation de cette saison, pourrait créer la surprise si elle confirme ses récentes performances.

Les organisateurs attendent plus de 450 000 spectateurs pour cette édition, qui se tient du 24 mai au 7 juin dans le cadre rénové du stade Roland-Garros.`,
      imageUrl: "https://picsum.photos/seed/tennis/800/450",
      categoryId: sport.id,
      authorId: journalist1.id,
      readTime: 4,
      publishedAt: new Date('2026-03-24T14:00:00Z'),
    },
    // Sciences
    {
      title: "Découverte majeure : un nouveau médicament contre Alzheimer montre des résultats prometteurs",
      slug: "decouverte-medicament-alzheimer-resultats-prometteurs",
      excerpt: "Une équipe de chercheurs franco-américains publie les résultats d'un essai clinique de phase III qui pourrait ouvrir une nouvelle ère dans le traitement de la maladie d'Alzheimer.",
      content: `Une équipe de chercheurs de l'Inserm et du Massachusetts Institute of Technology a publié dans la revue Nature Medicine les résultats d'un essai clinique de phase III portant sur un nouveau traitement contre la maladie d'Alzheimer. Ces résultats, présentés comme « historiques » par certains experts, montrent un ralentissement significatif de la progression de la maladie chez les patients traités.

L'essai a porté sur 2 800 patients atteints de la forme légère à modérée de la maladie, répartis dans 15 pays. Après 18 mois de traitement, le groupe traité par le nouveau médicament, baptisé Alzhérine, présentait un déclin cognitif 35% plus lent que le groupe placebo.

« C'est une avancée considérable, même si nous restons prudents », a déclaré le professeur Jean-Michel Tremblay, directeur de l'essai à Paris. « Il ne s'agit pas d'un remède, mais d'un traitement qui peut offrir aux patients plusieurs années de vie autonome supplémentaires. »

Les effets secondaires observés restent modérés, principalement des nausées et des maux de tête dans les premières semaines de traitement. La demande d'autorisation de mise sur le marché devrait être déposée auprès de l'Agence européenne des médicaments dans les prochains mois.`,
      imageUrl: "https://picsum.photos/seed/alzheimer/800/450",
      categoryId: sciences.id,
      authorId: admin.id,
      readTime: 5,
      publishedAt: new Date('2026-03-23T07:00:00Z'),
    },
    {
      title: "Mission lunaire Artémis : une astronaute française dans l'équipage",
      slug: "mission-lunaire-artemis-astronaute-francaise",
      excerpt: "L'ESA annonce la sélection de Sophie Marchand pour participer à la mission Artémis IV, qui emmènera des humains sur la Lune pour la première fois depuis 1972.",
      content: `L'Agence spatiale européenne (ESA) a annoncé hier la sélection de l'astronaute française Sophie Marchand pour faire partie de l'équipage de la mission Artémis IV, prévue pour 2027. Elle sera la première Française et la deuxième Européenne à fouler le sol lunaire.

Sophie Marchand, 42 ans, ingénieure aérospatiale de formation, est astronaute professionnelle depuis 2020. Elle a effectué un séjour de six mois à bord de la Station spatiale internationale et s'est notamment distinguée par ses expériences en biologie spatiale.

« C'est le rêve de toute une vie qui devient réalité », a déclaré l'astronaute lors d'une conférence de presse au siège de l'ESA à Paris. « Je pense à toutes les petites filles qui regardent le ciel la nuit et qui rêvent d'étoiles. Ce voyage est aussi le leur. »

La mission Artémis IV, qui mobilisera la fusée SLS de la NASA et le vaisseau Orion, posera ses astronautes dans la région du pôle sud lunaire, là où d'importantes réserves de glace d'eau ont été détectées. L'exploration de ces ressources est considérée comme un préalable essentiel à l'établissement d'une présence humaine durable sur la Lune.`,
      imageUrl: "https://picsum.photos/seed/lune/800/450",
      categoryId: sciences.id,
      authorId: journalist2.id,
      readTime: 4,
      publishedAt: new Date('2026-03-22T11:30:00Z'),
    },
    // Technologie
    {
      title: "Intelligence artificielle : l'Europe veut imposer ses règles au monde",
      slug: "intelligence-artificielle-europe-regles-monde",
      excerpt: "L'AI Act européen entre en vigueur, avec des implications mondiales pour les géants de la tech américains et chinois opérant sur le territoire de l'Union.",
      content: `L'AI Act, le premier cadre réglementaire complet au monde sur l'intelligence artificielle, est désormais pleinement applicable dans l'ensemble des 27 États membres de l'Union européenne. Cette réglementation pionnière impose des obligations strictes aux développeurs et utilisateurs de systèmes d'IA, selon leur niveau de risque.

Les systèmes d'IA dits « à haut risque » — utilisés notamment dans les domaines de la santé, de la justice, ou des ressources humaines — devront être certifiés et soumis à des audits réguliers. Les systèmes d'IA généraux, comme les grands modèles de langage, devront respecter des obligations de transparence et de protection des droits d'auteur.

Pour les géants américains comme Google, Microsoft et Meta, ainsi que les acteurs chinois présents en Europe, cette réglementation représente un défi de conformité considérable. Des investissements massifs dans les équipes juridiques et de compliance sont en cours.

« L'Europe a choisi d'être le législateur du monde numérique », analyse un expert en droit du numérique. « Comme avec le RGPD, les entreprises du monde entier vont devoir s'adapter, que ça leur plaise ou non. »

Les associations de défense des droits civiques saluent globalement cette réglementation, tout en regrettant certaines exemptions accordées aux forces de l'ordre et aux services de renseignement.`,
      imageUrl: "https://picsum.photos/seed/ia-europe/800/450",
      categoryId: technologie.id,
      authorId: journalist1.id,
      readTime: 5,
      publishedAt: new Date('2026-03-21T08:00:00Z'),
    },
    {
      title: "Cybersécurité : une attaque massive vise les hôpitaux européens",
      slug: "cybersecurite-attaque-massive-hopitaux-europeens",
      excerpt: "Des hackers ont ciblé simultanément des dizaines d'établissements de santé en France, en Allemagne et en Espagne. Le bilan humain pourrait être lourd.",
      content: `Une vague d'attaques informatiques d'une ampleur inédite a frappé simultanément plusieurs dizaines d'hôpitaux et cliniques en France, en Allemagne et en Espagne. Les systèmes informatiques de ces établissements ont été paralysés par un ransomware sophistiqué, forçant des transferts d'urgence de patients et l'annulation de milliers d'opérations programmées.

En France, le ministère de la Santé a activé la cellule de crise nationale et demandé à l'Agence nationale de sécurité des systèmes d'information (ANSSI) de coordonner la réponse. Quatorze établissements sont concernés, dont plusieurs CHU.

Les hackers, dont l'identité n'est pas encore établie avec certitude, exigent des rançons en cryptomonnaies pour débloquer les systèmes. Les gouvernements concernés ont formellement exclu tout paiement.

« Cette attaque est d'une gravité exceptionnelle car elle cible directement des vies humaines », a déclaré le directeur de l'ANSSI lors d'une conférence de presse. « Nous mobilisons toutes nos équipes et coopérons étroitement avec nos partenaires européens. »

Europol et le FBI ont été saisis et leurs équipes cybercriminalité travaillent à identifier les responsables. Des sources proches de l'enquête évoquent la piste d'un groupe criminel russophone.`,
      imageUrl: "https://picsum.photos/seed/cybersec/800/450",
      categoryId: technologie.id,
      authorId: admin.id,
      readTime: 5,
      publishedAt: new Date('2026-03-24T05:30:00Z'),
    },
    // Santé
    {
      title: "Santé mentale des jeunes : une crise silencieuse qui s'aggrave",
      slug: "sante-mentale-jeunes-crise-silencieuse",
      excerpt: "Un rapport de l'Observatoire national de la santé alerte sur la progression des troubles anxieux et dépressifs chez les 15-25 ans, un phénomène amplifié par l'usage des réseaux sociaux.",
      content: `L'Observatoire national de la santé a publié hier son rapport annuel sur la santé mentale des jeunes, dressant un tableau préoccupant. Selon cette étude qui porte sur un échantillon de 15 000 jeunes âgés de 15 à 25 ans, 28% d'entre eux déclarent souffrir de troubles anxieux significatifs, et 18% présentent des symptômes dépressifs.

Ces chiffres, en hausse de 40% par rapport à l'enquête précédente réalisée en 2022, confirment la tendance observée dans de nombreux pays occidentaux. La pandémie de COVID-19, qui a coïncidé avec une période de développement crucial pour ces générations, reste l'un des facteurs explicatifs principaux.

Mais le rapport pointe également le rôle des réseaux sociaux, en particulier des plateformes à base de vidéos courtes, dans la dégradation du bien-être psychologique. « Le lien entre temps d'écran excessif et troubles de l'humeur est désormais scientifiquement établi pour les adolescents », explique la responsable de l'étude.

Face à cette situation, les pouvoirs publics peinent à apporter une réponse à la hauteur. Les délais d'attente pour consulter un psychiatre ou un psychologue en ville restent en moyenne de plusieurs mois. L'Observatoire appelle à un « plan d'urgence » pour la santé mentale des jeunes.`,
      imageUrl: "https://picsum.photos/seed/santementale/800/450",
      categoryId: sante.id,
      authorId: journalist2.id,
      readTime: 5,
      publishedAt: new Date('2026-03-20T10:00:00Z'),
    },
    {
      title: "Canicule précoce : les autorités sanitaires appellent à la vigilance",
      slug: "canicule-precoce-autorites-sanitaires-vigilance",
      excerpt: "Des températures exceptionnellement élevées pour la saison sont attendues la semaine prochaine dans le sud de la France. Météo-France place six départements en vigilance orange.",
      content: `Météo-France a placé six départements du sud de la France en vigilance orange canicule à partir de lundi prochain. Les températures attendues, entre 35 et 38 degrés dans les zones les plus exposées, sont particulièrement inhabituelles pour la fin du mois de mars.

Santé publique France a activé le plan canicule anticipé et demande aux préfets de mettre en place les dispositifs d'alerte et d'assistance aux personnes vulnérables. Les établissements d'hébergement pour personnes âgées dépendantes (EHPAD) ont été invités à vérifier l'état de climatisation de leurs installations.

« Ce type d'épisode en mars est extrêmement rare et constitue un signal supplémentaire des effets du changement climatique sur notre pays », a déclaré une climatologue de Météo-France. « Nous devons nous préparer à une normalisation de ces événements extrêmes. »

Les services d'urgences des départements concernés se préparent à une hausse des consultations liées à la chaleur : déshydratation, malaises, et coups de chaleur. La population est invitée à se tenir informée de l'évolution de la situation via les canaux officiels.`,
      imageUrl: "https://picsum.photos/seed/canicule/800/450",
      categoryId: sante.id,
      authorId: journalist1.id,
      readTime: 3,
      publishedAt: new Date('2026-03-26T07:00:00Z'),
    },
    // Articles supplémentaires
    {
      title: "Le retour du vinyl : quand la nostalgie rencontre l'audiophile moderne",
      slug: "retour-vinyl-nostalgie-audiophile",
      excerpt: "Les ventes de disques vinyle ont dépassé celles du CD pour la troisième année consécutive. Ce phénomène dépasse la simple nostalgie pour toucher une nouvelle génération d'auditeurs.",
      content: `Les ventes de disques vinyles ont dépassé celles des CD en France pour la troisième année consécutive, selon les chiffres publiés par le Syndicat national de l'édition phonographique (SNEP). Un phénomène qui s'inscrit dans une tendance mondiale et qui touche désormais bien au-delà des amateurs de musique de rock ou de jazz.

Ce retour du vinyle ne s'explique pas uniquement par la nostalgie. Nombre d'acheteurs sont des jeunes de moins de 30 ans qui n'ont jamais connu cette technologie dans leur enfance. Ils sont attirés par le rituel de l'écoute, la chaleur supposée du son analogique, et l'objet physique dans une époque de dématérialisation totale de la musique.

Les grandes enseignes culturelles ont rouvert ou étoffé leurs rayons vinyle, et de nouvelles boutiques spécialisées ont ouvert dans les grandes villes françaises. Les pressings européens tournent à plein régime, avec des délais de fabrication qui s'allongent.

« Le vinyle, c'est une façon de dire que la musique mérite qu'on lui consacre du temps et de l'attention », explique un disquaire parisien dont la boutique ne désemplit pas. « C'est une résistance au zapping perpétuel. »`,
      imageUrl: "https://picsum.photos/seed/vinyl/800/450",
      categoryId: culture.id,
      authorId: journalist1.id,
      readTime: 4,
      publishedAt: new Date('2026-03-19T14:00:00Z'),
    },
    {
      title: "Jeux olympiques de Los Angeles 2028 : la France prépare ses ambitions",
      slug: "jeux-olympiques-los-angeles-2028-france-ambitions",
      excerpt: "Deux ans après le triomphe de Paris 2024, le Comité olympique français annonce un plan d'investissement massif pour préparer les athlètes aux JO de Los Angeles.",
      content: `Le Comité national olympique et sportif français (CNOSF) a présenté son plan de préparation pour les Jeux olympiques de Los Angeles 2028. Tirant les leçons du succès de Paris 2024, où la France avait terminé cinquième au tableau des médailles avec 16 titres olympiques, le CNOSF vise une place dans le top 4 mondial dans deux ans.

Un budget de 280 millions d'euros sur quatre ans a été dégagé pour accompagner les fédérations dans leurs programmes de détection et de formation des talents. Les disciplines où la France est traditionnellement forte — judo, escrime, cyclisme, athlétisme — bénéficieront de moyens renforcés.

La question de la préparation à la chaleur californienne, avec des épreuves en plein été à Los Angeles, est l'un des défis majeurs identifiés par le staff médical. Des centres de préparation climatisés et des protocoles d'acclimatation sont en cours d'élaboration.

« Notre objectif est clair : faire mieux qu'à Paris », a déclaré la présidente du CNOSF. « Nos athlètes ont montré à la face du monde ce dont ils sont capables. Avec les bons moyens et la bonne préparation, nous pouvons viser encore plus haut. »`,
      imageUrl: "https://picsum.photos/seed/jo2028/800/450",
      categoryId: sport.id,
      authorId: admin.id,
      readTime: 4,
      publishedAt: new Date('2026-03-18T08:00:00Z'),
    },
    {
      title: "Logement : la crise s'approfondit dans les grandes métropoles",
      slug: "logement-crise-approfondit-grandes-metropoles",
      excerpt: "Paris, Lyon, Bordeaux et Toulouse voient leurs tensions immobilières s'aggraver. Le nombre de sans-abri a augmenté de 15% en un an selon la Fondation Abbé Pierre.",
      content: `La Fondation Abbé Pierre a publié son rapport annuel sur l'état du mal-logement en France, dressant un bilan préoccupant. Selon cette étude, 4,2 millions de personnes sont actuellement mal logées en France, dont 330 000 sans domicile fixe — un chiffre en hausse de 15% sur un an.

Dans les grandes métropoles, la crise du logement prend des proportions alarmantes. À Paris, le délai d'attente pour un logement social dépasse désormais 12 ans en moyenne. À Lyon et Bordeaux, la situation n'est guère meilleure, avec une pénurie de logements abordables qui chasse les classes moyennes vers des périphéries toujours plus lointaines.

Les maires des grandes villes réclament des moyens supplémentaires de l'État pour construire davantage de logements sociaux et encadrer les loyers. « Nous ne pouvons pas résoudre seuls une crise qui a des causes nationales », a déclaré la maire de Paris lors d'une conférence de presse conjointe avec ses homologues de Lyon et Marseille.

Les professionnels de l'immobilier pointent de leur côté la complexité des réglementations d'urbanisme et la frilosité des investisseurs comme obstacles à la construction neuve. Le gouvernement promet une grande loi logement pour la rentrée.`,
      imageUrl: "https://picsum.photos/seed/logement/800/450",
      categoryId: economie.id,
      authorId: journalist2.id,
      readTime: 5,
      publishedAt: new Date('2026-03-17T09:30:00Z'),
    },
    {
      title: "Agriculture : les agriculteurs de retour dans les rues",
      slug: "agriculture-agriculteurs-retour-rues",
      excerpt: "Des convois de tracteurs ont bloqué plusieurs axes routiers autour des grandes villes françaises pour protester contre la concurrence des produits importés et la baisse des aides européennes.",
      content: `Des centaines de tracteurs ont formé des convois de protestation autour des grandes villes françaises, bloquant pendant plusieurs heures des axes routiers importants. Ce mouvement, coordonné par plusieurs syndicats agricoles dont la FNSEA et la Confédération paysanne, exprime le ras-le-bol d'agriculteurs qui estiment que leurs revendications n'ont pas été entendues depuis la vague de mobilisations de 2024.

Les griefs sont multiples : concurrence des produits agricoles importés à des prix inférieurs aux coûts de production européens, complexité des normes environnementales, baisse programmée des aides de la Politique agricole commune (PAC) à partir de 2028, et difficultés d'accès au crédit pour les jeunes qui souhaitent s'installer.

Le ministre de l'Agriculture a reçu des représentants des syndicats en urgence pour tenter de désamorcer la crise. Les discussions ont porté notamment sur des mesures de protection commerciale vis-à-vis des importations des pays tiers qui ne respectent pas les normes sanitaires et environnementales européennes.

« Nous voulons des actes, pas des promesses », a résumé un éleveur bovin du Lot-et-Garonne au micro de nos journalistes. « Si la France ne protège pas ses paysans, dans dix ans il n'y aura plus d'agriculture française. »`,
      imageUrl: "https://picsum.photos/seed/agriculture/800/450",
      categoryId: politique.id,
      authorId: journalist1.id,
      readTime: 4,
      publishedAt: new Date('2026-03-16T11:00:00Z'),
    },
    {
      title: "Transition énergétique : la France construit son premier réacteur EPR2",
      slug: "transition-energetique-france-premier-reacteur-epr2",
      excerpt: "Le chantier du réacteur EPR2 de Penly a officiellement débuté. Ce projet stratégique représente un investissement de 12 milliards d'euros et devrait créer 10 000 emplois directs.",
      content: `La première pierre du réacteur EPR2 de la centrale nucléaire de Penly, en Seine-Maritime, a été posée hier en présence du Président de la République et du directeur général d'EDF. Ce lancement marque le début d'une relance nucléaire ambitieuse après des décennies d'atermoiements politiques.

Le réacteur EPR2, nouvelle génération du modèle européen à eau pressurisée, tire les leçons des difficultés rencontrées lors de la construction des réacteurs de Flamanville et de Hinkley Point au Royaume-Uni. Sa conception simplifiée vise à faciliter la construction et à réduire les risques de dépassements de coûts et de délais.

Ce premier réacteur devrait être mis en service en 2035, suivi par un second à Penly. EDF prévoit de lancer ensuite la construction de six réacteurs supplémentaires sur d'autres sites français pour un programme total de 14 réacteurs d'ici 2050.

L'investissement, estimé à 12 milliards d'euros par réacteur, représente un pari industriel considérable sur l'avenir. Il est présenté par le gouvernement comme un pilier de la stratégie de décarbonation de l'économie française, complémentaire au développement des énergies renouvelables.`,
      imageUrl: "https://picsum.photos/seed/nucleaire/800/450",
      categoryId: sciences.id,
      authorId: admin.id,
      readTime: 5,
      publishedAt: new Date('2026-03-15T08:00:00Z'),
    },
    {
      title: "Tourisme : la France reste la première destination mondiale",
      slug: "tourisme-france-premiere-destination-mondiale",
      excerpt: "Avec 105 millions de visiteurs étrangers en 2025, la France consolide sa position de numéro un mondial du tourisme, portée par le succès des JO de Paris 2024.",
      content: `L'Organisation mondiale du tourisme a confirmé que la France demeure la première destination touristique mondiale avec 105 millions de visiteurs internationaux enregistrés en 2025. Un chiffre record qui confirme l'effet durable des Jeux olympiques de Paris 2024 sur l'attractivité touristique du pays.

Paris reste la ville la plus visitée d'Europe, devant Londres et Rome, mais d'autres régions françaises bénéficient elles aussi d'un afflux croissant de touristes. La Provence-Alpes-Côte d'Azur, la Bretagne et l'Alsace ont enregistré des records de fréquentation, témoignant d'une meilleure distribution géographique des flux touristiques.

Les retombées économiques sont considérables : le tourisme international a généré 74 milliards d'euros de recettes pour l'économie française en 2025, soit une hausse de 12% par rapport à 2024. L'emploi touristique représente désormais 1,3 million de postes directs.

Le secteur doit cependant faire face à des défis : saturation de certains sites emblématiques, empreinte carbone du tourisme aérien, et gestion des conflits d'usage avec les résidents locaux. Des plans de « tourisme durable » sont en cours d'élaboration dans plusieurs destinations emblématiques.`,
      imageUrl: "https://picsum.photos/seed/tourisme/800/450",
      categoryId: economie.id,
      authorId: journalist2.id,
      readTime: 3,
      publishedAt: new Date('2026-03-14T10:00:00Z'),
    },
    {
      title: "Intelligence artificielle et éducation : le grand défi des enseignants",
      slug: "intelligence-artificielle-education-defi-enseignants",
      excerpt: "L'irruption de ChatGPT et de ses successeurs dans les classes bouleverse les pratiques pédagogiques. Enseignants et institutions cherchent encore leurs marques.",
      content: `Deux ans après l'explosion de l'usage de l'intelligence artificielle générative dans les établissements scolaires et universitaires, la question de l'intégration de ces outils dans les pratiques pédagogiques reste entière. Entre interdiction, tolérance et utilisation encadrée, les établissements français affichent des approches très disparates.

Au lycée, les professeurs de français et de philosophie sont en première ligne, confrontés à des copies rédigées en tout ou partie par des IA. Les outils de détection se sont multipliés, mais leur fiabilité reste insuffisante pour en faire la base de sanctions disciplinaires.

À l'université, certaines équipes pédagogiques ont choisi de repenser complètement leur évaluation pour s'adapter à cette réalité. Exit les dissertations à rendre chez soi — place aux exposés oraux, aux travaux de groupe en présentiel, aux projets qui valorisent la démarche plutôt que le résultat.

« L'IA ne va pas remplacer la pensée, mais elle oblige l'école à clarifier ce qu'elle cherche vraiment à développer chez les élèves », explique un enseignant de terminale qui expérimente depuis un an l'utilisation guidée de ChatGPT dans ses cours. « C'est un défi formidable, même si c'est épuisant. »

Le ministère de l'Éducation nationale promet des recommandations claires pour la rentrée de septembre.`,
      imageUrl: "https://picsum.photos/seed/ia-education/800/450",
      categoryId: technologie.id,
      authorId: journalist1.id,
      readTime: 5,
      publishedAt: new Date('2026-03-13T09:00:00Z'),
    },
    {
      title: "Biodiversité : une espèce de dauphin retrouvée en Méditerranée",
      slug: "biodiversite-dauphin-retrouve-mediterranee",
      excerpt: "Des scientifiques ont observé pour la première fois depuis 50 ans un groupe de dauphins communs à museau court dans les eaux françaises de Méditerranée.",
      content: `Des chercheurs du Groupe de recherche sur les cétacés (GREC) ont annoncé avoir observé un groupe de sept dauphins communs à museau court (Delphinus delphis) dans les eaux françaises de Méditerranée, une première depuis plus de cinquante ans dans cette région.

Cette observation, réalisée au large du Golfe du Lion, a été documentée par vidéo et confirmée par plusieurs experts. L'espèce, autrefois abondante en Méditerranée, avait pratiquement disparu de la mer intérieure dans les années 1970, victime de la surpêche, de la pollution et de la dégradation de son habitat.

« C'est une nouvelle extraordinaire », réagit la directrice du GREC. « Elle suggère que les efforts de protection de la Méditerranée commencent à porter leurs fruits. Mais il faut rester prudent : sept individus ne font pas une population. »

La Méditerranée est l'une des mers les plus polluées du monde et abrite encore plusieurs espèces de cétacés sous la menace, dont le grand dauphin, le dauphin bleu et blanc, et le cachalot. Les chercheurs appellent à un renforcement des zones marines protégées pour favoriser la reconstitution des populations.`,
      imageUrl: "https://picsum.photos/seed/dauphin/800/450",
      categoryId: sciences.id,
      authorId: journalist2.id,
      readTime: 3,
      publishedAt: new Date('2026-03-12T08:30:00Z'),
    },
    {
      title: "Mode : les créateurs français dominent les Fashion Weeks mondiales",
      slug: "mode-createurs-francais-dominent-fashion-weeks",
      excerpt: "Les défilés parisiens de la saison printemps-été ont confirmé la suprématie de la création française, avec des collections saluées unanimement par la critique internationale.",
      content: `La semaine de la mode de Paris a conclu la saison des Fashion Weeks mondiales avec un éclat particulier cette année. Les maisons françaises — Dior, Saint Laurent, Givenchy, Jacquemus — ont présenté des collections printemps-été qui ont suscité l'enthousiasme de la presse et des acheteurs internationaux.

Chez Dior, la directrice artistique a signé une collection d'une cohérence remarquable, explorant la relation entre les vêtements et le corps en mouvement. Le défilé, présenté dans les jardins du Musée Rodin, a été acclamé comme l'un des plus beaux de la décennie.

Jacquemus, dont le fondateur Simon Porte Jacquemus a été nommé directeur artistique d'une grande maison cette saison, a maintenu une dualité entre sa ligne signature décontractée et les exigences d'une maison de couture établie — avec un résultat qui a impressionné par sa maîtrise.

L'industrie de la mode française génère 150 milliards d'euros de revenus annuels et emploie directement 600 000 personnes. Dans un contexte économique incertain, le secteur du luxe reste l'un des rares à afficher une croissance robuste, tirée par la demande asiatique et américaine.`,
      imageUrl: "https://picsum.photos/seed/mode/800/450",
      categoryId: culture.id,
      authorId: admin.id,
      readTime: 3,
      publishedAt: new Date('2026-03-11T12:00:00Z'),
    },
    {
      title: "Retraites : le mouvement social reprend de l'ampleur",
      slug: "retraites-mouvement-social-reprend-ampleur",
      excerpt: "Les syndicats ont appelé à une nouvelle journée de grève nationale pour protester contre les décrets d'application de la réforme des retraites, qui durcissent certaines conditions.",
      content: `Les grandes centrales syndicales ont appelé à une nouvelle journée nationale de grève et de manifestations pour protester contre les décrets d'application de la réforme des retraites. Selon les organisations syndicales, ces textes réglementaires, publiés discrètement pendant les vacances d'hiver, durcissent certaines conditions d'accès à la retraite au-delà de ce qui avait été voté par le Parlement.

La CGT, la CFDT, FO et la CFTC ont publié un communiqué commun — une unité syndicale rare — pour dénoncer ce qu'ils qualifient de « trahison ». Les services publics, les transports et l'éducation nationale devraient être les secteurs les plus touchés par le mouvement.

Le gouvernement conteste l'interprétation syndicale des textes et assure que les décrets ne font que préciser les modalités d'application de la loi, sans en modifier l'esprit. Les experts juridiques consultés par Le Monde 7 donnent en partie raison aux syndicats sur au moins deux dispositions litigieuses.

La mobilisation de la rue sera scrutée de près : une participation massive relancerait un mouvement social qui avait semblé s'essouffler. Les sondages montrent qu'une majorité de Français reste opposée à la réforme.`,
      imageUrl: "https://picsum.photos/seed/retraites/800/450",
      categoryId: politique.id,
      authorId: journalist1.id,
      readTime: 4,
      publishedAt: new Date('2026-03-10T07:00:00Z'),
    },
    {
      title: "Gastronomie : trois nouveaux étoilés Michelin en France",
      slug: "gastronomie-trois-nouveaux-etoiles-michelin-france",
      excerpt: "Le Guide Michelin France 2026 a été dévoilé avec ses nouvelles étoiles. Trois restaurants obtiennent leur première distinction, dont deux en dehors de Paris.",
      content: `Le Guide Michelin France 2026 vient d'être dévoilé lors d'une cérémonie à Lyon, ville symbole de la gastronomie française. L'édition de cette année distingue 30 nouveaux étoilés, dont trois restaurants qui décrochent la très convoitée seconde étoile.

Parmi les lauréats les plus remarqués, le restaurant « L'Atelier des Saisons » à Bordeaux, porté par le chef Maxime Rousseau, 34 ans, reçoit sa première étoile pour une cuisine qui célèbre les produits du terroir girondin avec une technique irréprochable. À Rennes, « La Table de Claire » est également distinguée pour sa reinterprétation des classiques bretons.

La troisième étoile, qui consacre une institution parisienne du Marais, récompense une cuisine d'auteur qui mêle influences japonaises et tradition française avec une harmonie rare.

Cette édition du guide confirme la vitalité de la gastronomie française en régions, qui représente désormais 60% des nouvelles distinctions. La diversité des cuisines honorées — végane, bistronomique, gastronomique classique — témoigne de l'éclectisme et de la richesse de la scène culinaire hexagonale.`,
      imageUrl: "https://picsum.photos/seed/gastronomie/800/450",
      categoryId: culture.id,
      authorId: journalist2.id,
      readTime: 3,
      publishedAt: new Date('2026-03-09T14:00:00Z'),
    },
    {
      title: "Santé au travail : le télétravail a changé les comportements pour le meilleur et pour le pire",
      slug: "sante-travail-teletravail-comportements",
      excerpt: "Une étude de l'INRS dresse un bilan nuancé des cinq ans de généralisation du télétravail sur la santé physique et mentale des salariés français.",
      content: `L'Institut national de recherche et de sécurité pour la prévention des accidents du travail et des maladies professionnelles (INRS) publie une étude exhaustive sur l'impact du télétravail généralisé sur la santé des salariés français, cinq ans après qu'il est devenu la norme pour des millions de travailleurs.

Le bilan est contrasté. D'un côté, le télétravail a réduit le temps de transport, source importante de fatigue et de stress, et a permis à de nombreux salariés de mieux concilier vie professionnelle et familiale. Les arrêts maladie de courte durée ont légèrement diminué dans les populations de télétravailleurs réguliers.

De l'autre côté, l'étude identifie des effets négatifs préoccupants : augmentation des troubles musculo-squelettiques liés à des postes de travail inadaptés à domicile, progression de l'isolement social et des troubles anxieux chez les personnes vivant seules, et difficulté croissante à déconnecter du travail en dehors des heures.

« Le télétravail n'est ni une panacée ni un problème en soi. Tout dépend des conditions dans lesquelles il est pratiqué », synthétise le directeur de l'INRS. « Les employeurs ont des obligations légales en matière de santé au travail qui s'appliquent quelle que soit la localisation du salarié. »

L'étude recommande notamment d'encadrer les jours de présence au bureau pour maintenir les liens sociaux et de mieux équiper les salariés pour leur poste à domicile.`,
      imageUrl: "https://picsum.photos/seed/teletravail/800/450",
      categoryId: sante.id,
      authorId: admin.id,
      readTime: 5,
      publishedAt: new Date('2026-03-08T09:00:00Z'),
    },
    {
      title: "Énergie renouvelable : la France rattrape son retard sur l'éolien offshore",
      slug: "energie-renouvelable-france-retard-eolien-offshore",
      excerpt: "Avec l'inauguration du parc éolien en mer de Saint-Nazaire et l'avancement de plusieurs chantiers, la France commence enfin à exploiter son potentiel maritime.",
      content: `La France inaugure cette semaine le parc éolien offshore de Saint-Nazaire, le premier du pays à atteindre sa pleine capacité de production. Avec ses 80 turbines implantées au large de la Loire-Atlantique, il produira l'électricité nécessaire pour alimenter 700 000 foyers.

Ce lancement marque un tournant après des années de retard accumulé. La France, qui dispose de l'une des plus longues côtes d'Europe, a longtemps traîné les pieds sur l'éolien en mer, laissant ses voisins britanniques, danois et allemands prendre une longueur d'avance considérable.

Plusieurs autres parcs sont désormais en cours de construction le long des côtes françaises, notamment en Normandie et en Bretagne. Leur mise en service échelonnée jusqu'en 2030 permettra à la France de rattraper une partie de son retard.

« Nous avons perdu dix ans. C'est regrettable, mais il n'est pas trop tard », commente un expert des marchés de l'énergie. « L'éolien offshore a vocation à devenir l'une des principales sources d'électricité renouvelable dans la transition énergétique française. »

La filière industrielle de l'éolien en mer représente un enjeu économique majeur : les fabricants et installateurs emploient déjà 20 000 personnes en France, un chiffre qui devrait tripler d'ici 2030.`,
      imageUrl: "https://picsum.photos/seed/eolien/800/450",
      categoryId: sciences.id,
      authorId: journalist1.id,
      readTime: 4,
      publishedAt: new Date('2026-03-07T10:30:00Z'),
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }

  // Abonnés newsletter de test
  await prisma.newsletterSubscriber.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      isConfirmed: true,
    },
  });

  console.log(`✅ Seed terminé : ${articles.length} articles créés dans ${categories.length} catégories`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
