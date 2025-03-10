
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

// Les nouvelles images pour les produits
export const products: Product[] = [
  {
    id: "1",
    name: "Smartphone XZ Premium",
    category: "electronique",
    price: 299.99,
    discountPrice: 249.99,
    image: "/lovable-uploads/647cc294-27a3-44f3-82fd-d377923d4499.png",
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
    image: "/lovable-uploads/91ebc91d-b4b1-4b09-a3ba-e0f635a4bd28.png",
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
    image: "/lovable-uploads/dfe3fb08-8965-4e0a-8188-35a46ffa96af.png",
    description: "Un sac à main en cuir véritable fabriqué par des artisans qualifiés.",
    rating: 4.7,
    inStock: true,
    featured: true
  },
  {
    id: "4",
    name: "Legging sport La Ruche d'Or",
    category: "mode",
    price: 89.99,
    image: "/lovable-uploads/1d2b4ed7-a506-4c06-98fc-88e28e7ce734.png",
    description: "Legging confortable avec motif La Ruche d'Or pour tous vos entraînements.",
    rating: 4.3,
    inStock: true,
    featured: true
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
    name: "T-shirt La Ruche d'Or",
    category: "mode",
    price: 29.99,
    image: "/lovable-uploads/e4118eb3-fc71-40d4-8485-25ffe9b4e6b5.png",
    description: "T-shirt confortable avec logo La Ruche d'Or, disponible en plusieurs tailles.",
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
    name: "Casquette La Ruche d'Or",
    category: "mode",
    price: 24.99,
    image: "/lovable-uploads/5044e05d-ed1e-4f1e-89a9-ccbe5762efa1.png",
    description: "Casquette élégante avec logo La Ruche d'Or, parfaite pour toutes les saisons.",
    rating: 4.5,
    inStock: true,
    featured: true
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
    name: "Sweatshirt La Ruche d'Or",
    category: "mode",
    price: 49.99,
    discountPrice: 39.99,
    image: "/lovable-uploads/8c802d68-775a-4882-b7fe-3a1f44ade043.png",
    description: "Sweatshirt confortable avec logo La Ruche d'Or, parfait pour les journées fraîches.",
    rating: 4.7,
    inStock: true,
    featured: true
  },
  {
    id: "13",
    name: "Ordinateur portable UltraBook",
    category: "electronique",
    price: 899.99,
    discountPrice: 799.99,
    image: generateImageUrl(13),
    description: "Un ordinateur portable ultrafin avec des performances exceptionnelles pour le travail et les loisirs.",
    rating: 4.9,
    inStock: true,
    featured: true
  },
  {
    id: "14",
    name: "Crème anti-âge revitalisante",
    category: "beaute",
    price: 69.99,
    image: generateImageUrl(14),
    description: "Une crème anti-âge enrichie en vitamines et en actifs naturels pour une peau visiblement plus jeune.",
    rating: 4.6,
    inStock: true,
    featured: false
  }
];

// Images placeholder pour les produits sans images spécifiques
const generateImageUrl = (index: number): string => {
  return `https://source.unsplash.com/random/300x300?product&sig=${index}`;
};

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
