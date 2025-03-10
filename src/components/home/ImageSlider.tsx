
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Images de mannequins en tenues de pagne avec fond violet
const sliderImages = [
  "/lovable-uploads/28c11ad3-984d-4f5a-ad85-7d11493c538b.png",
  "/lovable-uploads/edc1d82c-0a9e-41e3-9bc9-643b9f834d96.png",
  "/lovable-uploads/9678bbb5-620b-43b6-a16c-321b0b9cc9e2.png",
  "/lovable-uploads/b60f5a4b-8ba2-49b5-a202-77da5e7805f2.png"
];

export const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fonction pour passer à l'image suivante
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === sliderImages.length - 1 ? 0 : prevIndex + 1));
  };

  // Fonction pour revenir à l'image précédente
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? sliderImages.length - 1 : prevIndex - 1));
  };

  // Défilement automatique
  useEffect(() => {
    if (!isPaused && sliderImages.length > 0) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  // Marquer les images comme chargées
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Pause au survol de la souris
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div 
      className="relative w-full h-full bg-ruche-purple overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Overlay pour l'effet de profondeur */}
      <div className="absolute inset-0 bg-gradient-to-b from-ruche-purple/0 via-ruche-purple/0 to-ruche-purple/80 z-10"></div>
      
      {/* Images du slider avec fondu et zoom léger */}
      {sliderImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1500 ${
            index === currentIndex 
              ? 'opacity-100 scale-105' 
              : 'opacity-0 scale-100'
          }`}
          style={{ 
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          <img 
            src={image}
            alt={`Mannequin en tenue de pagne ${index + 1}`}
            className="w-full h-full object-cover"
            style={{ 
              objectPosition: index === 2 ? '50% 30%' : '50% 20%', // Ajusté pour mieux cadrer les visages
              transform: `scale(${isLoaded ? '1' : '1.05'})`,
              transition: 'transform 8s ease-out, opacity 1.5s ease-out'
            }}
            loading={index === 0 ? "eager" : "lazy"}
          />
          
          {/* Overlay par image pour une meilleure lisibilité du texte */}
          <div className="absolute inset-0 bg-ruche-purple/30"></div>
        </div>
      ))}
      
      {/* Vignettes de navigation en bas */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-4">
        <button 
          onClick={prevSlide}
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all hover:scale-110"
          aria-label="Image précédente"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex space-x-2">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 transform ${
                index === currentIndex 
                  ? 'bg-ruche-gold scale-125 w-3 h-3' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Aller à l'image ${index + 1}`}
            />
          ))}
        </div>
        
        <button 
          onClick={nextSlide}
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all hover:scale-110"
          aria-label="Image suivante"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Effet visuel en superposition */}
      <div className="absolute inset-0 bg-gradient-to-tr from-ruche-purple/40 to-transparent mix-blend-soft-light"></div>
    </div>
  );
};
