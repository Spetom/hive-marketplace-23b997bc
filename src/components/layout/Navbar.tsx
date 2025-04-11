
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const isMobile = useIsMobile();
  
  const links = [
    { name: 'Accueil', path: '/' },
    { name: 'Boutique', path: '/shop' },
    { name: 'À propos', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src="/lovable-uploads/79615c23-e955-46f0-ae0d-ea61a982bfab.png"
              alt="La Ruche d'Or"
              className="h-12 mr-2"
            />
            <span className="font-heading font-bold text-xl text-ruche-purple hidden sm:inline-block">
              LA RUCHE D'OR
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            {links.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={cn(
                  "text-ruche-purple hover:text-ruche-gold transition-colors btn-hover",
                  isActive(link.path) && "font-medium"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-ruche-purple hover:text-ruche-gold hover:bg-ruche-purple/5"
              >
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-ruche-gold text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-ruche-purple hover:text-ruche-gold hover:bg-ruche-purple/5"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md animate-slide-down">
          <div className="container-custom py-4">
            <nav className="flex flex-col space-y-4">
              {links.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={cn(
                    "text-ruche-purple hover:text-ruche-gold transition-colors py-2",
                    isActive(link.path) && "font-medium"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
