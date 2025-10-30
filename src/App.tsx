import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import BlogGenerator from "./pages/tools/BlogGenerator";
import CodeGenerator from "./pages/tools/CodeGenerator";
import GrammarFixer from "./pages/tools/GrammarFixer";
import AdCopyWriter from "./pages/tools/AdCopyWriter";
import TextSummarizer from "./pages/tools/TextSummarizer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          
          {/* AI Tools */}
          <Route path="/tool/1" element={<BlogGenerator />} />
          <Route path="/tool/2" element={<CodeGenerator />} />
          <Route path="/tool/3" element={<GrammarFixer />} />
          <Route path="/tool/5" element={<AdCopyWriter />} />
          <Route path="/tool/6" element={<TextSummarizer />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
