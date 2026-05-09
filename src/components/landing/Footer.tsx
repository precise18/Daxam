import React from 'react';
import DaxamLogo from '../DaxamLogo';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/30 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <DaxamLogo size="sm" showTagline />

          <div className="flex items-center gap-6 text-sm text-muted-foreground font-body">
            <a href="#" className="hover:text-foreground transition-colors">
              Docs
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Discord
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Twitter
            </a>
          </div>

          <p className="text-xs text-muted-foreground/60 font-body">
            Built on Solana. Powered by challenge.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
