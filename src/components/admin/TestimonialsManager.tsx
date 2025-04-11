
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { Check, X, Eye, Trash, Star, PlusCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type Testimonial = {
  id: string;
  customer_name: string;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  
  // Nouveau témoignage
  const [newTestimonial, setNewTestimonial] = useState({
    customer_name: '',
    content: '',
    rating: 5
  });
  
  useEffect(() => {
    fetchTestimonials();
  }, []);
  
  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setTestimonials(data as Testimonial[]);
    } catch (error) {
      console.error('Erreur lors du chargement des témoignages:', error);
      toast.error('Erreur lors du chargement des témoignages');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStatusChange = async (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      setTestimonials(prevTestimonials =>
        prevTestimonials.map(testimonial =>
          testimonial.id === id ? { ...testimonial, status: newStatus } : testimonial
        )
      );
      
      toast.success(`Statut du témoignage mis à jour avec succès`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };
  
  const handleDelete = async () => {
    if (!selectedTestimonial) return;
    
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', selectedTestimonial.id);
        
      if (error) throw error;
      
      setTestimonials(prevTestimonials =>
        prevTestimonials.filter(testimonial => testimonial.id !== selectedTestimonial.id)
      );
      
      toast.success('Témoignage supprimé avec succès');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la suppression du témoignage:', error);
      toast.error('Erreur lors de la suppression du témoignage');
    }
  };
  
  const handleAddTestimonial = async () => {
    if (!newTestimonial.customer_name || !newTestimonial.content) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert([{
          customer_name: newTestimonial.customer_name,
          content: newTestimonial.content,
          rating: newTestimonial.rating,
          status: 'approved'
        }])
        .select();
        
      if (error) throw error;
      
      toast.success('Témoignage ajouté avec succès');
      setNewTestimonial({ customer_name: '', content: '', rating: 5 });
      setIsDialogOpen(false);
      
      if (data) {
        setTestimonials(prev => [data[0] as Testimonial, ...prev]);
      } else {
        // Si aucune donnée n'est retournée, rafraîchir la liste
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du témoignage:', error);
      toast.error('Erreur lors de l\'ajout du témoignage');
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial => 
    testimonial.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    testimonial.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <Badge className="bg-green-500">Approuvé</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejeté</Badge>;
      default:
        return <Badge className="bg-yellow-500">En attente</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-border">
      <div className="p-4 flex justify-between items-center border-b">
        <div className="relative w-1/3">
          <Input
            placeholder="Rechercher un témoignage..."
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
          onClick={() => setIsDialogOpen(true)}
          className="bg-ruche-purple hover:bg-ruche-purple/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouveau témoignage
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Témoignage</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Chargement des témoignages...
                </TableCell>
              </TableRow>
            ) : filteredTestimonials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucun témoignage trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredTestimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell className="font-medium">{testimonial.customer_name}</TableCell>
                  <TableCell className="max-w-xs truncate">{testimonial.content}</TableCell>
                  <TableCell>
                    <div className="flex">
                      {renderStars(testimonial.rating)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(testimonial.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(testimonial.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {testimonial.status === 'pending' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-green-500 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleStatusChange(testimonial.id, 'approved')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleStatusChange(testimonial.id, 'rejected')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedTestimonial(testimonial);
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
      
      {/* Dialog ajout témoignage */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un témoignage</DialogTitle>
            <DialogDescription>
              Créez un nouveau témoignage client qui sera affiché sur le site
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="customer_name">Nom du client</Label>
              <Input
                id="customer_name"
                value={newTestimonial.customer_name}
                onChange={(e) => setNewTestimonial({...newTestimonial, customer_name: e.target.value})}
                placeholder="Nom du client"
              />
            </div>
            
            <div>
              <Label htmlFor="content">Témoignage</Label>
              <Textarea
                id="content"
                value={newTestimonial.content}
                onChange={(e) => setNewTestimonial({...newTestimonial, content: e.target.value})}
                placeholder="Contenu du témoignage"
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="rating">Note (1-5)</Label>
              <div className="flex items-center mt-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer ${star <= newTestimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                    onClick={() => setNewTestimonial({...newTestimonial, rating: star})}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddTestimonial}>
              Ajouter
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
              Êtes-vous sûr de vouloir supprimer ce témoignage ?
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

export default TestimonialsManager;
