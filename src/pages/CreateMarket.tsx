import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { toast } from "sonner";

const durations = ["1 day", "3 days", "7 days", "14 days", "30 days"];

const CreateMarket = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [escrow, setEscrow] = useState("");
  const [duration, setDuration] = useState(durations[2]);

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
