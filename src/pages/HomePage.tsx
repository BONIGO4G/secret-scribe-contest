
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, FileText, BarChart3, ArrowRight, CheckCircle, Clock, Lock } from "lucide-react";

interface HomePageProps {
  onShowLogin: () => void;
  onShowFeatures: () => void;
}

const HomePage = ({ onShowLogin, onShowFeatures }: HomePageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section améliorée */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Plateforme 100% sécurisée et anonyme
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Système de Gestion de 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Concours Moderne
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Plateforme professionnelle pour la gestion complète des concours et examens avec 
            anonymisation automatique, interface intuitive et sécurité renforcée.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
              onClick={onShowLogin}
            >
              Accéder à la plateforme
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-lg border-2 hover:bg-gray-50"
              onClick={onShowFeatures}
            >
              Découvrir les fonctionnalités
            </Button>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">Anonymisation</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Disponibilité</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">SSL</div>
              <div className="text-sm text-gray-600">Sécurisé</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features améliorées */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-gray-900 mb-4">
            Fonctionnalités Avancées
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une suite complète d'outils professionnels pour la gestion moderne des concours
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:-translate-y-2">
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-blue-800">Anonymisation Totale</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-blue-700">
                Génération automatique d'identifiants anonymes avec chiffrement avancé pour chaque copie
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100 hover:-translate-y-2">
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-green-800">Upload Intelligent</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-green-700">
                Dépôt sécurisé de documents PDF/ZIP avec validation automatique et sauvegarde cloud
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:-translate-y-2">
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-purple-800">Gestion Multi-Rôles</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-purple-700">
                Interfaces dédiées et optimisées pour candidats, correcteurs et administrateurs
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100 hover:-translate-y-2">
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-orange-800">Analytics Avancés</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-orange-700">
                Rapports détaillés, statistiques en temps réel et export de données personnalisables
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Process amélioré */}
      <section className="bg-gradient-to-r from-gray-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Processus Simplifié
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un workflow optimisé en 3 étapes pour une expérience utilisateur fluide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg relative z-10">
                1
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border">
                <div className="flex justify-center mb-4">
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
                <h4 className="text-xl font-bold mb-4 text-gray-800">Dépôt Sécurisé</h4>
                <p className="text-gray-600 leading-relaxed">
                  Les candidats téléchargent leurs copies via notre interface sécurisée avec validation automatique
                </p>
              </div>
            </div>
            
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg relative z-10">
                2
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border">
                <div className="flex justify-center mb-4">
                  <Lock className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="text-xl font-bold mb-4 text-gray-800">Anonymisation</h4>
                <p className="text-gray-600 leading-relaxed">
                  Le système génère instantanément des identifiants anonymes avec chiffrement de niveau bancaire
                </p>
              </div>
            </div>
            
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg relative z-10">
                3
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-purple-500" />
                </div>
                <h4 className="text-xl font-bold mb-4 text-gray-800">Correction Impartiale</h4>
                <p className="text-gray-600 leading-relaxed">
                  Les correcteurs évaluent les copies en toute objectivité sans connaître l'identité des candidats
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            Prêt à révolutionner vos concours ?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Rejoignez les établissements qui font confiance à ConcoursPro
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-4 text-xl font-medium shadow-xl hover:shadow-2xl transition-all"
            onClick={onShowLogin}
          >
            Commencer maintenant
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
