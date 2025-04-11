
// Fix for error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.
// The specific issue is on line 68, which is likely related to the count results from Supabase

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowUp, ArrowDown, ShoppingBag, Users, CreditCard, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Données factices pour les graphiques
const salesData = [
  { name: 'Jan', total: 1200 },
  { name: 'Feb', total: 2100 },
  { name: 'Mar', total: 1800 },
  { name: 'Apr', total: 2400 },
  { name: 'May', total: 2700 },
  { name: 'Jun', total: 3000 },
  { name: 'Jul', total: 2500 },
];

const popularProducts = [
  { name: 'Miel de Fleurs', sales: 45 },
  { name: 'Propolis', sales: 32 },
  { name: 'Miel d\'Acacia', sales: 28 },
  { name: 'Crème au Miel', sales: 22 },
  { name: 'Pollen', sales: 15 },
];

const DashboardOverview = () => {
  const [orderCount, setOrderCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);
  const [testimonialCount, setTestimonialCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer le nombre de commandes
        const { count: orderCountResult, error: orderError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });
          
        if (orderError) throw orderError;
        
        // Récupérer le nombre de produits
        const { count: productCountResult, error: productError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
          
        if (productError) throw productError;
        
        // Récupérer le chiffre d'affaires total
        const { data: revenueData, error: revenueError } = await supabase
          .from('orders')
          .select('total_amount');
          
        if (revenueError) throw revenueError;
        
        // Récupérer le nombre de témoignages
        const { count: testimonialCountResult, error: testimonialError } = await supabase
          .from('testimonials')
          .select('*', { count: 'exact', head: true });
          
        if (testimonialError) throw testimonialError;
        
        // Calculer le revenu total
        const totalRevenue = revenueData?.reduce((acc, order) => acc + parseFloat(order.total_amount.toString()), 0) || 0;
        
        // Mettre à jour les états avec les valeurs typées correctement
        setOrderCount(orderCountResult || 0);
        setProductCount(productCountResult || 0);
        setRevenue(totalRevenue);
        setTestimonialCount(testimonialCountResult || 0);
        
      } catch (error) {
        console.error('Erreur lors du chargement des données du tableau de bord:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Statistiques en cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chiffre d'affaires
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : `${revenue.toFixed(2)} €`}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Commandes
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : `+${orderCount}`}
            </div>
            <p className="text-xs text-muted-foreground">
              +12.2% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produits
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : productCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {productCount > 0 ? `${productCount} produit${productCount > 1 ? 's' : ''} actif${productCount > 1 ? 's' : ''}` : "Aucun produit"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Témoignages
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : testimonialCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {testimonialCount > 0 ? `${testimonialCount} avis client${testimonialCount > 1 ? 's' : ''}` : "Aucun témoignage"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ventes récentes</CardTitle>
            <CardDescription>
              Évolution des ventes sur les 6 derniers mois
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Produits les plus vendus</CardTitle>
            <CardDescription>
              Top 5 des produits par nombre de ventes
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={popularProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Activités récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Activités récentes</CardTitle>
          <CardDescription>
            Les dernières activités de la boutique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="mr-4 rounded-full bg-green-100 p-2">
                <ShoppingBag className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Nouvelle commande #143</p>
                <p className="text-xs text-muted-foreground">Il y a 23 minutes</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-4 rounded-full bg-blue-100 p-2">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Nouveau témoignage de Marie D.</p>
                <p className="text-xs text-muted-foreground">Il y a 1 heure</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-4 rounded-full bg-amber-100 p-2">
                <TrendingUp className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Produit "Miel d'Acacia" mis à jour</p>
                <p className="text-xs text-muted-foreground">Il y a 3 heures</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
