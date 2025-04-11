
import { useState, useEffect } from 'react';
import { Product, categories } from '@/lib/data';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { fetchProducts, mapSupabaseToProduct } from '@/services/productService';
import { useQuery } from '@tanstack/react-query';

interface ProductGridProps {
  products: Product[];
  title?: string;
  showFilters?: boolean;
}

const ProductGrid = ({ title, showFilters = false }: ProductGridProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Utiliser React Query pour récupérer les produits directement depuis Supabase
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const products = await fetchProducts();
      return products.map(mapSupabaseToProduct);
    },
  });
  
  // Filtrer les produits en fonction de la catégorie sélectionnée
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
  }, [selectedCategory, products]);
  
  // Calculer le nombre réel de produits par catégorie à partir des données de Supabase
  const getCategoryProductCount = (categoryId: string): number => {
    return products.filter(p => p.category === categoryId).length;
  };
  
  return (
    <div>
      {title && (
        <h2 className="text-2xl font-heading font-semibold text-ruche-purple mb-6">{title}</h2>
      )}
      
      {showFilters && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className={cn(
                selectedCategory === 'all' 
                  ? 'bg-ruche-gold text-white border-ruche-gold hover:bg-ruche-gold-light hover:text-white' 
                  : 'border-border text-muted-foreground hover:bg-ruche-purple/5 hover:text-ruche-purple'
              )}
              onClick={() => setSelectedCategory('all')}
            >
              Tous les produits
            </Button>
            
            {categories.map(category => (
              <Button
                key={category.id}
                variant="outline"
                className={cn(
                  selectedCategory === category.id 
                    ? 'bg-ruche-gold text-white border-ruche-gold hover:bg-ruche-gold-light hover:text-white' 
                    : 'border-border text-muted-foreground hover:bg-ruche-purple/5 hover:text-ruche-purple'
                )}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name} ({getCategoryProductCount(category.id)})
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-60 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          : filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
        }
      </div>
      
      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {isError 
              ? "Une erreur est survenue lors du chargement des produits." 
              : "Aucun produit trouvé dans cette catégorie."}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
