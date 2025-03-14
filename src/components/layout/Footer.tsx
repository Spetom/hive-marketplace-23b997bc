
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-ruche-purple text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <img 
                src="/lovable-uploads/79615c23-e955-46f0-ae0d-ea61a982bfab.png" 
                alt="La Ruche d'Or" 
                className="h-12 mr-2"
              />
              <span className="font-heading font-bold text-xl">LA RUCHE D'OR</span>
            </div>
            <p className="text-white/80 mb-6">
              La Ruche d'Or est une entreprise béninoise spécialisée dans la vente de tout types d'articles de qualité.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-ruche-gold transition-colors p-2 rounded-full"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-ruche-gold transition-colors p-2 rounded-full"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-ruche-gold transition-colors p-2 rounded-full"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-white/80 hover:text-ruche-gold transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-white/80 hover:text-ruche-gold transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/80 hover:text-ruche-gold transition-colors">
                  À Propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-ruche-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Catégories</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/shop?category=electronique" className="text-white/80 hover:text-ruche-gold transition-colors">
                  Électronique
                </Link>
              </li>
              <li>
                <Link to="/shop?category=mode" className="text-white/80 hover:text-ruche-gold transition-colors">
                  Mode
                </Link>
              </li>
              <li>
                <Link to="/shop?category=maison" className="text-white/80 hover:text-ruche-gold transition-colors">
                  Maison
                </Link>
              </li>
              <li>
                <Link to="/shop?category=beaute" className="text-white/80 hover:text-ruche-gold transition-colors">
                  Beauté & Santé
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-ruche-gold mr-3 mt-1 flex-shrink-0" />
                <span className="text-white/80">
                  123 Rue du Commerce, Cotonou, Bénin
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-ruche-gold mr-3 flex-shrink-0" />
                <span className="text-white/80">+2290197050090</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-ruche-gold mr-3 flex-shrink-0" />
                <span className="text-white/80">contact@laruche-dor.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm mb-4 md:mb-0">
              &copy; {currentYear} LA RUCHE D'OR. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-white/60 hover:text-white text-sm">
                Politique de confidentialité
              </Link>
              <Link to="/terms" className="text-white/60 hover:text-white text-sm">
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
