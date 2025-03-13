
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Trash2,
  MinusCircle,
  PlusCircle,
  X,
  ShoppingBag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// Conversion Euro to FCFA (1 EUR = 655.957 FCFA)
const euroToFCFA = (euroPrice: number): number => {
  return Math.round(euroPrice * 655.957);
};

export const Cart = () => {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleRemoveItem = (id: string, name: string) => {
    removeFromCart(id);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleClearCart = () => {
    clearCart();
    toast.info("Panier vidé");
  };

  const handleCloseCart = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-ruche-gold text-ruche-purple font-bold px-1.5 min-w-[20px] h-5">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-5">
          <div className="flex justify-between items-center">
            <SheetTitle className="font-heading">Mon Panier</SheetTitle>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleCloseCart}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">Votre panier est vide</h3>
            <p className="text-muted-foreground mb-6">
              Ajoutez des produits à votre panier pour commencer vos achats.
            </p>
            <Button onClick={handleCloseCart} asChild>
              <Link to="/shop">Découvrir nos produits</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-ruche-purple">{item.name}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <p className="font-semibold">
                        {euroToFCFA(
                          (item.discountPrice || item.price) * item.quantity
                        ).toLocaleString()} FCFA
                      </p>
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          className="text-muted-foreground hover:text-ruche-purple"
                          disabled={item.quantity <= 1}
                        >
                          <MinusCircle size={20} />
                        </button>
                        <span className="mx-2 w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className="text-muted-foreground hover:text-ruche-purple"
                        >
                          <PlusCircle size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id, item.name)}
                    className="text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-medium">{euroToFCFA(totalPrice).toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Livraison</span>
                <span className="font-medium">Gratuit</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="font-medium text-ruche-purple">Total</span>
                <span className="font-bold text-ruche-purple">
                  {euroToFCFA(totalPrice).toLocaleString()} FCFA
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={handleCloseCart} asChild className="bg-ruche-gold hover:bg-ruche-gold-light text-ruche-purple">
                <Link to="/checkout">
                  Passer à la caisse
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} className="mr-2" />
                Vider le panier
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
