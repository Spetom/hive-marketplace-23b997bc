
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Images de mannequins en tenues de pagne avec fond violet
const sliderImages = [
  // Toutes les images ont été supprimées
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
    if (!isPaused && sliderImages.length > 0) {
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
      className="relative w-full h-full bg-ruche-purple"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Fond uni lorsqu'il n'y a pas d'images */}
      {sliderImages.length === 0 && (
        <div className="absolute inset-0 bg-ruche-purple"></div>
      )}
      
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
      
      {/* Contrôles de navigation - masqués s'il n'y a pas d'images */}
      {sliderImages.length > 0 && (
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
      )}
    </div>
  );
};
