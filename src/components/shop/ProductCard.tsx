
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  return (
    <Card 
      className="overflow-hidden border border-border hover:border-ruche-gold transition-all duration-300 hover:shadow-lg group hover-lift"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden aspect-square">
          <div className={cn(
            "absolute inset-0 bg-gray-100 flex items-center justify-center transition-opacity",
            isLoading ? "opacity-100" : "opacity-0"
          )}>
            <div className="w-8 h-8 border-2 border-ruche-purple/30 border-t-ruche-gold rounded-full animate-spin"></div>
          </div>
          
          <img 
            src={product.image} 
            alt={product.name} 
            className={cn(
              "object-cover w-full h-full transition-all duration-700",
              isLoading ? "opacity-0 scale-110" : "opacity-100 scale-100",
              isHovered ? "scale-110" : "scale-100"
            )}
            onLoad={() => setIsLoading(false)}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.discountPrice && (
              <span className="bg-ruche-gold text-white text-xs font-bold px-2 py-1 rounded-md">
                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
              </span>
            )}
            {product.featured && (
              <span className="bg-ruche-purple text-white text-xs font-bold px-2 py-1 rounded-md">
                Featured
              </span>
            )}
          </div>
          
          {/* Actions */}
          <div className="absolute top-3 right-3">
            <button 
              onClick={toggleFavorite}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                isFavorite 
                  ? "bg-red-500 text-white" 
                  : "bg-white/80 backdrop-blur-sm text-ruche-purple hover:bg-white"
              )}
            >
              <Heart size={16} className={isFavorite ? "fill-white" : ""} />
            </button>
          </div>
          
          {/* Add to cart button */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ruche-purple to-transparent p-4 transform transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <Button 
              variant="default"
              size="sm"
              className="w-full bg-white text-ruche-purple hover:bg-ruche-gold hover:text-white"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={16} className="mr-2" />
              Ajouter au panier
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-ruche-purple line-clamp-1">{product.name}</h3>
          </div>
          
          <div className="flex items-center mb-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-ruche-gold' : 'text-gray-300'}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">({product.rating})</span>
          </div>
          
          <div className="flex items-end justify-between mt-1">
            <div>
              {product.discountPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-ruche-purple">{product.discountPrice.toFixed(2)}€</span>
                  <span className="text-sm text-muted-foreground line-through">{product.price.toFixed(2)}€</span>
                </div>
              ) : (
                <span className="text-lg font-semibold text-ruche-purple">{product.price.toFixed(2)}€</span>
              )}
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {product.inStock ? 'En stock' : 'Rupture'}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
