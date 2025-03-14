import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import CartButton from "./components/shop/CartButton";
import Index from "./pages/Index";
import About from "./pages/About";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import QuickFooter from "./components/layout/QuickFooter";
import Contact from './pages/Contact';
import { useEffect } from 'react';
import { initEmailJS } from './lib/emailService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  useEffect(() => {
    initEmailJS();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm py-3">
              <div className="container mx-auto px-4 flex justify-center items-center">
                <Link to="/" className="flex items-center">
                  <img
                    src="/lovable-uploads/79615c23-e955-46f0-ae0d-ea61a982bfab.png"
                    alt="La Ruche d'Or Logo"
                    className="h-12 object-contain"
                  />
                  <span className="font-heading font-bold text-xl text-ruche-purple ml-2 hidden sm:inline-block">
                    LA RUCHE D'OR
                  </span>
                </Link>
              </div>
            </div>
            <div className="h-20"></div>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <QuickFooter />
            <CartButton />
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
