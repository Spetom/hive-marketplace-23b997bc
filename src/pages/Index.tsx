
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import ProductGrid from '@/components/shop/ProductGrid';
import { Button } from '@/components/ui/button';
import { getFeaturedProducts } from '@/lib/data';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet';

const Index = () => {
  const featuredProducts = getFeaturedProducts();
  
  return (
    <>
      <Helmet>
        <title>LA RUCHE D'OR - Boutique en ligne</title>
        <meta name="description" content="La Ruche d'Or - Une entreprise béninoise spécialisée dans le prêt-à-porter et multitude-services de qualité." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Hero />
        
        <Features />
        
        <section className="py-20 bg-muted/30">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div>
                <h2 className="heading-2 text-ruche-purple mb-2">Produits à la Une</h2>
                <p className="text-muted-foreground">Découvrez notre sélection de produits populaires</p>
              </div>
              
              <Button
                asChild
                className="mt-4 md:mt-0 bg-ruche-purple hover:bg-ruche-purple-light"
              >
                <Link to="/shop">
                  Voir tous les produits
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
            
            <ProductGrid products={featuredProducts} />
          </div>
        </section>
        
        <section className="py-24 bg-ruche-purple">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-white font-heading text-2xl md:text-3xl italic font-bold mb-4">
                "L'or du style, miel de l'élégance"
              </h2>
              <h3 className="text-white font-heading text-2xl md:text-3xl font-bold mb-6">
                Rejoignez notre communauté de clients satisfaits
              </h3>
              <p className="text-white/80 text-lg mb-8">
                Inscrivez-vous à notre newsletter pour recevoir les dernières actualités et offres exclusives.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-grow px-4 py-3 rounded-md focus:outline-none"
                />
                <Button className="bg-ruche-gold hover:bg-ruche-gold-light text-ruche-purple font-medium">
                  S'inscrire
                </Button>
              </div>
              
              <p className="text-white/60 text-sm mt-4">
                En vous inscrivant, vous acceptez notre politique de confidentialité.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
