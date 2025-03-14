
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  CreditCard, 
  Wallet, 
  ArrowLeft, 
  CheckCircle, 
  Globe, 
  Phone,
  AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';
import { countries } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const euroToFCFA = (euroPrice: number): number => {
  return Math.round(euroPrice * 655.957);
};

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('fedapay');
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Bénin',
  });
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCountryChange = (value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      country: value
    }));
  };

  const isFormValid = () => {
    return customerInfo.fullName && 
           customerInfo.email && 
           customerInfo.phone && 
           customerInfo.address && 
           customerInfo.city;
  };

  const handlePaymentProcess = () => {
    if (!isFormValid()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setPaymentProcessing(true);
    setPaymentError(null);

    // Simuler un processus de paiement (normalement vous appelleriez l'API du processeur de paiement ici)
    setTimeout(() => {
      // Ici, nous envoyons normalement les détails de la commande au serveur
      // qui enverrait ensuite un email de confirmation à contact@laruche-dor.com
      console.log("Commande traitée avec succès. Un email sera envoyé à contact@laruche-dor.com");
      
      // Dans une application réelle, vous pourriez utiliser un service comme EmailJS ou une API backend
      // pour envoyer un email à l'adresse contact@laruche-dor.com
      // Exemple: sendOrderConfirmation(customerInfo, items, totalPrice, 'contact@laruche-dor.com');
      
      setPaymentProcessing(false);
      setPaymentCompleted(true);
      clearCart();
      toast.success(`Paiement effectué avec succès via ${getPaymentMethodName(selectedPaymentMethod)}!`);
    }, 2000);
  };

  const getPaymentMethodName = (method: string) => {
    switch(method) {
      case 'fedapay': return 'FedaPay';
      case 'mtn': return 'MTN Mobile Money';
      case 'moov': return 'Moov Money';
      case 'visa': return 'Visa/Mastercard';
      case 'paypal': return 'PayPal';
      default: return 'FedaPay';
    }
  };

  const handleSelectPaymentMethod = (method: string) => {
    setSelectedPaymentMethod(method);
    setPaymentError(null);
    toast.info(`Méthode de paiement: ${getPaymentMethodName(method)} sélectionnée`);
  };

  if (items.length === 0 && !paymentCompleted) {
    return (
      <div className="pt-24 pb-20">
        <div className="container-custom">
          <div className="bg-white p-8 rounded-lg border border-border text-center">
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-ruche-purple mb-6">
              Votre panier est vide
            </h1>
            <p className="text-muted-foreground mb-6">
              Vous n'avez aucun article dans votre panier.
            </p>
            <Button asChild>
              <Link to="/shop">
                Parcourir la boutique
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentCompleted) {
    return (
      <div className="pt-24 pb-20">
        <div className="container-custom">
          <div className="bg-white p-8 rounded-lg border border-border text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle size={64} className="text-green-500" />
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-ruche-purple mb-4">
              Paiement réussi !
            </h1>
            <p className="text-muted-foreground mb-6">
              Votre commande a été traitée avec succès. Vous recevrez bientôt un e-mail de confirmation.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild variant="outline">
                <Link to="/">
                  Retour à l'accueil
                </Link>
              </Button>
              <Button asChild>
                <Link to="/shop">
                  Continuer vos achats
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="container-custom">
        <div className="mb-6">
          <Link to="/shop" className="text-ruche-purple/70 hover:text-ruche-purple inline-flex items-center gap-2 text-sm">
            <ArrowLeft size={16} /> Retour à la boutique
          </Link>
        </div>

        <h1 className="font-heading text-2xl md:text-3xl font-bold text-ruche-purple mb-8">
          Finaliser votre commande
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-border overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-ruche-purple mb-6">Informations personnelles</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-ruche-purple mb-1">
                      Nom complet *
                    </label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={customerInfo.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-ruche-purple mb-1">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      placeholder="johndoe@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-ruche-purple mb-1">
                      Téléphone *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      placeholder="+229 00000000"
                      required
                    />
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-ruche-purple mb-6">Adresse de livraison</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-ruche-purple mb-1">
                      Adresse *
                    </label>
                    <Input
                      id="address"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      placeholder="123 Rue Exemple"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-ruche-purple mb-1">
                      Ville *
                    </label>
                    <Input
                      id="city"
                      name="city"
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      placeholder="Cotonou"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-ruche-purple mb-1">
                      Pays *
                    </label>
                    <Select 
                      value={customerInfo.country} 
                      onValueChange={handleCountryChange}
                    >
                      <SelectTrigger id="country" className="w-full">
                        <SelectValue placeholder="Sélectionnez un pays" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-ruche-purple mb-6">Méthode de paiement</h2>
                
                {paymentError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-600">
                    <AlertCircle size={16} />
                    <p className="text-sm">{paymentError}</p>
                  </div>
                )}
                
                <div className="space-y-4">
                  {/* Options de paiement béninoises */}
                  <div 
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${selectedPaymentMethod === 'fedapay' ? 'border-ruche-gold bg-ruche-gold/5' : 'border-border hover:border-ruche-gold/50'}`}
                    onClick={() => handleSelectPaymentMethod('fedapay')}
                  >
                    <Wallet className={`h-6 w-6 ${selectedPaymentMethod === 'fedapay' ? 'text-ruche-gold' : 'text-muted-foreground'}`} />
                    <div>
                      <h3 className="font-medium text-ruche-purple">FedaPay</h3>
                      <p className="text-sm text-muted-foreground">Paiement sécurisé via FedaPay</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${selectedPaymentMethod === 'mtn' ? 'border-ruche-gold bg-ruche-gold/5' : 'border-border hover:border-ruche-gold/50'}`}
                    onClick={() => handleSelectPaymentMethod('mtn')}
                  >
                    <Phone className={`h-6 w-6 ${selectedPaymentMethod === 'mtn' ? 'text-ruche-gold' : 'text-muted-foreground'}`} />
                    <div>
                      <h3 className="font-medium text-ruche-purple">MTN Mobile Money</h3>
                      <p className="text-sm text-muted-foreground">Paiement via MTN Mobile Money</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${selectedPaymentMethod === 'moov' ? 'border-ruche-gold bg-ruche-gold/5' : 'border-border hover:border-ruche-gold/50'}`}
                    onClick={() => handleSelectPaymentMethod('moov')}
                  >
                    <Phone className={`h-6 w-6 ${selectedPaymentMethod === 'moov' ? 'text-ruche-gold' : 'text-muted-foreground'}`} />
                    <div>
                      <h3 className="font-medium text-ruche-purple">Moov Money</h3>
                      <p className="text-sm text-muted-foreground">Paiement via Moov Money</p>
                    </div>
                  </div>
                  
                  {/* Options de paiement internationales */}
                  <div className="mt-6 mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Options internationales</h3>
                  </div>
                  
                  <div 
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${selectedPaymentMethod === 'visa' ? 'border-ruche-gold bg-ruche-gold/5' : 'border-border hover:border-ruche-gold/50'}`}
                    onClick={() => handleSelectPaymentMethod('visa')}
                  >
                    <CreditCard className={`h-6 w-6 ${selectedPaymentMethod === 'visa' ? 'text-ruche-gold' : 'text-muted-foreground'}`} />
                    <div>
                      <h3 className="font-medium text-ruche-purple">Carte de crédit</h3>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${selectedPaymentMethod === 'paypal' ? 'border-ruche-gold bg-ruche-gold/5' : 'border-border hover:border-ruche-gold/50'}`}
                    onClick={() => handleSelectPaymentMethod('paypal')}
                  >
                    <Globe className={`h-6 w-6 ${selectedPaymentMethod === 'paypal' ? 'text-ruche-gold' : 'text-muted-foreground'}`} />
                    <div>
                      <h3 className="font-medium text-ruche-purple">PayPal</h3>
                      <p className="text-sm text-muted-foreground">Paiement sécurisé via PayPal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-border overflow-hidden sticky top-24">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-ruche-purple mb-6">Résumé de la commande</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="font-medium text-ruche-purple">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{euroToFCFA((item.discountPrice || item.price) * item.quantity).toLocaleString()} FCFA</p>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Sous-total</p>
                    <p className="font-medium">{euroToFCFA(totalPrice).toLocaleString()} FCFA</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Livraison</p>
                    <p className="font-medium">Gratuit</p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between mb-6">
                  <p className="font-semibold text-ruche-purple">Total</p>
                  <p className="font-bold text-lg text-ruche-purple">{euroToFCFA(totalPrice).toLocaleString()} FCFA</p>
                </div>
                
                <Button 
                  onClick={handlePaymentProcess}
                  disabled={paymentProcessing || !isFormValid()}
                  className="w-full bg-ruche-gold hover:bg-ruche-gold-light text-ruche-purple h-12 text-base"
                >
                  {paymentProcessing ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Payer maintenant via {getPaymentMethodName(selectedPaymentMethod)}
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground mt-4">
                  En cliquant sur "Payer maintenant", vous acceptez nos conditions de vente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
