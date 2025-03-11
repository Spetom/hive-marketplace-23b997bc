
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ShoppingBag } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Check if this is a valid client-side route that might need redirection
  const isShopRoute = location.pathname === "/shop" || location.pathname.startsWith("/shop/");
  const isProductRoute = location.pathname.startsWith("/product/");
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-sm border border-border">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-ruche-purple mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-2">Page non trouvée</p>
          <p className="text-muted-foreground">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button asChild className="w-full" variant="default">
            <Link to="/" className="flex items-center justify-center">
              <Home size={18} className="mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
          
          {(isShopRoute || isProductRoute) && (
            <Button asChild className="w-full" variant="outline">
              <Link to="/shop" className="flex items-center justify-center">
                <ShoppingBag size={18} className="mr-2" />
                Aller à la boutique
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
