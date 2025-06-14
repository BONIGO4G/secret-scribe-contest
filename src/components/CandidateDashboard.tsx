
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudUpload, ArrowLeft, FileText, CheckCircle, Clock, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Copy } from '../App';

interface CandidateDashboardProps {
  submissions: Copy[];
  setSubmissions: React.Dispatch<React.SetStateAction<Copy[]>>;
  onReturn: () => void;
}

const CandidateDashboard = ({ submissions, setSubmissions, onReturn }: CandidateDashboardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateAnonymousId = () => {
    return 'ANON-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handleFileSelect = (file: File) => {
    // Vérification du type de fichier
    if (!file.type.includes('pdf') && !file.name.endsWith('.zip')) {
      toast.error('Format non supporté', {
        description: 'Seuls les fichiers PDF et ZIP sont acceptés.'
      });
      return;
    }

    // Vérification de la taille (10 MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Fichier trop volumineux', {
        description: 'La taille maximale autorisée est de 10 MB.'
      });
      return;
    }

    const anonymousId = generateAnonymousId();
    const newSubmission: Copy = {
      id: Date.now().toString(),
      anonymousId,
      filename: file.name,
      uploadDate: new Date().toLocaleString('fr-FR'),
      status: 'pending'
    };

    setSubmissions(prev => [newSubmission, ...prev]);
    
    toast.success('Copie envoyée avec succès', {
      description: `Identifiant anonyme généré : ${anonymousId}`
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Espace Candidat</h2>
          <p className="text-gray-600">
            Déposez vos copies pour le concours. Un identifiant anonyme sera généré automatiquement.
          </p>
        </div>
        <Button variant="outline" onClick={onReturn} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Zone d'upload */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CloudUpload className="w-5 h-5 mr-2 text-blue-500" />
                Déposer une copie
              </CardTitle>
              <CardDescription>
                Formats acceptés : PDF, ZIP (max 10 MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <CloudUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Cliquez pour sélectionner un fichier</p>
                <p className="text-sm text-gray-500">ou glissez-déposez votre fichier ici</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.zip"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informations importantes */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Informations importantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Anonymisation
                </h4>
                <p className="text-sm text-blue-700">
                  Votre identité sera complètement masquée aux correcteurs grâce à un identifiant anonyme unique.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sécurité
                </h4>
                <p className="text-sm text-green-700">
                  Toutes les données sont chiffrées et stockées de manière sécurisée.
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Délai
                </h4>
                <p className="text-sm text-orange-700">
                  Date limite de dépôt : 15 Décembre 2024 à 23h59
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Liste des copies déposées */}
      {submissions.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Mes copies déposées</CardTitle>
            <CardDescription>
              Historique de vos dépôts avec les identifiants anonymes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <FileText className="w-8 h-8 text-red-500" />
                    <div>
                      <p className="font-medium">{submission.filename}</p>
                      <p className="text-sm text-gray-600">Déposé le {submission.uploadDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-medium">{submission.anonymousId}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Reçu
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CandidateDashboard;
