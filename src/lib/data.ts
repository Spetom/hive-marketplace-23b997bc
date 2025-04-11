
// Function to generate image URLs for products without specific images
const generateImageUrl = (index: number): string => {
  return `https://source.unsplash.com/random/300x300?african,fabric&sig=${index}`;
};

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
    name: "Chemise en pagne Ankara",
    category: "mode",
    price: 29.99,
    discountPrice: 24.99,
    image: "/lovable-uploads/647cc294-27a3-44f3-82fd-d377923d4499.png",
    description: "Chemise élégante confectionnée en pagne Ankara aux motifs colorés traditionnels africains.",
    rating: 4.5,
    inStock: true,
    featured: true
  },
  {
    id: "2",
    name: "Ensemble Kente femme",
    category: "mode",
    price: 89.99,
    image: "/lovable-uploads/91ebc91d-b4b1-4b09-a3ba-e0f635a4bd28.png",
    description: "Magnifique ensemble en tissu Kente avec des motifs traditionnels ghanéens, parfait pour les occasions spéciales.",
    rating: 4.8,
    inStock: true
  },
  {
    id: "3",
    name: "Sac à main en pagne",
    category: "mode",
    price: 49.99,
    discountPrice: 39.99,
    image: "/lovable-uploads/dfe3fb08-8965-4e0a-8188-35a46ffa96af.png",
    description: "Sac à main élégant confectionné en pagne africain avec finition en cuir véritable.",
    rating: 4.7,
    inStock: true,
    featured: true
  },
  {
    id: "4",
    name: "Legging motifs africains",
    category: "mode",
    price: 39.99,
    image: "/lovable-uploads/1d2b4ed7-a506-4c06-98fc-88e28e7ce734.png",
    description: "Legging confortable avec motifs africains inspirés des textiles traditionnels.",
    rating: 4.3,
    inStock: true,
    featured: true
  },
  {
    id: "5",
    name: "Tissu pagne Wax premium (6 yards)",
    category: "tissus",
    price: 69.99,
    image: generateImageUrl(5),
    description: "Tissu pagne Wax authentique de qualité supérieure, parfait pour confectionner des vêtements uniques.",
    rating: 4.9,
    inStock: true
  },
  {
    id: "7",
    name: "T-shirt La Ruche d'Or motifs adinkra",
    category: "mode",
    price: 19.99,
    image: "/lovable-uploads/e4118eb3-fc71-40d4-8485-25ffe9b4e6b5.png",
    description: "T-shirt confortable avec logo La Ruche d'Or et motifs adinkra symbolisant la sagesse et la force.",
    rating: 4.6,
    inStock: true,
    featured: true
  },
  {
    id: "9",
    name: "Robe longue en bazin brodé",
    category: "mode",
    price: 129.99,
    discountPrice: 99.99,
    image: generateImageUrl(9),
    description: "Magnifique robe en bazin riche avec broderies traditionnelles, idéale pour les célébrations.",
    rating: 4.9,
    inStock: true
  },
  {
    id: "10",
    name: "Casquette La Ruche d'Or motifs kente",
    category: "mode",
    price: 24.99,
    image: "/lovable-uploads/5044e05d-ed1e-4f1e-89a9-ccbe5762efa1.png",
    description: "Casquette élégante avec logo La Ruche d'Or et accent en tissu kente, parfaite pour toutes les saisons.",
    rating: 4.5,
    inStock: true,
    featured: true
  },
  {
    id: "12",
    name: "Sweatshirt motifs bogolan",
    category: "mode",
    price: 49.99,
    discountPrice: 39.99,
    image: "/lovable-uploads/8c802d68-775a-4882-b7fe-3a1f44ade043.png",
    description: "Sweatshirt confortable avec motifs bogolan du Mali, parfait pour les journées fraîches.",
    rating: 4.7,
    inStock: true,
    featured: true
  },
  {
    id: "13",
    name: "Ensemble complet homme en pagne",
    category: "mode",
    price: 149.99,
    discountPrice: 129.99,
    image: generateImageUrl(13),
    description: "Ensemble complet pour homme confectionné en pagne africain de qualité, coupe moderne et élégante.",
    rating: 4.9,
    inStock: true,
    featured: true
  }
];

