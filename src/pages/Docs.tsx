import { useState, useEffect } from "react";
import { 
  BookOpen, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  Wallet, 
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Target,
  Layers,
  Lock
} from "lucide-react";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const sections: DocSection[] = [
  { id: "overview", title: "Overview", icon: <BookOpen className="h-4 w-4" /> },
  { id: "features", title: "Core Features", icon: <Zap className="h-4 w-4" /> },
  { id: "markets", title: "Opportunity Markets", icon: <Target className="h-4 w-4" /> },
  { id: "trading", title: "Trading Mechanics", icon: <TrendingUp className="h-4 w-4" /> },
  { id: "security", title: "Security & Escrow", icon: <Shield className="h-4 w-4" /> },
  { id: "faq", title: "FAQ", icon: <AlertCircle className="h-4 w-4" /> },
];

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is ScoutX?",
    answer: "ScoutX is a decentralized opportunity discovery platform where scouts signal conviction on emerging talent, startups, and investment opportunities by placing positions backed by real capital."
  },
  {
    question: "How does the escrow system work?",
    answer: "When sponsors create a market, they deposit USDC into an escrow smart contract. This ensures funds are locked and can only be distributed based on market outcomes. Scouts can trade up to 10% of the total escrow per transaction."
  },
  {
    question: "What are the trading limits?",
    answer: "Each trade is capped at 10% of the market's total escrow. Demo accounts start with 10,000 USDC. These limits prevent market manipulation and ensure fair participation."
  },
  {
    question: "What blockchain networks are supported?",
    answer: "ScoutX currently operates on Ethereum Mainnet. Integration with additional L2 networks is planned for future releases."
  },
  {
    question: "How are positions calculated?",
    answer: "Positions accumulate across multiple trades. Your total position in a market is the sum of all confirmed trades. Positions are visible in both the Trade Panel and My Trades page."
  },
  {
    question: "Is my data persisted?",
    answer: "Yes, all trades and balances are persisted locally using browser storage. For production, data will be stored on-chain for full decentralization and permanence."
  }
];

