
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ArrowLeft, GraduationCap, Shield } from "lucide-react";
import CorrectionForm from "./CorrectionForm";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { name: string; role: 'candidate' | 'corrector'; matricule?: string; id?: number }) => void;
}

const LoginModal = ({ isOpen, onClose, onLogin }: LoginModalProps) => {
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);

  if (!isOpen) return null;

  if (showCorrectionForm) {
    return <CorrectionForm onClose={() => setShowCorrectionForm(false)} />;
  }

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
            Accès Plateforme
          </CardTitle>
          <CardDescription className="text-lg">
            Choisissez votre mode d'accès
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger 
                value="student" 
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
            
            <TabsContent value="student" className="mt-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">Espace Étudiant</h4>
                <p className="text-sm text-blue-600 mb-4">
                  Déposez vos copies de concours de manière anonyme et sécurisée
                </p>
                <Button 
                  onClick={() => onLogin({ name: 'Étudiant', role: 'candidate' })}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  Accéder à l'espace étudiant
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="corrector" className="mt-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-6 border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-3">Espace Correcteur</h4>
                <p className="text-sm text-purple-600 mb-4">
                  Système avancé de correction de copies avec gestion des notes
                </p>
                <Button 
                  onClick={() => setShowCorrectionForm(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                >
                  Accéder au correcteur de copies
                </Button>
              </div>
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
