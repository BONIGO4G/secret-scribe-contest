
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ArrowLeft, Lock, Mail, FileText, Shield } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { name: string; role: 'candidate' | 'corrector' | 'admin' }) => void;
}

const LoginModal = ({ isOpen, onClose, onLogin }: LoginModalProps) => {
  const [candidateForm, setCandidateForm] = useState({ name: '', code: '' });
  const [correctorForm, setCorrectorForm] = useState({ email: '', password: '' });
  const [activeTab, setActiveTab] = useState('candidate');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleCandidateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (candidateForm.name && candidateForm.code) {
      setIsLoading(true);
      // Simulation d'une connexion
      setTimeout(() => {
        onLogin({ name: candidateForm.name, role: 'candidate' });
        setIsLoading(false);
        onClose();
      }, 1000);
    }
  };

  const handleCorrectorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (correctorForm.email && correctorForm.password) {
      setIsLoading(true);
      // Simulation d'une connexion
      setTimeout(() => {
        onLogin({ name: correctorForm.email.split('@')[0], role: 'corrector' });
        setIsLoading(false);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg mx-auto shadow-2xl border-0 bg-gradient-to-br from-white via-white to-blue-50">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Connexion Sécurisée
          </CardTitle>
          <CardDescription className="text-lg">
            Accédez à votre espace personnalisé en toute sécurité
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger 
                value="candidate" 
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Candidat</span>
              </TabsTrigger>
              <TabsTrigger 
                value="corrector"
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all"
              >
                <Shield className="w-4 h-4" />
                <span>Correcteur</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="candidate" className="mt-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Espace Candidat</h4>
                <p className="text-sm text-blue-600">
                  Déposez vos copies en toute confidentialité avec anonymisation automatique
                </p>
              </div>
              
              <form onSubmit={handleCandidateLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Nom complet</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Jean Dupont"
                    value={candidateForm.name}
                    onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                    required
                    className="h-12 border-2 focus:border-blue-500 transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm font-medium flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Code d'accès concours</span>
                  </Label>
                  <Input
                    id="code"
                    placeholder="CONC2024-001"
                    value={candidateForm.code}
                    onChange={(e) => setCandidateForm({ ...candidateForm, code: e.target.value })}
                    required
                    className="h-12 border-2 focus:border-blue-500 transition-colors font-mono"
                  />
                  <p className="text-xs text-gray-500">
                    Code fourni par l'administration du concours
                  </p>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Connexion..." : "Accéder à l'espace candidat"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="corrector" className="mt-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-6 border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Espace Correcteur</h4>
                <p className="text-sm text-purple-600">
                  Interface de correction anonyme avec outils d'évaluation professionnels
                </p>
              </div>
              
              <form onSubmit={handleCorrectorLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email professionnel</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correcteur@universite.fr"
                    value={correctorForm.email}
                    onChange={(e) => setCorrectorForm({ ...correctorForm, email: e.target.value })}
                    required
                    className="h-12 border-2 focus:border-purple-500 transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Mot de passe</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={correctorForm.password}
                    onChange={(e) => setCorrectorForm({ ...correctorForm, password: e.target.value })}
                    required
                    className="h-12 border-2 focus:border-purple-500 transition-colors"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Connexion..." : "Accéder à l'espace correcteur"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-center pt-4 border-t">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l'accueil</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginModal;
