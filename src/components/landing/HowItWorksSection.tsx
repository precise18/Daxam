import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Shield, Gamepad2, Trophy } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Wallet,
    title: 'Connect Wallet',
    description: 'Link your Phantom wallet in one click. No emails, no passwords. Your wallet is your identity.',
  },
  {
    step: '02',
    icon: Shield,
    title: 'Mint a Badge',
    description: 'Mint a Blue Badge NFT to unlock full platform access — create challenges, play games, earn rewards.',
  },
  {
    step: '03',
    icon: Gamepad2,
    title: 'Scroll & Play',
    description: 'Swipe through the TikTok-style feed. Find a challenge. Accept it, lock your SOL, and compete.',
  },
  {
    step: '04',
    icon: Trophy,
    title: 'Win & Earn',
    description: 'Beat the target score to claim the prize pool. Winnings go directly to your wallet. No intermediaries.',
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="relative py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-orbitron font-bold text-3xl md:text-5xl text-foreground mb-4">
            How <span className="daxam-gradient-text">Daxam</span> Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-body">
            From wallet to winnings in four steps.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-8 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="text-center relative"
              >
                {/* Step number */}
                <div className="relative z-10 w-16 h-16 mx-auto mb-5 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center group hover:border-primary/30 transition-all">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="font-orbitron text-xs text-primary/60 mb-2 tracking-widest">
                  STEP {item.step}
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
