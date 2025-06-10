
import { Button } from "@/components/ui/button";
import { User, LogOut, ArrowLeft } from "lucide-react";

interface HeaderProps {
  user?: {
    name: string;
    role: 'candidate' | 'corrector' | 'admin';
  } | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Header = ({ user, onLogin, onLogout }: HeaderProps) => {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'candidate': return 'Candidat';
      case 'corrector': return 'Correcteur';
      case 'admin': return 'Administrateur';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'candidate': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'corrector': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'admin': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <header className="border-b bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ConcoursPro
              </h1>
              <span className="text-sm text-gray-500 font-medium">Système de correction anonyme</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2 border">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                  <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getRoleColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={onLogout}
                className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </Button>
            </div>
          ) : (
            <Button 
              onClick={onLogin}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 font-medium"
            >
              Se connecter
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
