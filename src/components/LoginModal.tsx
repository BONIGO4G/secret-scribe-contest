
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { name: string; role: 'candidate' | 'corrector' | 'admin' }) => void;
}

const LoginModal = ({ isOpen, onClose, onLogin }: LoginModalProps) => {
  const [candidateForm, setCandidateForm] = useState({ name: '', code: '' });
  const [correctorForm, setCorrectorForm] = useState({ email: '', password: '' });

  if (!isOpen) return null;

  const handleCandidateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (candidateForm.name && candidateForm.code) {
      onLogin({ name: candidateForm.name, role: 'candidate' });
      onClose();
    }
  };

  const handleCorrectorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (correctorForm.email && correctorForm.password) {
      onLogin({ name: correctorForm.email.split('@')[0], role: 'corrector' });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Connexion</span>
          </CardTitle>
          <CardDescription>
            Choisissez votre type de compte pour accéder à la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="candidate" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="candidate">Candidat</TabsTrigger>
              <TabsTrigger value="corrector">Correcteur</TabsTrigger>
            </TabsList>
            
            <TabsContent value="candidate">
              <form onSubmit={handleCandidateLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    placeholder="Jean Dupont"
                    value={candidateForm.name}
                    onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Code d'accès concours</Label>
                  <Input
                    id="code"
                    placeholder="CONC2024-001"
                    value={candidateForm.code}
                    onChange={(e) => setCandidateForm({ ...candidateForm, code: e.target.value })}
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    Se connecter
                  </Button>
                  <Button type="button" variant="outline" onClick={onClose}>
                    Annuler
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="corrector">
              <form onSubmit={handleCorrectorLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correcteur@universite.fr"
                    value={correctorForm.email}
                    onChange={(e) => setCorrectorForm({ ...correctorForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={correctorForm.password}
                    onChange={(e) => setCorrectorForm({ ...correctorForm, password: e.target.value })}
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    Se connecter
                  </Button>
                  <Button type="button" variant="outline" onClick={onClose}>
                    Annuler
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginModal;
