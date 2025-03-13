import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '@/components/shop/ProductGrid';
import { products as initialProducts, categories } from '@/lib/data';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, FilterX, ShoppingBag, Briefcase } from 'lucide-react';
import { Product } from '@/lib/data';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pret-a-porter');
  
  useEffect(() => {
    setIsLoading(true);
    
    const initializeProducts = () => {
      try {
        const storedProducts = localStorage.getItem('adminProducts');
        if (storedProducts) {
          const parsedProducts = JSON.parse(storedProducts);
          setProducts(parsedProducts);
        } else {
          setProducts(initialProducts);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des produits depuis localStorage:", error);
        setProducts(initialProducts);
      } finally {
        setIsLoading(false);
      }
    };
    
    const timer = setTimeout(() => {
      initializeProducts();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (isLoading) {
      return;
    }
    
    let result = [...products];
    
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategories.length > 0) {
      result = result.filter(product => 
        selectedCategories.includes(product.category)
      );
    }
    
    result = result.filter(product => {
      const price = product.discountPrice || product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    if (inStockOnly) {
      result = result.filter(product => product.inStock);
    }
    
    setFilteredProducts(result);
  }, [searchQuery, selectedCategories, priceRange, inStockOnly, products, isLoading]);
  
  useEffect(() => {
    if (selectedCategories.length === 1) {
      setSearchParams({ category: selectedCategories[0] });
    } else if (selectedCategories.length === 0) {
      searchParams.delete('category');
      setSearchParams(searchParams);
    }
  }, [selectedCategories, setSearchParams, searchParams]);
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 300]);
    setSelectedCategories([]);
    setInStockOnly(false);
  };
  
  const getCategoryCount = (categoryId: string) => {
    return products.filter(product => product.category === categoryId).length;
  };
  
  return (
    <>
      <Helmet>
        <title>Boutique | LA RUCHE D'OR</title>
        <meta name="description" content="Découvrez notre collection de prêt-à-porter de qualité et nos multitude-services." />
      </Helmet>
      
      <div className="pt-24 pb-20">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h1 className="heading-1 text-ruche-purple mb-4">Notre Boutique</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Découvrez notre collection de prêt-à-porter et nos services supplémentaires.
            </p>
          </div>
          
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-muted rounded-lg p-1">
              <Button 
                variant={activeTab === 'pret-a-porter' ? 'default' : 'ghost'}
                className={`flex items-center gap-2 ${activeTab === 'pret-a-porter' ? 'bg-ruche-gold text-white' : ''}`}
                onClick={() => setActiveTab('pret-a-porter')}
              >
                <ShoppingBag size={18} />
                Prêt-à-porter
              </Button>
              <Button 
                variant={activeTab === 'services' ? 'default' : 'ghost'}
                className={`flex items-center gap-2 ${activeTab === 'services' ? 'bg-ruche-gold text-white' : ''}`}
                onClick={() => setActiveTab('services')}
              >
                <Briefcase size={18} />
                Multitude-services
              </Button>
            </div>
          </div>
          
          {activeTab === 'pret-a-porter' ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg border border-border h-fit sticky top-24">
                <div className="mb-6">
                  <h3 className="font-heading font-semibold text-lg text-ruche-purple mb-4">Recherche</h3>
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Rechercher un produit..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-heading font-semibold text-lg text-ruche-purple mb-4">Catégories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category.id} className="flex items-center">
                        <Checkbox 
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => handleCategoryChange(category.id)}
                          className="border-ruche-purple data-[state=checked]:bg-ruche-gold data-[state=checked]:border-ruche-gold"
                        />
                        <label 
                          htmlFor={`category-${category.id}`}
                          className="ml-2 text-muted-foreground cursor-pointer"
                        >
                          {category.name} ({getCategoryCount(category.id)})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-heading font-semibold text-lg text-ruche-purple mb-4">Prix</h3>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      min={0}
                      max={300}
                      step={10}
                      onValueChange={setPriceRange}
                      className="mb-6"
                    />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {priceRange[0]}€
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {priceRange[1]}€
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center">
                    <Checkbox 
                      id="in-stock"
                      checked={inStockOnly}
                      onCheckedChange={() => setInStockOnly(!inStockOnly)}
                      className="border-ruche-purple data-[state=checked]:bg-ruche-gold data-[state=checked]:border-ruche-gold"
                    />
                    <label 
                      htmlFor="in-stock"
                      className="ml-2 text-muted-foreground cursor-pointer"
                    >
                      Produits en stock uniquement
                    </label>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={resetFilters}
                >
                  <FilterX size={16} className="mr-2" />
                  Réinitialiser les filtres
                </Button>
              </div>
              
              <div className="lg:col-span-3">
                <div className="bg-white p-4 rounded-lg border border-border mb-6 flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
                  </span>
                  
                  <select className="border border-border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ruche-gold">
                    <option value="default">Tri par défaut</option>
                    <option value="price-asc">Prix: croissant</option>
                    <option value="price-desc">Prix: décroissant</option>
                    <option value="name-asc">Nom: A-Z</option>
                    <option value="name-desc">Nom: Z-A</option>
                  </select>
                </div>
                
                <ProductGrid products={filteredProducts} />
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg border border-border">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-heading font-semibold text-ruche-purple mb-4">Nos Multitude-Services</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  La Ruche d'Or vous propose une variété de services de qualité pour répondre à tous vos besoins.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="border border-border rounded-lg p-6 transition-all hover:shadow-md hover:border-ruche-gold">
                  <div className="w-12 h-12 bg-ruche-gold/10 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="text-ruche-gold" size={24} />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-ruche-purple mb-2">Service de Couture</h3>
                  <p className="text-muted-foreground">
                    Service de couture sur mesure, retouches et ajustements pour tous vos vêtements.
                  </p>
                </div>
                
                <div className="border border-border rounded-lg p-6 transition-all hover:shadow-md hover:border-ruche-gold">
                  <div className="w-12 h-12 bg-ruche-gold/10 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="text-ruche-gold" size={24} />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-ruche-purple mb-2">Transfert d'Argent</h3>
                  <p className="text-muted-foreground">
                    Service rapide et sécurisé de transfert d'argent national et international.
                  </p>
                </div>
                
                <div className="border border-border rounded-lg p-6 transition-all hover:shadow-md hover:border-ruche-gold">
                  <div className="w-12 h-12 bg-ruche-gold/10 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="text-ruche-gold" size={24} />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-ruche-purple mb-2">Consultation Mode</h3>
                  <p className="text-muted-foreground">
                    Conseils personnalisés en style vestimentaire adaptés à votre silhouette et à vos préférences.
                  </p>
                </div>
                
                <div className="border border-border rounded-lg p-6 transition-all hover:shadow-md hover:border-ruche-gold">
                  <div className="w-12 h-12 bg-ruche-gold/10 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="text-ruche-gold" size={24} />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-ruche-purple mb-2">Livraison à Domicile</h3>
                  <p className="text-muted-foreground">
                    Service de livraison rapide de vos achats directement à votre domicile ou bureau.
                  </p>
                </div>
                
                <div className="border border-border rounded-lg p-6 transition-all hover:shadow-md hover:border-ruche-gold">
                  <div className="w-12 h-12 bg-ruche-gold/10 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="text-ruche-gold" size={24} />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-ruche-purple mb-2">Recharge Mobile</h3>
                  <p className="text-muted-foreground">
                    Recharge rapide et facile pour tous les opérateurs téléphoniques locaux.
                  </p>
                </div>
                
                <div className="border border-border rounded-lg p-6 transition-all hover:shadow-md hover:border-ruche-gold">
                  <div className="w-12 h-12 bg-ruche-gold/10 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="text-ruche-gold" size={24} />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-ruche-purple mb-2">Événements Spéciaux</h3>
                  <p className="text-muted-foreground">
                    Organisation et tenues pour événements spéciaux : mariages, cérémonies, fêtes.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-lg text-ruche-purple mb-4">
                  Vous avez besoin d'un service spécifique ? Contactez-nous !
                </p>
                <Button 
                  className="bg-ruche-gold hover:bg-ruche-gold-light text-white"
                  onClick={() => window.location.href = "tel:+22997050090"}
                >
                  Nous appeler
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Shop;




