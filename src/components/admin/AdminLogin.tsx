
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';

interface AdminLoginProps {
  onAuthenticated: () => void;
}

const AdminLogin = ({ onAuthenticated }: AdminLoginProps) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Pour la démonstration, un mot de passe simple
    // Dans une application réelle, utilisez une authentification sécurisée
    setTimeout(() => {
      if (password === 'admin123') {
        toast.success('Connexion réussie');
        onAuthenticated();
      } else {
        toast.error('Mot de passe incorrect');
      }
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="pt-24 pb-20">
      <div className="container-custom">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg border border-border shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="bg-ruche-purple/10 p-3 rounded-full">
              <Shield className="h-8 w-8 text-ruche-purple" />
            </div>
          </div>
          
          <h1 className="text-2xl font-heading font-semibold text-center text-ruche-purple mb-6">
            Accès Administration
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1">
                  Mot de passe
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez le mot de passe"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-ruche-gold hover:bg-ruche-gold-dark text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Pour cette démonstration, utilisez le mot de passe: admin123
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
