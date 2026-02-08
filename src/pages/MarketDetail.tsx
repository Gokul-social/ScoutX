import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import TradePanel from "@/components/TradePanel";
import { useMarkets } from "@/context/MarketContext";

const sponsorTypeStyles: Record<string, string> = {
  VC: "border-primary/30 bg-primary/10 text-accent-foreground",
  DAO: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  Label: "border-amber-500/30 bg-amber-500/10 text-amber-400",
};

const MarketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getMarketById } = useMarkets();
  const market = id ? getMarketById(id) : undefined;

  if (!market) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Market not found.</p>
          <Button asChild variant="ghost" className="mt-4">
            <Link to="/markets">Back to markets</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container max-w-4xl">
          {/* Back */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mb-6 gap-1.5 text-xs text-muted-foreground"
          >
            <Link to="/markets">
              <ArrowLeft className="h-3 w-3" />
              Back to markets
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Left column */}
            <div>
              <div className="mb-4 flex items-start gap-3">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  {market.name}
                </h1>
                <Badge
                  variant="outline"
                  className={`mt-1 shrink-0 text-[10px] font-semibold uppercase tracking-wider ${
                    sponsorTypeStyles[market.sponsorType]
                  }`}
                >
                  {market.sponsorType}
                </Badge>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                {market.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    Sponsor Escrow
                  </div>
                  <div className="font-mono text-sm font-semibold text-foreground">
                    {market.escrowAmount}
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Time Remaining
                  </div>
                  <div className="font-mono text-sm font-semibold text-foreground">
                    {market.windowRemaining}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-border bg-card p-4">
                <div className="mb-1 text-xs text-muted-foreground">Sponsor</div>
                <div className="text-sm font-medium text-foreground">
                  {market.sponsor}
                </div>
              </div>
            </div>

            {/* Right column - Trade Panel */}
            <div className="lg:sticky lg:top-24">
              <TradePanel />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MarketDetail;
