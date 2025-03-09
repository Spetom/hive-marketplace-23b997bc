
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

const About = () => {
  return (
    <>
      <Helmet>
        <title>À propos - LA RUCHE D'OR</title>
        <meta name="description" content="Découvrez l'histoire et les valeurs de La Ruche d'Or, une entreprise béninoise spécialisée dans la vente de produits de qualité." />
      </Helmet>
      
      <div className="min-h-screen bg-muted/30">
        <div className="container-custom py-12 md:py-20">
          {/* En-tête de page */}
          <div className="mb-12">
            <Button 
              variant="ghost" 
              asChild 
              className="hover:bg-white/40 mb-4"
            >
              <Link to="/">
                <ArrowLeft size={18} className="mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
            
            <h1 className="heading-1 text-ruche-purple mb-4">À propos de <span className="text-ruche-gold">LA RUCHE D'OR</span></h1>
            <p className="text-muted-foreground text-lg max-w-3xl">
              Découvrez notre histoire, notre mission et les valeurs qui guident notre entreprise.
            </p>
          </div>
          
          {/* Section Notre Histoire */}
          <section className="mb-20">
            <h2 className="heading-2 text-ruche-purple mb-6">Notre Histoire</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-ruche-gold/10"></div>
                <img 
                  src="/placeholder.svg" 
                  alt="L'histoire de La Ruche d'Or" 
                  className="w-full h-auto object-cover"
                />
              </div>
              
              <div className="space-y-6">
                <p className="text-lg">
                  <span className="font-semibold text-ruche-purple">LA RUCHE D'OR</span> est née d'une vision audacieuse : créer une entreprise béninoise qui incarne l'excellence et l'innovation dans la distribution de produits de qualité.
                </p>
                
                <p>
                  Fondée en 2020, notre entreprise s'est rapidement imposée comme une référence dans le secteur, grâce à notre engagement inébranlable envers la qualité et la satisfaction client.
                </p>
                
                <p>
                  Aujourd'hui, nous sommes fiers de servir des milliers de clients à travers le Bénin et au-delà, en leur proposant une sélection rigoureuse de produits qui répondent aux plus hauts standards.
                </p>
              </div>
            </div>
          </section>
          
          {/* Section Notre Mission */}
          <section className="mb-20 bg-white p-8 rounded-xl shadow-md">
            <h2 className="heading-2 text-ruche-purple mb-6">Notre Mission</h2>
            
            <div className="space-y-6">
              <p className="text-lg font-medium text-ruche-purple">
                Chez <span className="text-ruche-gold">LA RUCHE D'OR</span>, notre mission est claire :
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-muted/50 p-6 rounded-lg hover-lift">
                  <h3 className="text-xl font-semibold text-ruche-purple mb-3">Qualité Irréprochable</h3>
                  <p>Proposer uniquement des produits de qualité supérieure, sélectionnés avec soin pour garantir une satisfaction totale.</p>
                </div>
                
                <div className="bg-muted/50 p-6 rounded-lg hover-lift">
                  <h3 className="text-xl font-semibold text-ruche-purple mb-3">Service Exceptionnel</h3>
                  <p>Offrir une expérience client inégalée, caractérisée par l'écoute, la réactivité et le professionnalisme.</p>
                </div>
                
                <div className="bg-muted/50 p-6 rounded-lg hover-lift">
                  <h3 className="text-xl font-semibold text-ruche-purple mb-3">Innovation Constante</h3>
                  <p>Innover continuellement dans notre offre et nos processus pour rester à la pointe des attentes du marché.</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Section Nos Valeurs */}
          <section className="mb-12">
            <h2 className="heading-2 text-ruche-purple mb-6">Nos Valeurs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="bg-ruche-gold p-3 rounded-full h-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-ruche-purple mb-2">Passion</h3>
                  <p>Nous mettons notre passion au service de chaque aspect de notre activité, des produits que nous sélectionnons au service que nous offrons.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-ruche-gold p-3 rounded-full h-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-ruche-purple mb-2">Intégrité</h3>
                  <p>Nous agissons avec honnêteté et transparence dans toutes nos relations, qu'il s'agisse de nos clients, de nos partenaires ou de nos employés.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-ruche-gold p-3 rounded-full h-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-ruche-purple mb-2">Excellence</h3>
                  <p>Nous recherchons l'excellence dans tout ce que nous entreprenons, en visant toujours à dépasser les attentes et à établir de nouveaux standards.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-ruche-gold p-3 rounded-full h-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M3 22v-6h18v6"/><path d="M3 10h18v6H3z"/><path d="M3 10V4c0-.6-.4-1-1-1h2c.6 0 1 .4 1 1v6"/><path d="M15 4v6"/><path d="M18 4v6"/><path d="M12 10V2.5"/></svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-ruche-purple mb-2">Responsabilité</h3>
                  <p>Nous assumons pleinement notre responsabilité envers notre communauté et notre environnement, en favorisant des pratiques durables et éthiques.</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* CTA */}
          <div className="bg-gradient-to-r from-ruche-purple to-ruche-purple-light text-white p-8 rounded-xl shadow-lg">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Prêt à découvrir nos produits d'exception?</h2>
              <p className="mb-6 text-white/80">Parcourez notre catalogue et trouvez les produits qui correspondent à vos besoins.</p>
              <Button 
                asChild
                size="lg"
                className="bg-ruche-gold hover:bg-ruche-gold-light text-ruche-purple font-medium transition-all duration-300"
              >
                <Link to="/shop">
                  <ShoppingBag size={18} className="mr-2" />
                  Visiter la boutique
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
