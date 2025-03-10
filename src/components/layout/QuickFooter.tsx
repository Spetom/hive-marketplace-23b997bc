
import { Link } from 'react-router-dom';
import { Mail, Phone, Clock, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const QuickFooter = () => {
  return (
    <footer className="bg-ruche-purple text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* À propos */}
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4 text-ruche-gold">À propos</h3>
            <p className="text-white/80 mb-4">
              La Ruche d'Or est une entreprise béninoise spécialisée dans la vente de produits de qualité pour toute la famille.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" className="text-white/80 hover:text-ruche-gold transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" className="text-white/80 hover:text-ruche-gold transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-white/80 hover:text-ruche-gold transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Liens rapides */}
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4 text-ruche-gold">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-ruche-gold transition-colors">Accueil</Link>
              </li>
              <li>
                <Link to="/shop" className="text-white/80 hover:text-ruche-gold transition-colors">Boutique</Link>
              </li>
              <li>
                <Link to="/about" className="text-white/80 hover:text-ruche-gold transition-colors">À propos</Link>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-ruche-gold transition-colors">Conditions générales</a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-ruche-gold transition-colors">Politique de confidentialité</a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4 text-ruche-gold">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-ruche-gold/80" />
                <span className="text-white/80">123 Rue du Commerce, Cotonou, Bénin</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-ruche-gold/80" />
                <a href="tel:+22900000000" className="text-white/80 hover:text-ruche-gold transition-colors">+229 00 00 00 00</a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-ruche-gold/80" />
                <a href="mailto:contact@laruchedor.bj" className="text-white/80 hover:text-ruche-gold transition-colors">contact@laruchedor.bj</a>
              </li>
            </ul>
          </div>
          
          {/* Horaires d'ouverture */}
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4 text-ruche-gold">Horaires d'ouverture</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Clock size={18} className="mr-2 text-ruche-gold/80" />
                <span className="text-white/80">Horaires</span>
              </li>
              <li className="text-white/80 pl-7">Lundi - Vendredi: 8h - 20h</li>
              <li className="text-white/80 pl-7">Samedi: 9h - 18h</li>
              <li className="text-white/80 pl-7">Dimanche: 10h - 15h</li>
            </ul>
          </div>
        </div>
        
        {/* Bas de page */}
        <div className="pt-6 border-t border-white/10 text-center md:flex md:justify-between md:items-center">
          <p className="text-white/60 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} La Ruche d'Or. Tous droits réservés.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-white/60 hover:text-ruche-gold text-sm">Mentions légales</a>
            <a href="#" className="text-white/60 hover:text-ruche-gold text-sm">CGV</a>
            <a href="#" className="text-white/60 hover:text-ruche-gold text-sm">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default QuickFooter;
