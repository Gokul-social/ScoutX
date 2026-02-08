import { useState } from "react";
import { Info, Loader2, TrendingUp, Wallet, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTrades, MAX_TRADE_ESCROW_PERCENTAGE } from "@/context/TradeContext";
import { toast } from "sonner";

interface TradePanelProps {
  marketId: string;
  marketName: string;
  escrowAmount: number; // Escrow amount in raw number format
  isOwnMarket?: boolean; // true if current user created this market
}

const TradePanel = ({ marketId, marketName, escrowAmount, isOwnMarket }: TradePanelProps) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { executeTrade, getPosition, balance, getMaxTradeAmount } = useTrades();

  const position = getPosition(marketId);
  const maxTradeAmount = getMaxTradeAmount(escrowAmount);
  const escrowLimit = escrowAmount * MAX_TRADE_ESCROW_PERCENTAGE;

  // Block trading on own markets
  if (isOwnMarket) {
    return (
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div>
            <h3 className="mb-1 text-sm font-semibold text-amber-400">
              Trading Restricted
            </h3>
            <p className="text-xs leading-relaxed text-amber-500/80">
              You cannot trade on markets you created. This prevents conflicts of interest and market manipulation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleTrade = async () => {
    // Validate amount
    const numAmount = parseFloat(amount);
    if (!amount.trim() || isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return;
    }

    // Check against balance
    if (numAmount > balance) {
      toast.error(`Insufficient balance. You have ${balance.toLocaleString()} USDC`);
      return;
    }

    // Check against escrow limit (10% of escrow)
    if (numAmount > escrowLimit) {
      toast.error(`Maximum trade is ${escrowLimit.toLocaleString()} USDC (10% of escrow)`);
      return;
    }

    setIsLoading(true);
    try {
      await executeTrade(marketId, marketName, numAmount, "YES");
      toast.success(`Successfully bought ${numAmount.toLocaleString()} USDC position`);
      setAmount(""); // Clear input after success
    } catch (error) {
      toast.error("Trade failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 text-sm font-semibold text-card-foreground">
        Trade Panel
      </h3>

      <div className="space-y-4">
        {/* Wallet Balance */}
        <div className="flex items-center justify-between rounded-md bg-secondary px-3 py-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Wallet className="h-3.5 w-3.5" />
            <span>Your Balance</span>
          </div>
          <span className="font-mono text-sm font-semibold text-foreground">
            {balance.toLocaleString()} USDC
          </span>
        </div>

        {/* Current Position */}
        {position && (
          <div className="flex items-center justify-between rounded-md bg-primary/10 px-3 py-2">
            <div className="flex items-center gap-2 text-xs text-primary">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Your Position</span>
            </div>
            <span className="font-mono text-sm font-semibold text-primary">
              {position.totalAmount.toLocaleString()} USDC
            </span>
          </div>
        )}

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">
              Amount (USDC)
            </label>
            <span className="text-[10px] text-muted-foreground">
              Max: {maxTradeAmount.toLocaleString()} USDC
            </span>
          </div>
          <Input
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="font-mono"
            disabled={isLoading}
          />
        </div>

        {/* Escrow limit warning */}
        <div className="flex items-start gap-2 rounded-md bg-amber-500/10 px-3 py-2">
          <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
          <p className="text-[10px] leading-relaxed text-amber-500">
            Max trade: 10% of escrow ({escrowLimit.toLocaleString()} USDC)
          </p>
        </div>

        <Button
          className="w-full font-semibold"
          size="lg"
          onClick={handleTrade}
          disabled={isLoading || balance === 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Buy YES"
          )}
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


