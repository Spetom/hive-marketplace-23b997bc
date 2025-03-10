
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import CartButton from '../shop/CartButton';

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
      
      {/* Fond avec dégradé */}
      <div className="absolute inset-0 bg-gradient-to-r from-ruche-purple to-ruche-purple-light opacity-95 z-0"></div>
      
      {/* Motif en arrière-plan */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NWgtMXYtNXptNiAwaDF2NWgtMXYtNXptLTExIDBoMXY1aC0xdi01em0tNiAwaDF2NWgtMXYtNXptMTIgMGg0djFoLTR2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50 z-0"></div>
            
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`${isVisible ? 'animate-slide-up opacity-100' : 'opacity-0'} transition-all duration-700`}>
            <h1 className="text-white font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="block">Découvrez l'Excellence</span>
              <span className="text-ruche-gold">LA RUCHE D'OR</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-lg">
              Votre destination privilégiée pour des produits de qualité supérieure. Parcourez notre catalogue et trouvez ce qui vous convient.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-ruche-gold hover:bg-ruche-gold-light text-ruche-purple font-medium transition-all duration-300 shadow-xl hover:shadow-ruche-gold/20 px-6"
              >
                <Link to="/shop">
                  Explorer la boutique
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 hover:text-white transition-all duration-300 px-6"
              >
                <Link to="/about">
                  En savoir plus
                </Link>
              </Button>
            </div>
          </div>
          
          <div className={`flex justify-center ${isVisible ? 'animate-fade-in opacity-100' : 'opacity-0'} transition-all duration-700 delay-300`}>
            <div className="relative">
              <div className="absolute inset-0 bg-ruche-gold rounded-full blur-3xl opacity-20 scale-90"></div>
              <div className="relative rounded-full p-2 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 shadow-xl">
                <img
                  src="/lovable-uploads/79615c23-e955-46f0-ae0d-ea61a982bfab.png"
                  alt="La Ruche d'Or Logo"
                  className="w-64 h-64 object-contain z-10 relative"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Forme décorative en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
    </section>
  );
};

export default Hero;
