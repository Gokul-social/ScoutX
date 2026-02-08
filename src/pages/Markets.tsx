import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import MarketCard from "@/components/MarketCard";
import { markets } from "@/data/markets";
import type { Market } from "@/data/markets";

const sponsorTypes: Array<Market["sponsorType"] | "All"> = ["All", "VC", "DAO", "Label"];

const Markets = () => {
  const [filter, setFilter] = useState<Market["sponsorType"] | "All">("All");
  const [search, setSearch] = useState("");

  const filtered = markets.filter((m) => {
    const matchesType = filter === "All" || m.sponsorType === filter;
    const matchesSearch =
      search === "" ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.sponsor.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
            Opportunity Markets
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Browse active markets and discover opportunities before anyone else.
          </p>

          {/* Filters */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              {sponsorTypes.map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setFilter(type)}
                  className="text-xs font-medium"
                >
                  {type}
                </Button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search markets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-sm text-muted-foreground">
              No markets found matching your criteria.
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Markets;
