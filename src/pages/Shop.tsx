
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '@/components/shop/ProductGrid';
import { products, categories } from '@/lib/data';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, FilterX } from 'lucide-react';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [inStockOnly, setInStockOnly] = useState(false);
  
  useEffect(() => {
    // Filtrer les produits en fonction des critères
    let result = [...products];
    
    // Recherche par nom
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filtre par catégorie
    if (selectedCategories.length > 0) {
      result = result.filter(product => 
        selectedCategories.includes(product.category)
      );
    }
    
    // Filtre par prix
    result = result.filter(product => {
      const price = product.discountPrice || product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // Filtre par disponibilité
    if (inStockOnly) {
      result = result.filter(product => product.inStock);
    }
    
    setFilteredProducts(result);
  }, [searchQuery, selectedCategories, priceRange, inStockOnly]);
  
  // Mise à jour de l'URL lorsque les catégories changent
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
  
  return (
    <>
      <Helmet>
        <title>Boutique | LA RUCHE D'OR</title>
        <meta name="description" content="Découvrez notre large gamme de produits de qualité. Électronique, mode, maison, beauté et bien plus encore." />
      </Helmet>
      
      <div className="pt-24 pb-20">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h1 className="heading-1 text-ruche-purple mb-4">Notre Boutique</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Découvrez notre large gamme de produits soigneusement sélectionnés pour vous.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar avec filtres */}
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
                        {category.name} ({category.count})
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
            
            {/* Grille de produits */}
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
        </div>
      </div>
    </>
  );
};

export default Shop;
