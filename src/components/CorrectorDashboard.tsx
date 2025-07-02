
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Mail, MapPin, Phone, BookOpen } from 'lucide-react';
import CorrectorInterface from './CorrectorInterface';
import { Copy, User as UserType } from '../App';

interface CorrectorDashboardProps {
  copies: Copy[];
  onReturn: () => void;
  onOpenEvaluation: (copy: Copy) => void;
  currentUser?: UserType;
}

// Mock teacher data based on connected user
const getTeacherInfo = (userName: string) => {
  const teacherData: Record<string, any> = {
    'Professeur-ABC123': {
      firstName: 'Martin',
      lastName: 'Dupont',
      email: 'martin.dupont@education.fr',
      address: '15 rue de la République, 75001 Paris',
      phone: '0123456789',
      subject: 'Mathématiques'
    },
    'Professeur-DEF456': {
      firstName: 'Sophie',
      lastName: 'Bernard',
      email: 'sophie.bernard@education.fr',
      address: '8 avenue Victor Hugo, 69002 Lyon',
      phone: '0198765432',
      subject: 'Physique-Chimie'
    }
  };
  
  return teacherData[userName] || {
    firstName: 'Jean',
    lastName: 'Professeur',
    email: 'jean.professeur@education.fr',
    address: 'Adresse non renseignée',
    phone: 'Non renseigné',
    subject: 'Matière générale'
  };
};

const CorrectorDashboard = ({ onReturn, currentUser }: CorrectorDashboardProps) => {
  const teacherInfo = currentUser ? getTeacherInfo(currentUser.name) : null;

  return (
    <div className="min-h-screen">
      <div className="bg-slate-700 text-white p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold">Interface de Correction</h1>
            <p className="text-slate-200">Système de correction des copies</p>
          </div>
          <Button variant="outline" onClick={onReturn} className="flex items-center space-x-2 text-white border-white hover:bg-white hover:text-slate-700">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Button>
        </div>
      </div>
      
      {teacherInfo && (
        <div className="max-w-7xl mx-auto p-4">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-500" />
                Profil du Correcteur
              </CardTitle>
              <CardDescription>
                Vos informations personnelles (lecture seule)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">Nom complet:</span>
                  </div>
                  <p className="text-lg font-semibold">{teacherInfo.firstName} {teacherInfo.lastName}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">Email:</span>
                  </div>
                  <p className="text-sm">{teacherInfo.email}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <BookOpen className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">Matière:</span>
                  </div>
                  <p className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block">{teacherInfo.subject}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">Adresse:</span>
                  </div>
                  <p className="text-sm">{teacherInfo.address}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">Téléphone:</span>
                  </div>
                  <p className="text-sm">{teacherInfo.phone}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Note:</span>
                  </div>
                  <p className="text-xs text-gray-600 italic">
                    Ces informations sont en lecture seule. Contactez l'administrateur pour toute modification.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <CorrectorInterface />
    </div>
  );
};

export default CorrectorDashboard;
