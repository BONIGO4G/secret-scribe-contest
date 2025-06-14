
import React from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogIn, LogOut, User } from 'lucide-react';
import { User as UserType } from '../App';

interface HeaderProps {
  currentUser: UserType | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Header = ({ currentUser, onLogin, onLogout }: HeaderProps) => {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ConcoursPro</h1>
          </div>
          
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 font-medium">{currentUser.name}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {currentUser.role}
                </span>
              </div>
              <Button 
                onClick={onLogout}
                variant="destructive"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          ) : (
            <Button onClick={onLogin} className="bg-gradient-to-r from-blue-500 to-purple-600">
              <LogIn className="w-4 h-4 mr-2" />
              Se connecter
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
