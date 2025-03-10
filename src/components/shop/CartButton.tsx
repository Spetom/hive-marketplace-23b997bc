
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Cart } from './Cart';

const CartButton = () => {
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };
  
  return (
    <div className="relative z-10">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={toggleCart}
        aria-label="Panier"
      >
        <ShoppingCart className="h-5 w-5 text-ruche-gold" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-ruche-gold text-ruche-purple text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Button>
      
      {isCartOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 z-40"
            onClick={toggleCart}
          ></div>
          <div className="absolute right-0 mt-2 z-50 w-80 sm:w-96">
            <Cart />
          </div>
        </>
      )}
    </div>
  );
};

export default CartButton;
