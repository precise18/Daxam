import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { ArrowLeft } from 'lucide-react';
import DaxamLogo from '@/components/DaxamLogo';
import ControlDeck from '@/components/feed/ControlDeck';
import GameStage from '@/components/feed/GameStage';
import RightPanel from '@/components/feed/RightPanel';
import GameInfoModal from '@/components/feed/GameInfoModal';
import ChallengeModal from '@/components/feed/ChallengeModal';
import { SAMPLE_GAMES, SAMPLE_CHALLENGES } from '@/lib/mockData';

const Feed: React.FC = () => {
  const { connected } = useWallet();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameInfoOpen, setGameInfoOpen] = useState(false);
  const [challengeModalOpen, setChallengeModalOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scoreIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastScrollTime = useRef(0);

  const currentGame = SAMPLE_GAMES[currentIndex];
  const gameChallenges = SAMPLE_CHALLENGES.filter(
    (c) => c.gameId === currentGame.id
  );

  // Score simulation when playing
  useEffect(() => {
    if (isPlaying) {
      scoreIntervalRef.current = setInterval(() => {
        setScore((prev) => prev + Math.floor(Math.random() * 150) + 50);
      }, 400);
    } else {
      if (scoreIntervalRef.current) {
        clearInterval(scoreIntervalRef.current);
        scoreIntervalRef.current = null;
      }
    }
    return () => {
      if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
    };
  }, [isPlaying]);

  const navigateTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= SAMPLE_GAMES.length || isTransitioning) return;
      setIsTransitioning(true);
      setIsPlaying(false);
      setScore(0);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 200);
    },
    [isTransitioning]
  );

  const handleNewGame = useCallback(() => {
    setScore(0);
    setIsPlaying(true);
  }, []);

  // Keyboard + scroll navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameInfoOpen || challengeModalOpen) return;
      if (e.key === 'ArrowDown' || e.key === 'j') {
        navigateTo(currentIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        navigateTo(currentIndex - 1);
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleNewGame();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (gameInfoOpen || challengeModalOpen) return;
      const now = Date.now();
      if (now - lastScrollTime.current < 600) return;
      lastScrollTime.current = now;

      if (e.deltaY > 30) {
        navigateTo(currentIndex + 1);
      } else if (e.deltaY < -30) {
        navigateTo(currentIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentIndex, navigateTo, handleNewGame, gameInfoOpen, challengeModalOpen]);

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Fixed floating overlay */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 h-14">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <DaxamLogo size="sm" />
        </div>
        <div className="flex items-center gap-3">
          <WalletMultiButton />
        </div>
      </div>

      {/* Main 3-column layout */}
      <div
        className={`flex h-full pt-14 transition-opacity duration-200 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* LEFT PANEL - Control Deck (hidden on mobile, shown in drawer later) */}
        <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0 border-r border-border/20 bg-card/40">
          <ControlDeck
            game={currentGame}
            challenges={gameChallenges}
            score={score}
            isPlaying={isPlaying}
            onNewGame={handleNewGame}
            onViewInfo={() => setGameInfoOpen(true)}
            onOpenChallenges={() => setChallengeModalOpen(true)}
          />
        </div>

        {/* CENTER - Game Stage */}
        <div className="flex-1 min-w-0 relative">
          <GameStage
            game={currentGame}
            isPlaying={isPlaying}
            onPlay={handleNewGame}
          />

          {/* Mobile bottom controls */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 daxam-glass-strong border-t border-border/20">
            <div className="flex items-center gap-3 p-3">
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-sm text-foreground truncate">
                  {currentGame.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  Score: <span className="font-orbitron text-primary">{score.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={handleNewGame}
                className="daxam-gradient-btn px-4 py-2 rounded-xl text-sm font-display font-semibold flex-shrink-0"
              >
                {isPlaying ? 'Restart' : 'Play'}
              </button>
              <button
                onClick={() => setChallengeModalOpen(true)}
                className="px-3 py-2 rounded-xl border border-border/50 text-sm text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              >
                Challenges
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Navigation + Actions */}
        <div className="hidden md:block w-16 lg:w-20 flex-shrink-0 border-l border-border/20 bg-card/20">
          <RightPanel
            currentIndex={currentIndex}
            totalGames={SAMPLE_GAMES.length}
            game={currentGame}
            onScrollUp={() => navigateTo(currentIndex - 1)}
            onScrollDown={() => navigateTo(currentIndex + 1)}
          />
        </div>
      </div>

      {/* Modals */}
      <GameInfoModal
        game={currentGame}
        isOpen={gameInfoOpen}
        onClose={() => setGameInfoOpen(false)}
      />
      <ChallengeModal
        game={currentGame}
        challenges={gameChallenges}
        isOpen={challengeModalOpen}
        onClose={() => setChallengeModalOpen(false)}
      />
    </div>
  );
};

export default Feed;
