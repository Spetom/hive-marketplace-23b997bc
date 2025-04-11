
import { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import ProductGrid from '@/components/shop/ProductGrid';
import { categories } from '@/lib/data';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, FilterX, ShoppingBag, Scissors, Briefcase, Flower, Utensils } from 'lucide-react';
import { Product } from '@/lib/data';
import { fetchProducts, mapSupabaseToProduct } from '@/services/productService';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

const Shop = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [inStockOnly, setInStockOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('pret-a-porter');
  
  const euroToFCFA = (euroPrice: number): number => {
    return Math.round(euroPrice * 655.957);
  };
  
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const products = await fetchProducts();
      return products.map(mapSupabaseToProduct);
    },
  });
  
  useEffect(() => {
    const storedTab = localStorage.getItem('activeShopTab');
    if (storedTab) {
      setActiveTab(storedTab);
      localStorage.removeItem('activeShopTab');
    }
    
    // Vérifier si nous avons un state avec activeTab
    if (location.state && typeof location.state === 'object') {
      const state = location.state as { activeTab?: string };
      if (state.activeTab) {
        setActiveTab(state.activeTab);
        // Nettoyer le state après l'avoir utilisé
        window.history.replaceState({}, document.title);
      }
    }
  }, [location]);
  
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
      const priceInEuro = product.discountPrice || product.price;
      const priceInFCFA = euroToFCFA(priceInEuro);
      return priceInFCFA >= priceRange[0] && priceInFCFA <= priceRange[1];
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
    setPriceRange([0, 200000]);
    setSelectedCategories([]);
    setInStockOnly(false);
  };
  
  const getCategoryCount = (categoryId: string) => {
    return products.filter(product => product.category === categoryId).length;
  };
  
  // Récupérer l'icône appropriée pour chaque catégorie
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'mode':
        return <ShoppingBag className="h-4 w-4 mr-2" />;
      case 'tissus':
        return <ShoppingBag className="h-4 w-4 mr-2" />;
      case 'cosmetique':
        return <Flower className="h-4 w-4 mr-2" />;
      case 'agroalimentaire':
        return <Utensils className="h-4 w-4 mr-2" />;
      default:
        return <ShoppingBag className="h-4 w-4 mr-2" />;
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Boutique | LA RUCHE D'OR</title>
        <meta name="description" content="Découvrez notre collection de prêt-à-porter africain, pagnes, cosmétiques et produits agroalimentaires. Profitez aussi de nos services de couture sur mesure." />
      </Helmet>
      
      <div className="pt-24 pb-20">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h1 className="heading-1 text-ruche-purple mb-4">Notre Boutique</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Découvrez notre collection de prêt-à-porter africain, pagnes, cosmétiques naturels et produits agroalimentaires. Profitez aussi de nos services de couture sur mesure.
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
                Boutique
              </Button>
              <Button 
                variant={activeTab === 'services' ? 'default' : 'ghost'}
                className={`flex items-center gap-2 ${activeTab === 'services' ? 'bg-ruche-gold text-white' : ''}`}
                onClick={() => setActiveTab('services')}
              >
                <Scissors size={18} />
                Services de Couture
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
                
                <ScrollArea className="h-[280px] pr-4 mb-6">
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
                          className="ml-2 text-muted-foreground cursor-pointer flex items-center"
                        >
                          {getCategoryIcon(category.id)}
                          {category.name} ({getCategoryCount(category.id)})
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="mb-6">
                  <h3 className="font-heading font-semibold text-lg text-ruche-purple mb-4">Prix</h3>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      min={0}
                      max={200000}
                      step={5000}
                      onValueChange={setPriceRange}
                      className="mb-6"
                    />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {priceRange[0].toLocaleString()} FCFA
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {priceRange[1].toLocaleString()} FCFA
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
                
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <div key={index} className="space-y-3">
                        <Skeleton className="h-60 w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <ProductGrid products={filteredProducts} />
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg border border-border">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-heading font-semibold text-ruche-purple mb-4">Nos Services de Couture</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  La Ruche d'Or vous propose une variété de services de couture de qualité, de la confection sur mesure aux retouches et ajustements.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="border border-border rounded-lg p-6 transition-all hover:shadow-md hover:border-ruche-gold">
                  <div className="w-12 h-12 bg-ruche-gold/10 rounded-full flex items-center justify-center mb-4">
                    <Scissors className="text-ruche-gold" size={24} />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-ruche-purple mb-2">Confection sur Mesure</h3>
                  <p className="text-muted-foreground">
                    Création de vêtements sur mesure selon vos goûts et mensurations, dans le tissu de votre choix.
                  </p>
                </div>
                
                <div className="border border-border rounded-lg p-6 transition-all hover:shadow-md hover:border-ruche-gold">
                  <div className="w-12 h-12 bg-ruche-gold/10 rounded-full flex items-center justify-center mb-4">
                    <Scissors className="text-ruche-gold" size={24} />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-ruche-purple mb-2">Retouches & Ajustements</h3>
                  <p className="text-muted-foreground">
                    Service de retouches et d'ajustements pour adapter parfaitement vos vêtements à votre silhouette.
                  </p>
                </div>
                
                <div className="border border-border rounded-lg p-6 transition-all hover:shadow-md hover:border-ruche-gold">
                  <div className="w-12 h-12 bg-ruche-gold/10 rounded-full flex items-center justify-center mb-4">
                    <Scissors className="text-ruche-gold" size={24} />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-ruche-purple mb-2">Confection de Pagnes</h3>
                  <p className="text-muted-foreground">
                    Confection professionnelle de pagnes traditionnels africains pour hommes et femmes.
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
                    <Scissors className="text-ruche-gold" size={24} />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-ruche-purple mb-2">Tenues Traditionnelles</h3>
                  <p className="text-muted-foreground">
                    Confection de tenues traditionnelles africaines pour cérémonies et occasions spéciales.
                  </p>
                </div>
                
                <div className="border border-border rounded-lg p-6 transition-all hover:shadow-md hover:border-ruche-gold">
                  <div className="w-12 h-12 bg-ruche-gold/10 rounded-full flex items-center justify-center mb-4">
                    <Scissors className="text-ruche-gold" size={24} />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-ruche-purple mb-2">Broderie Personnalisée</h3>
                  <p className="text-muted-foreground">
                    Service de broderie personnalisée pour ajouter une touche unique à vos vêtements et accessoires.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-lg text-ruche-purple mb-4">
                  Besoin d'un service de couture spécifique ? Contactez-nous !
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
