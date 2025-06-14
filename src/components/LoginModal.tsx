
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from 'lucide-react';
import { UserRole } from '../App';

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
  onLogin: (username: string, role: UserRole) => void;
}

const LoginModal = ({ show, onClose, onLogin }: LoginModalProps) => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && role) {
      onLogin(username, role);
      setUsername('');
      setRole('');
    }
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="text-white w-8 h-8" />
          </div>
          <DialogTitle className="text-2xl font-bold">Connexion</DialogTitle>
          <DialogDescription>
            Accédez à votre espace personnel
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-sm font-medium">
              Nom d'utilisateur
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Votre nom d'utilisateur"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="role" className="text-sm font-medium">
              Rôle
            </Label>
            <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionnez votre rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="candidate">Candidat</SelectItem>
                <SelectItem value="corrector">Correcteur</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Se connecter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
