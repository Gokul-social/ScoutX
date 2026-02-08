import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Sun, Moon, Wallet, Circle, LogOut, RefreshCw, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Markets", to: "/markets" },
  { label: "Create Market", to: "/create" },
  { label: "Docs", to: "/docs" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, authMethod, user, logout, switchWallet, loginWithWallet } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSwitchWallet = () => {
    switchWallet();
  };

  const handleConnectWallet = () => {
    loginWithWallet();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <nav className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tight text-foreground">
            ScoutX
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground ${
                  location.pathname === link.to
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground sm:flex">
            <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
            Ethereum Mainnet
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 font-mono text-xs"
                >
                  {authMethod === 'demo' ? (
                    <>
                      <User className="h-3.5 w-3.5" />
                      Demo Mode
                    </>
                  ) : (
                    <>
                      <Wallet className="h-3.5 w-3.5" />
                      {user?.address}
                    </>
                  )}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{user?.displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      {authMethod === 'demo' ? 'Demo Account' : user?.address}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {authMethod === 'demo' ? (
                  <DropdownMenuItem onClick={handleConnectWallet} className="gap-2 cursor-pointer">
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={handleSwitchWallet} className="gap-2 cursor-pointer">
                    <RefreshCw className="h-4 w-4" />
                    Switch Wallet
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" onClick={handleConnectWallet} className="gap-2">
              <Wallet className="h-3.5 w-3.5" />
              Connect Wallet
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

