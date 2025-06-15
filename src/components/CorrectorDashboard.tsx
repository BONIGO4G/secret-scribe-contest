
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CorrectorInterface from './CorrectorInterface';
import { Copy } from '../App';

interface CorrectorDashboardProps {
  copies: Copy[];
  onReturn: () => void;
  onOpenEvaluation: (copy: Copy) => void;
}

const CorrectorDashboard = ({ onReturn }: CorrectorDashboardProps) => {
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
      
      <CorrectorInterface />
    </div>
  );
};

export default CorrectorDashboard;