export const categories = [
  { id: "mode", name: "Vêtements", count: products.filter(p => p.category === "mode").length },
  { id: "tissus", name: "Tissus & Pagnes", count: products.filter(p => p.category === "tissus").length },
  { id: "accessoires", name: "Accessoires", count: products.filter(p => p.category === "accessoires").length }
];

// Liste des pays pour le formulaire de livraison
export const countries = [
  "Afghanistan", "Afrique du Sud", "Albanie", "Algérie", "Allemagne", "Andorre", "Angola", "Antigua-et-Barbuda", 
  "Arabie Saoudite", "Argentine", "Arménie", "Australie", "Autriche", "Azerbaïdjan", "Bahamas", "Bahreïn", 
  "Bangladesh", "Barbade", "Belgique", "Belize", "Bénin", "Bhoutan", "Biélorussie", "Birmanie", "Bolivie", 
  "Bosnie-Herzégovine", "Botswana", "Brésil", "Brunei", "Bulgarie", "Burkina Faso", "Burundi", "Cambodge", 
  "Cameroun", "Canada", "Cap-Vert", "Chili", "Chine", "Chypre", "Colombie", "Comores", "Congo", 
  "Corée du Nord", "Corée du Sud", "Costa Rica", "Côte d'Ivoire", "Croatie", "Cuba", "Danemark", "Djibouti", 
  "Dominique", "Égypte", "Émirats arabes unis", "Équateur", "Érythrée", "Espagne", "Estonie", "Eswatini", 
  "États-Unis", "Éthiopie", "Fidji", "Finlande", "France", "Gabon", "Gambie", "Géorgie", "Ghana", "Grèce", 
  "Grenade", "Guatemala", "Guinée", "Guinée équatoriale", "Guinée-Bissau", "Guyana", "Haïti", "Honduras", 
  "Hongrie", "Îles Marshall", "Îles Salomon", "Inde", "Indonésie", "Irak", "Iran", "Irlande", "Islande", 
  "Israël", "Italie", "Jamaïque", "Japon", "Jordanie", "Kazakhstan", "Kenya", "Kirghizistan", "Kiribati", 
  "Koweït", "Laos", "Lesotho", "Lettonie", "Liban", "Liberia", "Libye", "Liechtenstein", "Lituanie", 
  "Luxembourg", "Macédoine du Nord", "Madagascar", "Malaisie", "Malawi", "Maldives", "Mali", "Malte", "Maroc", 
  "Maurice", "Mauritanie", "Mexique", "Micronésie", "Moldavie", "Monaco", "Mongolie", "Monténégro", 
  "Mozambique", "Namibie", "Nauru", "Népal", "Nicaragua", "Niger", "Nigeria", "Niue", "Norvège", 
  "Nouvelle-Zélande", "Oman", "Ouganda", "Ouzbékistan", "Pakistan", "Palaos", "Palestine", "Panama", 
  "Papouasie-Nouvelle-Guinée", "Paraguay", "Pays-Bas", "Pérou", "Philippines", "Pologne", "Portugal", "Qatar", 
  "République centrafricaine", "République démocratique du Congo", "République dominicaine", "République tchèque", 
  "Roumanie", "Royaume-Uni", "Russie", "Rwanda", "Saint-Kitts-et-Nevis", "Saint-Marin", "Saint-Vincent-et-les-Grenadines", 
  "Sainte-Lucie", "Salvador", "Samoa", "Sao Tomé-et-Principe", "Sénégal", "Serbie", "Seychelles", "Sierra Leone", 
  "Singapour", "Slovaquie", "Slovénie", "Somalie", "Soudan", "Soudan du Sud", "Sri Lanka", "Suède", "Suisse", 
  "Suriname", "Syrie", "Tadjikistan", "Tanzanie", "Tchad", "Thaïlande", "Timor oriental", "Togo", "Tonga", 
  "Trinité-et-Tobago", "Tunisie", "Turkménistan", "Turquie", "Tuvalu", "Ukraine", "Uruguay", "Vanuatu", 
  "Vatican", "Venezuela", "Viêt Nam", "Yémen", "Zambie", "Zimbabwe"
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
