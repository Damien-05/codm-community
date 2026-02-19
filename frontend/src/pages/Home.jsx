import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Users, MessageCircle, Zap } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Trophy,
      title: 'Tournois Compétitifs',
      description: 'Participez à des tournois organisés et gagnez des récompenses',
      color: 'text-gaming-accent',
    },
    {
      icon: Users,
      title: 'Parties Privées',
      description: 'Créez vos propres parties avec des règles personnalisées',
      color: 'text-cod-yellow',
    },
    {
      icon: MessageCircle,
      title: 'Chat en Temps Réel',
      description: 'Discutez avec la communauté et trouvez des coéquipiers',
      color: 'text-cod-gold',
    },
    {
      icon: Zap,
      title: 'Système de Niveaux',
      description: 'Progressez, débloquez des badges et montez dans le classement',
      color: 'text-gaming-accent',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section avec image de fond */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center space-y-6 py-20 px-4 overflow-hidden rounded-2xl"
      >
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
            style={{
              backgroundImage: "url('/images/codm-hero.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-800/80 to-slate-900" />
        </div>

        {/* Contenu du hero */}
        <div className="relative z-10 space-y-6">
          {/* Image de héros (soldat CODM) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-cod-orange/20 blur-3xl rounded-full" />
              <img 
                src="/images/codm-soldiers.jpg" 
                alt="CODM Hero"
                className="relative w-64 h-64 object-cover rounded-full border-4 border-cod-orange shadow-2xl shadow-cod-orange/50"
              />
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold font-orbitron drop-shadow-2xl">
            <span className="text-cod-orange">CODM</span> <span className="text-cod-gold">Community</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto drop-shadow-lg">
            Rejoignez la plus grande communauté Call of Duty Mobile francophone
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link to="/tournaments" className="btn-primary text-lg px-8 py-3">
              Voir les Tournois
            </Link>
            <Link to="/matches" className="btn-secondary text-lg px-8 py-3">
              Parties Privées
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card hover:border-cod-orange/50 transition-all duration-300 group"
            >
              <Icon className={`h-12 w-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          );
        })}
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card text-center bg-gradient-to-br from-slate-700 to-slate-800"
        >
          <div className="text-5xl font-bold font-orbitron text-cod-orange mb-2">500+</div>
          <div className="text-gray-400">Joueurs Actifs</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="card text-center bg-gradient-to-br from-slate-700 to-slate-800"
        >
          <div className="text-5xl font-bold font-orbitron text-cod-yellow mb-2">50+</div>
          <div className="text-gray-400">Tournois Organisés</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="card text-center bg-gradient-to-br from-slate-700 to-slate-800"
        >
          <div className="text-5xl font-bold font-orbitron text-cod-gold mb-2">1000+</div>
          <div className="text-gray-400">Parties Jouées</div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="card text-center bg-gradient-to-r from-cod-orange/10 to-cod-yellow/10 border-cod-orange/50"
      >
        <h2 className="text-3xl font-bold font-orbitron mb-4">
          Prêt à Rejoindre la Communauté ?
        </h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Inscrivez-vous maintenant et commencez à participer aux tournois, 
          créer des parties et discuter avec d'autres passionnés de CODM.
        </p>
        <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-block">
          S'inscrire Gratuitement
        </Link>
      </motion.section>
    </div>
  );
}
