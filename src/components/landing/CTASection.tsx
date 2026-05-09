import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Gamepad2, ArrowRight } from 'lucide-react';

const CTASection: React.FC = () => {
  const { connected } = useWallet();

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-daxam-purple/8 blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-daxam-blue/6 blur-[100px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-orbitron font-bold text-3xl md:text-5xl text-foreground mb-6">
            Ready to{' '}
            <span className="daxam-gradient-text">Compete?</span>
          </h2>
          <p className="text-muted-foreground text-lg font-body mb-10 max-w-xl mx-auto">
            Every scroll is a new challenge. Every game is a new economy. Connect your wallet and enter the feed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {connected ? (
              <Link
                to="/feed"
                className="daxam-gradient-btn px-8 py-4 rounded-xl text-lg font-display font-semibold flex items-center gap-3 animate-pulse-glow"
              >
                <Gamepad2 className="w-5 h-5" />
                Enter the Arcade
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <WalletMultiButton />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
