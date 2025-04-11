
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/data";
import { toast } from "sonner";

// Fonction pour récupérer tous les produits
export async function fetchProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    toast.error('Impossible de charger les produits');
    return [];
  }
}

// Fonction pour récupérer un produit par son ID
export async function fetchProductById(id: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du produit ${id}:`, error);
    toast.error('Impossible de charger les détails du produit');
    return null;
  }
}

// Fonction pour créer un nouveau produit
export async function createProduct(product: Omit<Product, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        category: product.category,
        price: product.price,
        discount_price: product.discountPrice,
        description: product.description,
        image_url: product.image,
        in_stock: product.inStock,
        featured: product.featured,
        rating: product.rating
      }])
      .select();

    if (error) throw error;
    
    return data?.[0];
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    toast.error('Impossible de créer le produit');
    return null;
  }
}

// Fonction pour mettre à jour un produit
export async function updateProduct(id: string, product: Partial<Product>) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: product.name,
        category: product.category,
        price: product.price,
        discount_price: product.discountPrice,
        description: product.description,
        image_url: product.image,
        in_stock: product.inStock,
        featured: product.featured,
        rating: product.rating
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    
    return data?.[0];
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du produit ${id}:`, error);
    toast.error('Impossible de mettre à jour le produit');
    return null;
  }
}

// Fonction pour supprimer un produit
export async function deleteProduct(id: string) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression du produit ${id}:`, error);
    toast.error('Impossible de supprimer le produit');
    return false;
  }
}

// Nouvelle fonction pour uploader une image
export async function uploadProductImage(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);
      
    if (!data || !data.publicUrl) {
      throw new Error("Impossible d'obtenir l'URL publique");
    }
    
    toast.success("Image téléchargée avec succès", {
      description: "L'image est maintenant disponible pour votre produit."
    });
    
    return data.publicUrl;
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image:', error);
    toast.error('Impossible de télécharger l\'image');
    return null;
  }
}

// Fonction pour adapter les données de Supabase au format de l'application
export function mapSupabaseToProduct(item: any): Product {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    price: Number(item.price),
    discountPrice: item.discount_price ? Number(item.discount_price) : undefined,
    image: item.image_url || '',
    description: item.description || '',
    rating: item.rating || 4,
    inStock: item.in_stock !== false,
    featured: item.featured || false
  };
}
