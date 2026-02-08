import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Market } from "@/data/markets";

const sponsorTypeStyles: Record<Market["sponsorType"], string> = {
  VC: "border-primary/30 bg-primary/10 text-accent-foreground",
  DAO: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  Label: "border-amber-500/30 bg-amber-500/10 text-amber-400",
};

interface MarketCardProps {
  market: Market;
}

const MarketCard = ({ market }: MarketCardProps) => {
  return (
    <div className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-border hover:bg-card/80">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-snug text-card-foreground">
          {market.name}
        </h3>
        <Badge
          variant="outline"
          className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider ${
            sponsorTypeStyles[market.sponsorType]
          }`}
        >
          {market.sponsorType}
        </Badge>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
        {market.sponsor}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span className="font-mono">{market.windowRemaining}</span>
        </div>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground"
        >
          <Link to={`/markets/${market.id}`}>
            Enter
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default MarketCard;
