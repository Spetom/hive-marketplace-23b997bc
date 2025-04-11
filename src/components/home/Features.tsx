
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Scissors, Utensils, Flower, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();
  
  const handleCategoryClick = (category: string) => {
    navigate(`/shop?category=${category}`);
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-2 text-ruche-purple mb-3">Nos Produits & Services</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez notre sélection de produits africains et nos services de qualité
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <div 
            className="bg-white rounded-xl border border-border p-6 text-center hover:shadow-lg transition-all hover:border-ruche-gold cursor-pointer"
            onClick={() => handleCategoryClick('mode')}
          >
            <div className="w-16 h-16 bg-ruche-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-ruche-purple" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-ruche-purple mb-2">Mode Africaine</h3>
            <p className="text-muted-foreground text-sm">
              Vêtements et accessoires inspirés des traditions africaines
            </p>
          </div>
          
          <div 
            className="bg-white rounded-xl border border-border p-6 text-center hover:shadow-lg transition-all hover:border-ruche-gold cursor-pointer"
            onClick={() => handleCategoryClick('tissus')}
          >
            <div className="w-16 h-16 bg-ruche-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-ruche-purple" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-ruche-purple mb-2">Tissus & Pagnes</h3>
            <p className="text-muted-foreground text-sm">
              Pagnes et tissus authentiques pour vos créations
            </p>
          </div>
          
          <div
            className="bg-white rounded-xl border border-border p-6 text-center hover:shadow-lg transition-all hover:border-ruche-gold cursor-pointer"
            onClick={() => handleCategoryClick('cosmetique')}
          >
            <div className="w-16 h-16 bg-ruche-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flower className="h-8 w-8 text-ruche-purple" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-ruche-purple mb-2">Cosmétiques</h3>
            <p className="text-muted-foreground text-sm">
              Produits naturels de beauté et soins du corps africains
            </p>
          </div>
          
          <div
            className="bg-white rounded-xl border border-border p-6 text-center hover:shadow-lg transition-all hover:border-ruche-gold cursor-pointer"
            onClick={() => handleCategoryClick('agroalimentaire')}
          >
            <div className="w-16 h-16 bg-ruche-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="h-8 w-8 text-ruche-purple" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-ruche-purple mb-2">Agroalimentaire</h3>
            <p className="text-muted-foreground text-sm">
              Épices, café et autres produits alimentaires africains authentiques
            </p>
          </div>
          
          <div
            className="bg-white rounded-xl border border-border p-6 text-center hover:shadow-lg transition-all hover:border-ruche-gold cursor-pointer"
            onClick={() => navigate('/shop', { state: { activeTab: 'services' } })}
          >
            <div className="w-16 h-16 bg-ruche-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scissors className="h-8 w-8 text-ruche-purple" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-ruche-purple mb-2">Service Couture</h3>
            <p className="text-muted-foreground text-sm">
              Service de couture sur mesure et retouches
            </p>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <Button asChild variant="default" className="bg-ruche-gold hover:bg-ruche-gold-light text-white">
            <Link to="/shop">
              Découvrir tous nos produits
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
