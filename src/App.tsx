import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Pricing from "./pages/Pricing";
import Reviews from "./pages/Reviews";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import HandleOAuthRedirect from "./pages/HandleOAuthRedirect"; // ✅ تم إضافة هذا السطر

const queryClient = new QueryClient();

console.log('App.tsx: QueryClient created');

const App = () => {
  console.log('App.tsx: App component rendering...');
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/oauth-redirect" element={<HandleOAuthRedirect />} /> {/* ✅ تم إضافة هذا المسار */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
