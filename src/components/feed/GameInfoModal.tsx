import React from 'react';
import { X, ExternalLink, Trophy, Swords, Users, Calendar } from 'lucide-react';
import type { GameCreation } from '@/lib/mockData';
import { GAME_IMAGES } from '@/lib/gameImages';

interface GameInfoModalProps {
  game: GameCreation;
  isOpen: boolean;
  onClose: () => void;
}

const GameInfoModal: React.FC<GameInfoModalProps> = ({ game, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-daxam-darker/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl daxam-glass-strong border border-border/40 animate-slide-up daxam-scrollbar">
        {/* Header image */}
        <div className="relative h-48 md:h-56 overflow-hidden rounded-t-2xl">
          <img
            src={GAME_IMAGES[game.id]}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-daxam-darker/60 backdrop-blur-sm text-foreground hover:bg-daxam-darker/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Title */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground">
                {game.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                by {game.creator} · {game.creatorWallet}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {game.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { icon: Trophy, label: 'Top Score', value: game.topScore.toLocaleString() },
              { icon: Swords, label: 'Challenges', value: game.totalChallenges.toString() },
              { icon: Users, label: 'Plays', value: game.plays.toLocaleString() },
              { icon: Calendar, label: 'Published', value: new Date(game.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) },
            ].map((stat) => (
              <div key={stat.label} className="daxam-card rounded-xl p-3 text-center">
                <stat.icon className="w-4 h-4 text-primary mx-auto mb-1.5" />
                <div className="text-sm font-display font-semibold text-foreground">
                  {stat.value}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mb-5">
            <h3 className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-2">
              Description
            </h3>
            <p className="text-sm text-foreground/80 font-body leading-relaxed">
              {game.description}
            </p>
          </div>

          {/* Instructions */}
          <div className="mb-5">
            <h3 className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-2">
              How to Play
            </h3>
            <p className="text-sm text-foreground/80 font-body leading-relaxed">
              {game.instructions}
            </p>
          </div>

          {/* Tips */}
          {game.tips && (
            <div className="mb-5">
              <h3 className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-2">
                Pro Tips
              </h3>
              <div className="px-4 py-3 rounded-xl bg-daxam-purple/5 border border-daxam-purple/10">
                <p className="text-sm text-foreground/80 font-body leading-relaxed italic">
                  {game.tips}
                </p>
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            <div className="text-xs text-muted-foreground">
              Aspect Ratio: <span className="text-foreground font-medium">{game.aspectRatio}</span>
              {' · '}
              {game.mobileFriendly ? (
                <span className="text-daxam-green">Mobile Friendly</span>
              ) : (
                <span className="text-daxam-orange">Desktop Only</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Total Pool: <span className="text-foreground font-semibold">{game.totalPrizePool} SOL</span>
              </span>
              <button className="p-1.5 rounded-lg hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInfoModal;
