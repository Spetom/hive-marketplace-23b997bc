
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Logo header ajouté en haut de page */}
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
          {/* Ajout d'un espace pour compenser la hauteur du header fixe */}
          <div className="h-20"></div>
          
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <QuickFooter />
          
          {/* Cart button that appears on all pages */}
          <CartButton />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
