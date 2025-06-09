
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface HeaderProps {
  user?: {
    name: string;
    role: 'candidate' | 'corrector' | 'admin';
  } | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Header = ({ user, onLogin, onLogout }: HeaderProps) => {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">ConcoursPro</h1>
          <span className="text-sm text-muted-foreground">Système de correction anonyme</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{user.name}</span>
                <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                  {user.role === 'candidate' ? 'Candidat' : 
                   user.role === 'corrector' ? 'Correcteur' : 'Admin'}
                </span>
              </div>
              <Button variant="outline" onClick={onLogout}>
                Déconnexion
              </Button>
            </div>
          ) : (
            <Button onClick={onLogin}>
              Se connecter
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
