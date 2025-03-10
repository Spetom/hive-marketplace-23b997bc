
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
              Gérez votre catalogue de produits, vos commandes et vos clients
            </p>
          </div>
          
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="products">Produits</TabsTrigger>
              <TabsTrigger value="orders">Commandes</TabsTrigger>
              <TabsTrigger value="customers">Clients</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <ProductsManager />
            </TabsContent>
            
            <TabsContent value="orders">
              <div className="p-6 border rounded-lg bg-white shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Liste des commandes</h2>
                  <div className="flex gap-2">
                    <Button variant="outline">Exporter</Button>
                    <Button variant="outline">Filtrer</Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b text-left text-sm text-muted-foreground">
                        <th className="p-3 font-medium">N° Commande</th>
                        <th className="p-3 font-medium">Date</th>
                        <th className="p-3 font-medium">Client</th>
                        <th className="p-3 font-medium">Total</th>
                        <th className="p-3 font-medium">Statut</th>
                        <th className="p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-3">#001</td>
                        <td className="p-3">10/03/2023</td>
                        <td className="p-3">Jean Dupont</td>
                        <td className="p-3">45.90 €</td>
                        <td className="p-3">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Livré</span>
                        </td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm">Voir</Button>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-3">#002</td>
                        <td className="p-3">09/03/2023</td>
                        <td className="p-3">Marie Martin</td>
                        <td className="p-3">32.50 €</td>
                        <td className="p-3">
                          <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">En cours</span>
                        </td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm">Voir</Button>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-3">#003</td>
                        <td className="p-3">08/03/2023</td>
                        <td className="p-3">Pierre Leroy</td>
                        <td className="p-3">78.20 €</td>
                        <td className="p-3">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Préparation</span>
                        </td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm">Voir</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-muted-foreground">Affichage de 3 commandes sur 3</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>Précédent</Button>
                    <Button variant="outline" size="sm" disabled>Suivant</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="customers">
              <div className="p-6 border rounded-lg bg-white shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Liste des clients</h2>
                  <div className="flex gap-2">
                    <Button variant="outline">Exporter</Button>
                    <Button variant="outline">Filtrer</Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b text-left text-sm text-muted-foreground">
                        <th className="p-3 font-medium">Nom</th>
                        <th className="p-3 font-medium">Email</th>
                        <th className="p-3 font-medium">Téléphone</th>
                        <th className="p-3 font-medium">Commandes</th>
                        <th className="p-3 font-medium">Inscription</th>
                        <th className="p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-3">Jean Dupont</td>
                        <td className="p-3">jean.dupont@example.com</td>
                        <td className="p-3">06 12 34 56 78</td>
                        <td className="p-3">3</td>
                        <td className="p-3">01/01/2023</td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm">Voir</Button>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-3">Marie Martin</td>
                        <td className="p-3">marie.martin@example.com</td>
                        <td className="p-3">07 98 76 54 32</td>
                        <td className="p-3">2</td>
                        <td className="p-3">15/02/2023</td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm">Voir</Button>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-3">Pierre Leroy</td>
                        <td className="p-3">pierre.leroy@example.com</td>
                        <td className="p-3">06 55 44 33 22</td>
                        <td className="p-3">1</td>
                        <td className="p-3">05/03/2023</td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm">Voir</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-muted-foreground">Affichage de 3 clients sur 3</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>Précédent</Button>
                    <Button variant="outline" size="sm" disabled>Suivant</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Admin;
