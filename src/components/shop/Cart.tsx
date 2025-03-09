
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { items, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simuler un traitement de commande
    setTimeout(() => {
      clearCart();
      setIsCheckingOut(false);
      // Ici vous pourriez rediriger vers une page de confirmation
    }, 2000);
  };
  
  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingCart size={32} className="text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-heading font-semibold mb-3 text-ruche-purple">Votre panier est vide</h2>
        <p className="text-muted-foreground mb-6">
          Découvrez nos produits et ajoutez-les à votre panier.
        </p>
        <Button asChild>
          <Link to="/shop">
            Continuer les achats
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-heading font-semibold text-ruche-purple">Votre Panier</h2>
      </div>
      
      <div className="divide-y divide-border">
        {items.map(item => (
          <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start gap-4">
            <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <h3 className="font-medium text-lg text-ruche-purple">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Prix unitaire: {(item.discountPrice || item.price).toFixed(2)}€
                  </p>
                </div>
                <div className="font-semibold text-ruche-purple">
                  {((item.discountPrice || item.price) * item.quantity).toFixed(2)}€
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2">
                <div className="flex items-center border border-border rounded-md">
                  <button 
                    className="p-1 px-2 text-muted-foreground hover:text-ruche-purple"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center">{item.quantity}</span>
                  <button 
                    className="p-1 px-2 text-muted-foreground hover:text-ruche-purple"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <button 
                  className="text-red-500 hover:text-red-700 flex items-center mt-2 sm:mt-0"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 size={16} className="mr-1" />
                  <span className="text-sm">Retirer</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-6 bg-muted/30">
        <div className="flex justify-between mb-2">
          <span className="text-muted-foreground">Sous-total</span>
          <span className="font-medium">{totalPrice.toFixed(2)}€</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-muted-foreground">Frais de livraison</span>
          <span className="font-medium">5.00€</span>
        </div>
        <div className="flex justify-between pt-4 border-t border-border mt-4">
          <span className="font-semibold text-ruche-purple">Total</span>
          <span className="font-bold text-xl text-ruche-purple">{(totalPrice + 5).toFixed(2)}€</span>
        </div>
        
        <div className="mt-6 space-y-3">
          <Button 
            className="w-full bg-ruche-gold hover:bg-ruche-gold-light text-ruche-purple"
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-ruche-purple border-t-transparent"></div>
                Traitement...
              </>
            ) : (
              "Passer à la caisse"
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full" 
            asChild
          >
            <Link to="/shop">
              Continuer les achats
            </Link>
          </Button>
          
          <Button 
            variant="link" 
            className="w-full text-red-500 hover:text-red-700"
            onClick={clearCart}
          >
            Vider le panier
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