const Docs = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Track scroll position and update active section
  useEffect(() => {
    const sectionIds = sections.map((s) => s.id);
    
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Trigger when section is in the top portion of viewport
      threshold: 0,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Layout>
      <section className="py-8 md:py-12">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            {/* Sidebar Navigation */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-1">
                <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Documentation
                </div>
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                      activeSection === section.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {section.icon}
                    {section.title}
                  </button>
                ))}
              </div>
            </aside>

            {/* Main Content */}
            <main className="space-y-16">
              {/* Overview */}
              <section id="overview" className="scroll-mt-24">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                      ScoutX Documentation
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      v1.0.0 · Last updated February 2026
                    </p>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-base leading-relaxed text-muted-foreground">
                    ScoutX is a <strong className="text-foreground">decentralized opportunity discovery protocol</strong> that 
                    enables scouts to signal conviction on emerging opportunities through capital-backed positions. 
                    Whether you're identifying the next breakout artist, promising startup, or investment opportunity, 
                    ScoutX provides the infrastructure to back your insights with real stakes.
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-border bg-card p-4">
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </div>
                      <h3 className="mb-1 text-sm font-semibold text-foreground">Skin in the Game</h3>
                      <p className="text-xs text-muted-foreground">
                        Back your convictions with real capital, not just opinions.
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4">
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="mb-1 text-sm font-semibold text-foreground">Escrowed Funds</h3>
                      <p className="text-xs text-muted-foreground">
                        Sponsor funds locked in smart contracts for trustless execution.
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4">
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-amber-500/10">
                        <Users className="h-4 w-4 text-amber-500" />
                      </div>
                      <h3 className="mb-1 text-sm font-semibold text-foreground">Multi-Sponsor</h3>
                      <p className="text-xs text-muted-foreground">
                        VCs, DAOs, and Labels can all create and sponsor markets.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Core Features */}
              <section id="features" className="scroll-mt-24">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-foreground">
                  <Zap className="h-5 w-5 text-primary" />
                  Core Features
                </h2>

                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-card p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary">Market Creation</Badge>
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground">Create Opportunity Markets</h3>
                    <p className="text-sm text-muted-foreground">
                      Sponsors can create markets for any opportunity type. Define the opportunity, 
                      set an escrow amount, and specify the discovery window. Markets support three 
                      sponsor types: <strong className="text-foreground">Venture Capital</strong>, 
                      <strong className="text-foreground"> DAOs</strong>, and 
                      <strong className="text-foreground"> Labels/Brands</strong>.
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400">Trading</Badge>
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground">Signal Conviction</h3>
                    <p className="text-sm text-muted-foreground">
                      Scouts place YES positions on opportunities they believe in. Each trade is 
                      validated against your balance and the market's escrow limits. Your position 
                      accumulates across multiple trades.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <div className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">
                        <Wallet className="mr-1 inline h-3 w-3" /> 10,000 USDC starting balance
                      </div>
                      <div className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">
                        <Shield className="mr-1 inline h-3 w-3" /> 10% max per trade
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-400">Portfolio</Badge>
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground">Track Your Trades</h3>
                    <p className="text-sm text-muted-foreground">
                      The My Trades page provides a complete view of your trading activity. 
                      See total invested amount, active positions across markets, and full 
                      trade history with timestamps and status indicators.
                    </p>
                  </div>
                </div>
              </section>

              {/* Opportunity Markets */}
              <section id="markets" className="scroll-mt-24">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-foreground">
                  <Target className="h-5 w-5 text-primary" />
                  Opportunity Markets
                </h2>

                <div className="mb-6 rounded-lg border border-border bg-card p-5">
                  <h3 className="mb-3 font-semibold text-foreground">Market Types</h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                      <Badge variant="outline" className="mb-2 bg-primary/10 text-primary">VC</Badge>
                      <h4 className="mb-1 text-sm font-medium text-foreground">Venture Capital</h4>
                      <p className="text-xs text-muted-foreground">
                        Early-stage startup discovery and Series A/B investment opportunities.
                      </p>
                    </div>
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
                      <Badge variant="outline" className="mb-2 bg-emerald-500/10 text-emerald-400">DAO</Badge>
                      <h4 className="mb-1 text-sm font-medium text-foreground">DAOs</h4>
                      <p className="text-xs text-muted-foreground">
                        Decentralized governance and protocol contributor discovery.
                      </p>
                    </div>
                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                      <Badge variant="outline" className="mb-2 bg-amber-500/10 text-amber-400">Label</Badge>
                      <h4 className="mb-1 text-sm font-medium text-foreground">Labels / Brands</h4>
                      <p className="text-xs text-muted-foreground">
                        Talent scouting for music, sports, and entertainment.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-card p-5">
                  <h3 className="mb-3 font-semibold text-foreground">Market Lifecycle</h3>
                  <div className="relative">
                    <div className="absolute left-4 top-0 h-full w-0.5 bg-border" />
                    <div className="space-y-4">
                      <div className="relative flex gap-4 pl-10">
                        <div className="absolute left-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">1</div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground">Creation</h4>
                          <p className="text-xs text-muted-foreground">Sponsor creates market with escrow deposit</p>
                        </div>
                      </div>
                      <div className="relative flex gap-4 pl-10">
                        <div className="absolute left-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">2</div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground">Discovery Window</h4>
                          <p className="text-xs text-muted-foreground">Scouts place positions during the open period</p>
                        </div>
                      </div>
                      <div className="relative flex gap-4 pl-10">
                        <div className="absolute left-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">3</div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground">Resolution</h4>
                          <p className="text-xs text-muted-foreground">Market resolves based on opportunity outcome</p>
                        </div>
                      </div>
                      <div className="relative flex gap-4 pl-10">
                        <div className="absolute left-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs text-white">4</div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground">Settlement</h4>
                          <p className="text-xs text-muted-foreground">Rewards distributed to winning scouts</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Trading Mechanics */}
              <section id="trading" className="scroll-mt-24">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-foreground">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Trading Mechanics
                </h2>

                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-card p-5">
                    <h3 className="mb-3 font-semibold text-foreground">Trade Validation</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Every trade goes through multi-layer validation to ensure market integrity:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 rounded-md bg-secondary/50 p-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <div>
                          <h4 className="text-sm font-medium text-foreground">Amount Validation</h4>
                          <p className="text-xs text-muted-foreground">Trade amount must be greater than zero</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 rounded-md bg-secondary/50 p-3">
                        <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div>
                          <h4 className="text-sm font-medium text-foreground">Balance Check</h4>
                          <p className="text-xs text-muted-foreground">Cannot exceed your available balance</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 rounded-md bg-secondary/50 p-3">
                        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        <div>
                          <h4 className="text-sm font-medium text-foreground">Escrow Limit (10%)</h4>
                          <p className="text-xs text-muted-foreground">Single trade capped at 10% of market escrow</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                      <div>
                        <h3 className="mb-1 font-semibold text-foreground">Trading Limits</h3>
                        <p className="text-sm text-muted-foreground">
                          The 10% escrow cap prevents any single scout from dominating a market. 
                          This ensures fair price discovery and reduces manipulation risk.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-border bg-card p-5">
                      <Clock className="mb-3 h-5 w-5 text-muted-foreground" />
                      <h3 className="mb-2 font-semibold text-foreground">Trade States</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 text-[10px]">PENDING</Badge>
                          <span className="text-xs text-muted-foreground">Transaction submitted</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 text-[10px]">CONFIRMED</Badge>
                          <span className="text-xs text-muted-foreground">On-chain confirmation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-red-500/10 text-red-400 text-[10px]">FAILED</Badge>
                          <span className="text-xs text-muted-foreground">Transaction reverted</span>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-5">
                      <Layers className="mb-3 h-5 w-5 text-muted-foreground" />
                      <h3 className="mb-2 font-semibold text-foreground">Position Accumulation</h3>
                      <p className="text-xs text-muted-foreground">
                        Multiple trades on the same market accumulate into a single position. 
                        Your total position is visible in the Trade Panel and My Trades portfolio view.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Security & Escrow */}
              <section id="security" className="scroll-mt-24">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-foreground">
                  <Shield className="h-5 w-5 text-primary" />
                  Security & Escrow
                </h2>

                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-card p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                        <Lock className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <h3 className="mb-2 font-semibold text-foreground">Smart Contract Escrow</h3>
                        <p className="text-sm text-muted-foreground">
                          All sponsor funds are locked in audited smart contracts. Funds can only 
                          be released based on predefined market outcomes, ensuring trustless 
                          operation and eliminating counterparty risk.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-border bg-card p-4">
                      <h4 className="mb-2 text-sm font-semibold text-foreground">Data Persistence</h4>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          Trades stored in localStorage
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          Balance persisted across sessions
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          Market data synced with context
                        </li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4">
                      <h4 className="mb-2 text-sm font-semibold text-foreground">Authentication</h4>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          Demo mode for testing
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          WalletConnect integration
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          Ethereum wallet support
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="scroll-mt-24">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-foreground">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Frequently Asked Questions
                </h2>

                <div className="space-y-2">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-border bg-card overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-secondary/50"
                      >
                        <span className="text-sm font-medium text-foreground">{faq.question}</span>
                        {expandedFaq === index ? (
                          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                      </button>
                      {expandedFaq === index && (
                        <div className="border-t border-border px-4 py-3">
                          <p className="text-sm text-muted-foreground">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Footer Note */}
              <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  ScoutX is experimental software. Use at your own risk. Not financial advice.
                </p>
              </div>
            </main>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Docs;

