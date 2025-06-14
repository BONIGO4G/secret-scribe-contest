
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  // Interface principale du correcteur (après authentification)
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0 bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-purple-600" />
              <div>
                <CardTitle className="text-2xl font-bold text-purple-800">
                  Interface de Correction
                </CardTitle>
                <CardDescription className="text-purple-600">
                  Système de correction anonyme des copies
                </CardDescription>
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
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Accès autorisé - {correctorInfo?.name}
            </h3>
            <p className="text-gray-600 mb-6">
              Interface de correction en cours de développement
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                L'interface complète de correction sera bientôt disponible avec :
              </p>
              <ul className="text-sm text-blue-600 mt-2 space-y-1">
                <li>• Visualisation des copies anonymisées</li>
                <li>• Système de notation</li>
                <li>• Gestion des commentaires</li>
                <li>• Export des résultats</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CorrectionForm;
