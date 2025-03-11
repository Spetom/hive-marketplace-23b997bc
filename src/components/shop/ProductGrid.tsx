
import { useState, useEffect } from 'react';
import { Product, categories } from '@/lib/data';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  title?: string;
  showFilters?: boolean;
}

const ProductGrid = ({ products: initialProducts, title, showFilters = false }: ProductGridProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Load products from localStorage if available
  useEffect(() => {
    const storedProducts = localStorage.getItem('adminProducts');
    if (storedProducts) {
      try {
        const parsedProducts = JSON.parse(storedProducts);
        // Filter out products with placeholder or unsplash generated images
        const productsWithImages = parsedProducts.filter(
          (product: Product) => 
            !product.image.includes('unsplash.com/random') && 
            !product.image.includes('placeholder')
        );
        setProducts(productsWithImages);
      } catch (error) {
        console.error("Erreur lors du chargement des produits depuis localStorage:", error);
        // Filter initial products too
        const initialProductsWithImages = initialProducts.filter(
          product => 
            !product.image.includes('unsplash.com/random') && 
            !product.image.includes('placeholder')
        );
        setProducts(initialProductsWithImages);
      }
    } else {
      // Filter initial products
      const initialProductsWithImages = initialProducts.filter(
        product => 
          !product.image.includes('unsplash.com/random') && 
          !product.image.includes('placeholder')
      );
      setProducts(initialProductsWithImages);
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [initialProducts]);
  
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
  }, [selectedCategory, products]);
  
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
                {category.name} ({products.filter(p => p.category === category.id).length})
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
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
      
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Aucun produit trouvé dans cette catégorie.</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
