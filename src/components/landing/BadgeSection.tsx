import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Crown, Check } from 'lucide-react';

const badges = [
  {
    type: 'blue',
    title: 'Blue Badge',
    subtitle: 'Creator + Player',
    price: '0.05 SOL',
    gradient: 'from-daxam-blue to-daxam-purple',
    borderGlow: 'hover:shadow-[0_0_40px_hsl(220_90%_56%/0.3)]',
    icon: Shield,
    perks: [
      'Create and publish challenges',
      'Accept and play challenges',
      'Appear on leaderboards',
      'Earn creator fees on your games',
      'Full platform access',
    ],
  },
  {
    type: 'orange',
    title: 'Orange Badge',
    subtitle: 'Premium Tier',
    price: '0.01 SOL',
    gradient: 'from-daxam-orange to-yellow-500',
    borderGlow: 'hover:shadow-[0_0_40px_hsl(25_95%_53%/0.3)]',
    icon: Crown,
    perks: [
      'Entry-level platform membership',
      'Browse the game feed',
      'View challenges and stats',
      'Future: premium features access',
      'Future: governance participation',
    ],
  },
];

const BadgeSection: React.FC = () => {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-daxam-purple/3 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-orbitron font-bold text-3xl md:text-5xl text-foreground mb-4">
            Your <span className="daxam-gradient-text">On-Chain</span> Identity
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            NFT badges gate your access and signal your status. Soulbound. Non-transferable. Yours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.type}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`daxam-card rounded-2xl p-8 ${badge.borderGlow} transition-all duration-300 group`}
            >
              {/* Badge icon */}
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <badge.icon className="w-8 h-8 text-primary-foreground" />
              </div>

              <h3 className="font-display font-bold text-2xl text-foreground mb-1">
                {badge.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">{badge.subtitle}</p>
              <p
                className={`text-lg font-display font-semibold bg-gradient-to-r ${badge.gradient} bg-clip-text text-transparent mb-6`}
              >
                {badge.price}
              </p>

              <ul className="space-y-3">
                {badge.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-daxam-green mt-0.5 flex-shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 w-full py-3 rounded-xl font-display font-semibold text-sm transition-all ${
                  badge.type === 'blue'
                    ? 'daxam-gradient-btn'
                    : 'daxam-orange-btn'
                }`}
              >
                Mint {badge.title}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BadgeSection;
