export interface GameCreation {
  id: string;
  onChainId: number;
  title: string;
  creator: string;
  creatorWallet: string;
  description: string;
  instructions: string;
  tips: string;
  aspectRatio: '1:1' | '3:4' | '9:16' | '16:9' | '4:3';
  mobileFriendly: boolean;
  thumbnailColor: string;
  tags: string[];
  totalChallenges: number;
  totalPrizePool: number;
  topScore: number;
  likes: number;
  plays: number;
  publishedAt: string;
}

export interface Challenge {
  id: string;
  onChainId: number;
  gameId: string;
  creatorWallet: string;
  targetScore: number;
  totalPrizePool: number;
  entryFee: number;
  maxPlayers: number;
  registeredPlayers: number;
  winners: number;
  seed: string;
  expiryTime: string;
  status: 'active' | 'solved' | 'expired' | 'cancelled';
}

export interface LeaderboardEntry {
  rank: number;
  wallet: string;
  username: string;
  wins: number;
  earnings: number;
  winRate: number;
}

export const SAMPLE_GAMES: GameCreation[] = [
  {
    id: 'g1',
    onChainId: 1,
    title: 'Neon Runner',
    creator: 'CyberForge',
    creatorWallet: '7xKXt...9nPm',
    description: 'Endless runner through a neon-lit cyberpunk cityscape. Dodge obstacles, collect power-ups, and outrun the system. Every millisecond counts in this high-octane chase.',
    instructions: 'Use arrow keys or swipe to dodge obstacles. Collect blue orbs for speed boosts. Avoid red barriers.',
    tips: 'The pattern repeats every 30 seconds. Learn the cycle to maximize your distance.',
    aspectRatio: '16:9',
    mobileFriendly: true,
    thumbnailColor: '#6B2FD9',
    tags: ['runner', 'arcade', 'speed'],
    totalChallenges: 47,
    totalPrizePool: 128.5,
    topScore: 94520,
    likes: 2340,
    plays: 18400,
    publishedAt: '2025-03-15',
  },
  {
    id: 'g2',
    onChainId: 2,
    title: 'Pixel Siege',
    creator: 'ArchonDev',
    creatorWallet: '3mKLq...7bRt',
    description: 'Tower defense meets puzzle strategy. Place your defenses, manage resources, and survive 50 waves of pixel invaders. Each seed creates a unique battlefield.',
    instructions: 'Click to place towers. Right-click to upgrade. Manage your crystal economy wisely.',
    tips: 'Splash towers in chokepoints are extremely efficient in early waves.',
    aspectRatio: '1:1',
    mobileFriendly: true,
    thumbnailColor: '#2563EB',
    tags: ['strategy', 'tower-defense', 'pixel'],
    totalChallenges: 32,
    totalPrizePool: 85.2,
    topScore: 15200,
    likes: 1870,
    plays: 12300,
    publishedAt: '2025-04-02',
  },
  {
    id: 'g3',
    onChainId: 3,
    title: 'Void Breaker',
    creator: 'NullByte',
    creatorWallet: '9pZRx...2wFs',
    description: 'Physics-based destruction puzzle. Break through crystalline structures in the void of space. Calculate angles, harness gravity, and shatter everything.',
    instructions: 'Aim and launch projectiles to destroy all crystals. Use gravitational fields to curve shots.',
    tips: 'Chain reactions give massive score multipliers. Look for structural weak points.',
    aspectRatio: '3:4',
    mobileFriendly: false,
    thumbnailColor: '#F97316',
    tags: ['physics', 'puzzle', 'destruction'],
    totalChallenges: 21,
    totalPrizePool: 54.8,
    topScore: 88100,
    likes: 980,
    plays: 7600,
    publishedAt: '2025-04-18',
  },
  {
    id: 'g4',
    onChainId: 4,
    title: 'Synth Racer',
    creator: 'WaveDrift',
    creatorWallet: '5tYmN...8kQx',
    description: 'Synthwave racing through procedurally generated tracks. The seed determines the track. Master the curves, boost through gates, and set records that echo across the chain.',
    instructions: 'WASD to steer. Space for boost. Shift for drift. Hit boost gates for extra speed.',
    tips: 'Drifting through turns while boosting gives a 2x speed multiplier.',
    aspectRatio: '16:9',
    mobileFriendly: true,
    thumbnailColor: '#6B2FD9',
    tags: ['racing', 'synthwave', 'speed'],
    totalChallenges: 56,
    totalPrizePool: 203.4,
    topScore: 12450,
    likes: 3100,
    plays: 24800,
    publishedAt: '2025-02-28',
  },
  {
    id: 'g5',
    onChainId: 5,
    title: 'Hex Colony',
    creator: 'GridMaster',
    creatorWallet: '2rFjK...4pWn',
    description: 'Hexagonal tile-laying colony builder. Expand your territory, manage resources, and score points through strategic placement. Every game is different with seeded tile draws.',
    instructions: 'Drag tiles to place on the hex grid. Match colors for bonus points. Complete patterns for multipliers.',
    tips: 'Focus on completing full rings early — they provide permanent resource bonuses.',
    aspectRatio: '1:1',
    mobileFriendly: true,
    thumbnailColor: '#16A34A',
    tags: ['strategy', 'builder', 'hex'],
    totalChallenges: 18,
    totalPrizePool: 42.1,
    topScore: 6780,
    likes: 1450,
    plays: 9200,
    publishedAt: '2025-05-01',
  },
  {
    id: 'g6',
    onChainId: 6,
    title: 'Cipher Stack',
    creator: 'ByteShift',
    creatorWallet: '8wDnZ...1mTv',
    description: 'Fast-paced code-breaking puzzle. Stack ciphers, decode sequences, and race against time. The faster you solve, the higher you score. Pure mental agility.',
    instructions: 'Type the decoded sequence before time runs out. Each level adds complexity.',
    tips: 'Look for repeating patterns — most ciphers use substitution at their core.',
    aspectRatio: '9:16',
    mobileFriendly: true,
    thumbnailColor: '#2563EB',
    tags: ['puzzle', 'code', 'speed'],
    totalChallenges: 39,
    totalPrizePool: 97.6,
    topScore: 42300,
    likes: 2680,
    plays: 15700,
    publishedAt: '2025-03-20',
  },
];

