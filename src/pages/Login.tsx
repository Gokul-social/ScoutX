/**
 * Login Page
 * ==========
 * Minimalistic login with Demo User and Wallet connection options
 */

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wallet, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loginAsDemo, loginWithWallet } = useAuth();

  // Get the intended destination or default to home
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleDemoLogin = () => {
    loginAsDemo();
  };

  const handleWalletLogin = () => {
    loginWithWallet();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Gradient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Glass card */}
        <div className="relative backdrop-blur-xl bg-card/80 border border-border/50 rounded-2xl p-8 shadow-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 mb-6 shadow-lg shadow-purple-500/25">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome to ScoutX
            </h1>
            <p className="text-muted-foreground text-sm">
              Discover opportunities in private markets
            </p>
          </div>

          {/* Auth Buttons */}
          <div className="space-y-4">
            {/* Wallet Connection - Primary */}
            <Button
              onClick={handleWalletLogin}
              size="lg"
              className="w-full gap-3 h-14 text-base font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-[1.02]"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground">or</span>
              </div>
            </div>

            {/* Demo Mode - Secondary */}
            <Button
              onClick={handleDemoLogin}
              variant="outline"
              size="lg"
              className="w-full gap-3 h-14 text-base font-medium border-border/50 hover:bg-secondary/80 transition-all duration-300 hover:scale-[1.02]"
            >
              <User className="w-5 h-5" />
              Try Demo Mode
            </Button>
          </div>

          {/* Footer text */}
          <p className="text-center text-xs text-muted-foreground mt-8">
            Demo mode lets you explore without a wallet.
            <br />
            Connect a wallet for full functionality.
          </p>
        </div>

        {/* Decorative glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-transparent to-purple-600/20 rounded-2xl blur-xl -z-10" />
      </div>
    </div>
  );
};

export default Login;
