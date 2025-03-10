
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import ProductsManager from '@/components/admin/ProductsManager';
import AdminLogin from '@/components/admin/AdminLogin';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  if (!isAuthenticated) {
    return <AdminLogin onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <>
      <Helmet>
        <title>Administration | LA RUCHE D'OR</title>
      </Helmet>
      
      <div className="pt-24 pb-20">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="heading-1 text-ruche-purple">Administration</h1>
            <p className="text-muted-foreground mt-2">
              Gérez votre catalogue de produits
            </p>
          </div>
          
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="products">Produits</TabsTrigger>
              <TabsTrigger value="orders" disabled>Commandes</TabsTrigger>
              <TabsTrigger value="customers" disabled>Clients</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <ProductsManager />
            </TabsContent>
            
            <TabsContent value="orders">
              <div className="text-center py-10">
                <p className="text-muted-foreground">Module à venir...</p>
              </div>
            </TabsContent>
            
            <TabsContent value="customers">
              <div className="text-center py-10">
                <p className="text-muted-foreground">Module à venir...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Admin;
