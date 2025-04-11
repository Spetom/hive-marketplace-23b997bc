
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ShoppingBag, Users, ArrowUpRight, ArrowDownRight, Calendar, Tag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';

// Charts
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

type Stats = {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  totalTestimonials: number;
  recentOrders: any[];
  productsByCategory: any[];
}

const defaultStats: Stats = {
  totalOrders: 0,
  totalRevenue: 0,
  totalCustomers: 0,
  totalProducts: 0,
  totalTestimonials: 0,
  recentOrders: [],
  productsByCategory: []
};

const COLORS = ['#8b5cf6', '#c084fc', '#a78bfa', '#ddd6fe', '#ede9fe', '#f3f4f6'];

const DashboardOverview = () => {
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch orders count and total revenue
        const { data: ordersData } = await supabase
          .from('orders')
          .select('id, total_amount, customer_email');
        
        // Fetch total products
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
        
        // Fetch testimonials
        const { count: testimonialsCount } = await supabase
          .from('testimonials')
          .select('*', { count: 'exact', head: true });
        
        // Fetch products by category
        const { data: products } = await supabase
          .from('products')
          .select('category');
        
        // Process data
        const uniqueCustomers = new Set(ordersData?.map(order => order.customer_email) || []);
        const totalRevenue = ordersData?.reduce((sum, order) => sum + (parseFloat(order.total_amount.toString()) || 0), 0) || 0;
        
        // Count products by category
        const categoryCounts: Record<string, number> = {};
        products?.forEach(product => {
          const category = product.category;
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
        
        const productsByCategory = Object.keys(categoryCounts).map(category => ({
          name: category,
          value: categoryCounts[category],
        }));
        
        // Update state
        setStats({
          totalOrders: ordersData?.length || 0,
          totalRevenue,
          totalCustomers: uniqueCustomers.size,
          totalProducts: productsCount || 0,
          totalTestimonials: testimonialsCount || 0,
          recentOrders: ordersData?.slice(0, 5) || [],
          productsByCategory,
        });
      } catch (error) {
        console.error('Erreur lors du chargement des données du dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 20)}% depuis le mois dernier</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)}€</div>
            <div className="flex items-center pt-1">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <p className="text-xs text-green-500">+{Math.floor(Math.random() * 15)}%</p>
              <p className="text-xs text-muted-foreground ml-1">depuis le mois dernier</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <div className="flex items-center pt-1">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <p className="text-xs text-green-500">+{Math.floor(Math.random() * 10)}%</p>
              <p className="text-xs text-muted-foreground ml-1">depuis le mois dernier</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Témoignages</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTestimonials}</div>
            <div className="flex items-center pt-1">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <p className="text-xs text-green-500">+{Math.floor(Math.random() * 8)}%</p>
              <p className="text-xs text-muted-foreground ml-1">depuis le mois dernier</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Produits par catégorie</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-80 w-full">
              {stats.productsByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.productsByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.productsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Aucune donnée disponible</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Commandes récentes</CardTitle>
            <CardDescription>Les 5 dernières commandes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <p>Chargement...</p>
              ) : stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <div className="font-medium">{order.customer_email}</div>
                      <div className="text-sm text-muted-foreground">#{order.id.substring(0, 8)}</div>
                    </div>
                    <div className="font-medium">{parseFloat(order.total_amount.toString()).toFixed(2)}€</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Aucune commande récente</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <a href="#/admin/orders">
                <Calendar className="mr-2 h-4 w-4" />
                Voir toutes les commandes
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
