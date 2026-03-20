import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BlogProvider } from "@/context/BlogContext";
import { AdvertProvider } from "@/context/AdvertContext";
import Index from "./pages/Index";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';

const queryClient = new QueryClient();

const App = () => {
  const [token, setToken] = useState<string | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BlogProvider token={token}> {/* Passe token dans le context */}
          <AdvertProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AdvertProvider>
        </BlogProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
