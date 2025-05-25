import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/data";
import { toast } from "sonner";

// Fonction pour récupérer tous les produits
export async function fetchProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

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
    const updateData: any = {};
    
    if (product.name !== undefined) updateData.name = product.name;
    if (product.category !== undefined) updateData.category = product.category;
    if (product.price !== undefined) updateData.price = product.price;
    if (product.discountPrice !== undefined) updateData.discount_price = product.discountPrice;
    if (product.description !== undefined) updateData.description = product.description;
    if (product.image !== undefined) updateData.image_url = product.image;
    if (product.inStock !== undefined) updateData.in_stock = product.inStock;
    if (product.featured !== undefined) updateData.featured = product.featured;
    if (product.rating !== undefined) updateData.rating = product.rating;
    
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
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
    // Récupérer d'abord les informations sur le produit pour savoir s'il y a une image à supprimer
    const { data: product } = await supabase
      .from('products')
      .select('image_url')
      .eq('id', id)
      .single();
    
    // Supprimer l'image associée au produit si elle existe
    if (product?.image_url) {
      const imagePath = extractStoragePath(product.image_url);
      if (imagePath) {
        const { error: storageError } = await supabase.storage
          .from('product-images')
          .remove([imagePath]);
          
        if (storageError) {
          console.warn('Erreur lors de la suppression de l\'image:', storageError);
          // On continue malgré l'erreur pour supprimer le produit
        }
      }
    }
    
    // Supprimer le produit
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

// Fonction pour extraire le chemin du fichier à partir de l'URL publique
function extractStoragePath(url: string): string | null {
  try {
    // L'URL ressemble généralement à: https://.../storage/v1/object/public/product-images/filename.jpg
    const match = url.match(/\/storage\/v1\/object\/public\/product-images\/(.+)$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Erreur lors de l\'extraction du chemin de stockage:', error);
    return null;
  }
}

// Fonction pour uploader une image
export async function uploadProductImage(file: File): Promise<string | null> {
  try {
    console.log('Début du téléchargement de l\'image:', file.name, file.type, file.size);
    
    // Vérifications préliminaires
    if (!file.type.startsWith('image/')) {
      toast.error("Type de fichier non supporté", {
        description: "Veuillez télécharger une image (JPG, PNG, GIF, WebP)"
      });
      return null;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error("Fichier trop volumineux", {
        description: "La taille du fichier ne doit pas dépasser 5 MB"
      });
      return null;
    }
    
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt)) {
      toast.error("Extension de fichier non supportée", {
        description: "Extensions autorisées: JPG, PNG, GIF, WebP"
      });
      return null;
    }
    
    const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
    const filePath = fileName;
    
    console.log('Téléchargement vers:', filePath);
    
    // Tentative de téléchargement
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Erreur de téléchargement:', uploadError);
      
      // Messages d'erreur plus spécifiques
      if (uploadError.message.includes('Invalid bucket')) {
        toast.error("Erreur de configuration", {
          description: "Le bucket de stockage n'est pas correctement configuré"
        });
      } else if (uploadError.message.includes('Duplicate')) {
        toast.error("Fichier déjà existant", {
          description: "Un fichier avec ce nom existe déjà, veuillez réessayer"
        });
      } else if (uploadError.message.includes('policy')) {
        toast.error("Erreur d'autorisation", {
          description: "Vous n'avez pas les permissions nécessaires pour télécharger des images"
        });
      } else {
        toast.error("Erreur de téléchargement", {
          description: uploadError.message || "Une erreur inconnue s'est produite"
        });
      }
      return null;
    }
    
    console.log('Téléchargement réussi:', uploadData);
    
    // Obtenir l'URL publique
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);
      
    if (!urlData || !urlData.publicUrl) {
      console.error('Impossible d\'obtenir l\'URL publique');
      toast.error("Erreur de configuration", {
        description: "Impossible d'obtenir l'URL publique de l'image"
      });
      return null;
    }
    
    console.log('URL publique générée:', urlData.publicUrl);
    
    toast.success("Image téléchargée avec succès", {
      description: "L'image est maintenant disponible pour votre produit."
    });
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image:', error);
    toast.error('Erreur système', {
      description: 'Une erreur inattendue s\'est produite lors du téléchargement'
    });
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
