
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
      
      <CorrectorInterface currentUser={currentUser} />
    </div>
  );
};

export default CorrectorDashboard;
