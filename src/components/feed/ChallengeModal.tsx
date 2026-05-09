import React, { useState } from 'react';
import { X, Swords, Users, Clock, Target, Wallet, Shield, Copy, Check, Lock } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import type { GameCreation, Challenge } from '@/lib/mockData';

interface ChallengeModalProps {
  game: GameCreation;
  challenges: Challenge[];
  isOpen: boolean;
  onClose: () => void;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({
  game,
  challenges,
  isOpen,
  onClose,
}) => {
  const { connected } = useWallet();
  const [copiedSeed, setCopiedSeed] = useState<string | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopySeed = (seed: string) => {
    navigator.clipboard.writeText(seed);
    setCopiedSeed(seed);
    setTimeout(() => setCopiedSeed(null), 2000);
  };

  const getTimeRemaining = (expiry: string) => {
    const diff = new Date(expiry).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-daxam-darker/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl max-h-[85vh] overflow-hidden rounded-2xl daxam-glass-strong border border-border/40 animate-slide-up flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Swords className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-foreground">
                {game.title} Challenges
              </h2>
              <p className="text-xs text-muted-foreground">
                {challenges.length} active challenges
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Challenge list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 daxam-scrollbar">
          {challenges.length === 0 ? (
            <div className="text-center py-12">
              <Swords className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No active challenges for this game.
              </p>
            </div>
          ) : (
            challenges.map((challenge) => {
              const isSelected = selectedChallenge === challenge.id;
              return (
                <div
                  key={challenge.id}
                  className={`daxam-card rounded-xl overflow-hidden transition-all duration-200 ${
                    isSelected ? 'ring-1 ring-primary/40' : ''
                  }`}
                >
                  {/* Challenge summary */}
                  <button
                    className="w-full p-4 text-left"
                    onClick={() =>
                      setSelectedChallenge(isSelected ? null : challenge.id)
                    }
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-lg text-foreground">
                          {challenge.totalPrizePool} SOL
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase bg-daxam-green/10 text-daxam-green">
                          {challenge.status}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground font-display">
                        #{challenge.onChainId}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Target className="w-3.5 h-3.5 text-primary" />
                        <span>{challenge.targetScore.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Wallet className="w-3.5 h-3.5 text-daxam-blue" />
                        <span>{challenge.entryFee} SOL</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="w-3.5 h-3.5 text-daxam-orange" />
                        <span>
                          {challenge.registeredPlayers}/{challenge.maxPlayers}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 text-daxam-green" />
                        <span>{getTimeRemaining(challenge.expiryTime)}</span>
                      </div>
                    </div>

                    {/* Fill bar */}
                    <div className="mt-3 w-full h-1.5 rounded-full bg-muted/30 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-daxam-purple to-daxam-blue transition-all"
                        style={{
                          width: `${(challenge.registeredPlayers / challenge.maxPlayers) * 100}%`,
                        }}
                      />
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isSelected && (
                    <div className="px-4 pb-4 pt-1 border-t border-border/20 animate-slide-up">
                      {/* Seed */}
                      <div className="mb-3">
                        <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
                          Seed
                        </span>
                        <div className="mt-1 flex items-center gap-2">
                          <code className="flex-1 px-3 py-2 rounded-lg bg-daxam-darker text-xs text-foreground/70 font-mono truncate">
                            {challenge.seed}
                          </code>
                          <button
                            onClick={() => handleCopySeed(challenge.seed)}
                            className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 text-muted-foreground transition-colors"
                          >
                            {copiedSeed === challenge.seed ? (
                              <Check className="w-3.5 h-3.5 text-daxam-green" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Creator */}
                      <div className="mb-4 text-xs text-muted-foreground">
                        Creator:{' '}
                        <span className="text-foreground font-medium">
                          {challenge.creatorWallet}
                        </span>
                      </div>

                      {/* Fee Breakdown */}
                      <div className="mb-4 p-3 rounded-xl bg-daxam-darker/60 space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Entry Fee</span>
                          <span className="text-foreground font-medium">
                            {challenge.entryFee} SOL
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Platform Fee (5%)</span>
                          <span className="text-foreground font-medium">
                            {(challenge.entryFee * 0.05).toFixed(4)} SOL
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Creator Fee (10%)</span>
                          <span className="text-foreground font-medium">
                            {(challenge.entryFee * 0.1).toFixed(4)} SOL
                          </span>
                        </div>
                        <div className="border-t border-border/20 pt-1.5 flex justify-between text-xs">
                          <span className="text-muted-foreground font-medium">
                            Net Prize per Winner
                          </span>
                          <span className="text-daxam-green font-semibold">
                            ~{(challenge.entryFee * 0.85).toFixed(4)} SOL
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        {connected ? (
                          <>
                            <button className="flex-1 daxam-gradient-btn py-2.5 rounded-xl text-sm font-display font-semibold flex items-center justify-center gap-2">
                              <Shield className="w-4 h-4" />
                              Accept Challenge
                            </button>
                            <button
                              className="px-4 py-2.5 rounded-xl border border-border/50 text-sm font-display text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                            >
                              Play
                            </button>
                          </>
                        ) : (
                          <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-muted/20 text-sm text-muted-foreground">
                            <Lock className="w-4 h-4" />
                            Connect wallet to participate
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer note */}
        <div className="p-4 border-t border-border/30 text-center">
          <p className="text-[11px] text-muted-foreground">
            Blue Badge NFT required to accept challenges. All wagers are escrowed on-chain.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChallengeModal;
