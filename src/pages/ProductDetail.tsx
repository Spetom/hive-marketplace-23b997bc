
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getRelatedProducts } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import ProductGrid from '@/components/shop/ProductGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  Heart, 
  MinusCircle, 
  PlusCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Info
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Images alternatives générées aléatoirement pour la démonstration
  const additionalImages = [
    `https://source.unsplash.com/random/300x300?product&sig=${id}1`,
    `https://source.unsplash.com/random/300x300?product&sig=${id}2`,
    `https://source.unsplash.com/random/300x300?product&sig=${id}3`,
  ];
  
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast.success('Produit ajouté aux favoris');
    } else {
      toast.info('Produit retiré des favoris');
    }
  };
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-semibold text-ruche-purple mb-4">
            Produit non trouvé
          </h2>
          <p className="text-muted-foreground mb-6">
            Le produit que vous recherchez n'existe pas ou a été retiré.
          </p>
          <Button asChild>
            <Link to="/shop">
              Retour à la boutique
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const relatedProducts = getRelatedProducts(product.id, product.category);
  
  return (
    <>
      <Helmet>
        <title>{product.name} | LA RUCHE D'OR</title>
        <meta name="description" content={product.description} />
      </Helmet>
      
      <div className="pt-24 pb-20">
        <div className="container-custom">
          <div className="mb-6">
            <Link to="/shop" className="text-ruche-purple/70 hover:text-ruche-purple text-sm">
              ← Retour à la boutique
            </Link>
          </div>
          
          <div className="bg-white rounded-lg border border-border overflow-hidden mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 p-6">
              <div className="lg:col-span-2">
                <div className="mb-4 aspect-square overflow-hidden rounded-lg border border-border">
                  <img 
                    src={activeImage} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    className={`w-20 h-20 rounded-md overflow-hidden border ${activeImage === product.image ? 'border-ruche-gold' : 'border-border hover:border-ruche-purple/50'}`}
                    onClick={() => setActiveImage(product.image)}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                  
                  {additionalImages.map((img, index) => (
                    <button 
                      key={index}
                      className={`w-20 h-20 rounded-md overflow-hidden border ${activeImage === img ? 'border-ruche-gold' : 'border-border hover:border-ruche-purple/50'}`}
                      onClick={() => setActiveImage(img)}
                    >
                      <img 
                        src={img} 
                        alt={`${product.name} - Vue ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="lg:col-span-3">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-ruche-purple mb-2">
                      {product.name}
                    </h1>
                    
                    <div className="flex items-center mb-4">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-ruche-gold' : 'text-gray-300'}`} 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-muted-foreground ml-2">({product.rating} avis)</span>
                    </div>
                    
                    <p className="text-muted-foreground mb-6">
                      {product.description}
                    </p>
                    
                    <div className="mb-6">
                      {product.discountPrice ? (
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-semibold text-ruche-purple">{product.discountPrice.toFixed(2)}€</span>
                          <span className="text-xl text-muted-foreground line-through">{product.price.toFixed(2)}€</span>
                          <span className="bg-ruche-gold text-white text-sm font-bold px-2 py-1 rounded-md">
                            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                          </span>
                        </div>
                      ) : (
                        <span className="text-3xl font-semibold text-ruche-purple">{product.price.toFixed(2)}€</span>
                      )}
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="flex flex-col gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={product.inStock ? 'text-green-700' : 'text-red-700'}>
                          {product.inStock ? 'En stock' : 'Rupture de stock'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="flex items-center">
                          <button 
                            onClick={decrementQuantity}
                            disabled={quantity <= 1}
                            className="text-ruche-purple disabled:text-muted-foreground"
                          >
                            <MinusCircle size={24} />
                          </button>
                          <span className="w-12 text-center font-medium">{quantity}</span>
                          <button 
                            onClick={incrementQuantity}
                            className="text-ruche-purple"
                          >
                            <PlusCircle size={24} />
                          </button>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button
                            onClick={handleAddToCart}
                            disabled={!product.inStock}
                            className="bg-ruche-gold hover:bg-ruche-gold-light text-ruche-purple"
                          >
                            <ShoppingCart size={18} className="mr-2" />
                            Ajouter au panier
                          </Button>
                          
                          <Button
                            variant="outline"
                            onClick={toggleFavorite}
                            className={isFavorite ? 'border-red-500 text-red-500 hover:bg-red-50' : ''}
                          >
                            <Heart size={18} className={isFavorite ? 'fill-red-500' : ''} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <div className="flex gap-3">
                      <Truck size={20} className="text-ruche-gold flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-ruche-purple">Livraison rapide</p>
                        <p className="text-xs text-muted-foreground">Livraison en 2-5 jours ouvrables</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <ShieldCheck size={20} className="text-ruche-gold flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-ruche-purple">Garantie de qualité</p>
                        <p className="text-xs text-muted-foreground">Produits 100% authentiques</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <RotateCcw size={20} className="text-ruche-gold flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-ruche-purple">Retours faciles</p>
                        <p className="text-xs text-muted-foreground">30 jours pour retourner le produit</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-16">
            <Tabs defaultValue="description">
              <TabsList className="mb-6">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Spécifications</TabsTrigger>
                <TabsTrigger value="reviews">Avis clients</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="bg-white p-6 rounded-lg border border-border">
                <h3 className="font-heading font-semibold text-xl text-ruche-purple mb-4">À propos de ce produit</h3>
                <p className="text-muted-foreground mb-4">
                  {product.description}
                </p>
                <p className="text-muted-foreground mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel tincidunt luctus, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel tincidunt luctus, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl.
                </p>
                <div className="flex items-start mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                  <Info size={24} className="text-yellow-600 mr-3 flex-shrink-0" />
                  <p className="text-yellow-800 text-sm">
                    Les images peuvent différer légèrement du produit réel en fonction de votre écran et de l'éclairage lors de la prise de vue.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="bg-white p-6 rounded-lg border border-border">
                <h3 className="font-heading font-semibold text-xl text-ruche-purple mb-4">Spécifications techniques</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-b border-border pb-2">
                    <span className="text-sm text-muted-foreground">Catégorie</span>
                    <p className="font-medium text-ruche-purple">
                      {product.category === 'electronique' ? 'Électronique' : 
                       product.category === 'mode' ? 'Mode' :
                       product.category === 'maison' ? 'Maison' : 'Beauté & Santé'}
                    </p>
                  </div>
                  <div className="border-b border-border pb-2">
                    <span className="text-sm text-muted-foreground">Marque</span>
                    <p className="font-medium text-ruche-purple">La Ruche d'Or</p>
                  </div>
                  <div className="border-b border-border pb-2">
                    <span className="text-sm text-muted-foreground">Garantie</span>
                    <p className="font-medium text-ruche-purple">12 mois</p>
                  </div>
                  <div className="border-b border-border pb-2">
                    <span className="text-sm text-muted-foreground">Pays d'origine</span>
                    <p className="font-medium text-ruche-purple">Bénin</p>
                  </div>
                  <div className="border-b border-border pb-2">
                    <span className="text-sm text-muted-foreground">Disponibilité</span>
                    <p className="font-medium text-ruche-purple">{product.inStock ? 'En stock' : 'Rupture de stock'}</p>
                  </div>
                  <div className="border-b border-border pb-2">
                    <span className="text-sm text-muted-foreground">Note clients</span>
                    <p className="font-medium text-ruche-purple">{product.rating}/5</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="bg-white p-6 rounded-lg border border-border">
                <h3 className="font-heading font-semibold text-xl text-ruche-purple mb-4">Avis clients</h3>
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-ruche-gold' : 'text-gray-300'}`} 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="currentColor"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-muted-foreground ml-2">Basé sur 24 avis</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="border-b border-border pb-4">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium text-ruche-purple">Sophie M.</h4>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < 5 ? 'text-ruche-gold' : 'text-gray-300'}`} 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">15 mars 2023</p>
                    <p className="text-sm">
                      Très satisfaite de mon achat ! Le produit est conforme à la description et la livraison a été rapide. Je recommande !
                    </p>
                  </div>
                  
                  <div className="border-b border-border pb-4">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium text-ruche-purple">Thomas K.</h4>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < 4 ? 'text-ruche-gold' : 'text-gray-300'}`} 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">2 février 2023</p>
                    <p className="text-sm">
                      Bon rapport qualité-prix. Je retire une étoile car l'emballage était légèrement abîmé, mais le produit fonctionne parfaitement.
                    </p>
                  </div>
                  
                  <div>
                    <Button>Voir tous les avis</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <h2 className="heading-2 text-ruche-purple mb-6">Produits similaires</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
