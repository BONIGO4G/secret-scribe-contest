
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CorrectorDashboard from "./CorrectorDashboard";

interface CorrectionFormProps {
  onClose: () => void;
}

const CorrectionForm = ({ onClose }: CorrectionFormProps) => {
  const [matriculeService, setMatriculeService] = useState("");
  const [matriculeError, setMatriculeError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [correctorInfo, setCorrectorInfo] = useState<{name: string; matricule: string} | null>(null);
  const { toast } = useToast();

  // Fonction pour valider le format du matricule de service
  const validateMatriculeService = (matricule: string): boolean => {
    // Format pour matricule de service : peut être différent du format étudiant
    // On accepte lettres et chiffres, minimum 6 caractères
    const regex = /^[A-Za-z0-9]{6,}$/;
    return regex.test(matricule);
  };

  const handleCorrectorLogin = () => {
    if (!matriculeService) {
      setMatriculeError("Veuillez saisir votre matricule de service");
      return;
    }

    if (!validateMatriculeService(matriculeService)) {
      setMatriculeError("Le matricule de service doit contenir au minimum 6 caractères alphanumériques");
      return;
    }

    setMatriculeError("");
    setIsAuthenticated(true);
    setCorrectorInfo({
      name: `Professeur ${matriculeService.toUpperCase()}`,
      matricule: matriculeService.toUpperCase()
    });

    toast({
      title: "Connexion réussie",
      description: `Bienvenue, matricule de service ${matriculeService.toUpperCase()}`,
    });
  };

  const handleMatriculeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setMatriculeService(value);
    if (matriculeError) {
      setMatriculeError("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCorrectorInfo(null);
    setMatriculeService("");
  };

  // Interface d'authentification
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-gradient-to-br from-white via-white to-purple-50">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Accès Correcteur
            </CardTitle>
            <CardDescription className="text-lg">
              Saisissez votre matricule de service
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="matricule-service" className="text-sm font-medium text-purple-800">
                    Matricule de Service
                  </Label>
                  <Input
                    id="matricule-service"
                    type="text"
                    value={matriculeService}
                    onChange={handleMatriculeChange}
                    placeholder="PROF123456"
                    className={`mt-1 ${matriculeError ? 'border-red-500 focus:border-red-500' : 'border-purple-200 focus:border-purple-500'}`}
                  />
                  {matriculeError && (
                    <p className="mt-1 text-xs text-red-600">{matriculeError}</p>
                  )}
                </div>
                
                <Button 
                  onClick={handleCorrectorLogin}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                >
                  Accéder à l'interface de correction
                </Button>
              </div>
            </div>
            
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
  }

  // Interface principale du correcteur (CorrectorDashboard)
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="min-h-screen">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-purple-800">
                  Interface de Correction
                </h1>
                <p className="text-purple-600">
                  Système de correction anonyme des copies
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {correctorInfo && (
                <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50">
                  {correctorInfo.matricule}
                </Badge>
              )}
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                Déconnexion
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour à l'accueil</span>
              </Button>
            </div>
          </div>
        </div>
        
        <CorrectorDashboard />
      </div>
    </div>
  );
};

export default CorrectionForm;
