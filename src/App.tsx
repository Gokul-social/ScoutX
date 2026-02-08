import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmiConfig";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Markets from "./pages/Markets";
import MarketDetail from "./pages/MarketDetail";
import CreateMarket from "./pages/CreateMarket";
import Docs from "./pages/Docs";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark">
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/markets" element={<ProtectedRoute><Markets /></ProtectedRoute>} />
                <Route path="/markets/:id" element={<ProtectedRoute><MarketDetail /></ProtectedRoute>} />
                <Route path="/create" element={<ProtectedRoute><CreateMarket /></ProtectedRoute>} />
                <Route path="/docs" element={<ProtectedRoute><Docs /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </ThemeProvider>
);

export default App;

