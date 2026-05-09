import React from 'react';
import { Gamepad2, Monitor } from 'lucide-react';
import type { GameCreation } from '@/lib/mockData';
import { GAME_IMAGES } from '@/lib/gameImages';

interface GameStageProps {
  game: GameCreation;
  isPlaying: boolean;
  onPlay: () => void;
}

const GameStage: React.FC<GameStageProps> = ({ game, isPlaying, onPlay }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-daxam-darker">
      {!isPlaying ? (
        /* Preview State */
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Thumbnail */}
          <div className="absolute inset-0">
            <img
              src={GAME_IMAGES[game.id]}
              alt={game.title}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at center, transparent 30%, hsl(252 32% 7% / 0.7) 100%)',
              }}
            />
          </div>

          {/* Play overlay */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <button
              onClick={onPlay}
              className="w-20 h-20 lg:w-24 lg:h-24 rounded-full daxam-gradient-btn flex items-center justify-center animate-pulse-glow group"
            >
              <Gamepad2 className="w-8 h-8 lg:w-10 lg:h-10 text-primary-foreground group-hover:scale-110 transition-transform" />
            </button>
            <div className="text-center">
              <p className="text-foreground font-display font-semibold text-lg">
                {game.title}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Press New to play
              </p>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 mt-1">
              {game.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-muted/40 text-muted-foreground backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Mobile warning */}
            {!game.mobileFriendly && (
              <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg bg-daxam-orange/10 border border-daxam-orange/20">
                <Monitor className="w-4 h-4 text-daxam-orange" />
                <span className="text-xs text-daxam-orange font-medium">
                  Desktop only
                </span>
              </div>
            )}
          </div>

          {/* Stats bar at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between daxam-glass-strong">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Pool</div>
                <div className="text-sm font-display font-semibold text-foreground">
                  {game.totalPrizePool} SOL
                </div>
              </div>
              <div className="w-px h-8 bg-border/30" />
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Challenges</div>
                <div className="text-sm font-display font-semibold text-foreground">
                  {game.totalChallenges}
                </div>
              </div>
              <div className="w-px h-8 bg-border/30" />
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Top Score</div>
                <div className="text-sm font-display font-semibold text-foreground">
                  {game.topScore.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-display">
              {game.aspectRatio}
            </div>
          </div>
        </div>
      ) : (
        /* Active Gameplay State */
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Simulated game canvas */}
          <div className="absolute inset-0">
            <img
              src={GAME_IMAGES[game.id]}
              alt={game.title}
              className="w-full h-full object-cover opacity-90"
            />
          </div>

          {/* Game overlay HUD */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="px-3 py-1.5 rounded-lg daxam-glass-strong flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-daxam-green animate-pulse" />
              <span className="text-xs font-display font-semibold text-daxam-green">
                PLAYING
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-lg daxam-glass-strong">
              <span className="text-xs font-display text-muted-foreground">
                Seed: {game.id}-demo
              </span>
            </div>
          </div>

          {/* Simulated game content overlay */}
          <div className="relative z-10 text-center">
            <div className="w-32 h-32 rounded-2xl border-2 border-daxam-purple/40 bg-daxam-darker/60 backdrop-blur-sm flex items-center justify-center animate-float">
              <Gamepad2 className="w-12 h-12 text-primary/60" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground font-display">
              Game simulation active
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStage;
