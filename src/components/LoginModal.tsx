import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Key } from 'lucide-react';
import { UserRole } from '../App';
import { useToast } from '@/hooks/use-toast';

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
  onLogin: (username: string, role: UserRole) => void;
}

const LoginModal = ({ show, onClose, onLogin }: LoginModalProps) => {
  const [matricule, setMatricule] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [error, setError] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const { toast } = useToast();

  // Mock codes d'accès correcteur (en production, ceci serait dans une base de données)
  const validCorrectorCodes = [
    'CORR-ABC123-XYZ789',
    'CORR-DEF456-UVW012',
    'CORR-GHI789-RST345'
  ];

  // Validation du matricule selon le rôle
  const validateMatricule = (matricule: string, role: UserRole): boolean => {
    if (role === 'candidate') {
      // Matricule candidat : exactement 8 chiffres
      const regex = /^\d{8}$/;
      return regex.test(matricule);
    } else if (role === 'corrector') {
      // Matricule de service : au minimum 6 caractères alphanumériques
      const regex = /^[A-Za-z0-9]{6,}$/;
      return regex.test(matricule);
    } else if (role === 'admin') {
      // Admin : AD + 4 chiffres + AK
      const regex = /^AD\d{4}AK$/;
      return regex.test(matricule);
    }
    return false;
  };

  const getMatriculeError = (role: UserRole): string => {
    if (role === 'candidate') {
      return 'Le matricule candidat doit contenir exactement 8 chiffres';
    } else if (role === 'corrector') {
      return 'Le matricule de service doit contenir au minimum 6 caractères alphanumériques';
    } else if (role === 'admin') {
      return 'Le matricule administrateur doit commencer par AD, suivi de 4 chiffres et se terminer par AK (ex: AD1234AK)';
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!matricule || !role) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (!validateMatricule(matricule, role)) {
      setError(getMatriculeError(role));
      return;
    }

    onLogin(matricule, role);
    setMatricule('');
    setRole('');
    setError('');
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!accessCode) {
      setError('Veuillez saisir le code d\'accès');
      return;
    }

    if (!validCorrectorCodes.includes(accessCode)) {
      setError('Code d\'accès invalide');
      return;
    }

    // Extraire le nom du professeur du code ou utiliser un nom générique
    const teacherName = `Professeur-${accessCode.split('-')[1]}`;
    
    toast({
      title: "Connexion réussie",
      description: "Bienvenue dans l'espace correcteur",
    });

    onLogin(teacherName, 'corrector');
    setAccessCode('');
    setError('');
  };

  const handleMatriculeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = role === 'corrector' ? e.target.value.toUpperCase() : e.target.value;
    setMatricule(value);
    if (error) {
      setError('');
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setMatricule('');
    setError('');
  };

  const getPlaceholder = () => {
    if (role === 'candidate') {
      return '12345678';
    } else if (role === 'corrector') {
      return 'PROF123456';
    } else if (role === 'admin') {
      return 'AD1234AK';
    }
    return 'Votre matricule';
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

        <Tabs defaultValue="matricule" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="matricule" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Matricule</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center space-x-2">
              <Key className="w-4 h-4" />
              <span>Code d'accès</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matricule" className="space-y-4 mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="role" className="text-sm font-medium">
                  Rôle
                </Label>
                <Select value={role} onValueChange={handleRoleChange}>
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

              <div>
                <Label htmlFor="matricule" className="text-sm font-medium">
                  {role === 'candidate' ? 'Matricule Candidat' : 
                   role === 'corrector' ? 'Matricule de Service' : 
                   'Matricule'}
                </Label>
                <Input
                  id="matricule"
                  type="text"
                  value={matricule}
                  onChange={handleMatriculeChange}
                  placeholder={getPlaceholder()}
                  required
                  className={`mt-1 ${error ? 'border-red-500 focus:border-red-500' : ''}`}
                  maxLength={role === 'candidate' ? 8 : role === 'admin' ? 8 : undefined}
                />
                {role === 'candidate' && (
                  <p className="mt-1 text-xs text-gray-500">
                    Exactement 8 chiffres requis
                  </p>
                )}
                {role === 'corrector' && (
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum 6 caractères alphanumériques
                  </p>
                )}
                {role === 'admin' && (
                  <p className="mt-1 text-xs text-gray-500">
                    Format: AD + 4 chiffres + AK (ex: AD1234AK)
                  </p>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                  Annuler
                </Button>
                <Button type="submit" className="flex-1">
                  Se connecter
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="code" className="space-y-4 mt-4">
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <Label htmlFor="access-code" className="text-sm font-medium">
                  Code d'accès correcteur
                </Label>
                <Input
                  id="access-code"
                  type="text"
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value.toUpperCase());
                    if (error) setError('');
                  }}
                  placeholder="CORR-ABC123-XYZ789"
                  required
                  className={`mt-1 ${error ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Saisissez le code d'accès fourni par l'administrateur
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                  Annuler
                </Button>
                <Button type="submit" className="flex-1">
                  Se connecter
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
