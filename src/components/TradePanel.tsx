import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TradePanel = () => {
  const [amount, setAmount] = useState("");

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 text-sm font-semibold text-card-foreground">
        Trade Panel
      </h3>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Amount (USDC)
          </label>
          <Input
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="font-mono"
          />
        </div>

        <Button className="w-full font-semibold" size="lg">
          Buy YES
        </Button>

        <div className="flex items-start gap-2 rounded-md bg-secondary p-3">
          <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Prices are visible only to the sponsor during the opportunity window.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TradePanel;
