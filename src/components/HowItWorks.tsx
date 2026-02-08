import { Shield, Zap, Lock } from "lucide-react";

const steps = [
  {
    icon: Shield,
    number: "01",
    title: "Sponsor posts opportunity",
    description: "A sponsor creates an opportunity market and locks escrow funds as incentive for scouts.",
  },
  {
    icon: Zap,
    number: "02",
    title: "Scouts place private bets",
    description: "Scouts signal conviction by placing instant, off-chain bets during the opportunity window.",
  },
  {
    icon: Lock,
    number: "03",
    title: "On-chain settlement",
    description: "When the window closes, positions settle on-chain and rewards are distributed transparently.",
  },
];

const HowItWorks = () => {
  return (
    <section className="border-t border-border/50 py-20">
      <div className="container">
        <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight text-foreground">
          How ScoutX Works
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <step.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="mb-2 font-mono text-xs text-muted-foreground">
                {step.number}
              </div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
