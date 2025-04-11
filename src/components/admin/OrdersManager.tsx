
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
import { toast } from 'sonner';
import { Eye, FileDown, Filter, Calendar, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  shipping_address: Record<string, any> | null;
  created_at: string;
};

type OrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  variant_info?: Record<string, any> | null;
};

const OrdersManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const statusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'processing', label: 'En préparation' },
    { value: 'shipped', label: 'Expédié' },
    { value: 'delivered', label: 'Livré' },
    { value: 'cancelled', label: 'Annulé' }
  ];
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setOrders(data as Order[]);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchOrderItems = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);
        
      if (error) throw error;
      
      setOrderItems(data as OrderItem[]);
    } catch (error) {
      console.error('Erreur lors du chargement des détails de la commande:', error);
      toast.error('Erreur lors du chargement des détails de la commande');
    }
  };
  
  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order);
    await fetchOrderItems(order.id);
    setIsViewDialogOpen(true);
  };
  
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
        
      if (error) throw error;
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      
      toast.success('Statut de la commande mis à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };
  
  const exportOrdersToCSV = () => {
    try {
      let csvContent = "ID,Client,Email,Montant total,Statut,Date\n";
      
      orders.forEach((order) => {
        csvContent += `${order.id},${order.customer_name},"${order.customer_email}",${order.total_amount},"${order.status}","${format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')}"\n`;
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `commandes_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de l\'export des commandes:', error);
      toast.error('Erreur lors de l\'export des commandes');
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge className="bg-amber-500">En attente</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">En préparation</Badge>;
      case 'shipped':
        return <Badge className="bg-indigo-600">Expédié</Badge>;
      case 'delivered':
        return <Badge className="bg-green-600">Livré</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulé</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const renderAddressProperty = (address: Record<string, any> | null, property: string): string => {
    if (!address) return '';
    return typeof address[property] === 'string' ? address[property] : '';
  };
  
  return (
    <div className="bg-white rounded-lg border border-border">
      <div className="p-4 flex justify-between items-center border-b">
        <div className="relative w-1/3">
          <Input
            placeholder="Rechercher une commande..."
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
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={exportOrdersToCSV}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Chargement des commandes...
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Aucune commande trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{order.customer_email}</TableCell>
                  <TableCell className="text-right">{parseFloat(order.total_amount.toString()).toFixed(2)}€</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2" />
                      {format(new Date(order.created_at), 'dd/MM/yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-1">
                    {/* Ajout du menu déroulant pour changer rapidement le statut */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Statut
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {statusOptions.map((status) => (
                          <DropdownMenuItem 
                            key={status.value}
                            onClick={() => updateOrderStatus(order.id, status.value)}
                            className={order.status === status.value ? "bg-muted" : ""}
                          >
                            {status.label}
                            {order.status === status.value && (
                              <CheckCircle className="ml-2 h-4 w-4 text-primary" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Voir
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de la commande</DialogTitle>
            <DialogDescription>
              {selectedOrder ? `Commande #${selectedOrder.id}` : 'Chargement...'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Informations client</h3>
                  <div className="border rounded-md p-3">
                    <p><span className="font-medium">Nom:</span> {selectedOrder.customer_name}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.customer_email}</p>
                  </div>
                  
                  {selectedOrder.shipping_address && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Adresse de livraison</h3>
                      <div className="border rounded-md p-3">
                        <p>{renderAddressProperty(selectedOrder.shipping_address, 'street')}</p>
                        <p>{renderAddressProperty(selectedOrder.shipping_address, 'city')}, {renderAddressProperty(selectedOrder.shipping_address, 'postal_code')}</p>
                        <p>{renderAddressProperty(selectedOrder.shipping_address, 'country')}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Détails de la commande</h3>
                    <div className="border rounded-md p-3">
                      <p>
                        <span className="font-medium">Date:</span> {format(new Date(selectedOrder.created_at), 'PPP à HH:mm', { locale: fr })}
                      </p>
                      <p className="mt-1">
                        <span className="font-medium">Total:</span> {parseFloat(selectedOrder.total_amount.toString()).toFixed(2)}€
                      </p>
                      <div className="mt-2">
                        <span className="font-medium">Statut:</span>
                        <Select
                          value={selectedOrder.status}
                          onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Changer le statut" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Produits</h3>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produit</TableHead>
                          <TableHead className="text-right">Prix</TableHead>
                          <TableHead className="text-center">Qté</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderItems.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-3 text-muted-foreground">
                              Aucun produit trouvé
                            </TableCell>
                          </TableRow>
                        ) : (
                          orderItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                {item.product_name}
                                {item.variant_info && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {Object.entries(item.variant_info).map(([key, value]) => (
                                      <span key={key}>{key}: {String(value)}, </span>
                                    ))}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {parseFloat(item.unit_price.toString()).toFixed(2)}€
                              </TableCell>
                              <TableCell className="text-center">{item.quantity}</TableCell>
                              <TableCell className="text-right">
                                {(parseFloat(item.unit_price.toString()) * item.quantity).toFixed(2)}€
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">
                            Total
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {parseFloat(selectedOrder.total_amount.toString()).toFixed(2)}€
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManager;
