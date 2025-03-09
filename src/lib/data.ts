
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  image: string;
  description: string;
  rating: number;
  inStock: boolean;
  featured?: boolean;
}

// Images placeholder pour les produits
const generateImageUrl = (index: number): string => {
  return `https://source.unsplash.com/random/300x300?product&sig=${index}`;
};

export const products: Product[] = [
  {
    id: "1",
    name: "Smartphone XZ Premium",
    category: "electronique",
    price: 299.99,
    discountPrice: 249.99,
    image: generateImageUrl(1),
    description: "Un smartphone haut de gamme avec un appareil photo exceptionnel et une batterie longue durée.",
    rating: 4.5,
    inStock: true,
    featured: true
  },
  {
    id: "2",
    name: "Montre connectée Pulse",
    category: "electronique",
    price: 129.99,
    image: generateImageUrl(2),
    description: "Suivez votre activité physique et restez connecté avec cette montre élégante.",
    rating: 4.2,
    inStock: true
  },
  {
    id: "3",
    name: "Sac à main en cuir véritable",
    category: "mode",
    price: 159.99,
    discountPrice: 129.99,
    image: generateImageUrl(3),
    description: "Un sac à main en cuir véritable fabriqué par des artisans qualifiés.",
    rating: 4.7,
    inStock: true,
    featured: true
  },
  {
    id: "4",
    name: "Chaussures de sport légères",
    category: "mode",
    price: 89.99,
    image: generateImageUrl(4),
    description: "Chaussures confortables avec un amorti exceptionnel pour tous vos entraînements.",
    rating: 4.3,
    inStock: true
  },
  {
    id: "5",
    name: "Mixeur électrique pro",
    category: "maison",
    price: 69.99,
    image: generateImageUrl(5),
    description: "Préparez des smoothies et des soupes en un instant avec ce mixeur puissant.",
    rating: 4.1,
    inStock: true
  },
  {
    id: "6",
    name: "Ensemble de décoration murale",
    category: "maison",
    price: 49.99,
    image: generateImageUrl(6),
    description: "Ajoutez une touche d'élégance à votre intérieur avec cet ensemble de décoration.",
    rating: 4.4,
    inStock: true
  },
  {
    id: "7",
    name: "Sérum visage hydratant",
    category: "beaute",
    price: 29.99,
    image: generateImageUrl(7),
    description: "Hydratez votre peau en profondeur avec ce sérum aux ingrédients naturels.",
    rating: 4.6,
    inStock: true,
    featured: true
  },
  {
    id: "8",
    name: "Parfum Élégance Dorée",
    category: "beaute",
    price: 79.99,
    image: generateImageUrl(8),
    description: "Un parfum captivant avec des notes florales et boisées.",
    rating: 4.8,
    inStock: true
  },
  {
    id: "9",
    name: "Écouteurs sans fil Pro",
    category: "electronique",
    price: 99.99,
    discountPrice: 79.99,
    image: generateImageUrl(9),
    description: "Des écouteurs avec une qualité sonore exceptionnelle et une autonomie impressionnante.",
    rating: 4.4,
    inStock: true
  },
  {
    id: "10",
    name: "Ensemble costume homme",
    category: "mode",
    price: 199.99,
    image: generateImageUrl(10),
    description: "Un costume élégant pour toutes vos occasions spéciales.",
    rating: 4.5,
    inStock: true
  },
  {
    id: "11",
    name: "Lampe de bureau design",
    category: "maison",
    price: 59.99,
    image: generateImageUrl(11),
    description: "Une lampe moderne avec différents modes d'éclairage pour votre espace de travail.",
    rating: 4.2,
    inStock: true
  },
  {
    id: "12",
    name: "Palette de maquillage professionnelle",
    category: "beaute",
    price: 49.99,
    discountPrice: 39.99,
    image: generateImageUrl(12),
    description: "Une palette complète avec des couleurs vibrantes pour tous vos looks.",
    rating: 4.7,
    inStock: true
  }
];

export const categories = [
  { id: "electronique", name: "Électronique", count: products.filter(p => p.category === "electronique").length },
  { id: "mode", name: "Mode", count: products.filter(p => p.category === "mode").length },
  { id: "maison", name: "Maison", count: products.filter(p => p.category === "maison").length },
  { id: "beaute", name: "Beauté & Santé", count: products.filter(p => p.category === "beaute").length }
];

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === "all") return products;
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getRelatedProducts = (id: string, category: string): Product[] => {
  return products.filter(product => product.category === category && product.id !== id).slice(0, 4);
};
