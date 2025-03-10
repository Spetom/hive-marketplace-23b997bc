
import { useState, useEffect } from 'react';
import { Product, products, categories } from '@/lib/data';
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
  ImagePlus 
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ProductsManager = () => {
  const [productsList, setProductsList] = useState<Product[]>([...products]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Produit temporaire pour l'édition/création
  const [tempProduct, setTempProduct] = useState<Product>({
    id: '',
    name: '',
    category: 'electronique',
    price: 0,
    image: '',
    description: '',
    rating: 4,
    inStock: true,
    featured: false
  });

  const filteredProducts = productsList.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setTempProduct({...product});
    setIsCreating(false);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (editingProduct) {
      setProductsList(prev => prev.filter(p => p.id !== editingProduct.id));
      toast.success(`Produit "${editingProduct.name}" supprimé`);
      setIsDeleteDialogOpen(false);
      setEditingProduct(null);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setTempProduct({
      id: Math.random().toString(36).substring(2, 9),
      name: '',
      category: 'electronique',
      price: 0,
      image: 'https://source.unsplash.com/random/300x300?product',
      description: '',
      rating: 4,
      inStock: true,
      featured: false
    });
    setIsCreating(true);
    setIsDialogOpen(true);
  };

  const saveProduct = () => {
    if (isCreating) {
      // Création d'un nouveau produit
      setProductsList(prev => [...prev, tempProduct]);
      toast.success(`Produit "${tempProduct.name}" créé`);
    } else {
      // Modification d'un produit existant
      setProductsList(prev => 
        prev.map(p => p.id === tempProduct.id ? tempProduct : p)
      );
      toast.success(`Produit "${tempProduct.name}" mis à jour`);
    }
    setIsDialogOpen(false);
  };

  // Fonction pour partager les données
  const exportData = () => {
    const dataStr = JSON.stringify(productsList, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = 'products.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Données exportées avec succès');
  };

  return (
    <div className="bg-white rounded-lg border border-border">
      <div className="p-4 flex justify-between items-center border-b">
        <div className="relative w-1/3">
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
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportData}
            className="text-ruche-purple"
          >
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
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
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
            ))}
            
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Aucun produit trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Dialog pour édition/création de produit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? 'Créer un nouveau produit' : 'Modifier le produit'}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations du produit ci-dessous.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du produit</Label>
                <Input 
                  id="name" 
                  value={tempProduct.name} 
                  onChange={(e) => setTempProduct({...tempProduct, name: e.target.value})}
                  placeholder="Nom du produit"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select 
                  value={tempProduct.category}
                  onValueChange={(value) => setTempProduct({...tempProduct, category: value})}
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
                  onChange={(e) => setTempProduct({...tempProduct, price: parseFloat(e.target.value)})}
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
                  onChange={(e) => setTempProduct({
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
                    setTempProduct({...tempProduct, inStock: checked as boolean})
                  }
                />
                <Label htmlFor="inStock">En stock</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="featured" 
                  checked={tempProduct.featured}
                  onCheckedChange={(checked) => 
                    setTempProduct({...tempProduct, featured: checked as boolean})
                  }
                />
                <Label htmlFor="featured">Mettre en avant</Label>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="image">URL de l'image</Label>
                <div className="flex">
                  <Input 
                    id="image" 
                    value={tempProduct.image} 
                    onChange={(e) => setTempProduct({...tempProduct, image: e.target.value})}
                    placeholder="URL de l'image"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="mt-2">
                <div className="h-40 w-full rounded-md overflow-hidden bg-gray-100 border border-border flex items-center justify-center">
                  {tempProduct.image ? (
                    <img 
                      src={tempProduct.image} 
                      alt="Aperçu" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Aucune image
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={tempProduct.description}
                  onChange={(e) => setTempProduct({...tempProduct, description: e.target.value})}
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
            >
              {isCreating ? 'Créer' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog de confirmation de suppression */}
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
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsManager;
