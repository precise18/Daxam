import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  Shield,
  Trophy,
  Swords,
  Wallet,
  ArrowLeft,
  Crown,
  Target,
  TrendingUp,
} from 'lucide-react';
import Header from '@/components/Header';

const Profile: React.FC = () => {
  const { connected, publicKey } = useWallet();

  const walletAddress = publicKey?.toBase58() || '';
  const truncated = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : '';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16 max-w-4xl mx-auto px-4">
        {!connected ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center mb-6">
              <Wallet className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              Link your Solana wallet to view your profile, badges, challenges, and earnings.
            </p>
            <WalletMultiButton />
          </div>
        ) : (
          <>
            {/* Profile header */}
            <div className="daxam-card rounded-2xl p-6 md:p-8 mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-daxam-purple to-daxam-blue flex items-center justify-center flex-shrink-0">
                  <span className="font-orbitron text-2xl font-bold text-primary-foreground">
                    {walletAddress.slice(0, 2).toUpperCase()}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="font-display font-bold text-2xl text-foreground">
                    Player_{walletAddress.slice(0, 6)}
                  </h1>
                  <p className="text-sm text-muted-foreground font-mono mt-1">
                    {truncated}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium daxam-badge-blue flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Blue Badge
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted/40 text-muted-foreground flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5" /> Orange Badge
                      <span className="text-[10px] ml-1 opacity-60">Not Minted</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { icon: Trophy, label: 'Wins', value: '24', color: 'text-daxam-orange' },
                { icon: Swords, label: 'Challenges', value: '38', color: 'text-primary' },
                { icon: Target, label: 'Win Rate', value: '63%', color: 'text-daxam-green' },
                { icon: TrendingUp, label: 'Earnings', value: '14.2 SOL', color: 'text-daxam-blue' },
              ].map((stat) => (
                <div key={stat.label} className="daxam-card rounded-xl p-4 text-center">
                  <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                  <div className="font-display font-bold text-xl text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            <div className="daxam-card rounded-2xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {[
                  { action: 'Won challenge on Neon Runner', time: '2h ago', amount: '+1.8 SOL', positive: true },
                  { action: 'Lost challenge on Pixel Siege', time: '5h ago', amount: '-0.5 SOL', positive: false },
                  { action: 'Created challenge on Synth Racer', time: '1d ago', amount: '-4.0 SOL', positive: false },
                  { action: 'Won challenge on Hex Colony', time: '2d ago', amount: '+2.1 SOL', positive: true },
                  { action: 'Minted Blue Badge', time: '3d ago', amount: '-0.05 SOL', positive: false },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-border/20 last:border-0"
                  >
                    <div>
                      <p className="text-sm text-foreground">{item.action}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                    </div>
                    <span
                      className={`text-sm font-display font-semibold ${
                        item.positive ? 'text-daxam-green' : 'text-muted-foreground'
                      }`}
                    >
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="mt-6 flex gap-3">
              <Link
                to="/feed"
                className="flex-1 daxam-gradient-btn py-3 rounded-xl text-sm font-display font-semibold text-center"
              >
                Enter Feed
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
