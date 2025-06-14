
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Upload, Users, BarChart3, CheckCircle, Clock, FileText } from 'lucide-react';

interface HomePageProps {
  onShowLogin: () => void;
}

const HomePage = ({ onShowLogin }: HomePageProps) => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Shield className="w-4 h-4 mr-2" />
              Plateforme 100% sécurisée et anonyme
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Système de Gestion de 
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Concours Moderne
              </span>
            </h1>
            
            <p className="text-xl mb-12 max-w-3xl mx-auto leading-relaxed opacity-90">
              Plateforme professionnelle pour la gestion complète des concours et examens avec 
              anonymisation automatique, interface intuitive et sécurité renforcée.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                onClick={onShowLogin}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg"
              >
                Accéder à la plateforme
                <CheckCircle className="ml-2 w-4 h-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Découvrir les fonctionnalités
              </Button>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-sm opacity-80">Anonymisation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-sm opacity-80">Disponibilité</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">SSL</div>
                <div className="text-sm opacity-80">Sécurisé</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités Avancées
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une suite complète d'outils professionnels pour la gestion moderne des concours
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-3">Anonymisation Totale</h3>
              <p className="text-blue-700">
                Génération automatique d'identifiants anonymes avec chiffrement avancé pour chaque copie
              </p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Upload className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-3">Upload Intelligent</h3>
              <p className="text-green-700">
                Dépôt sécurisé de documents PDF/ZIP avec validation automatique et sauvegarde cloud
              </p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-purple-800 mb-3">Gestion Multi-Rôles</h3>
              <p className="text-purple-700">
                Interfaces dédiées et optimisées pour candidats, correcteurs et administrateurs
              </p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BarChart3 className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-orange-800 mb-3">Analytics Avancés</h3>
              <p className="text-orange-700">
                Rapports détaillés, statistiques en temps réel et export de données personnalisables
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-gradient-to-r from-gray-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Processus Simplifié
            </h2>
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
                  <FileText className="text-blue-500 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Dépôt Sécurisé</h3>
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
                  <Shield className="text-green-500 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Anonymisation</h3>
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
                  <CheckCircle className="text-purple-500 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Correction Impartiale</h3>
                <p className="text-gray-600 leading-relaxed">
                  Les correcteurs évaluent les copies en toute objectivité sans connaître l'identité des candidats
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Prêt à révolutionner vos concours ?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Rejoignez les établissements qui font confiance à ConcoursPro
            </p>
            <Button 
              onClick={onShowLogin}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl"
            >
              Commencer maintenant
              <CheckCircle className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
