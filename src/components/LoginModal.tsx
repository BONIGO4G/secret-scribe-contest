
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ArrowLeft, Lock, Mail, FileText, Shield, GraduationCap, Building } from "lucide-react";
import { ApiService } from "@/services/apiService";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { name: string; role: 'candidate' | 'corrector'; matricule?: string; id?: number }) => void;
}

const LoginModal = ({ isOpen, onClose, onLogin }: LoginModalProps) => {
  const [candidateForm, setCandidateForm] = useState({ matricule: '', name: '' });
  const [correctorForm, setCorrectorForm] = useState({ 
    lastname: '', 
    firstname: '', 
    institution: '', 
    email: '' 
  });
  const [activeTab, setActiveTab] = useState('candidate');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleCandidateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!candidateForm.matricule || !candidateForm.name) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    if (!ApiService.validateMatricule(candidateForm.matricule)) {
      toast({
        title: "Matricule invalide",
        description: "Le matricule doit contenir 8 chiffres suivis d'une lettre majuscule (ex: 12345678A).",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Génération d'un ID anonyme unique
      const anonymousId = `ANON-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Création/connexion du candidat
      const result = await ApiService.createCandidate({
        matricule: candidateForm.matricule.toUpperCase(),
        name: candidateForm.name,
        anonymousId
      });
      
      onLogin({ 
        name: candidateForm.name, 
        role: 'candidate', 
        matricule: candidateForm.matricule.toUpperCase(),
        id: result.candidateId 
      });
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${candidateForm.name} (${candidateForm.matricule.toUpperCase()})`,
      });
      
      onClose();
    } catch (error) {
      console.error('Erreur connexion candidat:', error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter. Vérifiez vos informations.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCorrectorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!correctorForm.lastname || !correctorForm.firstname || !correctorForm.institution || !correctorForm.email) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Création/connexion du correcteur
      const result = await ApiService.createCorrector({
        lastname: correctorForm.lastname,
        firstname: correctorForm.firstname,
        institution: correctorForm.institution,
        email: correctorForm.email
      });
      
      onLogin({ 
        name: `${correctorForm.firstname} ${correctorForm.lastname}`, 
        role: 'corrector',
        id: result.correctorId 
      });
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${correctorForm.firstname} ${correctorForm.lastname}`,
      });
      
      onClose();
    } catch (error) {
      console.error('Erreur connexion correcteur:', error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter. Vérifiez vos informations.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
            Accédez à votre espace personnalisé
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger 
                value="candidate" 
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Étudiant</span>
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
                <h4 className="font-semibold text-blue-800 mb-2">Espace Étudiant</h4>
                <p className="text-sm text-blue-600">
                  Utilisez votre matricule étudiant pour vous identifier
                </p>
              </div>
              
              <form onSubmit={handleCandidateLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="matricule" className="text-sm font-medium flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Matricule étudiant</span>
                  </Label>
                  <Input
                    id="matricule"
                    placeholder="12345678A"
                    value={candidateForm.matricule}
                    onChange={(e) => setCandidateForm({ ...candidateForm, matricule: e.target.value.toUpperCase() })}
                    required
                    maxLength={9}
                    className="h-12 border-2 focus:border-blue-500 transition-colors font-mono text-center text-lg"
                  />
                  <p className="text-xs text-gray-500">
                    Format: 8 chiffres suivi d'une lettre (ex: 12345678A)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="student-name" className="text-sm font-medium flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Nom complet</span>
                  </Label>
                  <Input
                    id="student-name"
                    placeholder="Jean Dupont"
                    value={candidateForm.name}
                    onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                    required
                    className="h-12 border-2 focus:border-blue-500 transition-colors"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Connexion..." : "Accéder à l'espace étudiant"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="corrector" className="mt-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-6 border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Espace Correcteur</h4>
                <p className="text-sm text-purple-600">
                  Identification complète pour l'accès aux corrections
                </p>
              </div>
              
              <form onSubmit={handleCorrectorLogin} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastname" className="text-sm font-medium">
                      Nom de famille
                    </Label>
                    <Input
                      id="lastname"
                      placeholder="Dupont"
                      value={correctorForm.lastname}
                      onChange={(e) => setCorrectorForm({ ...correctorForm, lastname: e.target.value })}
                      required
                      className="h-11 border-2 focus:border-purple-500 transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="firstname" className="text-sm font-medium">
                      Prénom
                    </Label>
                    <Input
                      id="firstname"
                      placeholder="Jean"
                      value={correctorForm.firstname}
                      onChange={(e) => setCorrectorForm({ ...correctorForm, firstname: e.target.value })}
                      required
                      className="h-11 border-2 focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="institution" className="text-sm font-medium flex items-center space-x-2">
                    <Building className="w-4 h-4" />
                    <span>Établissement d'origine</span>
                  </Label>
                  <Input
                    id="institution"
                    placeholder="Université de Paris"
                    value={correctorForm.institution}
                    onChange={(e) => setCorrectorForm({ ...correctorForm, institution: e.target.value })}
                    required
                    className="h-11 border-2 focus:border-purple-500 transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="corrector-email" className="text-sm font-medium flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email professionnel</span>
                  </Label>
                  <Input
                    id="corrector-email"
                    type="email"
                    placeholder="jean.dupont@universite.fr"
                    value={correctorForm.email}
                    onChange={(e) => setCorrectorForm({ ...correctorForm, email: e.target.value })}
                    required
                    className="h-11 border-2 focus:border-purple-500 transition-colors"
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
