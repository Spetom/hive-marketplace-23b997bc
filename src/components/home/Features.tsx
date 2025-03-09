
import { useState, useEffect, useRef } from 'react';
import { Shield, Truck, CreditCard, Heart } from 'lucide-react';

const features = [
  {
    icon: <Truck size={32} className="text-ruche-gold" />,
    title: "Livraison rapide",
    description: "Profitez de notre service de livraison rapide partout au Bénin et dans la sous-région."
  },
  {
    icon: <Shield size={32} className="text-ruche-gold" />,
    title: "Produits authentiques",
    description: "Tous nos produits sont 100% authentiques avec une garantie de qualité."
  },
  {
    icon: <CreditCard size={32} className="text-ruche-gold" />,
    title: "Paiement sécurisé",
    description: "Multiples options de paiement sécurisées pour votre tranquillité d'esprit."
  },
  {
    icon: <Heart size={32} className="text-ruche-gold" />,
    title: "Service client dévoué",
    description: "Notre équipe est disponible pour vous assister à chaque étape de votre achat."
  }
];

const Features = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const timer = setTimeout(() => {
            const indices = Array.from({ length: features.length }, (_, i) => i);
            setVisibleItems(indices);
          }, 300);
          
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="heading-2 text-ruche-purple mb-4">Pourquoi nous choisir?</h2>
          <p className="text-muted-foreground text-lg">
            La Ruche d'Or s'engage à offrir une expérience d'achat exceptionnelle.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-6 border border-border hover:border-ruche-gold hover:shadow-lg transition-all duration-500 hover:-translate-y-1 ${
                visibleItems.includes(index) ? 'animate-slide-up opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="bg-ruche-purple/5 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3 text-ruche-purple">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
