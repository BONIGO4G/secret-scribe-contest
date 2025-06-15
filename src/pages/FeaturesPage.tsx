
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, FileText, BarChart3, ArrowRight, CheckCircle, Clock, Lock, Upload, Download, Eye, Star } from "lucide-react";

interface FeaturesPageProps {
  onBackToHome: () => void;
}

const FeaturesPage = ({ onBackToHome }: FeaturesPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Fonctionnalités de la Plateforme</h1>
            <Button 
              variant="outline" 
              onClick={onBackToHome}
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Une Plateforme Complète pour 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              la Gestion de Concours
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Découvrez toutes les fonctionnalités avancées qui font de notre plateforme 
            la solution de référence pour l'organisation de concours et examens.
          </p>
        </div>
      </section>

      {/* Fonctionnalités principales */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Fonctionnalités Principales
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-blue-800">Anonymisation Totale</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-blue-700 text-center mb-4">
                Génération automatique d'identifiants anonymes avec chiffrement avancé
              </CardDescription>
              <ul className="space-y-2 text-sm text-blue-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Codes anonymes uniques
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Chiffrement sécurisé
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Traçabilité complète
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-green-800">Upload Intelligent</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-green-700 text-center mb-4">
                Dépôt sécurisé de documents avec validation automatique
              </CardDescription>
              <ul className="space-y-2 text-sm text-green-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Support PDF/ZIP
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Validation automatique
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Sauvegarde cloud
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-purple-800">Gestion Multi-Rôles</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-purple-700 text-center mb-4">
                Interfaces dédiées pour chaque type d'utilisateur
              </CardDescription>
              <ul className="space-y-2 text-sm text-purple-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Interface candidat
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Interface correcteur
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Interface admin
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-orange-800">Analytics Avancés</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-orange-700 text-center mb-4">
                Rapports détaillés et statistiques en temps réel
              </CardDescription>
              <ul className="space-y-2 text-sm text-orange-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Tableaux de bord
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Export PDF
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Statistiques détaillées
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-red-50 to-red-100">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-red-800">Correction Avancée</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-red-700 text-center mb-4">
                Outils de correction professionnels et intuitifs
              </CardDescription>
              <ul className="space-y-2 text-sm text-red-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Grille d'évaluation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Commentaires détaillés
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Notes de 0 à 20
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-indigo-50 to-indigo-100">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <Download className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-indigo-800">Export & Rapports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-indigo-700 text-center mb-4">
                Génération automatique de bulletins et rapports
              </CardDescription>
              <ul className="space-y-2 text-sm text-indigo-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Bulletins PDF
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Rapports généraux
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Export Excel
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Avantages */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir Notre Plateforme ?
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">Simplicité</h4>
              <p className="text-gray-600">Interface intuitive et facile à utiliser pour tous les utilisateurs</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">Sécurité</h4>
              <p className="text-gray-600">Chiffrement de niveau bancaire et protection des données</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">Rapidité</h4>
              <p className="text-gray-600">Traitement instantané et temps de réponse optimaux</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">Fiabilité</h4>
              <p className="text-gray-600">Disponibilité 24/7 et sauvegarde automatique</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Prêt à Découvrir la Plateforme ?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Commencez dès maintenant et révolutionnez la gestion de vos concours
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg"
            onClick={onBackToHome}
          >
            Retour à l'accueil
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
