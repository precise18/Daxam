import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Gamepad2, Zap, Trophy } from 'lucide-react';
import { HERO_BG } from '@/lib/gameImages';

const HeroSection: React.FC = () => {
  const { connected } = useWallet();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, hsl(252 32% 7% / 0.75) 0%, hsl(252 28% 10% / 0.85) 50%, hsl(252 28% 10%) 100%)',
          }}
        />
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div
          className="absolute inset-0 animate-grid-flow"
          style={{
            backgroundImage:
              'linear-gradient(hsl(262 73% 52% / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(262 73% 52% / 0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            height: '200%',
          }}
        />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-daxam-purple/10 blur-[120px] animate-float pointer-events-none" />
      <div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-daxam-blue/10 blur-[100px] animate-float pointer-events-none"
        style={{ animationDelay: '3s' }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full daxam-glass mb-8 text-sm font-medium text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-daxam-green animate-pulse" />
            Live on Solana Devnet
          </div>

          {/* Main heading */}
          <h1 className="font-orbitron font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-6">
            <span className="text-foreground">THE</span>
            <br />
            <span className="daxam-gradient-text">SOCIAL LAYER</span>
            <br />
            <span className="text-foreground">OF WEB3</span>
            <br />
            <span className="daxam-gradient-text">GAMING</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-body mb-10 leading-relaxed">
            Discover games through a TikTok-style feed. Compete in challenge economies.
            Earn real rewards on Solana. Own your identity on-chain.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {connected ? (
              <Link
                to="/feed"
                className="daxam-gradient-btn px-8 py-4 rounded-xl text-lg font-display font-semibold flex items-center gap-3"
              >
                <Gamepad2 className="w-5 h-5" />
                Enter the Feed
              </Link>
            ) : (
              <WalletMultiButton />
            )}
            <Link
              to="/feed"
              className="px-8 py-4 rounded-xl text-lg font-display font-semibold border border-border/50 text-foreground hover:bg-muted/30 transition-all flex items-center gap-3"
            >
              Explore Games
            </Link>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            {[
              { icon: Gamepad2, value: '120+', label: 'Games' },
              { icon: Trophy, value: '2.4K', label: 'Challenges' },
              { icon: Zap, value: '18K+', label: 'Players' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
        <span className="text-xs uppercase tracking-widest font-display">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-muted-foreground/50 to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
