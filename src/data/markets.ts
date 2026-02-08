export interface Market {
  id: string;
  name: string;
  description: string;
  sponsorType: "VC" | "DAO" | "Label";
  escrowAmount: string;
  windowRemaining: string;
  sponsor: string;
}

export const markets: Market[] = [
  {
    id: "1",
    name: "Series A — Climate Tech Startup Discovery",
    description:
      "Identifying the next breakthrough climate technology startup for Series A investment. Scouts signal conviction on early-stage companies building in carbon capture, renewable energy storage, and grid optimization.",
    sponsorType: "VC",
    escrowAmount: "50,000 USDC",
    windowRemaining: "2d 14h 32m",
    sponsor: "Greenfield Capital",
  },
  {
    id: "2",
    name: "Protocol Grant — ZK Infrastructure",
    description:
      "Evaluating zero-knowledge proof infrastructure projects for a major protocol grant. Focus on proving systems, developer tooling, and scalability solutions.",
    sponsorType: "DAO",
    escrowAmount: "120,000 USDC",
    windowRemaining: "5d 8h 15m",
    sponsor: "zkDAO Collective",
  },
  {
    id: "3",
    name: "Emerging Artist — Electronic Music",
    description:
      "Scouting the next generation of electronic music producers. Emphasis on innovative sound design, live performance capability, and community engagement.",
    sponsorType: "Label",
    escrowAmount: "15,000 USDC",
    windowRemaining: "1d 3h 45m",
    sponsor: "Midnight Records",
  },
  {
    id: "4",
    name: "DeFi Protocol Audit Selection",
    description:
      "Selecting the most promising DeFi protocols for comprehensive security audits. Scouts evaluate codebase quality, team credibility, and protocol design.",
    sponsorType: "DAO",
    escrowAmount: "200,000 USDC",
    windowRemaining: "7d 22h 10m",
    sponsor: "Security Alliance",
  },
  {
    id: "5",
    name: "Seed Round — AI × Crypto Founders",
    description:
      "Discovering founders building at the intersection of artificial intelligence and crypto. Focus on decentralized compute, AI-powered trading, and autonomous agents.",
    sponsorType: "VC",
    escrowAmount: "75,000 USDC",
    windowRemaining: "3d 6h 55m",
    sponsor: "Paradigm Scouts",
  },
];
