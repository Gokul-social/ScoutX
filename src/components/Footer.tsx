const Footer = () => {
  return (
    <footer className="border-t border-border/50">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms
          </a>
        </div>
        <p className="text-xs text-muted-foreground/60">
          ScoutX is experimental software. Use at your own risk. Not financial advice.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
