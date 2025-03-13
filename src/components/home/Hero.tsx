
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import CartButton from '../shop/CartButton';
import { ImageSlider } from './ImageSlider';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Panier en haut à droite */}
      <div className="absolute top-6 right-6 z-20">
        <CartButton />
      </div>
      
      {/* Slider d'images en arrière-plan */}
      <div className="absolute inset-0 z-0">
        <ImageSlider />
      </div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`${isVisible ? 'animate-slide-up opacity-100' : 'opacity-0'} transition-all duration-700`}>
            <h1 className="text-white font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="block">Découvrez l'Excellence</span>
              <span className="text-ruche-gold">LA RUCHE D'OR</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-lg">
              Votre destination privilégiée pour le prêt-à-porter de qualité et multitude-services. Parcourez notre catalogue et trouvez ce qui vous convient.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-ruche-gold hover:bg-ruche-gold-light text-ruche-purple font-medium transition-all duration-300 shadow-xl hover:shadow-ruche-gold/20 px-6"
              >
                <Link to="/shop">
                  Découvrir le prêt-à-porter
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white bg-ruche-purple hover:bg-ruche-purple-light hover:text-white transition-all duration-300 px-6"
              >
                <Link to="/shop" onClick={() => localStorage.setItem('activeShopTab', 'services')}>
                  Nos services
                </Link>
              </Button>
            </div>
          </div>
          
          <div className={`flex justify-center ${isVisible ? 'animate-fade-in opacity-100' : 'opacity-0'} transition-all duration-700 delay-300`}>
            {/* Logo has been removed from here */}
          </div>
        </div>
      </div>
      
      {/* Forme décorative en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
    </section>
  );
};

export default Hero;
