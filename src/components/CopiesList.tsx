
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Edit } from 'lucide-react';
import { Copy } from '../App';

interface CopiesListProps {
  copies: Copy[];
  onOpenEvaluation: (copy: Copy) => void;
}

const getStatusInfo = (status: Copy['status'], score?: number) => {
  switch (status) {
    case 'pending':
      return {
        label: 'En attente',
        color: 'bg-yellow-100 text-yellow-800',
        icon: <FileText className="w-3 h-3 mr-1" />
      };
    case 'in_progress':
      return {
        label: 'En cours',
        color: 'bg-blue-100 text-blue-800',
        icon: <Edit className="w-3 h-3 mr-1" />
      };
    case 'corrected':
      return {
        label: `Corrigé - ${score}/20`,
        color: 'bg-green-100 text-green-800',
        icon: <Eye className="w-3 h-3 mr-1" />
      };
    default:
      return {
        label: 'Inconnu',
        color: 'bg-gray-100 text-gray-800',
        icon: null
      };
  }
};

const getButtonText = (status: Copy['status']) => {
  switch (status) {
    case 'pending':
      return 'Corriger';
    case 'in_progress':
      return 'Continuer';
    case 'corrected':
      return 'Voir';
    default:
      return 'Ouvrir';
  }
};

const CopiesList = ({ copies, onOpenEvaluation }: CopiesListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Copies à corriger</CardTitle>
      </CardHeader>
      <CardContent>
        {copies.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune copie disponible pour le moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {copies.map((copy) => {
              const statusInfo = getStatusInfo(copy.status, copy.score);
              const buttonText = getButtonText(copy.status);
              
              return (
                <div key={copy.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <FileText className="text-red-500 w-8 h-8" />
                      <div>
                        <p className="font-medium font-mono">{copy.anonymousId}</p>
                        <p className="text-sm text-gray-600">
                          Reçu le {copy.uploadDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={statusInfo.color}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </Badge>
                      <Button
                        onClick={() => onOpenEvaluation(copy)}
                        variant={copy.status === 'corrected' ? 'outline' : 'default'}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {buttonText}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CopiesList;
