import React, { useState } from 'react';
import { Volume2, VolumeX, Play, RotateCcw, Info, Swords, Heart, Eye, Users } from 'lucide-react';
import type { GameCreation, Challenge } from '@/lib/mockData';

interface ControlDeckProps {
  game: GameCreation;
  challenges: Challenge[];
  score: number;
  isPlaying: boolean;
  onNewGame: () => void;
  onViewInfo: () => void;
  onOpenChallenges: () => void;
}

const ControlDeck: React.FC<ControlDeckProps> = ({
  game,
  challenges,
  score,
  isPlaying,
  onNewGame,
  onViewInfo,
  onOpenChallenges,
}) => {
  const [muted, setMuted] = useState(false);

  const topChallenges = challenges.slice(0, 3);

  return (
    <div className="h-full flex flex-col gap-4 p-4 lg:p-5 overflow-y-auto daxam-scrollbar">
      {/* Score Display */}
      <div className="daxam-card rounded-xl p-4">
        <div className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-1">
          Score
        </div>
        <div className="font-orbitron text-3xl lg:text-4xl font-bold daxam-gradient-text tabular-nums">
          {score.toLocaleString()}
        </div>
        {isPlaying && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-daxam-green animate-pulse" />
            <span className="text-xs text-daxam-green font-medium">LIVE</span>
          </div>
        )}
      </div>

      {/* Game Title + Creator */}
      <div>
        <h2 className="font-display font-bold text-lg text-foreground leading-tight">
          {game.title}
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">by {game.creator}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" /> {game.likes.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> {game.plays.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Music Controls */}
      <div className="flex items-center gap-3 px-1">
        <button
          onClick={() => setMuted(!muted)}
          className="p-2 rounded-lg bg-muted/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-all"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <div className="flex-1 h-1 rounded-full bg-muted/40 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-daxam-purple to-daxam-blue transition-all"
            style={{ width: muted ? '0%' : '65%' }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onNewGame}
          className="flex-1 daxam-gradient-btn py-2.5 rounded-xl text-sm font-display font-semibold flex items-center justify-center gap-2"
        >
          {isPlaying ? (
            <>
              <RotateCcw className="w-4 h-4" /> Restart
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> New Game
            </>
          )}
        </button>
        <button
          onClick={onViewInfo}
          className="px-3 py-2.5 rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Challenges Strip */}
      <div className="flex-1 min-h-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-display uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5" /> Active Challenges
          </h3>
          <span className="text-xs text-primary font-medium">{challenges.length}</span>
        </div>

        <div className="space-y-2">
          {topChallenges.map((c) => (
            <div
              key={c.id}
              className="daxam-card rounded-xl p-3 cursor-pointer hover:border-primary/30"
              onClick={onOpenChallenges}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-display font-semibold text-foreground">
                  {c.totalPrizePool} SOL
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-daxam-green/10 text-daxam-green font-medium uppercase">
                  {c.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Score: {c.targetScore.toLocaleString()}</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {c.registeredPlayers}/{c.maxPlayers}
                </span>
              </div>
              <div className="mt-1.5 w-full h-1 rounded-full bg-muted/40 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-daxam-purple to-daxam-blue"
                  style={{
                    width: `${(c.registeredPlayers / c.maxPlayers) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {challenges.length > 3 && (
          <button
            onClick={onOpenChallenges}
            className="w-full mt-3 py-2 rounded-xl border border-border/40 text-xs font-display text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          >
            View All Challenges
          </button>
        )}
      </div>
    </div>
  );
};

export default ControlDeck;
