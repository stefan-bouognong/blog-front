import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import  founderImage  from '@/images/eliade.jpeg';
import { Target, BookOpen, Scale, MessageSquare } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header with Founder Image */}
            <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <img
                src={founderImage}
                alt="Eliade Kibangoud Mboungou"
                className="w-48 h-48 md:w-60 md:h-60 rounded-full object-cover shadow-xl ring-4 ring-primary/20"
              />

            </div>

              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                À propos du blog
              </h1>
              <p className="text-lg text-muted-foreground">
                Forum de Pensée Critique (FPC)
              </p>
            </div>

            {/* Content */}
            <div className="prose-content space-y-8">
              {/* Qui est derrière ce blog */}
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Qui est derrière ce blog ?
                </h2>
                
                <p className="text-lg leading-relaxed text-foreground/90 mb-4">
                  Ce blog, intitulé <strong>Forum de Pensée Critique (FPC)</strong>, a été créé par 
                  <strong> Eliade Kibangoud Mboungou</strong>, également connu sous les initiales <strong>EKM</strong>, 
                  en mars 2025. Initialement lancé sous le nom ECOBELCO (Économie belge et de la République du Congo), 
                  il a été repensé et restructuré en janvier 2026 pour devenir FPC, dans une logique d'élargissement 
                  intellectuel et éditorial.
                </p>

                <p className="text-lg leading-relaxed text-foreground/90 mb-4">
                  Économiste de formation et comptable financier de profession, Eliade est originaire de la 
                  République du Congo et réside actuellement en Belgique, pays qu'il considère comme un espace 
                  d'opportunités, de stabilité institutionnelle et d'expression démocratique. Né le 10 mars 1996, 
                  il a effectué ses études primaires et secondaires dans son pays natal avant de poursuivre un 
                  parcours académique et professionnel résolument international.
                </p>

                <p className="text-lg leading-relaxed text-foreground/90 mb-4">
                  Après un enseignement secondaire scientifique (série C) en République du Congo, il a renforcé 
                  ses compétences linguistiques et académiques au Ghana, avant de poursuivre des études supérieures 
                  en République populaire de Chine, où il a obtenu un bachelier en gestion et administration des 
                  affaires. Durant ce parcours, il s'est distingué par son engagement académique et associatif, 
                  figurant parmi les meilleurs étudiants étrangers de son université et représentant les étudiants 
                  internationaux durant deux années consécutives.
                </p>

                <p className="text-lg leading-relaxed text-foreground/90 mb-4">
                  Il a ensuite poursuivi un master en économie en Belgique, au sein d'une université reconnue 
                  pour son exigence académique et son ouverture internationale. Ce parcours lui a permis de 
                  développer une compréhension fine des politiques publiques, des mécanismes économiques et 
                  des réalités institutionnelles européennes.
                </p>

                <p className="text-lg leading-relaxed text-foreground/90 mb-4">
                  Sur le plan professionnel, Eliade a évolué dans des environnements internationaux, industriels 
                  et financiers, en Asie comme en Europe. Il a travaillé au sein de structures de grande envergure 
                  dans les secteurs du sport international, de l'assurance, de l'emploi, de la gestion financière 
                  et de l'économie (circulaire). Ces expériences lui ont permis et lui permettent de côtoyer des 
                  acteurs du monde industriel, entrepreneurial et institutionnel, et de développer une vision 
                  pragmatique des liens entre économie réelle, politiques publiques et performance organisationnelle.
                </p>

                <p className="text-lg leading-relaxed text-foreground/90">
                  En Belgique, il est actif dans des cercles économiques, académiques, associatifs et citoyens, 
                  où il échange avec des profils issus de sensibilités politiques diverses. Sans appartenance 
                  partisane, il privilégie le dialogue, l'analyse rigoureuse et l'indépendance intellectuelle.
                </p>
              </div>

              {/* Pourquoi ce blog */}
              <div className="pt-8 border-t border-border">
                <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Pourquoi ce blog ?
                </h2>
                
                <p className="text-lg leading-relaxed text-foreground/90 mb-4">
                  Le FPC – Forum de Pensée Critique est né d'un constat simple : 
                  <strong> le débat public souffre trop souvent de simplifications, de postures idéologiques 
                  rigides et de désinformation.</strong>
                </p>

                <p className="text-lg leading-relaxed text-foreground/90 mb-4">
                  À travers cet espace d'analyse, EKM entend contribuer de manière rigoureuse, libre et 
                  constructive aux débats économiques, sociaux et institutionnels, aussi bien en Belgique 
                  qu'en République du Congo — deux pays qui occupent une place centrale dans son parcours 
                  personnel, académique et professionnel ; bref : dans sa vie.
                </p>

                <p className="text-lg leading-relaxed text-foreground/90">
                  À ce titre, le FPC intègre également des analyses et explications sur des questions de 
                  finance appliquée et de gestion. Ces contenus visent à faciliter la compréhension de la 
                  finance à toutes les personnes intéressées et de relier les réalités économiques concrètes 
                  des entreprises et des ménages aux choix économiques, sociaux et institutionnels plus larges.
                </p>
              </div>

              {/* Le FPC se définit comme */}
              <div className="pt-8 border-t border-border">
                <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Le FPC se définit comme
                </h2>
                
                <div className="grid gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-foreground/90">
                      <strong>Un outil pédagogique</strong>, visant à rendre accessibles des enjeux complexes
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-foreground/90">
                      <strong>Un espace d'analyse indépendante</strong>, affranchi de toute logique partisane ou militante
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-foreground/90">
                      <strong>Un pont intellectuel</strong> entre l'Europe et l'Afrique, entre la diaspora et les 
                      réalités locales, entre réflexion théorique et expériences de terrain
                    </p>
                  </div>
                </div>
              </div>

              {/* Ligne éditoriale */}
              <div className="pt-8 border-t border-border">
                <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Scale className="h-6 w-6 text-primary" />
                  Ligne éditoriale
                </h2>
                
                <p className="text-lg leading-relaxed text-foreground/90 mb-6">
                  Le Forum de Pensée Critique repose sur des principes clairs :
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <p className="font-medium text-foreground">Neutralité politique assumée</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <p className="font-medium text-foreground">Liberté de ton et d'analyse</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <p className="font-medium text-foreground">Primauté des faits, des chiffres et des raisonnements</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <p className="font-medium text-foreground">Ouverture au débat contradictoire et pluraliste</p>
                  </div>
                </div>

                <p className="text-lg leading-relaxed text-foreground/90 mb-4">
                  Les analyses proposées peuvent parfois rejoindre des positions dites de gauche, parfois de 
                  droite, parfois aucune — non par opportunisme, mais parce qu'elles ne répondent pas à une 
                  idéologie préétablie, mais à une lecture économique, sociale et institutionnelle des faits.
                </p>

                <div className="p-6 rounded-lg bg-primary/5 border border-primary/20 my-6">
                  <p className="text-lg text-foreground/90 mb-2">
                    <strong>Le FPC n'est ni un organe politique, ni un instrument partisan.</strong>
                  </p>
                  <p className="text-foreground/80">
                    Il ne soutient aucun parti, aucun courant, aucun agenda électoral.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-5 rounded-lg bg-secondary border border-border">
                  <MessageSquare className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-lg text-foreground/90 italic">
                    Il est l'expression d'un engagement intellectuel : 
                    <strong> penser librement, analyser honnêtement, proposer avec responsabilité.</strong>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
