import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Images de mannequins en tenues de pagne avec fond violet
const sliderImages = [
  "/lovable-uploads/ec250035-70f6-4b60-9bba-243d79a04594.png",
  "/lovable-uploads/1ac13343-eaa8-410d-b6a1-2627667b0a0d.png",
  "/lovable-uploads/f6e0747e-1013-48a9-bbb7-715083e1bda6.png",
  "/lovable-uploads/cc2f561f-591a-4d84-a7b1-c23653a0d6be.png"
];

export const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
    if (!isPaused) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  // Pause au survol de la souris
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div 
      className="relative w-full h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Images du slider avec fondu */}
      {sliderImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={image}
            alt={`Mannequin en tenue de pagne ${index + 1}`}
            className="w-full h-full object-cover"
            style={{ 
              objectPosition: '50% 20%' // Ajusté pour mieux cadrer les visages
            }}
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
      
      {/* Contrôles de navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex items-center space-x-2">
        <button 
          onClick={prevSlide}
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
          aria-label="Image précédente"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex space-x-1">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-ruche-gold' : 'bg-white/50'
              }`}
              aria-label={`Aller à l'image ${index + 1}`}
            />
          ))}
        </div>
        
        <button 
          onClick={nextSlide}
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
          aria-label="Image suivante"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
