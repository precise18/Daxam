import React from 'react';
import { ChevronUp, ChevronDown, Heart, Share2, MessageCircle, Trophy } from 'lucide-react';
import type { GameCreation } from '@/lib/mockData';

interface RightPanelProps {
  currentIndex: number;
  totalGames: number;
  game: GameCreation;
  onScrollUp: () => void;
  onScrollDown: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  currentIndex,
  totalGames,
  game,
  onScrollUp,
  onScrollDown,
}) => {
  return (
    <div className="h-full flex flex-col items-center justify-between py-6 px-3">
      {/* Scroll Up */}
      <button
        onClick={onScrollUp}
        disabled={currentIndex === 0}
        className="p-2.5 rounded-xl border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* Center: Position + Actions */}
      <div className="flex flex-col items-center gap-5">
        {/* Position minimap */}
        <div className="flex flex-col items-center gap-1.5">
          {Array.from({ length: totalGames }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'h-6 bg-gradient-to-b from-daxam-purple to-daxam-blue'
                  : 'h-2 bg-muted/40'
              }`}
            />
          ))}
        </div>

        {/* Index counter */}
        <div className="text-center">
          <span className="font-orbitron text-sm font-bold text-foreground">
            {currentIndex + 1}
          </span>
          <span className="text-xs text-muted-foreground"> / {totalGames}</span>
        </div>

        {/* Social actions */}
        <div className="flex flex-col items-center gap-4">
          <button className="flex flex-col items-center gap-1 group">
            <div className="p-2.5 rounded-xl bg-muted/30 group-hover:bg-primary/15 group-hover:text-primary text-muted-foreground transition-all">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-muted-foreground">{game.likes > 999 ? `${(game.likes / 1000).toFixed(1)}k` : game.likes}</span>
          </button>

          <button className="flex flex-col items-center gap-1 group">
            <div className="p-2.5 rounded-xl bg-muted/30 group-hover:bg-daxam-blue/15 group-hover:text-daxam-blue text-muted-foreground transition-all">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-muted-foreground">24</span>
          </button>

          <button className="flex flex-col items-center gap-1 group">
            <div className="p-2.5 rounded-xl bg-muted/30 group-hover:bg-daxam-orange/15 group-hover:text-daxam-orange text-muted-foreground transition-all">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-muted-foreground">Share</span>
          </button>

          <button className="flex flex-col items-center gap-1 group">
            <div className="p-2.5 rounded-xl bg-muted/30 group-hover:bg-daxam-green/15 group-hover:text-daxam-green text-muted-foreground transition-all">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-muted-foreground">Board</span>
          </button>
        </div>
      </div>

      {/* Scroll Down */}
      <button
        onClick={onScrollDown}
        disabled={currentIndex === totalGames - 1}
        className="p-2.5 rounded-xl border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  );
};

export default RightPanel;