export const SAMPLE_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    onChainId: 101,
    gameId: 'g1',
    creatorWallet: '7xKXt...9nPm',
    targetScore: 50000,
    totalPrizePool: 4.2,
    entryFee: 0.42,
    maxPlayers: 10,
    registeredPlayers: 7,
    winners: 0,
    seed: 'DAXAM-1-1714500000-7xKXt9nP-a8f2',
    expiryTime: '2025-05-15T18:00:00Z',
    status: 'active',
  },
  {
    id: 'c2',
    onChainId: 102,
    gameId: 'g1',
    creatorWallet: '3mKLq...7bRt',
    targetScore: 75000,
    totalPrizePool: 8.5,
    entryFee: 0.85,
    maxPlayers: 10,
    registeredPlayers: 4,
    winners: 0,
    seed: 'DAXAM-1-1714600000-3mKLq7bR-c3d1',
    expiryTime: '2025-05-16T12:00:00Z',
    status: 'active',
  },
  {
    id: 'c3',
    onChainId: 103,
    gameId: 'g1',
    creatorWallet: '5tYmN...8kQx',
    targetScore: 30000,
    totalPrizePool: 2.0,
    entryFee: 0.2,
    maxPlayers: 10,
    registeredPlayers: 9,
    winners: 2,
    seed: 'DAXAM-1-1714700000-5tYmN8kQ-f7e9',
    expiryTime: '2025-05-14T20:00:00Z',
    status: 'active',
  },
  {
    id: 'c4',
    onChainId: 104,
    gameId: 'g2',
    creatorWallet: '7xKXt...9nPm',
    targetScore: 10000,
    totalPrizePool: 5.0,
    entryFee: 0.5,
    maxPlayers: 10,
    registeredPlayers: 6,
    winners: 1,
    seed: 'DAXAM-2-1714800000-7xKXt9nP-b2a4',
    expiryTime: '2025-05-17T08:00:00Z',
    status: 'active',
  },
  {
    id: 'c5',
    onChainId: 105,
    gameId: 'g4',
    creatorWallet: '5tYmN...8kQx',
    targetScore: 8000,
    totalPrizePool: 12.0,
    entryFee: 1.2,
    maxPlayers: 10,
    registeredPlayers: 3,
    winners: 0,
    seed: 'DAXAM-4-1714900000-5tYmN8kQ-d5c8',
    expiryTime: '2025-05-18T16:00:00Z',
    status: 'active',
  },
];

export const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, wallet: '7xKXt...9nPm', username: 'CyberViper', wins: 142, earnings: 312.5, winRate: 78 },
  { rank: 2, wallet: '3mKLq...7bRt', username: 'PixelHunter', wins: 128, earnings: 274.2, winRate: 72 },
  { rank: 3, wallet: '9pZRx...2wFs', username: 'NullVoid', wins: 115, earnings: 248.8, winRate: 69 },
  { rank: 4, wallet: '5tYmN...8kQx', username: 'WaveRider', wins: 98, earnings: 201.3, winRate: 65 },
  { rank: 5, wallet: '2rFjK...4pWn', username: 'HexKing', wins: 87, earnings: 178.9, winRate: 61 },
  { rank: 6, wallet: '8wDnZ...1mTv', username: 'ByteBreaker', wins: 76, earnings: 156.4, winRate: 58 },
  { rank: 7, wallet: '4jLpQ...6sYr', username: 'SynthPilot', wins: 65, earnings: 134.7, winRate: 55 },
  { rank: 8, wallet: '1nCxW...3hBg', username: 'GridRunner', wins: 54, earnings: 112.1, winRate: 52 },
];
