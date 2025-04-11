
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
  SidebarInset
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Users, Tag, BarChart3, Settings, LogOut, Star, Ticket } from "lucide-react";

// Admin Components
import ProductsManager from '@/components/admin/ProductsManager';
import TestimonialsManager from '@/components/admin/TestimonialsManager';
import PromocodeManager from '@/components/admin/PromocodeManager';
import OrdersManager from '@/components/admin/OrdersManager';
import DashboardOverview from '@/components/admin/DashboardOverview';

// Tabs enum pour gérer les différentes sections de l'administration
export enum AdminTabs {
  DASHBOARD = 'dashboard',
  PRODUCTS = 'products',
  ORDERS = 'orders',
  TESTIMONIALS = 'testimonials',
  PROMOCODES = 'promocodes',
  SETTINGS = 'settings',
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Récupérer l'onglet actif depuis les paramètres de navigation ou utiliser la valeur par défaut
  const getInitialTab = () => {
    // Check if location.state exists and has activeTab property
    if (location.state && typeof location.state === 'object' && 'activeTab' in location.state) {
      const activeTab = (location.state as { activeTab?: string }).activeTab;
      // Validate that activeTab is a valid AdminTabs value
      if (activeTab && Object.values(AdminTabs).includes(activeTab as AdminTabs)) {
        return activeTab as AdminTabs;
      }
    }
    return AdminTabs.DASHBOARD;
  };
  
  const [activeTab, setActiveTab] = useState<AdminTabs>(getInitialTab());

  // Effet pour mettre à jour l'onglet actif lorsque les paramètres de navigation changent
  useEffect(() => {
    const newTab = getInitialTab();
    setActiveTab(newTab);
  }, [location]);

  const handleLogout = () => {
    // Logique de déconnexion ici
    navigate('/admin');
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case AdminTabs.DASHBOARD:
        return <DashboardOverview />;
      case AdminTabs.PRODUCTS:
        return <ProductsManager />;
      case AdminTabs.ORDERS:
        return <OrdersManager />;
      case AdminTabs.TESTIMONIALS:
        return <TestimonialsManager />;
      case AdminTabs.PROMOCODES:
        return <PromocodeManager />;
      case AdminTabs.SETTINGS:
        return (
          <div className="p-6 border rounded-lg bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Paramètres</h2>
            <p className="text-muted-foreground">Fonctionnalité en cours de développement.</p>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Tableau de bord | LA RUCHE D'OR</title>
      </Helmet>
      
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen bg-muted/20">
          <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader>
              <div className="flex items-center px-2">
                <img
                  src="/lovable-uploads/79615c23-e955-46f0-ae0d-ea61a982bfab.png"
                  alt="La Ruche d'Or Logo"
                  className="h-10 object-contain"
                />
                <span className="ml-2 text-lg font-bold text-ruche-purple">Admin</span>
              </div>
            </SidebarHeader>

            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Tableau de bord" 
                    isActive={activeTab === AdminTabs.DASHBOARD}
                    onClick={() => setActiveTab(AdminTabs.DASHBOARD)}
                  >
                    <BarChart3 className="size-4" />
                    <span>Tableau de bord</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Produits" 
                    isActive={activeTab === AdminTabs.PRODUCTS}
                    onClick={() => setActiveTab(AdminTabs.PRODUCTS)}
                  >
                    <ShoppingBag className="size-4" />
                    <span>Produits</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Commandes" 
                    isActive={activeTab === AdminTabs.ORDERS}
                    onClick={() => setActiveTab(AdminTabs.ORDERS)}
                  >
                    <Tag className="size-4" />
                    <span>Commandes</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Témoignages" 
                    isActive={activeTab === AdminTabs.TESTIMONIALS}
                    onClick={() => setActiveTab(AdminTabs.TESTIMONIALS)}
                  >
                    <Star className="size-4" />
                    <span>Témoignages</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Codes promo" 
                    isActive={activeTab === AdminTabs.PROMOCODES}
                    onClick={() => setActiveTab(AdminTabs.PROMOCODES)}
                  >
                    <Ticket className="size-4" />
                    <span>Codes promo</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              
              <SidebarSeparator />
              
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Paramètres" 
                    isActive={activeTab === AdminTabs.SETTINGS}
                    onClick={() => setActiveTab(AdminTabs.SETTINGS)}
                  >
                    <Settings className="size-4" />
                    <span>Paramètres</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Déconnexion" 
                    onClick={handleLogout}
                  >
                    <LogOut className="size-4" />
                    <span>Déconnexion</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            
            <SidebarFooter>
              <div className="px-3 py-2">
                <p className="text-xs text-muted-foreground">
                  Ruche d'Or Admin v1.0
                </p>
              </div>
            </SidebarFooter>
          </Sidebar>
          
          <SidebarInset className="p-4">
            <div className="container max-w-7xl">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-ruche-purple">
                  {activeTab === AdminTabs.DASHBOARD && 'Tableau de bord'}
                  {activeTab === AdminTabs.PRODUCTS && 'Gestion des produits'}
                  {activeTab === AdminTabs.ORDERS && 'Gestion des commandes'}
                  {activeTab === AdminTabs.TESTIMONIALS && 'Gestion des témoignages'}
                  {activeTab === AdminTabs.PROMOCODES && 'Gestion des codes promo'}
                  {activeTab === AdminTabs.SETTINGS && 'Paramètres'}
                </h1>
              </div>
              
              {activeTab === AdminTabs.DASHBOARD && <DashboardOverview />}
              {activeTab === AdminTabs.PRODUCTS && <ProductsManager />}
              {activeTab === AdminTabs.ORDERS && <OrdersManager />}
              {activeTab === AdminTabs.TESTIMONIALS && <TestimonialsManager />}
              {activeTab === AdminTabs.PROMOCODES && <PromocodeManager />}
              {activeTab === AdminTabs.SETTINGS && (
                <div className="p-6 border rounded-lg bg-white shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Paramètres</h2>
                  <p className="text-muted-foreground">Fonctionnalité en cours de développement.</p>
                </div>
              )}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
};

export default AdminDashboard;
