import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Swords, Shield, Sparkles, Users, Wallet } from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: 'Swipe & Discover',
    description:
      'TikTok-style vertical feed of live, playable browser games. No routing, no reloads — just scroll and discover.',
    color: 'text-daxam-purple',
    glow: 'group-hover:shadow-[0_0_30px_hsl(262_73%_52%/0.2)]',
  },
  {
    icon: Swords,
    title: 'Challenge Economy',
    description:
      'Lock SOL to beat a target score. Winners earn, losers fund creators. Every game is a financial opportunity.',
    color: 'text-daxam-blue',
    glow: 'group-hover:shadow-[0_0_30px_hsl(220_90%_56%/0.2)]',
  },
  {
    icon: Shield,
    title: 'NFT Badges',
    description:
      'Blue Badge for creators and players. Orange Badge for entry-level access. On-chain identity that gates your experience.',
    color: 'text-daxam-orange',
    glow: 'group-hover:shadow-[0_0_30px_hsl(25_95%_53%/0.2)]',
  },
  {
    icon: Sparkles,
    title: 'AI Game Creation',
    description:
      'Describe your game in natural language. AI generates playable challenge logic. Ship games without deep technical knowledge.',
    color: 'text-daxam-purple',
    glow: 'group-hover:shadow-[0_0_30px_hsl(262_73%_52%/0.2)]',
  },
  {
    icon: Users,
    title: 'Social-Fi Identity',
    description:
      'Wallet-based profiles with on-chain reputation. Followers, likes, and badges evolve as you compete and create.',
    color: 'text-daxam-blue',
    glow: 'group-hover:shadow-[0_0_30px_hsl(220_90%_56%/0.2)]',
  },
  {
    icon: Wallet,
    title: 'Trustless Finance',
    description:
      'All fund custody, fee splits, and winner payouts are fully on-chain. Smart contracts handle everything. No middleman.',
    color: 'text-daxam-green',
    glow: 'group-hover:shadow-[0_0_30px_hsl(142_71%_45%/0.2)]',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-daxam-purple/5 blur-[150px]" />

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-orbitron font-bold text-3xl md:text-5xl text-foreground mb-4">
            Built for the{' '}
            <span className="daxam-gradient-text">New Era</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Where TikTok meets Steam meets Web3. Six pillars that define the Daxam experience.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group daxam-card rounded-2xl p-6 ${feature.glow} transition-all duration-300`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-4 ${feature.color} transition-all group-hover:scale-110`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-body">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
