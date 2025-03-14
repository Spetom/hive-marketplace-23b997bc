
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import ContactForm from '@/components/contact/ContactForm';
import QuickFooter from '@/components/layout/QuickFooter';

const Contact = () => {
  return (
    <>
      <div className="pt-24 pb-20">
        <div className="container-custom">
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-ruche-purple mb-6 text-center">
            Contactez-nous
          </h1>
          
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Pour toute demande ou information, n'hésitez pas à nous contacter. Notre équipe est à votre disposition pour répondre à vos questions dans les plus brefs délais.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="space-y-8">
              <div className="bg-white p-6 md:p-8 rounded-lg border border-border shadow-sm">
                <h2 className="font-heading text-xl md:text-2xl font-bold text-ruche-purple mb-6">
                  Nos informations
                </h2>
                
                <div className="space-y-5">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-ruche-gold mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-ruche-purple mb-1">Adresse</h3>
                      <p className="text-muted-foreground">Tokpota maison Assogba, Porto-Novo, Bénin</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-ruche-gold mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-ruche-purple mb-1">Téléphone</h3>
                      <p className="text-muted-foreground">+2290197050090</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MessageCircle className="h-5 w-5 text-ruche-gold mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-ruche-purple mb-1">WhatsApp</h3>
                      <p className="text-muted-foreground">+229 51 74 59 51</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-ruche-gold mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-ruche-purple mb-1">Email</h3>
                      <p className="text-muted-foreground">contact@laruche-dor.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-ruche-gold mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-ruche-purple mb-1">Horaires d'ouverture</h3>
                      <p className="text-muted-foreground">Lundi - Vendredi: 8h - 20h</p>
                      <p className="text-muted-foreground">Samedi: 9h - 18h</p>
                      <p className="text-muted-foreground">Dimanche: 10h - 15h</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-lg border border-border shadow-sm">
                <h2 className="font-heading text-xl md:text-2xl font-bold text-ruche-purple mb-6">
                  Localisation
                </h2>
                
                <div className="aspect-[4/3] w-full rounded-md overflow-hidden border border-border">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63436.56608602132!2d2.5795541!3d6.4968574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023545b484fc8b3%3A0xc4cbea32fd4ffa42!2sPorto-Novo%2C%20Benin!5e0!3m2!1sen!2s!4v1695888011827!5m2!1sen!2s" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Carte de localisation de La Ruche d'Or"
                  />
                </div>
              </div>
            </div>
            
            <ContactForm />
          </div>
        </div>
      </div>
      <QuickFooter />
    </>
  );
};

export default Contact;
