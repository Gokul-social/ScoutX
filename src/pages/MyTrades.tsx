import { Link } from "react-router-dom";
import { ArrowRight, Clock, TrendingUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useTrades } from "@/context/TradeContext";

const statusStyles: Record<string, string> = {
  pending: "border-yellow-500/30 bg-yellow-500/10 text-yellow-500",
  confirmed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  failed: "border-red-500/30 bg-red-500/10 text-red-400",
};

const MyTrades = () => {
  const { trades, getTotalInvested, getAllPositions } = useTrades();

  const totalInvested = getTotalInvested();
  const positions = getAllPositions();

  // Format timestamp to readable date
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
            My Trades
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Track your trading history and portfolio positions.
          </p>

          {/* Portfolio Summary */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Wallet className="h-3.5 w-3.5" />
                Total Invested
              </div>
              <div className="font-mono text-xl font-bold text-foreground">
                {totalInvested.toLocaleString()} USDC
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                Active Positions
              </div>
              <div className="font-mono text-xl font-bold text-foreground">
                {positions.length}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Total Trades
              </div>
              <div className="font-mono text-xl font-bold text-foreground">
                {trades.length}
              </div>
            </div>
          </div>

          {/* Trades List */}
          {trades.length > 0 ? (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground">
                Trade History
              </h2>
              <div className="divide-y divide-border rounded-lg border border-border bg-card">
                {trades.map((trade) => (
                  <div
                    key={trade.id}
                    className="flex items-center justify-between p-4 transition-colors hover:bg-secondary/30"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {trade.marketName}
                        </span>
                        <Badge
                          variant="outline"
                          className="border-primary/30 bg-primary/10 text-xs text-primary"
                        >
                          {trade.type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase ${statusStyles[trade.status]}`}
                        >
                          {trade.status}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(trade.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {trade.amount.toLocaleString()} USDC
                      </span>
                      <Button asChild variant="ghost" size="sm" className="gap-1">
                        <Link to={`/markets/${trade.marketId}`}>
                          View
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <TrendingUp className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-sm font-medium text-foreground">
                No trades yet
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Start trading by exploring opportunity markets.
              </p>
              <Button asChild>
                <Link to="/markets">Browse Markets</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MyTrades;
