
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
    console.log('=== DÉBUT TÉLÉCHARGEMENT IMAGE ===');
    console.log('Fichier:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });
    
    // Vérifications préliminaires
    if (!file.type.startsWith('image/')) {
      console.error('Type de fichier invalide:', file.type);
      toast.error("Type de fichier non supporté", {
        description: "Veuillez télécharger une image (JPG, PNG, GIF, WebP)"
      });
      return null;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      console.error('Fichier trop volumineux:', file.size);
      toast.error("Fichier trop volumineux", {
        description: "La taille du fichier ne doit pas dépasser 5 MB"
      });
      return null;
    }
    
    // Vérifier les extensions autorisées
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      console.error('Extension non supportée:', fileExt);
      toast.error("Extension de fichier non supportée", {
        description: "Extensions autorisées: JPG, PNG, GIF, WebP"
      });
      return null;
    }
    
    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileName = `${randomId}-${timestamp}.${fileExt}`;
    
    console.log('Nom de fichier généré:', fileName);
    
    // Vérifier la connexion Supabase
    console.log('Vérification de la connexion Supabase...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Erreur lors de la vérification des buckets:', bucketsError);
      toast.error("Erreur de connexion", {
        description: "Impossible de se connecter au stockage. Vérifiez votre connexion."
      });
      return null;
    }
    
    console.log('Buckets disponibles:', buckets);
    
    // Vérifier que le bucket product-images existe
    const productImagesBucket = buckets?.find(bucket => bucket.id === 'product-images');
    if (!productImagesBucket) {
      console.error('Bucket product-images non trouvé');
      toast.error("Erreur de configuration", {
        description: "Le bucket de stockage des images n'est pas configuré"
      });
      return null;
    }
    
    console.log('Bucket product-images trouvé:', productImagesBucket);
    
    // Tentative de téléchargement avec options spécifiques
    console.log('Début du téléchargement vers Supabase Storage...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });
    
    if (uploadError) {
      console.error('=== ERREUR TÉLÉCHARGEMENT ===');
      console.error('Code d\'erreur:', uploadError.name);
      console.error('Message:', uploadError.message);
      console.error('Détails complets:', uploadError);
      
      // Messages d'erreur plus spécifiques
      if (uploadError.message.includes('Invalid bucket') || uploadError.message.includes('Bucket not found')) {
        toast.error("Erreur de configuration", {
          description: "Le bucket de stockage n'est pas correctement configuré"
        });
      } else if (uploadError.message.includes('Duplicate') || uploadError.message.includes('already exists')) {
        toast.error("Fichier déjà existant", {
          description: "Un fichier avec ce nom existe déjà, veuillez réessayer"
        });
      } else if (uploadError.message.includes('policy') || uploadError.message.includes('permission') || uploadError.message.includes('RLS')) {
        toast.error("Erreur d'autorisation", {
          description: "Vous n'avez pas les permissions nécessaires pour télécharger des images"
        });
      } else if (uploadError.message.includes('size') || uploadError.message.includes('too large')) {
        toast.error("Fichier trop volumineux", {
          description: "Le fichier dépasse la taille maximale autorisée"
        });
      } else if (uploadError.message.includes('timeout') || uploadError.message.includes('network')) {
        toast.error("Erreur de réseau", {
          description: "Problème de connexion. Vérifiez votre réseau et réessayez."
        });
      } else {
        toast.error("Erreur de téléchargement", {
          description: `Erreur: ${uploadError.message}`
        });
      }
      return null;
    }
    
    console.log('=== TÉLÉCHARGEMENT RÉUSSI ===');
    console.log('Données de téléchargement:', uploadData);
    
    // Obtenir l'URL publique
    console.log('Génération de l\'URL publique...');
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);
      
    if (!urlData || !urlData.publicUrl) {
      console.error('Impossible d\'obtenir l\'URL publique');
      toast.error("Erreur de configuration", {
        description: "Impossible d'obtenir l'URL publique de l'image"
      });
      return null;
    }
    
    console.log('=== URL PUBLIQUE GÉNÉRÉE ===');
    console.log('URL:', urlData.publicUrl);
    
    toast.success("Image téléchargée avec succès", {
      description: "L'image est maintenant disponible pour votre produit."
    });
    
    return urlData.publicUrl;
    
  } catch (error) {
    console.error('=== ERREUR SYSTÈME CRITIQUE ===');
    console.error('Type d\'erreur:', typeof error);
    console.error('Erreur complète:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'Pas de stack trace');
    
    toast.error('Erreur système critique', {
      description: `Une erreur inattendue s'est produite: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
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
