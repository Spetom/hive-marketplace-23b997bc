
import emailjs from 'emailjs-com';
import { toast } from 'sonner';

// Configuration d'EmailJS
const EMAILJS_SERVICE_ID = 'service_laruche'; // Vous devrez créer ce service sur EmailJS
const EMAILJS_CONTACT_TEMPLATE_ID = 'template_contact'; // Template pour les messages de contact
const EMAILJS_ORDER_TEMPLATE_ID = 'template_order'; // Template pour les commandes
const EMAILJS_USER_ID = 'YOUR_USER_ID'; // Votre User ID EmailJS

// Initialiser EmailJS
export const initEmailJS = () => {
  emailjs.init(EMAILJS_USER_ID);
};

// Interface pour les informations de commande
interface OrderInfo {
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
    quantity: number;
  }>;
  totalPrice: number;
  paymentMethod: string;
}

// Interface pour les messages de contact
interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

// Fonction pour envoyer un email de confirmation de commande
export const sendOrderConfirmation = async (orderInfo: OrderInfo): Promise<boolean> => {
  try {
    // Formatage des items pour l'email
    const itemsList = orderInfo.items.map(item => 
      `${item.name} x${item.quantity} - ${((item.discountPrice || item.price) * item.quantity * 655.957).toLocaleString()} FCFA`
    ).join('\n');

    const templateParams = {
      to_email: 'contact@laruche-dor.com',
      customer_name: orderInfo.customerInfo.fullName,
      customer_email: orderInfo.customerInfo.email,
      customer_phone: orderInfo.customerInfo.phone,
      customer_address: `${orderInfo.customerInfo.address}, ${orderInfo.customerInfo.city}, ${orderInfo.customerInfo.country}`,
      order_items: itemsList,
      total_price: `${(orderInfo.totalPrice * 655.957).toLocaleString()} FCFA`,
      payment_method: orderInfo.paymentMethod,
      order_date: new Date().toLocaleDateString('fr-FR')
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_ORDER_TEMPLATE_ID,
      templateParams
    );

    console.log('Email de commande envoyé avec succès:', response);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de commande:', error);
    toast.error('Erreur lors de l\'envoi de l\'email de confirmation. Veuillez nous contacter directement.');
    return false;
  }
};

// Fonction pour envoyer un message du formulaire de contact
export const sendContactMessage = async (contactData: ContactMessage): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: 'contact@laruche-dor.com',
      from_name: contactData.name,
      from_email: contactData.email,
      from_phone: contactData.phone || 'Non spécifié',
      subject: contactData.subject,
      message: contactData.message
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_CONTACT_TEMPLATE_ID,
      templateParams
    );

    console.log('Message de contact envoyé avec succès:', response);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message de contact:', error);
    toast.error('Erreur lors de l\'envoi du message. Veuillez réessayer plus tard.');
    return false;
  }
};
