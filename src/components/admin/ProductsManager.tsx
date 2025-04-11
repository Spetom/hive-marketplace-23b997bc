
import { useState, useEffect, useRef } from 'react';
import { Product } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  PlusCircle, 
  Pencil, 
  Trash, 
  ImagePlus,
  Save,
  RefreshCw,
  Database,
  Download,
  Upload,
  X
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { categories } from '@/lib/data';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  mapSupabaseToProduct,
  uploadProductImage
} from '@/services/productService';

const ProductsManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false); // Désactivé par défaut
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [tempProduct, setTempProduct] = useState<Product>({
    id: '',
    name: '',
    category: 'mode',
    price: 0,
    image: '',
    description: '',
    rating: 4,
    inStock: true,
    featured: false
  });

  // Charger les produits avec React Query
  const { data: productsList = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const products = await fetchProducts();
      return products.map(mapSupabaseToProduct);
    },
  });

  // Mutation pour créer un produit
  const createMutation = useMutation({
    mutationFn: (product: Omit<Product, 'id'>) => createProduct(product),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast.success(`Produit "${tempProduct.name}" créé`, {
          description: "Les modifications ont été enregistrées.",
          icon: <Save className="h-4 w-4" />
        });
        setUnsavedChanges(false);
        setIsDialogOpen(false);
      }
    }
  });

  // Mutation pour mettre à jour un produit
  const updateMutation = useMutation({
    mutationFn: ({ id, product }: { id: string, product: Partial<Product> }) => updateProduct(id, product),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast.success(`Produit "${tempProduct.name}" mis à jour`, {
          description: "Les modifications ont été enregistrées.",
          icon: <Save className="h-4 w-4" />
        });
        setUnsavedChanges(false);
        // Ne pas fermer automatiquement le dialogue après la mise à jour
        // setIsDialogOpen(false);
      }
    }
  });

  // Mutation pour supprimer un produit
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: (success, id) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast.success(`Produit supprimé`, {
          description: "Le produit a été supprimé avec succès.",
          icon: <Trash className="h-4 w-4" />
        });
        setIsDeleteDialogOpen(false);
        setEditingProduct(null);
      }
    }
  });

  // Mutation pour uploader une image
  const uploadMutation = useMutation({
    mutationFn: uploadProductImage,
    onSuccess: (data) => {
      if (data) {
        setTempProduct({...tempProduct, image: data});
        setUnsavedChanges(true);
      }
    },
    onSettled: () => {
      setIsUploading(false);
    }
  });

  // Nettoyer le timer lorsque le composant est démonté
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  // Gestion de l'auto-sauvegarde avec un délai plus long
  useEffect(() => {
    if (!isDialogOpen || !autoSaveEnabled || !unsavedChanges) {
      return;
    }
    
    // Vérification de base des données requises
    if (!tempProduct.name || tempProduct.name.trim() === '' || tempProduct.price < 0) {
      return;
    }
    
    // Nettoyer tout timer existant lors d'une modification
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    // Définir un nouveau timer avec un délai plus long (5 secondes)
    autoSaveTimerRef.current = setTimeout(() => {
      try {
        saveProduct();
      } catch (error) {
        console.error("Erreur lors de la sauvegarde automatique:", error);
        toast.error("Erreur lors de la sauvegarde automatique", {
          description: "Veuillez réessayer manuellement"
        });
      }
    }, 5000); // Augmenté à 5 secondes au lieu de 2
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [tempProduct, isDialogOpen, autoSaveEnabled, unsavedChanges]);

  const filteredProducts = productsList.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setTempProduct({...product});
    setIsCreating(false);
    setUnsavedChanges(false);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (editingProduct) {
      deleteMutation.mutate(editingProduct.id);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setTempProduct({
      id: '', // l'ID sera généré par Supabase
      name: '',
      category: 'mode',
      price: 0,
      image: '',
      description: '',
      rating: 4,
      inStock: true,
      featured: false
    });
    setIsCreating(true);
    setUnsavedChanges(false);
    setAutoSaveEnabled(false); // Désactiver l'auto-sauvegarde pour un nouveau produit
    setIsDialogOpen(true);
  };

  const handleTempProductChange = (updatedTempProduct: Product) => {
    setTempProduct(updatedTempProduct);
    setUnsavedChanges(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type du fichier (images seulement)
    if (!file.type.startsWith('image/')) {
      toast.error("Type de fichier non supporté", {
        description: "Veuillez télécharger une image (JPG, PNG, GIF, etc.)"
      });
      return;
    }

    // Vérifier la taille du fichier (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Fichier trop volumineux", {
        description: "La taille du fichier ne doit pas dépasser 5 MB"
      });
      return;
    }

    setIsUploading(true);
    uploadMutation.mutate(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setTempProduct({...tempProduct, image: ''});
    setUnsavedChanges(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const saveProduct = () => {
    if (!tempProduct.name || tempProduct.name.trim() === '') {
      toast.error("Le nom du produit est requis");
      return;
    }

    if (isNaN(tempProduct.price) || tempProduct.price < 0) {
      toast.error("Le prix doit être un nombre positif");
      return;
    }

    if (isCreating) {
      const { id, ...productToCreate } = tempProduct; // On ignore l'id pour la création
      createMutation.mutate(productToCreate);
    } else if (editingProduct) {
      updateMutation.mutate({ id: tempProduct.id, product: tempProduct });
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(productsList, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = 'products.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Données exportées avec succès', {
      description: "Toutes les modifications ont été incluses dans l'export."
    });
  };

  return (
    <div className="bg-white rounded-lg border border-border">
      <div className="p-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Input
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => refetch()} 
            title="Rafraîchir"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          {isLoading && <span className="text-sm text-muted-foreground">Chargement...</span>}
          {isError && <span className="text-sm text-red-500">Erreur de chargement</span>}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportData}
            className="text-ruche-purple"
          >
            <Download className="mr-2 h-4 w-4" />
            Exporter JSON
          </Button>
          
          <Button 
            onClick={handleCreateProduct}
            className="bg-ruche-purple hover:bg-ruche-purple/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouveau produit
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="text-right">Prix</TableHead>
              <TableHead className="text-center">En stock</TableHead>
              <TableHead className="text-center">Mis en avant</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/300x300?text=Image';
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  {categories.find(c => c.id === product.category)?.name || product.category}
                </TableCell>
                <TableCell className="text-right">
                  {product.price.toFixed(2)}€
                  {product.discountPrice && (
                    <span className="ml-2 text-sm line-through text-muted-foreground">
                      {product.discountPrice.toFixed(2)}€
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {product.inStock ? (
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                  ) : (
                    <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {product.featured ? (
                    <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full"></span>
                  ) : (
                    <span className="inline-block w-3 h-3 bg-gray-300 rounded-full"></span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteProduct(product)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {isLoading ? 
                    'Chargement des produits...' : 
                    isError ? 
                      'Erreur lors du chargement des produits' : 
                      'Aucun produit trouvé'
                  }
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open && unsavedChanges && !autoSaveEnabled) {
          if (confirm("Vous avez des modifications non enregistrées. Voulez-vous vraiment fermer ?")) {
            setIsDialogOpen(false);
          }
        } else {
          setIsDialogOpen(open);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? 'Créer un nouveau produit' : 'Modifier le produit'}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations du produit ci-dessous.
              {autoSaveEnabled && (
                <span className="text-green-600 ml-2">
                  Sauvegarde automatique activée
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center mb-4">
            <Checkbox 
              id="autoSave" 
              checked={autoSaveEnabled}
              onCheckedChange={(checked) => setAutoSaveEnabled(!!checked)}
            />
            <Label htmlFor="autoSave" className="ml-2 cursor-pointer">
              Sauvegarde automatique
            </Label>
            {unsavedChanges && !autoSaveEnabled && (
              <span className="ml-auto text-amber-600 text-sm">
                Modifications non enregistrées
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du produit</Label>
                <Input 
                  id="name" 
                  value={tempProduct.name} 
                  onChange={(e) => handleTempProductChange({...tempProduct, name: e.target.value})}
                  placeholder="Nom du produit"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select 
                  value={tempProduct.category}
                  onValueChange={(value) => handleTempProductChange({...tempProduct, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="price">Prix (€)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  value={tempProduct.price} 
                  onChange={(e) => handleTempProductChange({...tempProduct, price: parseFloat(e.target.value) || 0})}
                  placeholder="Prix"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div>
                <Label htmlFor="discountPrice">Prix remisé (€) (optionnel)</Label>
                <Input 
                  id="discountPrice" 
                  type="number" 
                  value={tempProduct.discountPrice || ''} 
                  onChange={(e) => handleTempProductChange({
                    ...tempProduct, 
                    discountPrice: e.target.value ? parseFloat(e.target.value) : undefined
                  })}
                  placeholder="Prix remisé (optionnel)"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="inStock" 
                  checked={tempProduct.inStock}
                  onCheckedChange={(checked) => 
                    handleTempProductChange({...tempProduct, inStock: checked as boolean})
                  }
                />
                <Label htmlFor="inStock">En stock</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="featured" 
                  checked={tempProduct.featured}
                  onCheckedChange={(checked) => 
                    handleTempProductChange({...tempProduct, featured: checked as boolean})
                  }
                />
                <Label htmlFor="featured">Mettre en avant</Label>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="block mb-2">Image du produit</Label>
                <input 
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="h-40 w-full rounded-md overflow-hidden bg-gray-100 border border-border flex items-center justify-center relative">
                  {tempProduct.image ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={tempProduct.image} 
                        alt="Aperçu" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/300x300?text=Aperçu';
                        }}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="text-center cursor-pointer w-full h-full flex flex-col items-center justify-center"
                      onClick={triggerFileInput}
                    >
                      <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Cliquez pour ajouter une image
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-2 flex justify-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={triggerFileInput}
                    disabled={isUploading}
                    type="button"
                    className="w-full"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Téléchargement...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        {tempProduct.image ? 'Changer d\'image' : 'Télécharger une image'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={tempProduct.description}
                  onChange={(e) => handleTempProductChange({...tempProduct, description: e.target.value})}
                  placeholder="Description du produit"
                  rows={4}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={saveProduct}
              className="bg-ruche-gold hover:bg-ruche-gold-dark"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Chargement...
                </>
              ) : isCreating ? 'Créer' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le produit "{editingProduct?.name}" ?
              Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={confirmDeleteProduct}
              variant="destructive"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsManager;
