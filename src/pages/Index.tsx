import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import MarketCard from "@/components/MarketCard";
import HowItWorks from "@/components/HowItWorks";
import { markets } from "@/data/markets";

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="container max-w-3xl text-center">
          <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
            Private markets for discovering real-world opportunities.
          </h1>
          <p className="mb-10 text-base text-muted-foreground md:text-lg">
            Bet on outcomes. Signal conviction. Get rewarded for being early.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild size="lg" className="gap-2 font-semibold">
              <Link to="/markets">
                Explore Markets
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-semibold">
              <Link to="/create">Create Market</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Live Markets */}
      <section className="border-t border-border/50 py-20">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Live Opportunity Markets
            </h2>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground"
            >
              <Link to="/markets">
                View all
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {markets.slice(0, 3).map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />
    </Layout>
  );
};

export default Index;
