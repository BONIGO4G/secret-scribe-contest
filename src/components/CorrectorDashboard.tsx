
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CorrectorStats from './CorrectorStats';
import CorrectorProgress from './CorrectorProgress';
import CopiesList from './CopiesList';
import { Copy } from '../App';

interface CorrectorDashboardProps {
  copies: Copy[];
  onReturn: () => void;
  onOpenEvaluation: (copy: Copy) => void;
}

const CorrectorDashboard = ({ copies, onReturn, onOpenEvaluation }: CorrectorDashboardProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Espace Correcteur</h2>
          <p className="text-gray-600">
            Interface de correction anonyme pour les copies de concours
          </p>
        </div>
        <Button variant="outline" onClick={onReturn} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </Button>
      </div>

      <CorrectorStats copies={copies} />
      <CorrectorProgress copies={copies} />
      <CopiesList copies={copies} onOpenEvaluation={onOpenEvaluation} />
    </div>
  );
};

export default CorrectorDashboard;
