
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { CalendarIcon, PlusCircle, Pencil, Trash, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type Promocode = {
  id: string;
  code: string;
  discount_percent?: number | null;
  discount_amount?: number | null;
  valid_from: string;
  valid_until?: string | null;
  max_uses?: number | null;
  current_uses: number;
  created_at: string;
};

const PromocodeManager = () => {
  const [promocodes, setPromocodes] = useState<Promocode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPromocode, setSelectedPromocode] = useState<Promocode | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Nouveau code promo
  const [newPromocode, setNewPromocode] = useState({
    code: '',
    discount_type: 'percent', // 'percent' ou 'amount'
    discount_value: '',
    valid_from: new Date(),
    valid_until: null as Date | null,
    max_uses: '' as string | number
  });
  
  useEffect(() => {
    fetchPromocodes();
  }, []);
  
  const fetchPromocodes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('promocodes')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setPromocodes(data as Promocode[]);
    } catch (error) {
      console.error('Erreur lors du chargement des codes promo:', error);
      toast.error('Erreur lors du chargement des codes promo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePromocode = async () => {
    // Validation
    if (!newPromocode.code) {
      toast.error('Le code promo est requis');
      return;
    }
    
    if (!newPromocode.discount_value || parseFloat(newPromocode.discount_value.toString()) <= 0) {
      toast.error('La valeur de la remise doit être supérieure à 0');
      return;
    }

    try {
      const promocodeData: any = {
        code: newPromocode.code,
        valid_from: newPromocode.valid_from.toISOString(),
        valid_until: newPromocode.valid_until ? newPromocode.valid_until.toISOString() : null,
        max_uses: newPromocode.max_uses ? parseInt(newPromocode.max_uses.toString()) : null
      };
      
      // Ajouter le bon type de remise
      if (newPromocode.discount_type === 'percent') {
        promocodeData.discount_percent = parseFloat(newPromocode.discount_value.toString());
      } else {
        promocodeData.discount_amount = parseFloat(newPromocode.discount_value.toString());
      }
      
      let result;
      
      if (isEditing && selectedPromocode) {
        // Mise à jour
        result = await supabase
          .from('promocodes')
          .update(promocodeData)
          .eq('id', selectedPromocode.id)
          .select();
          
        toast.success('Code promo mis à jour avec succès');
      } else {
        // Création
        result = await supabase
          .from('promocodes')
          .insert([promocodeData])
          .select();
          
        toast.success('Code promo créé avec succès');
      }
      
      if (result.error) throw result.error;
      
      // Rafraîchir la liste
      fetchPromocodes();
      resetForm();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du code promo:', error);
      toast.error('Erreur lors de l\'enregistrement du code promo');
    }
  };
  
  const handleDelete = async () => {
    if (!selectedPromocode) return;
    
    try {
      const { error } = await supabase
        .from('promocodes')
        .delete()
        .eq('id', selectedPromocode.id);
        
      if (error) throw error;
      
      setPromocodes(prev => prev.filter(promo => promo.id !== selectedPromocode.id));
      toast.success('Code promo supprimé avec succès');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la suppression du code promo:', error);
      toast.error('Erreur lors de la suppression du code promo');
    }
  };
  
  const handleEditPromocode = (promocode: Promocode) => {
    setSelectedPromocode(promocode);
    setIsEditing(true);
    
    setNewPromocode({
      code: promocode.code,
      discount_type: promocode.discount_percent ? 'percent' : 'amount',
      discount_value: promocode.discount_percent 
        ? promocode.discount_percent.toString()
        : (promocode.discount_amount ? promocode.discount_amount.toString() : ''),
      valid_from: new Date(promocode.valid_from),
      valid_until: promocode.valid_until ? new Date(promocode.valid_until) : null,
      max_uses: promocode.max_uses ?? ''
    });
    
    setIsDialogOpen(true);
  };
  
  const resetForm = () => {
    setNewPromocode({
      code: '',
      discount_type: 'percent',
      discount_value: '',
      valid_from: new Date(),
      valid_until: null,
      max_uses: ''
    });
    setIsEditing(false);
    setSelectedPromocode(null);
    setIsDialogOpen(false);
  };

  const filteredPromocodes = promocodes.filter(promocode => 
    promocode.code.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Vérifie si un code promo est actif en fonction des dates
  const isPromocodeActive = (promocode: Promocode) => {
    const now = new Date();
    const validFrom = new Date(promocode.valid_from);
    const validUntil = promocode.valid_until ? new Date(promocode.valid_until) : null;
    
    if (validUntil && now > validUntil) return false;
    if (now < validFrom) return false;
    if (promocode.max_uses && promocode.current_uses >= promocode.max_uses) return false;
    
    return true;
  };
  
  return (
    <div className="bg-white rounded-lg border border-border">
      <div className="p-4 flex justify-between items-center border-b">
        <div className="relative w-1/3">
          <Input
            placeholder="Rechercher un code promo..."
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
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="bg-ruche-purple hover:bg-ruche-purple/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouveau code promo
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Remise</TableHead>
              <TableHead>Validité</TableHead>
              <TableHead>Utilisations</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Chargement des codes promo...
                </TableCell>
              </TableRow>
            ) : filteredPromocodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucun code promo trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredPromocodes.map((promocode) => (
                <TableRow key={promocode.id}>
                  <TableCell className="font-medium flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-ruche-purple" />
                    {promocode.code.toUpperCase()}
                  </TableCell>
                  <TableCell>
                    {promocode.discount_percent 
                      ? `${promocode.discount_percent}%` 
                      : `${promocode.discount_amount}€`}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Début: {format(new Date(promocode.valid_from), 'dd/MM/yyyy')}</div>
                      {promocode.valid_until && (
                        <div>Fin: {format(new Date(promocode.valid_until), 'dd/MM/yyyy')}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {promocode.current_uses}{promocode.max_uses ? `/${promocode.max_uses}` : ''}
                  </TableCell>
                  <TableCell>
                    {isPromocodeActive(promocode) 
                      ? <Badge className="bg-green-500">Actif</Badge>
                      : <Badge variant="outline">Inactif</Badge>
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditPromocode(promocode)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedPromocode(promocode);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Dialog ajout/édition code promo */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Modifier le code promo' : 'Ajouter un code promo'}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Modifiez les détails de votre code promo'
                : 'Créez un nouveau code promo pour vos clients'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={newPromocode.code}
                onChange={(e) => setNewPromocode({...newPromocode, code: e.target.value})}
                placeholder="CODE10"
                className="uppercase"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount_type">Type de remise</Label>
                <select
                  id="discount_type"
                  value={newPromocode.discount_type}
                  onChange={(e) => setNewPromocode({...newPromocode, discount_type: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="percent">Pourcentage (%)</option>
                  <option value="amount">Montant fixe (€)</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="discount_value">Valeur</Label>
                <div className="relative">
                  <Input
                    id="discount_value"
                    type="number"
                    min="0"
                    step={newPromocode.discount_type === 'percent' ? '1' : '0.01'}
                    value={newPromocode.discount_value}
                    onChange={(e) => setNewPromocode({...newPromocode, discount_value: e.target.value})}
                    placeholder={newPromocode.discount_type === 'percent' ? '10' : '5.00'}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    {newPromocode.discount_type === 'percent' ? '%' : '€'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="valid_from">Date de début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newPromocode.valid_from ? (
                      format(newPromocode.valid_from, 'PPP', { locale: fr })
                    ) : (
                      <span>Choisir une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newPromocode.valid_from}
                    onSelect={(date) => date && setNewPromocode({...newPromocode, valid_from: date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="valid_until" className="flex justify-between">
                <span>Date de fin</span>
                <span className="text-sm text-muted-foreground">(Optionnel)</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newPromocode.valid_until ? (
                      format(newPromocode.valid_until, 'PPP', { locale: fr })
                    ) : (
                      <span>Pas de date de fin</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="p-2 border-b">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNewPromocode({...newPromocode, valid_until: null})}
                    >
                      Pas de limite
                    </Button>
                  </div>
                  <Calendar
                    mode="single"
                    selected={newPromocode.valid_until || undefined}
                    onSelect={(date) => setNewPromocode({...newPromocode, valid_until: date})}
                    initialFocus
                    fromDate={newPromocode.valid_from || undefined}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="max_uses" className="flex justify-between">
                <span>Nombre max d'utilisations</span>
                <span className="text-sm text-muted-foreground">(Optionnel)</span>
              </Label>
              <Input
                id="max_uses"
                type="number"
                min="0"
                value={newPromocode.max_uses}
                onChange={(e) => setNewPromocode({...newPromocode, max_uses: e.target.value})}
                placeholder="Illimité"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Annuler
            </Button>
            <Button onClick={handleSavePromocode}>
              {isEditing ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog confirmation suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce code promo ?
              Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromocodeManager;
