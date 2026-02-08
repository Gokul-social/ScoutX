import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { useMarkets } from "@/context/MarketContext";
import type { Market } from "@/data/markets";

const durations = ["1 day", "3 days", "7 days", "14 days", "30 days"];

// Predefined sponsor types with descriptions
const sponsorTypes: Array<{
  value: Market["sponsorType"];
  label: string;
  description: string;
}> = [
  { value: "VC", label: "Venture Capital", description: "Investment funds & angel investors" },
  { value: "DAO", label: "DAO", description: "Decentralized autonomous organizations" },
  { value: "Label", label: "Label / Brand", description: "Record labels, studios & brands" },
];

// Map duration to windowRemaining format
const durationToWindow = (duration: string): string => {
  const daysMatch = duration.match(/(\d+)/);
  if (!daysMatch) return "7d 0h 0m";
  const days = parseInt(daysMatch[1], 10);
  return `${days}d 0h 0m`;
};

const CreateMarket = () => {
  const navigate = useNavigate();
  const { addMarket } = useMarkets();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [escrow, setEscrow] = useState("");
  const [duration, setDuration] = useState(durations[2]);
  const [sponsorType, setSponsorType] = useState<Market["sponsorType"]>("VC");
  const [sponsorName, setSponsorName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Market title is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!escrow.trim()) {
      toast.error("Escrow amount is required");
      return;
    }
    if (!sponsorName.trim()) {
      toast.error("Sponsor name is required");
      return;
    }

    // Create the new market
    addMarket({
      name: title.trim(),
      description: description.trim(),
      sponsorType: sponsorType,
      escrowAmount: `${parseFloat(escrow).toLocaleString()} USDC`,
      windowRemaining: durationToWindow(duration),
      sponsor: sponsorName.trim(),
    });

    toast.success("Market created successfully");
    navigate("/markets");
  };

  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container max-w-xl">
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
            Create Market
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Post an opportunity and attract scouts to discover outcomes.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-medium text-muted-foreground">
                Market Title
              </Label>
              <Input
                id="title"
                placeholder="e.g., Series A — Climate Tech Discovery"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-medium text-muted-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the opportunity and what scouts should evaluate..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Sponsor Type Dropdown */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Market Category
              </Label>
              <Select value={sponsorType} onValueChange={(value: Market["sponsorType"]) => setSponsorType(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {sponsorTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {sponsorTypes.find((t) => t.value === sponsorType)?.description}
              </p>
            </div>

            {/* Sponsor Name Input */}
            <div className="space-y-2">
              <Label htmlFor="sponsorName" className="text-xs font-medium text-muted-foreground">
                Sponsor / Organization Name
              </Label>
              <Input
                id="sponsorName"
                placeholder="e.g., Sequoia Capital, Uniswap DAO, Sony Music"
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="escrow" className="text-xs font-medium text-muted-foreground">
                Escrow Amount (USDC)
              </Label>
              <Input
                id="escrow"
                placeholder="0.00"
                value={escrow}
                onChange={(e) => setEscrow(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Opportunity Window
              </Label>
              <div className="flex flex-wrap gap-2">
                {durations.map((d) => (
                  <Button
                    key={d}
                    type="button"
                    variant={duration === d ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setDuration(d)}
                    className="text-xs"
                  >
                    {d}
                  </Button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full font-semibold" size="lg">
              Create Market
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default CreateMarket;

