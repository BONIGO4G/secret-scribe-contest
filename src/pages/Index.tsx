
import { useState } from "react";
import Header from "@/components/Header";
import LoginModal from "@/components/LoginModal";
import CandidateDashboard from "@/components/CandidateDashboard";
import CorrectorDashboard from "@/components/CorrectorDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, FileText, BarChart3 } from "lucide-react";

interface User {
  name: string;
  role: 'candidate' | 'corrector' | 'admin';
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Page d'accueil pour utilisateurs non connectés
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header 
          user={user} 
          onLogin={() => setShowLoginModal(true)} 
          onLogout={handleLogout} 
        />
        
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-primary mb-6">
              Système de Gestion de Concours
            </h1>
            <h2 className="text-2xl text-muted-foreground mb-8">
              Correction anonyme et sécurisée
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Plateforme moderne pour la gestion des concours et examens avec 
              anonymisation automatique des copies et interface de correction professionnelle.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => setShowLoginModal(true)}
            >
              Accéder à la plateforme
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-16">
          <h3 className="text-3xl font-bold text-center text-primary mb-12">
            Fonctionnalités principales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <CardTitle>Anonymisation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Génération automatique d'identifiants anonymes pour chaque copie
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <CardTitle>Upload sécurisé</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Dépôt de documents PDF/ZIP avec chiffrement et sécurité
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <CardTitle>Multi-rôles</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Interfaces dédiées pour candidats, correcteurs et administrateurs
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                <CardTitle>Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Export des résultats et génération de rapports détaillés
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Process */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center text-primary mb-12">
              Comment ça fonctionne
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h4 className="text-xl font-semibold mb-4">Dépôt des copies</h4>
                <p className="text-muted-foreground">
                  Les candidats téléchargent leurs copies via l'interface sécurisée
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h4 className="text-xl font-semibold mb-4">Anonymisation</h4>
                <p className="text-muted-foreground">
                  Le système génère automatiquement des identifiants anonymes
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h4 className="text-xl font-semibold mb-4">Correction</h4>
                <p className="text-muted-foreground">
                  Les correcteurs évaluent les copies sans connaître l'identité des candidats
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Dashboard basé sur le rôle de l'utilisateur
  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        onLogin={() => setShowLoginModal(true)} 
        onLogout={handleLogout} 
      />
      
      {user.role === 'candidate' && <CandidateDashboard />}
      {user.role === 'corrector' && <CorrectorDashboard />}
    </div>
  );
};

export default Index;
