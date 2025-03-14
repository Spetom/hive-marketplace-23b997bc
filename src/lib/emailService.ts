
import { toast } from 'sonner';

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

// Formspree Form ID pour le formulaire de contact
const FORMSPREE_CONTACT_ID = "xpzyezol"; // Remplacez par votre ID Formspree

// Formspree Form ID pour les commandes
const FORMSPREE_ORDER_ID = "xvoyaenn"; // Remplacez par votre ID Formspree

// Fonction pour envoyer un email de confirmation de commande
export const sendOrderConfirmation = async (orderInfo: OrderInfo): Promise<boolean> => {
  try {
    // Formatage des items pour l'email
    const itemsList = orderInfo.items.map(item => 
      `${item.name} x${item.quantity} - ${((item.discountPrice || item.price) * item.quantity * 655.957).toLocaleString()} FCFA`
    ).join('\n');

    const formData = {
      customerName: orderInfo.customerInfo.fullName,
      customerEmail: orderInfo.customerInfo.email,
      customerPhone: orderInfo.customerInfo.phone,
      customerAddress: `${orderInfo.customerInfo.address}, ${orderInfo.customerInfo.city}, ${orderInfo.customerInfo.country}`,
      orderItems: itemsList,
      totalPrice: `${(orderInfo.totalPrice * 655.957).toLocaleString()} FCFA`,
      paymentMethod: orderInfo.paymentMethod,
      orderDate: new Date().toLocaleDateString('fr-FR')
    };

    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ORDER_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      console.log('Email de commande envoyé avec succès');
      return true;
    } else {
      throw new Error('Échec de l\'envoi');
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de commande:', error);
    toast.error('Erreur lors de l\'envoi de l\'email de confirmation. Veuillez nous contacter directement.');
    return false;
  }
};

// Fonction pour envoyer un message du formulaire de contact
export const sendContactMessage = async (contactData: ContactMessage): Promise<boolean> => {
  try {
    const formData = {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || 'Non spécifié',
      subject: contactData.subject,
      message: contactData.message
    };

    const response = await fetch(`https://formspree.io/f/${FORMSPREE_CONTACT_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      console.log('Message de contact envoyé avec succès');
      return true;
    } else {
      throw new Error('Échec de l\'envoi');
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message de contact:', error);
    toast.error('Erreur lors de l\'envoi du message. Veuillez réessayer plus tard.');
    return false;
  }
};

// Plus besoin de l'initialisation EmailJS
export const initEmailJS = () => {
  // Cette fonction est maintenue pour la compatibilité mais n'a plus d'effet
  console.log('Service email prêt à utiliser');
};
